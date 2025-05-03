import { createReadStream, createWriteStream } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'
import { UserMessage } from '../constants/userMessage.js'
import { fallbackInstruction } from './fallback.js'
import { EOL } from 'node:os'
import { access, mkdir, open, rename, stat, unlink } from 'node:fs/promises'

export const catInstruction = (path) => {
  const currentDir = process.cwd()
  const target = resolve(currentDir, path)

  const readFile = createReadStream(target, {encoding: 'utf-8'})

  try {
    readFile.pipe(process.stdout)

    readFile.on('error', () => {
      fallbackInstruction()
    })

    readFile.on('end', () => {
      process.stdout.write(EOL)
    })

  } catch(e) {
    throw new Error(UserMessage.OPERATION_FAILED, { cause: e })
  }
}


export const createEmptyFileInstruction = async (fileName) => {
  if (!fileName) {
    return fallbackInstruction()
  }

  const currentDirectory = process.cwd()
  const safeFilePath = join(currentDirectory, basename(fileName))

  try {
    const file = await open(safeFilePath, 'a')

    await file.close()

  } catch (e) {
    throw new Error(UserMessage.OPERATION_FAILED, { cause: e })
  }
}

export const createDirectoryInstruction = async (dirName) => {
  if (!dirName) {
    fallbackInstruction()
    return
  }

  
  const currentDirectory = process.cwd()
  const safeDirPath = join(currentDirectory, basename(dirName))

  try {
    await mkdir(safeDirPath, { recursive: false })
  } catch(e) {
      throw new Error(UserMessage.OPERATION_FAILED, { cause: e })
  }
}

export const renameFileInstruction = async (filePath, newName) => {
  const absoluteFilePath = resolve(process.cwd(), filePath)


  const newSafeFilePath = join(dirname(absoluteFilePath), basename(newName))

  try {
    await access(newSafeFilePath)
    throw new Error(UserMessage.OPERATION_FAILED)
  } catch (e) {
    if (e.code !== 'ENOENT') {
      throw new Error(UserMessage.OPERATION_FAILED, { cause: e })
    }
  }

  try {
    await rename(absoluteFilePath, newSafeFilePath)
  } catch (e) {
    throw new Error(UserMessage.OPERATION_FAILED, { cause: e })
  }
}

export const copyFileInstruction = async (filePath, newDirectoryPath) => {
  const absoluteFilePath = resolve(process.cwd(), filePath)

  const absoluteNewDirPath = resolve(process.cwd(), newDirectoryPath)

  try {
    await access(absoluteFilePath)
  } catch (e) {
    if (e.code !== 'ENOENT') {
      throw new Error(UserMessage.OPERATION_FAILED, { cause: e })
    }
  }

  try {
    const dirStats = await stat(absoluteNewDirPath)

    if (!dirStats.isDirectory()) {
      throw new Error(UserMessage.OPERATION_FAILED)
    }
  } catch (e) {
    throw new Error(UserMessage.OPERATION_FAILED, {cause: e})
  }

  const fileName = basename(absoluteFilePath)

  const newFilePath = join(absoluteNewDirPath, fileName)


  try {
    await access(newFilePath)
    throw new Error(UserMessage.OPERATION_FAILED)
  } catch (e) {
    if (e.code !== 'ENOENT') {
      throw new Error(UserMessage.OPERATION_FAILED, { cause: e })
    }
  }

  return new Promise((res, rej) => {
    const readStream = createReadStream(absoluteFilePath)
    const writeStream = createWriteStream(newFilePath)
  
    readStream.pipe(writeStream)
  
    readStream.on('error', (e) => {
      rej(new Error(UserMessage.OPERATION_FAILED, { cause: e }))
    })
  
    writeStream.on('error', (e) => {
      rej(new Error(UserMessage.OPERATION_FAILED, { cause: e }))
    })
  
    writeStream.on('finish', () => {
      res()
    })
  })

}

export const deleteFileInstruction = async (filePath) => {
  try {
    await unlink(filePath)
  } catch(e) {
    throw new Error(UserMessage.OPERATION_FAILED, { cause: e })
  }
}

export const moveFileInstruction = async (filePath, newDirPath) => {
  try {
    await copyFileInstruction(filePath, newDirPath)
    await deleteFileInstruction(filePath)
  } catch (e) {
    throw new Error(UserMessage.OPERATION_FAILED, { cause: e })
  }
}
