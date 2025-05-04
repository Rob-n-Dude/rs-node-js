import { createReadStream, createWriteStream } from 'fs'
import { resolve } from 'path'
import { createBrotliCompress, createBrotliDecompress } from 'zlib'
import { InvalidInputError, OperationFailedError } from '../helpers/error.js'

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
      reject(new OperationFailedError({cause: e}))
    })

    writeStream.on('error', (e) => {
      reject(new OperationFailedError({cause: e}))
    })

    brotliStream.on('error', (e) => {
      reject(new OperationFailedError({cause: e}))
    })
  })
}

export const compressInstruction = (filePath, destinationPath) => {
  if (!filePath || !destinationPath) {
    throw new InvalidInputError()
  }

  const compress = createBrotliCompress()
  return handleBrotliOperation(compress, filePath, destinationPath)
}

export const decompressInstruction = (filePath, destinationPath) => {
  if (!filePath || !destinationPath) {
    throw new InvalidInputError()
  }

  const decompress = createBrotliDecompress()
  return handleBrotliOperation(decompress, filePath, destinationPath)
}