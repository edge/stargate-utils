import { SuperAgentRequest } from 'superagent';
/**
 * Data for a closed session.
 */
export declare type ClosedSession = Required<Omit<Session, 'lastActive'>>;
/**
 * Parameters for closed sessions API.
 *
 * The `from` and `to` parameters define a window of time within which sessions must have been active.
 * If only `from` is given, the filter matches any session that ended after then.
 * If only `to` is given, the filter matches any session that started before then.
 * If both are given, the filter matches any session that was active between the bounds of `from` and `to`.
 */
export declare type ClosedSessionsParams = {
    /** Start of filter window. */
    from?: number;
    /** End of filter window. */
    to?: number;
};
/**
 * Geolocation data.
 */
export declare type Geolocation = {
    city?: string;
    country?: string;
    countryCode?: string;
    lat?: number;
    lng?: number;
};
/**
 * Metrics recorded for Host sessions.
 */
export declare type HostMetrics = {
    cdn?: {
        requests: number;
        data: {
            in: number;
            out: number;
        };
        timing: {
            download: number;
            processing: number;
            total: number;
        };
    };
};
/**
 * Metrics recorded for sessions.
 */
export declare type Metrics = HostMetrics & {
    messages: number;
};
/**
 * Information about a node.
 */
export declare type Node = {
    /** Node type will be `host`, `gateway`, or `stargate` */
    type: string;
    /** Version of node */
    version: string;
    /** Device address */
    address: string;
    /** Session UUID */
    session: string;
    /** Stake hash */
    stake: string;
    /** Gateway address, if node is a `host` */
    gateway?: string;
    /** Stargate address, if node is a `gateway` */
    stargate?: string;
    /** Geolocation data */
    geo?: Geolocation;
};
/**
 * Data for an open session.
 */
export declare type OpenSession = Required<Omit<Session, 'end'>>;
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
export declare type RequestCallback = (r: SuperAgentRequest) => SuperAgentRequest;
/**
 * Session data.
 * This represents both open and closed sessions.
 *
 * You may use the convenience functions `isClosed` and `isOpen` to disambiguate, and optionally cast to
 * `ClosedSession` or `OpenSession` for typing purposes.
 */
export declare type Session = {
    node: Node;
    start: number;
    lastActive?: number;
    end?: number;
    metrics: Metrics;
};
/**
 * Get closed sessions from a Stargate.
 *
 * ```
 * const sessions = await closedSessions('https://stargate.edge.network')
 * ```
 */
export declare const closedSessions: (host: string, params?: ClosedSessionsParams | undefined, cb?: RequestCallback | undefined) => Promise<ClosedSession[]>;
/**
 * Determine whether a session is closed.
 */
export declare const isClosed: (session: Session) => boolean;
/**
 * Determine whether a session is open.
 */
export declare const isOpen: (session: Session) => boolean;
/**
 * Get open sessions from a Stargate.
 *
 * ```
 * const sessions = await openSessions('https://stargate.edge.network')
 * ```
 */
export declare const openSessions: (host: string, cb?: RequestCallback | undefined) => Promise<OpenSession[]>;
/**
 * Get both closed and open sessions from a Stargate.
 *
 * ```
 * const sessions = await sessions('https://stargate.edge.network')
 * ```
 */
export declare const sessions: (host: string, params?: ClosedSessionsParams | undefined, cb?: RequestCallback | undefined) => Promise<Session[]>;
