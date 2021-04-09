import { parseDDMMSSMM } from "../targetUploader";
import { point } from "@turf/turf";
import * as wkx from 'wkx';

describe("Target Uploader", () => {
  it("should create point from DMSM/DMSM point format", () => {
    const dmsPoint = "981912283W/0382953120N";
    const ddPoint = parseDDMMSSMM(dmsPoint);
    expect(ddPoint).toBeDefined();

    const dmsPoint2 = "71320819S/111549499E";
    const ddPoint2 = parseDDMMSSMM(dmsPoint2);

    expect(ddPoint2).toBeDefined();
  });
  it('should build wkb from geojson', () => {
    //John, Virgin Islands US is 18.319410, and the longitude is -64.703247.
    const testPoint = point([-64.703247, 18.319410])
    expect(testPoint.type).toEqual('Feature');
    const binary = wkx.Geometry.parseGeoJSON(testPoint.geometry).toWkb;
    expect(binary).toBeDefined();

    const wkt = wkx.Geometry.parseGeoJSON(testPoint.geometry);
    wkt.srid = 26918;
    const wkb = wkt.toWkb();
    expect(wkb).toBeDefined();
  })
});
