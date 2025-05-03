import os from 'os'

import { Transform } from 'node:stream'
import { KNOWN_COMMANDS } from '../constants/commands.js'
import { 
  fallbackInstruction, 
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
 } from '../instructions/index.js'

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
}

export class UserInputTransform extends Transform {
  constructor(sourceStream) {
    super()
    this.source = sourceStream

    process.chdir(os.homedir())
  }

  async _transform (chunk, encoding, callback) {
    const [command, ...value] = chunk.toString().trim().split(commandSeparator)

    try {
      const instruction = MAP_COMMAND_TO_OPERATION[command]
  
      await instruction(...value)
    } catch (e) {
      // TODO: find a new way to handle errors
      console.log('inside transform', e)
      fallbackInstruction()
    } finally {
      this.push(loggerTrigger)
      callback()
    }
  }
}