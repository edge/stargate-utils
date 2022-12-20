import superagent from 'superagent'
import { Host, RequestCallback, parseHost } from '.'

/** HTTP response body for services list query. */
export type GetServicesResponse = {
  services: Service[]
}

/**
 * A service known to Stargate.
 */
export type Service = {
  name: string
  version: string
  integrations?: boolean
}

/**
 * Get a single service.
 */
export const get = async (host: Host, name: string, cb?: RequestCallback): Promise<Service> => {
  const [baseUrl, header] = parseHost(host)
  const url = `${baseUrl}/services/${name}`
  const req = superagent.get(url).set('Host', header)
  const res = cb === undefined ? await req : await cb(req)
  return res.body
}

/**
 * Get a list of services.
 */
export const list = async (host: Host, cb?: RequestCallback): Promise<GetServicesResponse> => {
  const [baseUrl, header] = parseHost(host)
  const url = `${baseUrl}/services`
  const req = superagent.get(url).set('Host', header)
  const res = cb === undefined ? await req : await cb(req)
  return res.body
}
