// Copyright (C) 2022 Edge Network Technologies Limited
// Use of this source code is governed by a GNU GPL-style license
// that can be found in the LICENSE.md file. All rights reserved.

import { toQueryString } from './helpers'
import superagent, { SuperAgentRequest } from 'superagent'

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
}

/**
 * Get closed sessions from a Stargate.
 *
 * ```
 * const sessions = await closedSessions('https://stargate.edge.network')
 * ```
 */
export const closedSessions = async (
  host: string,
  params?: ClosedSessionsParams,
  cb?: RequestCallback
): Promise<ClosedSession[]> => {
  let url = `${host}/sessions/closed`
  if (params !== undefined) url += `?${toQueryString(params)}`
  const response = cb === undefined ? await superagent.get(url) : await cb(superagent.get(url))
  return response.body
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
 * Get open sessions from a Stargate.
 *
 * ```
 * const sessions = await openSessions('https://stargate.edge.network')
 * ```
 */
export const openSessions = async (host: string, cb?: RequestCallback): Promise<OpenSession[]> => {
  const url = `${host}/sessions/open`
  const response = cb === undefined ? await superagent.get(url) : await cb(superagent.get(url))
  return response.body
}

/**
 * Get both closed and open sessions from a Stargate.
 *
 * ```
 * const sessions = await sessions('https://stargate.edge.network')
 * ```
 */
export const sessions = async (
  host: string,
  params?: ClosedSessionsParams,
  cb?: RequestCallback
): Promise<Session[]> => [
  ...await closedSessions(host, params, cb),
  ...await openSessions(host, cb)
]
