
export class ResultException extends Error {}

export type Result<T, E> = {
  isOk(): boolean,
  isErr(): boolean,

  equals<F = E>(result: Result<T, F>): boolean,

  map<U>(fn: (value: T) => U): Result<U, E>,
  mapErr<F>(fn: (error: E) => F): Result<T, F>,
  bimap<U = T, F = E>(map: (data: T) => U, mapErr: (error: E) => F): Result<U, F>,

  chain<U, F = E>(fn: (data: T) => Result<U, F>): Result<U, F>,
  chainErr<U, F = E>(fn: (error: E) => Result<U, F>): Result<U, F>,

  iter(): Iterator<T>,

  and<U, F = E>(result: Result<U, F>): Result<U, F>,
  andThen<U>(fn: (data: T) => Result<U, E>): Result<U, E>,
  or<F>(result: Result<T, F>): Result<T, F>,
  orElse<F>(fn: (error: E) => Result<T, F>): Result<T, F>,

  /**
   * @throws {ResultExpection}
   */
  unwrap(): T,
  unwrapOr(value: T): T,
  unwrapOrElse(fn: (value: T) => T): T,
  unwrapErr(): E,

  /**
   * @throws {ResultExpection}
   */
  expect(msg: string): T,

  /**
   * @throws {ResultExpection}
   */
  expectErr(msg: string): E,
  promise(): Promise<T>,

  swap(): Result<E, T>,
  extract(): T[],
  extractErr(): E[],
}

export type OkConstructor = {
  <T, E>(data: T): Result<T, E>,

  isOk<T, E>(result: Result<T, E>): boolean,
  of<T, E>(data: T): Result<T, E>,
}

export type ErrConstructor = {
  <T, E>(data: T): Result<T, E>,

  isErr<T, E>(result: Result<T, E>): boolean,
  of<T, E>(data: T): Result<T, E>,
}

export type ResultNamespace = {
  Ok: OkConstructor,
  Err: ErrConstructor,
  of<T, E>(data: T): Result<T, E>,
}

export const Result: ResultNamespace
export const Ok: OkConstructor
export const Err: ErrConstructor

