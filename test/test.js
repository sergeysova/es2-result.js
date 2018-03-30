/* eslint-disable no-magic-numbers, no-unused-vars, id-match */
/* eslint-disable one-var, one-var-declaration-per-line */
import test from 'ava'

import { Result, Ok, Err } from '../lib'


test('Ok and Err extends Result', (t) => {
  t.true(new Result.Ok() instanceof Result, 'Ok instanceof Result')
  t.true(new Result.Err() instanceof Result, 'Err instanceof Result')
})

test('exported Ok and Err is equal Result static props', (t) => {
  t.is(Err, Result.Err)
  t.is(Ok, Result.Ok)
})

test('constructor of Result return Err or Ok', (t) => {
  t.true(new Result(0) instanceof Result.Ok, 'Result(number) return Ok')
  t.true(new Result(new Error('foo')) instanceof Result.Err, 'Result(Error) return Err')
  t.true(new Result(new TypeError('foo')) instanceof Result.Err, 'Result(TypeError) return Err')
  t.true(new Result(new ReferenceError('foo')) instanceof Result.Err, 'Result(ReferenceError) return Err')
})

test('Result.from equals constructor', (t) => {
  t.true(Result.of(0) instanceof Result.Ok, 'Result(number) return Ok')
  t.true(Result.of(new Error('foo')) instanceof Result.Err, 'Result(Error) return Err')
  t.true(Result.of(new TypeError('foo')) instanceof Result.Err, 'Result(TypeError) return Err')
  t.true(Result.of(new ReferenceError('foo')) instanceof Result.Err, 'Result(ReferenceError) return Err')
})

test('Ok.from', (t) => {
  t.true(Result.Ok.of(1) instanceof Result.Ok)
  t.true(Result.Ok.of(1) instanceof Result)
  t.is(Result.Ok.of(1)._data, 1)
})

test('Err.from', (t) => {
  t.true(Result.Err.of(1) instanceof Result.Err)
  t.true(Result.Err.of(1) instanceof Result)
  t.is(Result.Err.of(1)._error, 1)
})

test('isOk()', (t) => {
  t.true(Result.of(0).isOk())
  t.false(Result.of(new Error('foo')).isOk())
  t.true(Ok.isOk(Result.of(1)))
  t.false(Err.isErr(Result.of(1)))
})

test('isErr()', (t) => {
  t.false(Result.of(0).isErr())
  t.true(Result.of(new Error('foo')).isErr())
  t.true(Err.isErr(Result.of(new Error('foo'))))
  t.false(Ok.isOk(Result.of(new Error('foo'))))
})

test('map(fn)', (t) => {
  t.is(Result.Ok.of(1).map((a) => a + 1).unwrapOr(100), 2)
  t.is(Result.Err.of(1).map((a) => a + 1).unwrapOr(100), 100)
})

test('mapErr(fn)', (t) => {
  t.deepEqual(Result.Ok.of(2).mapErr((e) => 3), Ok.of(2))
  t.deepEqual(Result.Err.of(2).mapErr((e) => 3), Err.of(3))
  t.deepEqual(Result.of(2).map((e) => 4).mapErr((e) => 5), Ok.of(4))
})

test('iter()', (t) => {
  t.is(Result.of(1).iter().next().value, 1, 'Ok::iter() return iterable over single item')
  t.is(Result.of(new Error('')).iter().next().done, true, 'Err::iter() return done iterable')
})

test('and(result)', (t) => {
  let x = Result.of(2)
  let y = Result.of(new Error('foo'))

  t.is(x.and(y), y)

  x = Result.of(new Error('bar'))
  y = Result.of(2)
  t.is(x.and(y), x)

  x = Result.of(1)
  y = Result.of(2)
  t.is(x.and(y), y)
})

test('andThen(fn)', (t) => {
  const sq = (x) => Ok.of(x * x)
  const err = (x) => Err.of(x)

  t.deepEqual(Result.of(2).andThen(sq).andThen(sq), Ok.of(16))
  t.deepEqual(Result.of(2).andThen(sq).andThen(err), Err.of(4))
  t.deepEqual(Ok.of(2).andThen(err).andThen(sq), Err.of(2))
  t.deepEqual(Err.of(3).andThen(sq).andThen(sq), Err.of(3))
})

test('or(result)', (t) => {
  let x, y

  x = Ok.of(2)
  y = Err.of('late error')
  t.is(x.or(y), x)

  x = Err.of('early error')
  y = Ok.of(2)
  t.is(x.or(y), y)

  x = Err.of('not a 2')
  y = Err.of('late error')
  t.is(x.or(y), y)

  x = Ok.of(2)
  y = Ok.of(100)
  t.is(x.or(y), x)
})

test('orElse(fn)', (t) => {
  const sq = (x) => Ok.of(x * x)
  const err = (x) => Err.of(x)

  t.deepEqual(Ok.of(2).orElse(sq).orElse(sq), Ok.of(2))
  t.deepEqual(Ok.of(2).orElse(err).orElse(sq), Ok.of(2))
  t.deepEqual(Err.of(3).orElse(sq).orElse(err), Ok.of(9))
  t.deepEqual(Err.of(3).orElse(err).orElse(err), Err.of(3))
})

test('unwrapOr(value)', (t) => {
  t.is(Result.Ok.of(12).unwrapOr(1), 12)
  t.is(Result.Err.of('foo').unwrapOr(19), 19)
})

test('unwrapOrElse(fn)', (t) => {
  const count = (x) => x.length

  t.is(Ok.of(2).unwrapOrElse(count), 2)
  t.is(Err.of('foo').unwrapOrElse(count), 3)
})

test('unwrap()', (t) => {
  t.throws(() => {
    Err.of('emergency failure').unwrap()
  }, /emergency failure/)

  t.notThrows(() => {
    t.is(Ok.of(2).unwrap(), 2)
  })
})

test('unwrapErr()', (t) => {
  t.throws(() => {
    Ok.of(2).unwrapErr()
  }, /2/)

  t.notThrows(() => {
    t.is(Err.of(10).unwrapErr(), 10)
  })
})

test('expect(msg)', (t) => {
  t.throws(() => {
    Err.of('failure').expect('testing expect')
  }, /testing expect/)

  t.notThrows(() => {
    t.is(Ok.of(12).expect('not throws'), 12)
  })
})

test('expectErr(msg)', (t) => {
  t.throws(() => {
    Ok.of(12).expectErr('testing expectErr')
  }, /testing expectErr: 12/)

  t.notThrows(() => {
    t.is(Err.of(12).expectErr('not throws'), 12)
  })
})

test('thenable', async (t) => {
  t.is(await Ok.of(12), 12)
  try {
    await Err.of('throws')
  }
  catch (error) {
    t.is(error, 'throws')
  }
})

test('catcheable', (t) => {
  t.deepEqual(Ok.of(1).catch(() => 2), Ok.of(1))
  t.is(Err.of(1).catch(() => 2), 2)
})

test('promise()', async (t) => {
  t.true(Ok.of(1).promise() instanceof Promise)
  // t.true(Err.from(2).promise() instanceof Promise)

  t.notThrows(async () => {
    t.is(await Ok.of(1).promise(), 1)
  })

  try {
    await Err.of(2).promise()
  }
  catch (error) {
    t.is(error, 2)
  }
})

test('swap()', (t) => {
  t.deepEqual(Ok.of(1).swap(), Err.of(1))
  t.deepEqual(Err.of(2).swap(), Ok.of(2))
})
