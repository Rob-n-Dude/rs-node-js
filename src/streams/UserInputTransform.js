import os from 'os'

import { Transform } from 'node:stream'
import { KNOWN_COMMANDS } from '../constants/commands.js'
import { 
  exitInstruction, 
  upInstruction,
  cdInstruction,
  listInstruction,
  catInstruction,
  createEmptyFileInstruction,
  createDirectoryInstruction,
  renameFileInstruction,
  copyFileInstruction,
  deleteFileInstruction,
  moveFileInstruction,
  systemInstruction,
  hashInstruction,
  compressInstruction,
  decompressInstruction,
 } from '../instructions/index.js'
import { isCustomError } from '../helpers/error.js'
import { getUserNameAndGreet } from '../helpers/user.js'

const commandSeparator = ' '
const loggerTrigger = 'logger'

const MAP_COMMAND_TO_OPERATION = {
  [KNOWN_COMMANDS.EXIT]: exitInstruction,
  [KNOWN_COMMANDS.UP]: upInstruction,
  [KNOWN_COMMANDS.CD]: cdInstruction,
  [KNOWN_COMMANDS.LS]: listInstruction,
  [KNOWN_COMMANDS.CAT]: catInstruction, 
  [KNOWN_COMMANDS.ADD]: createEmptyFileInstruction,
  [KNOWN_COMMANDS.MK_DIR]: createDirectoryInstruction,
  [KNOWN_COMMANDS.RN]: renameFileInstruction,
  [KNOWN_COMMANDS.CP]: copyFileInstruction,
  [KNOWN_COMMANDS.RM]: deleteFileInstruction,
  [KNOWN_COMMANDS.MV]: moveFileInstruction,
  [KNOWN_COMMANDS.OS]: systemInstruction,
  [KNOWN_COMMANDS.HASH]: hashInstruction,
  [KNOWN_COMMANDS.COMPRESS]: compressInstruction,
  [KNOWN_COMMANDS.DECOMPRESS]: decompressInstruction,
}

export class UserInputTransform extends Transform {
  constructor(sourceStream) {
    super()
    this.source = sourceStream

    process.chdir(os.homedir())
    getUserNameAndGreet()
  }

  async _transform (chunk, _, callback) {
    const [command, ...value] = chunk.toString().trim().split(commandSeparator)

    try {
      const instruction = MAP_COMMAND_TO_OPERATION[command]
  
      await instruction(...value)
    } catch (error) {
      if (isCustomError(error)) {
        return error.showMessage()
      }

      console.log('error:', error)
    } finally {
      this.push(loggerTrigger)
      callback()
    }
  }
}