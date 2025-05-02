import { Writable } from "node:stream"
import { getCurrentLocation } from '../helpers/location.js'

const locationTemplate = 'You are currently in %s'

export class Logger extends Writable {
  _write(_, __, callback) {
    const location = getCurrentLocation()
    console.log(locationTemplate, location)

    callback()
  }
}