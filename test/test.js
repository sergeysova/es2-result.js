/* eslint-disable no-magic-numbers, no-unused-vars, id-match */
/* eslint-disable one-var, one-var-declaration-per-line */
import test from 'ava'

import { Result, Ok, Err } from '../lib'


test('exported Ok and Err is equal Result static props', (t) => {
  t.is(Err, Result.Err)
  t.is(Ok, Result.Ok)
})

test('no constructor of Result', (t) => {
  t.true(typeof Result === 'object')
})

test('Ok()', (t) => {
  t.is(Result.Ok(1).unwrap(), 1)
})

test('Err()', (t) => {
  t.is(Result.Err(1).unwrapErr(), 1)
})


test('Result.isResult(target)', (t) => {
  t.true(Result.isResult(Ok(1)))
  t.true(Result.isResult(Err(1)))

  t.false(Result.isResult(new Error('Bar')))
  t.false(Result.isResult(12))
  t.false(Result.isResult(Result))
  t.false(Result.isResult(Result.Ok))
  t.false(Result.isResult(Result.Err))
})

test('isOk()', (t) => {
  t.true(Ok(0).isOk())
  t.false(Err(new Error('foo')).isOk())
  t.true(Ok.isOk(Ok(1)))
  t.false(Err.isErr(Ok(1)))
})

test('isErr()', (t) => {
  t.false(Ok(0).isErr())
  t.true(Err(new Error('foo')).isErr())
  t.true(Err.isErr(Err(new Error('foo'))))
  t.false(Ok.isOk(Err(new Error('foo'))))
})

test('map(fn)', (t) => {
  t.is(Result.Ok(1).map((a) => a + 1).unwrapOr(100), 2)
  t.is(Result.Err(1).map((a) => a + 1).unwrapOr(100), 100)
})

test('mapErr(fn)', (t) => {
  t.is(Result.Ok(2).mapErr((e) => 3).unwrap(), 2)
  t.is(Result.Err(2).mapErr((e) => 3).unwrapErr(), 3)
  t.is(Ok(2).map((e) => 4).mapErr((e) => 5).unwrap(), 4)
})

test('bimap(f, g)', (t) => {
  const foo = (x) => x * x
  const bar = (y) => y + y

  t.is(Ok(4).bimap(foo, bar).unwrap(), 16)
  t.is(Err(4).bimap(foo, bar).unwrapErr(), 8)
})

test('iter()', (t) => {
  t.is(Ok(1).iter().next().value, 1, 'Ok::iter() return iterable over single item')
  t.is(Err(new Error('')).iter().next().done, true, 'Err::iter() return done iterable')
})

test('and(result)', (t) => {
  let x = Ok(2)
  let y = Err('foo')

  t.is(x.and(y).unwrapErr(), 'foo')

  x = Err('bar')
  y = Ok(2)
  t.is(x.and(y).unwrapErr(), 'bar')

  x = Ok(1)
  y = Ok(2)
  t.is(x.and(y).unwrap(), 2)
})

test('andThen(fn)', (t) => {
  const sq = (x) => Ok(x * x)
  const err = (x) => Err(x)

  t.is(Ok(2).andThen(sq).andThen(sq).unwrap(), 16)
  t.is(Ok(2).andThen(sq).andThen(err).unwrapErr(), 4)
  t.is(Ok(2).andThen(err).andThen(sq).unwrapErr(), 2)
  t.is(Err(3).andThen(sq).andThen(sq).unwrapErr(), 3)
})

test('or(result)', (t) => {
  let x, y

  x = Ok(2)
  y = Err('late error')
  t.is(x.or(y).unwrap(), 2)

  x = Err('early error')
  y = Ok(2)
  t.is(x.or(y).unwrap(), 2)

  x = Err('not a 2')
  y = Err('late error')
  t.is(x.or(y).unwrapErr(), 'late error')

  x = Ok(2)
  y = Ok(100)
  t.is(x.or(y).unwrap(), 2)
})

test('orElse(fn)', (t) => {
  const sq = (x) => Ok(x * x)
  const err = (x) => Err(x)

  t.is(Ok(2).orElse(sq).orElse(sq).unwrap(), 2)
  t.is(Ok(2).orElse(err).orElse(sq).unwrap(), 2)
  t.is(Err(3).orElse(sq).orElse(err).unwrap(), 9)
  t.is(Err(3).orElse(err).orElse(err).unwrapErr(), 3)
})

test('unwrapOr(value)', (t) => {
  t.is(Result.Ok(12).unwrapOr(1), 12)
  t.is(Result.Err('foo').unwrapOr(19), 19)
})

test('unwrapOrElse(fn)', (t) => {
  const count = (x) => x.length

  t.is(Ok(2).unwrapOrElse(count), 2)
  t.is(Err('foo').unwrapOrElse(count), 3)
})

test('unwrap()', (t) => {
  t.throws(() => {
    Err('emergency failure').unwrap()
  }, /emergency failure/)

  t.notThrows(() => {
    t.is(Ok(2).unwrap(), 2)
  })
})

test('unwrapErr()', (t) => {
  t.throws(() => {
    Ok(2).unwrapErr()
  }, /2/)

  t.notThrows(() => {
    t.is(Err(10).unwrapErr(), 10)
  })
})

test('expect(msg)', (t) => {
  t.throws(() => {
    Err('failure').expect('testing expect')
  }, /testing expect/)

  t.notThrows(() => {
    t.is(Ok(12).expect('not throws'), 12)
  })
})

test('expectErr(msg)', (t) => {
  t.throws(() => {
    Ok(12).expectErr('testing expectErr')
  }, /testing expectErr: 12/)

  t.notThrows(() => {
    t.is(Err(12).expectErr('not throws'), 12)
  })
})

test('promise()', async (t) => {
  t.true(Ok(1).promise() instanceof Promise)
  // t.true(Err.from(2).promise() instanceof Promise)

  t.notThrows(async () => {
    t.is(await Ok(1).promise(), 1)
  })

  try {
    await Err(2).promise()
  }
  catch (error) {
    t.is(error, 2)
  }
})

test('swap()', (t) => {
  t.is(Ok(1).swap().unwrapErr(), 1)
  t.is(Err(2).swap().unwrap(), 2)
})

test('combine .and() and () to make all() function', (t) => {
  const all = (ls) => ls.reduce((p, c) => p.and(c), Ok(true))

  t.is(all([Ok(1), Ok(2)]).unwrap(), 2)
})

test('extract()', (t) => {
  t.deepEqual(Ok(1).extract(), [1])
  t.deepEqual(Err(1).extract(), [])
})

test('extractErr()', (t) => {
  t.deepEqual(Ok(1).extractErr(), [])
  t.deepEqual(Err(1).extractErr(), [1])
})

