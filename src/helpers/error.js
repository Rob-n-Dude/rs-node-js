import { UserMessage } from "../constants/userMessage.js"

class CustomError extends Error {
  constructor(message, options) {
    super(message, options)
    this.userMessage = message
  }

  showMessage() {
    console.log(this.userMessage)
  }
}

export const isCustomError = (e) => e instanceof CustomError

export class InvalidInputError extends CustomError {
  constructor(options = {}) {
    super(UserMessage.INVALID_INPUT, options)
  }
}

export class OperationFailedError extends CustomError {
  constructor(options = {}) {
    super(UserMessage.OPERATION_FAILED, options)
  }
}