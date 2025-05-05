import { exitInstruction } from "./instructions/index.js"
import { Logger, UserInputTransform } from "./streams/index.js"

const startFileManager = async () => {
  const userInputHandler = new UserInputTransform(process.stdin)
  const logger = new Logger()

  process.stdin.pipe(userInputHandler).pipe(logger)

  process.on('SIGINT', () => {
    exitInstruction()
  })
}


startFileManager()
