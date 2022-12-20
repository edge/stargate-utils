// Copyright (C) 2022 Edge Network Technologies Limited
// Use of this source code is governed by a GNU GPL-style license
// that can be found in the LICENSE.md file. All rights reserved.

import { SuperAgentRequest } from 'superagent'

export * as service from './service'
export * as session from './session'

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
export const parseHost = (h: Host): [string, string] => {
  if (typeof h === 'string') return [h, h.match(urlRegexp)?.[1] || '']
  return [`${h.protocol}://${h.address}`, h.host]
}

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

/** Transform a simple object into a query string. */
export const toQueryString = (data: Record<string, unknown>): string => Object.keys(data)
  .map(key => `${key}=${urlsafe(data[key])}`)
  .join('&')

/**
 * Domain matching expression.
 * See `parseHost()` for usage.
 */
const urlRegexp = /^https?:\/\/([^/]+)/

/** Prepare a value for safe use in a query string. */
export const urlsafe = (v: unknown): string => {
  if (typeof v === 'string') return v.replace(/ /g, '%20')
  return `${v}`
}
