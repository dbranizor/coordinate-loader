"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pg_1 = require("pg");
exports.default = (function (query, values, cb) {
    var pool = new pg_1.Pool();
    pool.connect(function (err, client, release) {
        if (err) {
            return cb(err);
        }
        client.query(query, values, function (err, results) {
            release();
            if (err) {
                return cb(err);
            }
            return cb(null, results.rows, results);
        });
    });
});
