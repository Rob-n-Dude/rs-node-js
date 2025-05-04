import { Writable } from "node:stream"

const locationTemplate = 'You are currently in %s'

const logCurrentLocation = () => {
  console.log(locationTemplate, process.cwd())
}

export class Logger extends Writable {
  constructor() {
    super()

    this.on('pipe', logCurrentLocation)
  }
  _write(_, __, callback) {
    logCurrentLocation()
    callback()
  }
}