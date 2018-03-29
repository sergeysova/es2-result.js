
const symbolOk = Symbol('Result::Ok')
const symbolErr = Symbol('Result::Err')

class Ok {
  static [Symbol.hasInstance](instance) {
    return instance[symbolOk] === true
  }

  static isOk(target) {
    return target instanceof Ok
  }

  static from(data) {
    return new Ok(data)
  }

  constructor(data) {
    this._data = data
  }

  get [symbolOk]() {
    return true
  }

  isOk() {
    return true
  }

  isErr() {
    return false
  }

  map(fn) {
    return new Ok(fn(this._data))
  }

  mapErr(fn) {
    return this
  }

  *iter() {
    yield this._data
  }

  and(res) {
    return res
  }

  andThen(fn) {
    return fn(this._data)
  }

  unwrapOr(value) {
    return this._data
  }
}

class Err {
  static [Symbol.hasInstance](instance) {
    return instance[symbolErr] === true
  }

  static isErr(target) {
    return target instanceof Err
  }

  static from(error) {
    return new Err(error)
  }

  constructor(error) {
    this._error = error
  }

  get [symbolErr]() {
    return true
  }

  isOk() {
    return false
  }

  isErr() {
    return true
  }

  map(fn) {
    return this
  }

  mapErr(fn) {
    return new Err(fn(this._error))
  }

  *iter() {
  }

  and(res) {
    return this
  }

  andThen(fn) {
    return this
  }

  unwrapOr(value) {
    return value
  }
}

class Result {
  static [Symbol.hasInstance](instance) {
    return instance[symbolOk] === true || instance[symbolErr] === true
  }

  static from(data) {
    return new Result(data)
  }

  constructor(data) {
    if (data instanceof Error) {
      return new Err(data)
    }
    return new Ok(data)
  }
}

Result.Ok = Ok
Result.Err = Err

module.exports = {
  Result,
  Ok,
  Err,
}

