import { createReadStream, createWriteStream } from 'fs'
import { resolve } from 'path'
import { createBrotliCompress, createBrotliDecompress } from 'zlib'
import { UserMessage } from '../constants/userMessage.js'

const handleBrotliOperation = (brotliStream, filePath, destinationPath) => {
  const absoluteFilePath = resolve(process.cwd(), filePath)
  const absoluteDestinationPath = resolve(process.cwd(), destinationPath)

  return new Promise((resolve, reject) => {
    const readStream = createReadStream(absoluteFilePath)
    const writeStream = createWriteStream(absoluteDestinationPath)

    readStream.pipe(brotliStream).pipe(writeStream)

    readStream.on('end', () => {
      resolve()
    })

    readStream.on('error', (e) => {
      reject(new Error(UserMessage.OPERATION_FAILED, { cause: e }))
    })

    writeStream.on('error', (e) => {
      reject(new Error(UserMessage.OPERATION_FAILED, { cause: e }))
    })

    brotliStream.on('error', (e) => {
      reject(new Error(UserMessage.OPERATION_FAILED, { cause: e }))
    })
  })
}

export const compressInstruction = (filePath, destinationPath) => {
  const compress = createBrotliCompress()
  return handleBrotliOperation(compress, filePath, destinationPath)
}

export const decompressInstruction = (filePath, destinationPath) => {
  const decompress = createBrotliDecompress()
  
  return handleBrotliOperation(decompress, filePath, destinationPath)
}