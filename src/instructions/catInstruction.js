import { createReadStream } from 'node:fs'
import { resolve } from 'node:path'
import { UserMessage } from '../constants/userMessage.js'
import { fallbackInstruction } from './fallback.js'
import { EOL } from 'node:os'

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