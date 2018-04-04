/* eslint-disable no-use-before-define, import/no-extraneous-dependencies, global-require */

const symbolOk = Symbol('Result::Ok')
const symbolErr = Symbol('Result::Err')

let Option = null

try {
  Option = require('@es2/option')
}
catch (error) {
  // Option none
}

const ifOption = (fn) => Option
  ? fn
  : undefined

class ResultException extends Error {}

function Ok(data) {
  return {
    [symbolOk]: true,

    isOk: () => true,

    isErr: () => false,

    equals: (result) => Ok.isOk(result) && result.unwrap() === data,

    map: (fn) => Ok(fn(data)),

    // eslint-disable-next-line no-unused-vars
    mapErr: (fn) => Ok(data),

    // eslint-disable-next-line no-unused-vars
    bimap: (f, g) => Ok(f(data)),

    chain: (fn) => fn(data),

    // eslint-disable-next-line no-unused-vars
    chainErr: (fn) => Ok(data),

    * iter() {
      yield data
    },

    and: (result) => result,

    andThen: (fn) => fn(data),

    // eslint-disable-next-line no-unused-vars
    or: (result) => Ok(data),

    // eslint-disable-next-line no-unused-vars
    orElse: (fn) => Ok(data),

    unwrap: () => data,

    // eslint-disable-next-line no-unused-vars
    unwrapOr: (value) => data,

    // eslint-disable-next-line no-unused-vars
    unwrapOrElse: (fn) => data,

    unwrapErr: () => {
      throw new ResultException(data)
    },

    // eslint-disable-next-line no-unused-vars
    expect: (msg) => data,

    expectErr: (msg) => {
      throw new ResultException(`${msg}: ${data}`)
    },

    promise: () => Promise.resolve(data),

    swap: () => Err(data),

    extract: () => [data],

    extractErr: () => [],

    ok: ifOption(() => Option.Some(data)),

    err: ifOption(() => Option.None()),
  }
}

Ok.isOk = (instance) => instance[symbolOk] === true
Ok.of = Ok

function Err(error) {
  return {
    [symbolErr]: true,

    isOk: () => false,

    isErr: () => true,

    equals: (result) => Err.isErr(result) && result.unwrapErr() === error,

    // eslint-disable-next-line no-unused-vars
    map: (fn) => Err(error),

    mapErr: (fn) => Err(fn(error)),

    // eslint-disable-next-line no-unused-vars
    bimap: (f, g) => Err(g(error)),

    // eslint-disable-next-line no-unused-vars
    chain: (fn) => Err(error),

    chainErr: (fn) => fn(error),

    // eslint-disable-next-line no-empty-function
    * iter() {
    },

    // eslint-disable-next-line no-unused-vars
    and: (result) => Err(error),

    // eslint-disable-next-line no-unused-vars
    andThen: (fn) => Err(error),

    or: (result) => result,

    orElse: (fn) => fn(error),

    unwrap: () => {
      throw error
    },

    unwrapOr: (value) => value,

    unwrapOrElse: (fn) => fn(error),

    unwrapErr: () => error,

    expect: (msg) => {
      throw new ResultException(msg)
    },

    // eslint-disable-next-line no-unused-vars
    expectErr: (msg) => error,

    promise: () => Promise.reject(error),

    swap: () => Ok(error),

    extract: () => [],

    extractErr: () => [error],

    ok: ifOption(() => Option.None()),

    err: ifOption(() => Option.Some(error)),
  }
}

Err.isErr = (instance) => instance[symbolErr] === true
Err.of = Err

const Result = { Ok, Err }

Result.isResult = (instance) => Ok.isOk(instance) || Err.isErr(instance)
Result.of = Ok.of

module.exports = {
  Ok,
  Err,
  Result,
}
