import { getRawHeaders } from 'headers-polyfill'
import type { Client, Config, RequestOptions } from './types.js'
import {
  buildUrl,
  createConfig,
  createInterceptors,
  mergeConfigs,
  mergeHeaders,
  setAuthParams,
} from './utils.js'

import type { Request, Response } from '@paperback/types'

export const createClient = (config: Config = {}): Client => {
  let _config = mergeConfigs(createConfig(), config)

  const getConfig = (): Config => ({ ..._config })

  const setConfig = (config: Config): Config => {
    _config = mergeConfigs(_config, config)
    return getConfig()
  }

  const interceptors = createInterceptors<
    Request,
    Response,
    unknown,
    RequestOptions
  >()

  // @ts-expect-error type shenanigans
  const request: Client['request'] = async (options) => {
    const opts = {
      ..._config,
      ...options,
      headers: mergeHeaders(_config.headers, options.headers),
    }

    if (opts.security) {
      await setAuthParams({
        ...opts,
        security: opts.security,
      })
    }

    if (opts.body && opts.bodySerializer) {
      opts.body = opts.bodySerializer(opts.body)
    }

    // remove Content-Type header if body is empty to avoid sending invalid requests
    if (opts.body === undefined || opts.body === '') {
      opts.headers.delete('Content-Type')
    }

    const url = buildUrl(opts)

    let request: Request = {
      url,
      method: opts.method,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      body: opts.body as any,
      headers: getRawHeaders(opts.headers),
    }

    for (const fn of interceptors.request._fns) {
      request = await fn(request, opts)
    }

    // eslint-disable-next-line prefer-const
    let [response, data] = await Application.scheduleRequest(request)

    for (const fn of interceptors.response._fns) {
      response = await fn(response, request, opts)
    }

    const result = {
      request,
      response,
    }

    if (response.status >= 200 && response.status < 300) {
      if (
        response.status === 204 ||
        response.headers['Content-Length'] === '0'
      ) {
        return {
          data: {},
          ...result,
        }
      }

      const parseAs = opts.parseAs ?? 'json'

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let parsedData: any
      switch (parseAs) {
        case 'arrayBuffer': {
          parsedData = data
          break
        }
        case 'json': {
          parsedData = JSON.parse(Application.arrayBufferToUTF8String(data))

          if (opts.responseValidator) {
            await opts.responseValidator(parsedData)
          }

          if (opts.responseTransformer) {
            parsedData = await opts.responseTransformer(parsedData)
          }

          break
        }
        case 'text': {
          parsedData = Application.arrayBufferToUTF8String(data)
          break
        }
        default: {
          throw new Error('unsupported parseAs')
        }
      }

      return {
        data: parsedData,
        ...result,
      }
    }

    let error = Application.arrayBufferToUTF8String(data)

    try {
      error = JSON.parse(error)
    } catch {
      // noop
    }

    let finalError = error

    for (const fn of interceptors.error._fns) {
      finalError = (await fn(error, response, request, opts)) as string
    }

    finalError = finalError || ({} as string)

    if (opts.throwOnError) {
      throw finalError
    }

    return {
      error: finalError,
      ...result,
    }
  }

  return {
    buildUrl,
    connect: (options) => request({ ...options, method: 'CONNECT' }),
    delete: (options) => request({ ...options, method: 'DELETE' }),
    get: (options) => request({ ...options, method: 'GET' }),
    getConfig,
    head: (options) => request({ ...options, method: 'HEAD' }),
    interceptors,
    options: (options) => request({ ...options, method: 'OPTIONS' }),
    patch: (options) => request({ ...options, method: 'PATCH' }),
    post: (options) => request({ ...options, method: 'POST' }),
    put: (options) => request({ ...options, method: 'PUT' }),
    request,
    setConfig,
    trace: (options) => request({ ...options, method: 'TRACE' }),
  }
}
