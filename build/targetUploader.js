"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addBuffer = exports.parseDDMMSSMM = void 0;
var turf_1 = require("@turf/turf");
var csv = require("csv-parser");
var fs = __importStar(require("fs"));
var wkx = __importStar(require("wkx"));
var query_1 = __importDefault(require("./query"));
var Hemesphere;
(function (Hemesphere) {
    Hemesphere["NORTH"] = "N";
    Hemesphere["SOUTH"] = "S";
    Hemesphere["EAST"] = "E";
    Hemesphere["WEST"] = "W";
})(Hemesphere || (Hemesphere = {}));
exports.default = (function () {
    fs.createReadStream("test_targets.csv")
        .pipe(csv())
        .on("data", function (row) {
        console.log("dingo row", row);
        var polygonVertices = [];
        Object.keys(row).forEach(function (key) {
            if (key.match("^poly-") && row[key] !== "") {
                var point_1 = exports.parseDDMMSSMM(row[key]);
                polygonVertices = __spreadArray(__spreadArray([], polygonVertices), [point_1]);
            }
            else {
                console.log("no poly");
            }
        });
        var centerPoint = exports.parseDDMMSSMM(row.center_point);
        var centerPointGeo = turf_1.point(centerPoint);
        centerPointGeo = centerPointGeo.geometry;
        console.log('dingo centerPoint', centerPointGeo);
        var centerPointWKT = wkx.Geometry.parseGeoJSON(centerPointGeo);
        centerPointWKT.srid = 4326;
        var wkbCenterPoint = centerPointWKT.toWkb().toString('hex');
        console.log('dingo creating polygon', polygonVertices);
        var feature = turf_1.polygon([polygonVertices]);
        console.log(JSON.stringify(feature));
        var polyGeo = feature.geometry;
        console.log('dingo inserting this...', polyGeo);
        var wktPolygon = wkx.Geometry.parseGeoJSON(polyGeo);
        wktPolygon.srid = 4326;
        var wkbPolygon = wktPolygon.toWkb().toString('hex');
        var queryString = "INSERT INTO target_area(id, ooi_id, name, num_merged, target_geometry, center_point) VALUES('" + row.id + "', '" + row.ooi_id + "', '" + row.name + "', " + row.num_merged + ", (ST_SetSRID('" + wkbPolygon + "'::geometry, 4326)), (ST_SetSRID('" + wkbCenterPoint + "'::geometry, 4326))) ON CONFLICT DO NOTHING;";
        query_1.default(queryString, [], function (data, rows, results) {
            if (!rows || !results) {
                console.log("dingo error");
            }
            console.log("REcieved DB Results", data, rows, results);
        });
    })
        .on("end", function () { });
});
var parseDDMMSSMM = function (coordinate) {
    var coords = coordinate.split("/");
    var lat = 0;
    var lon = 0;
    if (coords.length !== 2) {
        console.error("Incorrect Data Passed Through: " + coordinate);
        return;
    }
    coords.forEach(function (c) {
        var hem = c[c.length - 1];
        switch (hem) {
            case Hemesphere.NORTH:
                var tempLat = c.slice(0, -1);
                if (tempLat.length !== 10) {
                    tempLat = exports.addBuffer(tempLat);
                }
                lat = convertToDegrees(tempLat);
                break;
            case Hemesphere.SOUTH:
                var tempNegativeLat = c.slice(0, -1);
                if (tempNegativeLat.length !== 10) {
                    tempNegativeLat = exports.addBuffer(tempNegativeLat);
                }
                lat = convertToDegrees(tempNegativeLat);
                lat = lat * -1;
                break;
            case Hemesphere.EAST:
                var tempLon = c.slice(0, -1);
                if (tempLon.length !== 10) {
                    tempLon = exports.addBuffer(tempLon);
                }
                lon = convertToDegrees(tempLon);
                break;
            case Hemesphere.WEST:
                var tempNegativeLon = c.slice(0, -1);
                console.log("dingo west", c, tempNegativeLon);
                if (tempNegativeLon.length !== 10) {
                    tempNegativeLon = exports.addBuffer(tempNegativeLon);
                }
                console.log("dingo west buffer", tempNegativeLon);
                lon = convertToDegrees(tempNegativeLon);
                lon = lon * -1;
                break;
            default:
                console.error("Incorrect Coordinate Passed Through: " + c + " - " + hem);
        }
    });
    console.log("dingo", lat, lon);
    return [lat, lon];
};
exports.parseDDMMSSMM = parseDDMMSSMM;
var addBuffer = function (coordinate) {
    var buffAmmount = 10 - coordinate.length;
    for (var i = 0; i < buffAmmount; i++) {
        coordinate = "0" + coordinate;
    }
    return coordinate;
};
exports.addBuffer = addBuffer;
var convertToDegrees = function (value) {
    var deg = +value.slice(0, 3);
    var min = +value.slice(3, 5);
    min = min / 60;
    var sec = +value.slice(5, 7);
    sec = sec / 3600;
    var mm = +value.slice(7, 10);
    mm = mm / 3600000;
    var dd = deg + min + sec + mm;
    return dd;
};
