
export interface Thenable<T, E> {
  then<U>(res: (value: T) => U): Thenable<U, E>
  then<U, F>(res: (value: T) => U, rej: (error: E) => F): Thenable<U, F>
  catch?<F>(rej: (error: E) => F): Thenable<T, F>
}

export class Result<T, E> implements Thenable<T, E> {
  static Ok: typeof Ok
  static Err: typeof Err

  static from<T, E>(data: T): Result<T, E>
  constructor(data: T)

  map<U>(fn: (data: T) => U): Result<U, E>
  mapErr<F>(fn: (error: E) => F): Result<T, F>
  iter(): Iterable<T>
  and<U>(res: Result<U, E>): Result<U, E>
  andThen<U>(fn: (data: T) => Result<U, E>): Result<U, E>
  or<F>(res: Result<T, F>): Result<T, F>
  orElse<F>(fn: (error: E) => Result<T, F>): Result<T, F>
  unwrap(): T
  unwrapOr(value: T): T
  unwrapOrElse(fn: (error: E) => T): T
  unwrapErr(): E
  expect(msg: string): T
  expectErr(msg: string): E

  then<U>(res: (value: T) => U): Thenable<U, E>
  then<U, F>(res: (value: T) => U, rej: (error: E) => F): Thenable<U, F>
  catch<F>(rej: (error: E) => F): Thenable<T, F>
  promise(): Promise<T>
}

export class Ok<T, E> extends Result<T, E> {
  static isOk<A>(target: A): boolean
}

export class Err<T, E> extends Result<T, E> {
  static isErr<A>(target: A): boolean
}
