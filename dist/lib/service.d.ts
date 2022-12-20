import { Host, RequestCallback } from '.';
/** HTTP response body for services list query. */
export declare type GetServicesResponse = {
    services: Service[];
};
/**
 * A service known to Stargate.
 */
export declare type Service = {
    name: string;
    version: string;
    integrations?: boolean;
};
/**
 * Get a single service.
 */
export declare const get: (host: Host, name: string, cb?: RequestCallback) => Promise<Service>;
/**
 * Get a list of services.
 */
export declare const list: (host: Host, cb?: RequestCallback) => Promise<GetServicesResponse>;
