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
  t.true(Result.from(0) instanceof Result.Ok, 'Result(number) return Ok')
  t.true(Result.from(new Error('foo')) instanceof Result.Err, 'Result(Error) return Err')
  t.true(Result.from(new TypeError('foo')) instanceof Result.Err, 'Result(TypeError) return Err')
  t.true(Result.from(new ReferenceError('foo')) instanceof Result.Err, 'Result(ReferenceError) return Err')
})

test('Ok.from', (t) => {
  t.true(Result.Ok.from(1) instanceof Result.Ok)
  t.true(Result.Ok.from(1) instanceof Result)
  t.is(Result.Ok.from(1)._data, 1)
})

test('Err.from', (t) => {
  t.true(Result.Err.from(1) instanceof Result.Err)
  t.true(Result.Err.from(1) instanceof Result)
  t.is(Result.Err.from(1)._error, 1)
})

test('isOk()', (t) => {
  t.true(Result.from(0).isOk())
  t.false(Result.from(new Error('foo')).isOk())
  t.true(Ok.isOk(Result.from(1)))
  t.false(Err.isErr(Result.from(1)))
})

test('isErr()', (t) => {
  t.false(Result.from(0).isErr())
  t.true(Result.from(new Error('foo')).isErr())
  t.true(Err.isErr(Result.from(new Error('foo'))))
  t.false(Ok.isOk(Result.from(new Error('foo'))))
})

test('map(fn)', (t) => {
  t.is(Result.Ok.from(1).map(a => a + 1).unwrapOr(100), 2)
  t.is(Result.Err.from(1).map(a => a + 1).unwrapOr(100), 100)
})

test('mapErr(fn)', (t) => {
  t.is(Result.Ok.from(2).mapErr(e => 3)._data, 2)
  t.is(Result.Err.from(2).mapErr(e => 3)._error, 3)
  t.is(Result.from(2).map(e => 4).mapErr(e => 5)._data, 4)
})

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
  const sq = (x) => Ok.from(x * x)
  const err = (x) => Err.from(x)

  t.is(Result.from(2).andThen(sq).andThen(sq)._data, 16)
  t.is(Result.from(2).andThen(sq).andThen(err)._error, 4)
  t.is(Ok.from(2).andThen(err).andThen(sq)._error, 2)
  t.is(Err.from(3).andThen(sq).andThen(sq)._error, 3)
})

test('or(result)', (t) => {
  let x, y

  x = Ok.from(2)
  y = Err.from('late error')
  t.is(x.or(y), x)

  x = Err.from('early error')
  y = Ok.from(2)
  t.is(x.or(y), y)

  x = Err.from('not a 2')
  y = Err.from('late error')
  t.is(x.or(y), y)

  x = Ok.from(2)
  y = Ok.from(100)
  t.is(x.or(y), x)
})

test('orElse(fn)', (t) => {
  const sq = (x) => Ok.from(x * x)
  const err = (x) => Err.from(x)

  t.deepEqual(Ok.from(2).orElse(sq).orElse(sq), Ok.from(2))
  t.deepEqual(Ok.from(2).orElse(err).orElse(sq), Ok.from(2))
  t.deepEqual(Err.from(3).orElse(sq).orElse(err), Ok.from(9))
  t.deepEqual(Err.from(3).orElse(err).orElse(err), Err.from(3))
})

test('unwrapOr(value)', (t) => {
  t.is(Result.Ok.from(12).unwrapOr(1), 12)
  t.is(Result.Err.from('foo').unwrapOr(19), 19)
})

test('unwrapOrElse(fn)', (t) => {
  const count = (x) => x.length

  t.is(Ok.from(2).unwrapOrElse(count), 2)
  t.is(Err.from('foo').unwrapOrElse(count), 3)
})

test('unwrap()', (t) => {
  t.throws(() => {
    Err.from('emergency failure').unwrap()
  }, /emergency failure/)

  t.notThrows(() => {
    t.is(Ok.from(2).unwrap(), 2)
  })
})

test('unwrapErr()', (t) => {
  t.throws(() => {
    Ok.from(2).unwrapErr()
  }, /2/)

  t.notThrows(() => {
    t.is(Err.from(10).unwrapErr(), 10)
  })
})

test('expect(msg)', (t) => {
  t.throws(() => {
    Err.from('failure').expect('testing expect')
  }, /testing expect/)

  t.notThrows(() => {
    t.is(Ok.from(12).expect('not throws'), 12)
  })
})

test('expectErr(msg)', (t) => {
  t.throws(() => {
    Ok.from(12).expectErr('testing expectErr')
  }, /testing expectErr: 12/)

  t.notThrows(() => {
    t.is(Err.from(12).expectErr('not throws'), 12)
  })
})

test('thenable', async (t) => {
  t.is(await Ok.from(12), 12)
  try {
    await Err.from('throws')
  } catch(err) {
    t.is(err, 'throws')
  }
})

test('catcheable', (t) => {
  t.deepEqual(Ok.from(1).catch(() => 2), Ok.from(1))
  t.is(Err.from(1).catch(() => 2), 2)
})
