const args = process.argv.slice(2)
const argPrefix = '--'
const notFoundValue = undefined

const separator = '='

export const getValueFromArgs = (key) => {
  const target = args.find((arg) => arg.startsWith(argPrefix + key))

  if (target === notFoundValue) {
    return target
  }

  return target.split(separator).at(1)
}