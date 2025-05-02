import { getValueFromArgs } from "./getValueFromArgs.js"

const userNameArgKey = 'username'

const fallbackUserName = 'Unknown Warrior'
const greetingTemplate = 'Welcome to the File Manager, %s!'
const farewellTemplate = 'Thank you for using File Manager, %s, goodbye!'


const getUserName = () => {
  return getValueFromArgs(userNameArgKey) || fallbackUserName
}

export const getUserNameAndGreet = () => {
  const username = getUserName()

  console.log(greetingTemplate, username)
}

export const getUserNameAndFarewell = () => {
  const username = getUserName()

  console.log(farewellTemplate, username)
} 