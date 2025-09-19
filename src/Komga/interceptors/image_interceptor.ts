import { PaperbackInterceptor, type Request, type Response } from '@paperback/types'
import { getKomgaCredentials } from '../utils/config.js'


export class KomgaImageInterceptor extends PaperbackInterceptor {
  override async interceptRequest(request: Request): Promise<Request> {
    if (!request.url.includes('thumbnail')) {
      return request
    }

    const { username, password } = getKomgaCredentials()
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    request.headers!['Authorization'] =
      'Basic ' + btoa(`${username}:${password}`)

    return request
  }

  override async interceptResponse(
    _request: Request,
    _response: Response,
    data: ArrayBuffer
  ): Promise<ArrayBuffer> {
    return data
  }
}
