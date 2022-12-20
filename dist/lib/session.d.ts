import { Host, RequestCallback } from '.';
/**
 * Metrics recorded for devices that serve CDN requests (specifically, Hosts).
 */
export declare type CdnMetrics = {
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
    cdn?: CdnMetrics;
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
    metrics?: Metrics;
};
/**
 * Get closed sessions from a Stargate.
 *
 * ```
 * const sessions = await closedSessions('https://stargate.edge.network', 'my-bearer-token')
 * ```
 */
export declare const closedSessions: (host: Host, token: string, params?: ClosedSessionsParams, cb?: RequestCallback) => Promise<ClosedSession[]>;
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
export declare const openSessions: (host: Host, cb?: RequestCallback) => Promise<OpenSession[]>;
/**
 * Get both closed and open sessions from a Stargate.
 *
 * ```
 * const sessions = await sessions('https://stargate.edge.network', 'my-bearer-token')
 * ```
 */
export declare const sessions: (host: Host, token: string, params?: ClosedSessionsParams, cb?: RequestCallback) => Promise<Session[]>;
