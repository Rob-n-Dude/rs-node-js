import { createReadStream } from 'node:fs'
import { basename, join, resolve } from 'node:path'
import { UserMessage } from '../constants/userMessage.js'
import { fallbackInstruction } from './fallback.js'
import { EOL } from 'node:os'
import { open } from 'node:fs/promises'

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


export const createEmptyFile = async (fileName) => {
  if (!fileName) {
    throw new Error(UserMessage.INVALID_INPUT)
  }

  const currentDirectory = process.cwd()
  const safeFilePath = join(currentDirectory, basename(fileName))

  try {
    const file = await open(safeFilePath, 'a')

    await file.close()

  } catch (e) {
    console.log('error', e)
  }
}