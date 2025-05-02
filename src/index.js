import { getUserNameAndGreet } from "./helpers/user.js"
import { Logger } from "./streams/Logger.js"
import { UserInputTransform } from "./streams/UserInputTransform.js"
import { Transform } from 'node:stream'

const startFileManager = async () => {
  getUserNameAndGreet()
  const userInputHandler = new UserInputTransform(process.stdin)
  const logger = new Logger()

  process.stdin.pipe(userInputHandler).pipe(logger)


}


startFileManager()
