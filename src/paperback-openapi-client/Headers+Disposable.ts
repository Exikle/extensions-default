import { Headers as H } from 'headers-polyfill'

export class Headers extends H {
  override entries(): HeadersIterator<[string, string]> {
    // @ts-expect-error type shenanigans
    return super.entries()
  }

  override keys(): HeadersIterator<string> {
    // @ts-expect-error type shenanigans
    return super.keys()
  }

  override values(): HeadersIterator<string> {
    // @ts-expect-error type shenanigans
    return super.values()
  }

  override [Symbol.iterator](): HeadersIterator<[string, string]> {
    // @ts-expect-error type shenanigans
    return super[Symbol.iterator]()
  }
}
