export class MaxNumberOfCheckInsErrors extends Error {
  constructor() {
    super(`Max Number Of CheckIns reached.`)
  }
}
