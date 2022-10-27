// Copyright (C) 2022 Edge Network Technologies Limited
// Use of this source code is governed by a GNU GPL-style license
// that can be found in the LICENSE.md file. All rights reserved.

import { toQueryString } from './helpers'
import superagent, { SuperAgentRequest } from 'superagent'

/**
 * Metrics recorded for devices that serve CDN requests (specifically, Hosts).
 */
export type CdnMetrics = {
  requests: number
  data: {
    in: number
    out: number
  }
  timing: {
    download: number
    processing: number
    total: number
  }
}

/**
 * Data for a closed session.
 */
export type ClosedSession = Required<Omit<Session, 'lastActive'>>

/**
 * Parameters for closed sessions API.
 *
 * The `from` and `to` parameters define a window of time within which sessions must have been active.
 * If only `from` is given, the filter matches any session that ended after then.
 * If only `to` is given, the filter matches any session that started before then.
 * If both are given, the filter matches any session that was active between the bounds of `from` and `to`.
 */
export type ClosedSessionsParams = {
  /** Start of filter window. */
  from?: number
  /** End of filter window. */
  to?: number
}

/**
 * Geolocation data.
 */
export type Geolocation = {
  city?: string
  country?: string
  countryCode?: string
  lat?: number
  lng?: number
}

/**
 * A Host [base URL] can be expressed as a string or an object.
 *
 * The object form allows a different hostname (or Host header) to be used than is actually used in the request.
 * The example below is roughly equivalent to `curl -H 'Host: stargate.edge.network' 'https://1.2.3.4'`:
 *
 * ```json
 * { "address": "1.2.3.4", "host": "stargate.edge.network", "protocol": "https" }
 * ```
 *
 * See `parseHost()` for a standard parsing implementation.
 *
 * **This type is completely unrelated to network Hosts.**
 */
export type Host = string | {
  address: string
  host: string
  protocol: string
}

/**
 * Metrics recorded for Host sessions.
 */
export type HostMetrics = {
  cdn?: CdnMetrics
}

/**
 * Metrics recorded for sessions.
 */
export type Metrics = HostMetrics & {
  messages: number
}

/**
 * Information about a node.
 */
export type Node = {
  /** Node type will be `host`, `gateway`, or `stargate` */
  type: string
  /** Version of node */
  version: string
  /** Device address */
  address: string
  /** Session UUID */
  session: string
  /** Stake hash */
  stake: string
  /** Gateway address, if node is a `host` */
  gateway?: string
  /** Stargate address, if node is a `gateway` */
  stargate?: string
  /** Geolocation data */
  geo?: Geolocation
}

/**
 * Data for an open session.
 */
export type OpenSession = Required<Omit<Session, 'end'>>

/**
 * Callback function allowing a SuperAgent HTTP request to be modified before it is sent.
 * For example, you may want to specify a 100ms request timeout while fetching transactions:
 *
 * ```
 * const txs = await tx.transactions('https://stargate.edge.network', undefined, r => r.timeout(100))
 * ```
 *
 * This approach enables user code to alter request behaviour using SuperAgent's API:
 * https://visionmedia.github.io/superagent/
 */
export type RequestCallback = (r: SuperAgentRequest) => SuperAgentRequest

/**
 * Session data.
 * This represents both open and closed sessions.
 *
 * You may use the convenience functions `isClosed` and `isOpen` to disambiguate, and optionally cast to
 * `ClosedSession` or `OpenSession` for typing purposes.
 */
export type Session = {
  node: Node
  start: number
  lastActive?: number
  end?: number
  metrics?: Metrics
}

/**
 * Get closed sessions from a Stargate.
 *
 * ```
 * const sessions = await closedSessions('https://stargate.edge.network', 'my-bearer-token')
 * ```
 */
export const closedSessions = async (
  host: Host,
  token: string,
  params?: ClosedSessionsParams,
  cb?: RequestCallback
): Promise<ClosedSession[]> => {
  const [baseUrl, header] = parseHost(host)
  let url = `${baseUrl}/sessions/closed`
  if (params !== undefined) url += `?${toQueryString(params)}`
  const req = superagent.get(url)
    .set('Host', header)
    .set('Authorization', `Bearer ${token}`)
  const res = cb === undefined ? await req : await cb(req)
  return res.body
}

/**
 * Determine whether a session is closed.
 */
export const isClosed = (session: Session): boolean => !isOpen(session)

/**
 * Determine whether a session is open.
 */
export const isOpen = (session: Session): boolean => session.end === undefined


/**
 * Parse a Host string or object to a tuple of request base URL and Host header value.
 *
 * For example:
 *
 * ```js
 * const host = {
 *   address: '1.2.3.4',
 *   host: 'stargate.edge.network',
 *   protocol: 'https'
 * }
 * const [url, header] = parseHost(host)
 * const data = await superagent.get(url).set("Host", header)
 * ```
 */
const parseHost = (h: Host): [string, string] => {
  if (typeof h === 'string') return [h, h.match(urlRegexp)?.[1] || '']
  return [`${h.protocol}://${h.address}`, h.host]
}

/**
 * Get open sessions from a Stargate.
 *
 * ```
 * const sessions = await openSessions('https://stargate.edge.network')
 * ```
 */
export const openSessions = async (host: Host, cb?: RequestCallback): Promise<OpenSession[]> => {
  const [baseUrl, header] = parseHost(host)
  const url = `${baseUrl}/sessions/open`
  const req = superagent.get(url).set('Host', header)
  const res = cb === undefined ? await req : await cb(req)
  return res.body
}

/**
 * Get both closed and open sessions from a Stargate.
 *
 * ```
 * const sessions = await sessions('https://stargate.edge.network', 'my-bearer-token')
 * ```
 */
export const sessions = async (
  host: Host,
  token: string,
  params?: ClosedSessionsParams,
  cb?: RequestCallback
): Promise<Session[]> => [
  ...await closedSessions(host, token, params, cb),
  ...await openSessions(host, cb)
]

/**
 * Domain matching expression.
 * See `parseHost()` for usage.
 */
const urlRegexp = /^https?:\/\/([^/]+)/
