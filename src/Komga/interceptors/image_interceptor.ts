import {
  PaperbackInterceptor,
  type Request,
  type Response,
} from '@paperback/types'
import { getKomgaCredentials } from '../utils/config.js'

export class KomgaImageInterceptor extends PaperbackInterceptor {
  override async interceptRequest(request: Request): Promise<Request> {
    // Normally auth is handled by the sdk. We only want to inject headers if they're not present
    if (request.headers!['Authorization'] !== undefined) {
      return request
    }

    const { username, password } = getKomgaCredentials()
    request.headers!['Authorization'] = 'Basic ' + btoa(`${username}:${password}`)

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
