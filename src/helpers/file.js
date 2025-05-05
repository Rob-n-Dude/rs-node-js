import { access } from 'fs/promises'

export const isFileExists = async (path) => {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}