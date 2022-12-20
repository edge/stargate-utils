"use strict";
// Copyright (C) 2022 Edge Network Technologies Limited
// Use of this source code is governed by a GNU GPL-style license
// that can be found in the LICENSE.md file. All rights reserved.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
exports.__esModule = true;
exports.urlsafe = exports.toQueryString = exports.parseHost = exports.session = exports.service = void 0;
exports.service = __importStar(require("./service"));
exports.session = __importStar(require("./session"));
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
var parseHost = function (h) {
    var _a;
    if (typeof h === 'string')
        return [h, ((_a = h.match(urlRegexp)) === null || _a === void 0 ? void 0 : _a[1]) || ''];
    return ["".concat(h.protocol, "://").concat(h.address), h.host];
};
exports.parseHost = parseHost;
/** Transform a simple object into a query string. */
var toQueryString = function (data) { return Object.keys(data)
    .map(function (key) { return "".concat(key, "=").concat((0, exports.urlsafe)(data[key])); })
    .join('&'); };
exports.toQueryString = toQueryString;
/**
 * Domain matching expression.
 * See `parseHost()` for usage.
 */
var urlRegexp = /^https?:\/\/([^/]+)/;
/** Prepare a value for safe use in a query string. */
var urlsafe = function (v) {
    if (typeof v === 'string')
        return v.replace(/ /g, '%20');
    return "".concat(v);
};
exports.urlsafe = urlsafe;
