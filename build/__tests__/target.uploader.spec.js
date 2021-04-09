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
var targetUploader_1 = require("../targetUploader");
var turf_1 = require("@turf/turf");
var wkx = __importStar(require("wkx"));
describe("Target Uploader", function () {
    it("should create point from DMSM/DMSM point format", function () {
        var dmsPoint = "981912283W/0382953120N";
        var ddPoint = targetUploader_1.parseDDMMSSMM(dmsPoint);
        expect(ddPoint).toBeDefined();
        var dmsPoint2 = "71320819S/111549499E";
        var ddPoint2 = targetUploader_1.parseDDMMSSMM(dmsPoint2);
        expect(ddPoint2).toBeDefined();
    });
    it('should build wkb from geojson', function () {
        //John, Virgin Islands US is 18.319410, and the longitude is -64.703247.
        var testPoint = turf_1.point([-64.703247, 18.319410]);
        expect(testPoint.type).toEqual('Feature');
        var binary = wkx.Geometry.parseGeoJSON(testPoint.geometry).toWkb;
        expect(binary).toBeDefined();
        var wkt = wkx.Geometry.parseGeoJSON(testPoint.geometry);
        wkt.srid = 26918;
        var wkb = wkt.toWkb();
        expect(wkb).toBeDefined();
    });
});
