"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var targetUploader_1 = require("../targetUploader");
describe("Target Uploader", function () {
    it("should create point from DMSM/DMSM point format", function () {
        var dmsPoint = "981912283W/0382953120N";
        var ddPoint = targetUploader_1.parseDDMMSSMM(dmsPoint);
        expect(ddPoint).toBeDefined();
        var dmsPoint2 = "71320819S/111549499E";
        var ddPoint2 = targetUploader_1.parseDDMMSSMM(dmsPoint2);
        console.log('dingo ddpoint2', ddPoint2);
        expect(ddPoint2).toBeDefined();
    });
});
