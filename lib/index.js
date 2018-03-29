
const symbolOk = Symbol('Result::Ok')
const symbolErr = Symbol('Result::Err')

class ResultException extends Error {}

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

  or(result) {
    return this
  }

  orElse(fn) {
    return this
  }

  unwrap() {
    return this._data
  }

  unwrapOr(value) {
    return this._data
  }

  unwrapOrElse(fn) {
    return this._data
  }

  unwrapErr() {
    throw new ResultException(this._data)
  }

  expect(msg) {
    return this._data
  }

  expectErr(msg) {
    throw new ResultException(`${msg}: ${this._data}`)
  }

  then(res, rej) {
    return res(this._data)
  }

  catch(rej) {
    return this
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

  or(res) {
    return res
  }

  orElse(fn) {
    return fn(this._error)
  }

  unwrap() {
    throw this._error
  }

  unwrapOr(value) {
    return value
  }

  unwrapOrElse(fn) {
    return fn(this._error)
  }

  unwrapErr() {
    return this._error
  }

  expect(msg) {
    throw new ResultException(msg)
  }

  expectErr(msg) {
    return this._error
  }

  then(res, rej) {
    return rej(this._error)
  }

  catch(rej) {
    return rej(this._error)
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

