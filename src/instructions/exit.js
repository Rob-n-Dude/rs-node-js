import { getUserNameAndFarewell} from '../helpers/user.js'

export const exitInstruction = () => {
  getUserNameAndFarewell()
  process.exit(0)
}
