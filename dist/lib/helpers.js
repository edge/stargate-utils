"use strict";
// Copyright (C) 2022 Edge Network Technologies Limited
// Use of this source code is governed by a GNU GPL-style license
// that can be found in the LICENSE.md file. All rights reserved.
exports.__esModule = true;
exports.urlsafe = exports.toQueryString = void 0;
var toQueryString = function (data) { return Object.keys(data)
    .map(function (key) { return "".concat(key, "=").concat((0, exports.urlsafe)(data[key])); })
    .join('&'); };
exports.toQueryString = toQueryString;
var urlsafe = function (v) {
    if (typeof v === 'string')
        return v.replace(/ /g, '%20');
    return "".concat(v);
};
exports.urlsafe = urlsafe;
