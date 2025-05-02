
import { Transform } from 'node:stream'
import { KNOWN_COMMANDS } from '../constants/commands.js'
import { fallbackInstruction } from '../instructions/fallback.js'

const commandSeparator = ' '

const exitInstruction = (instance) => {
  console.log('exit')
  instance.source.destroy()
}

const MAP_COMMAND_TO_OPERATION = {
  [KNOWN_COMMANDS.EXIT]: exitInstruction
}

export class UserInputTransform extends Transform {
  constructor(sourceStream) {
    super()
    this.source = sourceStream
    this.destination = './'
  }

  _transform (chunk, encoding, callback) {
    const [command, value, ..._] = chunk.toString().trim().split(commandSeparator)

    const instruction = MAP_COMMAND_TO_OPERATION[command] || fallbackInstruction

    instruction(this, value)

    callback(null, this.destination)
  }
}