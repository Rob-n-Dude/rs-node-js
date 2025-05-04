import { createReadStream, createWriteStream } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'
import { EOL } from 'node:os'
import { access, mkdir, open, rename, stat, unlink } from 'node:fs/promises'
import { InvalidInputError, OperationFailedError } from '../helpers/error.js'

export const catInstruction = (path) => {
  if (!path) {
    throw new InvalidInputError()
  }

  const currentDir = process.cwd()
  const target = resolve(currentDir, path)

  const readFile = createReadStream(target, {encoding: 'utf-8'})

  return new Promise((resolve, reject) => {
    readFile.pipe(process.stdout)

    readFile.on('error', (e) => {
      reject(new OperationFailedError({ cause: e }))
    })

    readFile.on('end', () => {
      resolve()
      process.stdout.write(EOL)
    })
  })
}


export const createEmptyFileInstruction = async (fileName) => {
  if (!fileName) {
    throw new InvalidInputError()
  }

  const currentDirectory = process.cwd()
  const safeFilePath = join(currentDirectory, basename(fileName))

  try {
    const file = await open(safeFilePath, 'a')
    await file.close()
  } catch (e) {
    throw new OperationFailedError({ cause: e})
  }
}

export const createDirectoryInstruction = async (dirName) => {
  if (!dirName) {
    throw new InvalidInputError()
  }
  
  const currentDirectory = process.cwd()
  const safeDirPath = join(currentDirectory, basename(dirName))

  try {
    await mkdir(safeDirPath, { recursive: false })
  } catch(e) {
    throw new OperationFailedError({ cause: e })
  }
}

export const renameFileInstruction = async (filePath, newName) => {
  if (!filePath || !newName) {
    throw new InvalidInputError()
  }

  const absoluteFilePath = resolve(process.cwd(), filePath)

  const newSafeFilePath = join(dirname(absoluteFilePath), basename(newName))

  try {
    await access(newSafeFilePath)
    throw new OperationFailedError()
  } catch (e) {
    if (e.code !== 'ENOENT') {
      throw new OperationFailedError({ cause: e })
    }
  }

  try {
    await rename(absoluteFilePath, newSafeFilePath)
  } catch (e) {
    throw new OperationFailedError({ cause: e })
  }
}

export const copyFileInstruction = async (filePath, newDirectoryPath) => {
  if (!filePath || !newDirectoryPath) {
    throw new InvalidInputError()
  }

  const absoluteFilePath = resolve(process.cwd(), filePath)

  const absoluteNewDirPath = resolve(process.cwd(), newDirectoryPath)

  try {
    await access(absoluteFilePath)
  } catch (e) {
    if (e.code !== 'ENOENT') {
      throw new OperationFailedError({ cause: e })
    }
  }

  try {
    const dirStats = await stat(absoluteNewDirPath)

    if (!dirStats.isDirectory()) {
      throw new OperationFailedError()
    }
  } catch (e) {
    throw new OperationFailedError({ cause: e })
  }

  const fileName = basename(absoluteFilePath)

  const newFilePath = join(absoluteNewDirPath, fileName)

  try {
    await access(newFilePath)
    throw new OperationFailedError()
  } catch (e) {
    if (e.code !== 'ENOENT') {
      throw new OperationFailedError({ cause: e })
    }
  }

  return new Promise((res, rej) => {
    const readStream = createReadStream(absoluteFilePath)
    const writeStream = createWriteStream(newFilePath)
  
    readStream.pipe(writeStream)
  
    readStream.on('error', (e) => {
      rej(new OperationFailedError({ cause: e }))
    })
  
    writeStream.on('error', (e) => {
      rej(new OperationFailedError({ cause: e }))
    })
  
    writeStream.on('finish', () => {
      res()
    })
  })

}

export const deleteFileInstruction = async (filePath) => {
  if (!filePath) {
    throw new InvalidInputError()
  }

  try {
    await unlink(filePath)
  } catch(e) {
    throw new OperationFailedError({ cause: e})
  }
}

export const moveFileInstruction = async (filePath, newDirPath) => {
  try {
    await copyFileInstruction(filePath, newDirPath)
    await deleteFileInstruction(filePath)
  } catch (e) {
    throw new OperationFailedError({ cause: e})
  }
}
