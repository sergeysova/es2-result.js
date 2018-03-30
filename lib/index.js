
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

  static of(data) {
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

  mapErr(fn) { // eslint-disable-line no-unused-vars
    return this
  }

  * iter() {
    yield this._data
  }

  and(res) {
    return res
  }

  andThen(fn) {
    return fn(this._data)
  }

  or(result) { // eslint-disable-line no-unused-vars
    return this
  }

  orElse(fn) { // eslint-disable-line no-unused-vars
    return this
  }

  unwrap() {
    return this._data
  }

  unwrapOr(value) { // eslint-disable-line no-unused-vars
    return this._data
  }

  unwrapOrElse(fn) { // eslint-disable-line no-unused-vars
    return this._data
  }

  unwrapErr() {
    throw new ResultException(this._data)
  }

  expect(msg) { // eslint-disable-line no-unused-vars
    return this._data
  }

  expectErr(msg) {
    throw new ResultException(`${msg}: ${this._data}`)
  }

  then(res, rej) { // eslint-disable-line no-unused-vars
    return res(this._data)
  }

  catch(rej) { // eslint-disable-line no-unused-vars
    return this
  }

  promise() {
    return Promise.resolve(this._data)
  }
}

class Err {
  static [Symbol.hasInstance](instance) {
    return instance[symbolErr] === true
  }

  static isErr(target) {
    return target instanceof Err
  }

  static of(error) {
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

  map(fn) { // eslint-disable-line no-unused-vars
    return this
  }

  mapErr(fn) {
    return new Err(fn(this._error))
  }

  * iter() { // eslint-disable-line no-empty-function
  }

  and(res) { // eslint-disable-line no-unused-vars
    return this
  }

  andThen(fn) { // eslint-disable-line no-unused-vars
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

  expectErr(msg) { // eslint-disable-line no-unused-vars
    return this._error
  }

  then(res, rej) {
    return rej(this._error)
  }

  catch(rej) {
    return rej(this._error)
  }

  promise() {
    return Promise.reject(this._error)
  }
}

class Result {
  static [Symbol.hasInstance](instance) {
    return instance[symbolOk] === true || instance[symbolErr] === true
  }

  static of(data) {
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

