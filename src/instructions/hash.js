import { createHash } from 'node:crypto'
import { createReadStream } from 'node:fs'
import { UserMessage } from '../constants/userMessage.js'
import { resolve } from 'node:path'

const ALG = 'sha256'

export const hashInstruction = (filePath) => {
  const absFilePath = resolve(process.cwd(), filePath)

  return new Promise((resolve, reject) => {
    const readStream = createReadStream(absFilePath)
    const hashStream = createHash(ALG)

    readStream.on('data', (chunk) => {
      hashStream.update(chunk)
    })

    readStream.on('end', () => {
      const result = hashStream.digest('hex')
      console.log('result', result)
      resolve(result)
    })

    readStream.on('error', (e) => {
      reject(new Error(UserMessage.OPERATION_FAILED, {cause: e}))
    })
  })
}