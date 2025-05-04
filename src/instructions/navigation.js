import { dirname, isAbsolute, join } from 'node:path'
import { lstat, readdir } from 'node:fs/promises'
import { InvalidInputError } from '../helpers/error.js'

const LS_KEY = {
  NAME: 'Name',
  TYPE: 'Type'
}

const DIRECTORY_CONTENT_TYPE = {
  FILE: 'file',
  DIRECTORY: 'directory'
}

export const upInstruction = () => {
  const currentDirectory = process.cwd()
  const parentDirectory = dirname(currentDirectory)

  if (currentDirectory === parentDirectory) {
    return
  }

  process.chdir(parentDirectory)
}

export const cdInstruction = (path) => {
  if (!path) {
    throw new InvalidInputError()
  }

  const currentDirectory = process.cwd()

  if (isAbsolute(path)) {
    process.chdir(path)
    return
  }
  
  const targetDirectory = join(currentDirectory, path)
  process.chdir(targetDirectory)
}

export const listInstruction = async () => {
  const currentDirectory = process.cwd()

  const dirContent = await readdir(currentDirectory, { withFileTypes: false})

  const result = await Promise.all(
    dirContent.map(async (el) => {
      const path = join(currentDirectory, el)
      const stats = await lstat(path)
      const type = stats.isDirectory() ? DIRECTORY_CONTENT_TYPE.DIRECTORY : DIRECTORY_CONTENT_TYPE.FILE

      return{
        [LS_KEY.NAME]: el,
        [LS_KEY.TYPE]: type
      }
    })
  )

  const sortedResult = [...result].sort((a,b) => {
    if (a[LS_KEY.TYPE] === b[LS_KEY.TYPE]) {
      return a[LS_KEY.NAME].localeCompare(b[LS_KEY.NAME])
    }

    if (a[LS_KEY.TYPE] === DIRECTORY_CONTENT_TYPE.DIRECTORY) {
      return -1
    }

    if (b[LS_KEY.TYPE] === DIRECTORY_CONTENT_TYPE.DIRECTORY) {
      return 1
    }

    return 0
  })

  console.table(sortedResult)
}