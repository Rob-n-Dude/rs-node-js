import { createHash } from 'node:crypto'
import { createReadStream } from 'node:fs'
import { resolve } from 'node:path'
import { InvalidInputError, OperationFailedError } from '../helpers/error.js'

const ALG = 'sha256'

export const hashInstruction = (filePath) => {
  if (!filePath) {
    throw new InvalidInputError()
  }
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
      reject(new OperationFailedError({ cause: e }))
    })
  })
}