import os from 'node:os'
import { InvalidInputError } from '../helpers/error.js'

const KNOWN_ARGUMENTS = {
  EOL: 'EOL',
  CPUS: 'cpus',
  HOMEDIR: 'homedir',
  USER_NAME: 'username',
  ARCH: 'architecture'
}
const separator = '--'

const MAP_ARGUMENT_TO_EXECUTOR = {
  [KNOWN_ARGUMENTS.EOL]: () => getEOL(),
  [KNOWN_ARGUMENTS.CPUS]: () => getCPUs(),
  [KNOWN_ARGUMENTS.HOMEDIR]: () => getHomeDir(),
  [KNOWN_ARGUMENTS.USER_NAME]: () => getSystemUser(),
  [KNOWN_ARGUMENTS.ARCH]: () => getArchitecture(),
}

export const systemInstruction = (argument) => {
  const fn = MAP_ARGUMENT_TO_EXECUTOR[parseArgument(argument)]

  if (!fn) {
    throw new InvalidInputError()
  }

  console.log(fn())
}

const parseArgument = (arg) => {
  return arg.split(separator).at(1)
}

const getEOL = () => {
  return JSON.stringify(os.EOL)
}

const getCPUs = () => {
  return os.cpus()
}

const getHomeDir = () => {
  return os.homedir()
}

const getSystemUser = () => {
  const { username } = os.userInfo()
  return username
}

const getArchitecture = () => {
  return os.arch()
}

