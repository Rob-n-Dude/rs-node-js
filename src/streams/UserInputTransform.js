import os from 'os'

import { Transform } from 'node:stream'
import { KNOWN_COMMANDS } from '../constants/commands.js'
import { 
  fallbackInstruction, 
  exitInstruction, 
  upInstruction,
  cdInstruction,
  listInstruction
 } from '../instructions/index.js'

const commandSeparator = ' '
const loggerTrigger = 'logger'

const MAP_COMMAND_TO_OPERATION = {
  [KNOWN_COMMANDS.EXIT]: exitInstruction,
  [KNOWN_COMMANDS.UP]: upInstruction,
  [KNOWN_COMMANDS.CD]: cdInstruction,
  [KNOWN_COMMANDS.LS]: listInstruction,
}

export class UserInputTransform extends Transform {
  constructor(sourceStream) {
    super()
    this.source = sourceStream

    process.chdir(os.homedir())
  }

  _transform (chunk, encoding, callback) {
    const [command, value, ..._] = chunk.toString().trim().split(commandSeparator)

    try {
      const instruction = MAP_COMMAND_TO_OPERATION[command]
  
      instruction(value)
    } catch {
      fallbackInstruction()
    } finally {
      this.push(loggerTrigger)
      callback()
    }
  }
}