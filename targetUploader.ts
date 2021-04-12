import { point, featureCollection, polygon } from "@turf/turf";
const csv = require("csv-parser");
import * as fs from "fs";
import * as wkx from "wkx";
import query from "./query";

enum Hemesphere {
  NORTH = "N",
  SOUTH = "S",
  EAST = "E",
  WEST = "W",
}

export default () => {
  fs.createReadStream("test_targets.csv")
    .pipe(csv())
    .on("data", (row: any) => {
      console.log("dingo row", row);
      let polygonVertices: any[] = [];
      Object.keys(row).forEach((key) => {
        if (key.match("^poly-") && row[key] !== "") {
          const point = parseDDMMSSMM(row[key]);
          polygonVertices = [...polygonVertices, point];
        } else {
          console.log("no poly");
        }
      });

      
      
      const centerPoint = parseDDMMSSMM(row.center_point);
     
      let centerPointGeo:any = point(centerPoint);
      centerPointGeo = centerPointGeo.geometry;
      
      console.log('dingo centerPoint', centerPointGeo);
      const centerPointWKT = wkx.Geometry.parseGeoJSON(centerPointGeo);
      centerPointWKT.srid = 4326;
      const wkbCenterPoint = centerPointWKT.toWkb().toString('hex');

      console.log('dingo creating polygon', polygonVertices);
      let feature:any = polygon([polygonVertices]);
      console.log(JSON.stringify(feature));
      const polyGeo = feature.geometry;
      console.log('dingo inserting this...',polyGeo)
      const wktPolygon = wkx.Geometry.parseGeoJSON(polyGeo);
      wktPolygon.srid = 4326;
      const wkbPolygon = wktPolygon.toWkb().toString('hex');

      const queryString = `INSERT INTO target_area(id, ooi_id, name, num_merged, target_geometry, center_point) VALUES('${row.id}', '${row.ooi_id}', '${row.name}', ${row.num_merged}, (ST_SetSRID('${wkbPolygon}'::geometry, 4326)), (ST_SetSRID('${wkbCenterPoint}'::geometry, 4326))) ON CONFLICT DO NOTHING;`;
      query(queryString, [], (data: any, rows: any, results: any) => {
        if (!rows || !results) {
          console.log("dingo error");
        }
        console.log("REcieved DB Results", data, rows, results);
      });
    })
    .on("end", () => {});
};
export const parseDDMMSSMM = (coordinate: string): any => {
  let coords = coordinate.split("/");
  let lat: number = 0;
  let lon: number = 0;
  if (coords.length !== 2) {
    console.error(`Incorrect Data Passed Through: ${coordinate}`);
    return;
  }

  coords.forEach((c) => {
    const hem = c[c.length - 1];
    switch (hem) {
      case Hemesphere.NORTH:
        let tempLat: string = c.slice(0, -1);
        if (tempLat.length !== 10) {
          tempLat = addBuffer(tempLat);
        }
        lat = convertToDegrees(tempLat);
        break;
      case Hemesphere.SOUTH:
        let tempNegativeLat: string = c.slice(0, -1);
        if (tempNegativeLat.length !== 10) {
          tempNegativeLat = addBuffer(tempNegativeLat);
        }
        lat = convertToDegrees(tempNegativeLat);
        lat = lat * -1;
        break;
      case Hemesphere.EAST:
        let tempLon: string = c.slice(0, -1);
        if (tempLon.length !== 10) {
          tempLon = addBuffer(tempLon);
        }
        lon = convertToDegrees(tempLon);
        break;
      case Hemesphere.WEST:
        let tempNegativeLon: string = c.slice(0, -1);
        console.log("dingo west", c, tempNegativeLon);
        if (tempNegativeLon.length !== 10) {
          tempNegativeLon = addBuffer(tempNegativeLon);
        }
        console.log("dingo west buffer", tempNegativeLon);
        lon = convertToDegrees(tempNegativeLon);
        lon = lon * -1;
        break;
      default:
        console.error(`Incorrect Coordinate Passed Through: ${c} - ${hem}`);
    }
  });
  console.log("dingo", lat, lon);


  return [lon, lat];
};

export const addBuffer = (coordinate: string): string => {
  const buffAmmount = 10 - coordinate.length;
  for (let i = 0; i < buffAmmount; i++) {
    coordinate = `0${coordinate}`;
  }
  return coordinate;
};

const convertToDegrees = (value: string): number => {
  const deg = +value.slice(0, 3);
  let min = +value.slice(3, 5);
  min = min / 60;
  let sec = +value.slice(5, 7);
  sec = sec / 3600;
  let mm = +value.slice(7, 10);
  mm = mm / 3600000;
  const dd = deg + min + sec + mm;
  return dd;
};
