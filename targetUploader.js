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
Object.defineProperty(exports, "__esModule", { value: true });
exports.addBuffer = exports.parseDDMMSSMM = void 0;
var turf_1 = require("@turf/turf");
var csv = require('csv-parser');
var fs = __importStar(require("fs"));
var Hemesphere;
(function (Hemesphere) {
    Hemesphere["NORTH"] = "N";
    Hemesphere["SOUTH"] = "S";
    Hemesphere["EAST"] = "E";
    Hemesphere["WEST"] = "W";
})(Hemesphere || (Hemesphere = {}));
exports.default = (function () {
    fs.createReadStream('states_target_areas')
        .pipe(csv())
        .on('data', function (row) {
        console.log('dingo row', row);
    })
        .on('end', function () {
        console.log('csv processed');
    });
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
                console.log('dingo west', c, tempNegativeLon);
                if (tempNegativeLon.length !== 10) {
                    tempNegativeLon = exports.addBuffer(tempNegativeLon);
                }
                console.log('dingo west buffer', tempNegativeLon);
                lon = convertToDegrees(tempNegativeLon);
                lon = lon * -1;
                break;
            default:
                console.error("Incorrect Coordinate Passed Through: " + c + " - " + hem);
        }
    });
    console.log("dingo", lat, lon);
    var p = turf_1.point([lon, lat]);
    //@ts-ignore
    p['crs'] = {
        type: 'name',
        properties: {
            name: 'EPSG:4326'
        }
    };
    return p;
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
