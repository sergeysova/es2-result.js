import test from 'ava'

import { Result } from '../lib'


test('Ok and Err extends Result', (t) => {
  t.true(new Result.Ok() instanceof Result, 'Ok instanceof Result')
  t.true(new Result.Err() instanceof Result, 'Err instanceof Result')
})

test('constructor of Result return Err or Ok', (t) => {
  t.true(new Result(0) instanceof Result.Ok, 'Result(number) return Ok')
  t.true(new Result(new Error('foo')) instanceof Result.Err, 'Result(Error) return Err')
  t.true(new Result(new TypeError('foo')) instanceof Result.Err, 'Result(TypeError) return Err')
  t.true(new Result(new ReferenceError('foo')) instanceof Result.Err, 'Result(ReferenceError) return Err')
})

test('Result.from equals constructor', (t) => {
  t.true(Result.from(0) instanceof Result.Ok, 'Result(number) return Ok')
  t.true(Result.from(new Error('foo')) instanceof Result.Err, 'Result(Error) return Err')
  t.true(Result.from(new TypeError('foo')) instanceof Result.Err, 'Result(TypeError) return Err')
  t.true(Result.from(new ReferenceError('foo')) instanceof Result.Err, 'Result(ReferenceError) return Err')
})

test.todo('Ok.from')

test.todo('Err.from')

test('isOk()', (t) => {
  t.true(Result.from(0).isOk())
  t.false(Result.from(new Error('foo')).isOk())
})

test('isErr()', (t) => {
  t.false(Result.from(0).isErr())
  t.true(Result.from(new Error('foo')).isErr())
})

test('map(fn)', (t) => {
  t.is(Result.Ok.from(1).map(a => a + 1).unwrapOr(100), 2)
  t.is(Result.Err.from(1).map(a => a + 1).unwrapOr(100), 100)
})

test.todo('mapErr(fn)')

test('iter()', (t) => {
  t.is(Result.from(1).iter().next().value, 1, 'Ok::iter() return iterable over single item')
  t.is(Result.from(new Error('')).iter().next().done, true, 'Err::iter() return done iterable')
})

test('and(result)', (t) => {
  let x = Result.from(2)
  let y = Result.from(new Error('foo'))

  t.is(x.and(y), y)

  x = Result.from(new Error('bar'))
  y = Result.from(2)
  t.is(x.and(y), x)

  x = Result.from(1)
  y = Result.from(2)
  t.is(x.and(y), y)
})

test('andThen(fn)', (t) => {
  const sq = (x) => Result.from(x * x)
  const err = (x) => Result.Err.from(x)

  t.is(Result.from(2).andThen(sq).andThen(sq)._data, 16)
  t.is(Result.from(2).andThen(sq).andThen(err)._error, 4)
  t.is(Result.Ok.from(2).andThen(err).andThen(sq)._error, 2)
  t.is(Result.Err.from(3).andThen(sq).andThen(sq)._error, 3)
})

test.todo('or(result)')

test.todo('orElse(fn)')

test('unwrapOr(value)', (t) => {
  t.is(Result.Ok.from(12).unwrapOr(1), 12)
  t.is(Result.Err.from('foo').unwrapOr(19), 19)
})
