import { GeoJSONObject } from "@turf/turf";
import { addBuffer } from "./targetUploader";

export default (geojson: GeoJSONObject): string[] => {
  let list: [] = [];
  if (geojson.type === "Polygon") {
    //@ts-ignore
    list = geojson["coordinates"][0].map((coord) => {
      let xDms: number = coord[0];

      let coordinateX = buildDms(xDms);
      coordinateX = addCoordinateString(xDms, coordinateX, "x");

      let yDms: number = coord[1];
      let coordinateY = buildDms(yDms);
      coordinateY = addCoordinateString(yDms, coordinateY, "y");
      return `${coordinateX}/${coordinateY}`;
    });
  }
  return list;
};

export const buildDms = (coord: number) => {
  let val;
  if (coord * -1 > 0) {
    val = coord * -1;
  } else {
    val = coord;
  }
  let buffAmmount = addBuffer(val.toString());
  const decimal = parseFloat(buffAmmount).toFixed(0);
  let minutes = (parseFloat(buffAmmount) % 1)* 60;
  let seconds = (minutes % 1) * 60;
  let milliseconds = (seconds % 1).toFixed(3).toString().slice(2, 5);
  console.log('dingo decimal', decimal)
  console.log('dingo minutes', minutes)
  console.log('dingo seconds', seconds)

  let finalMinutes = minutes.toFixed(0).toString().length < 2 ? `0${minutes.toFixed(0).toString()}` : minutes.toFixed(0).toString();
  let finalSeconds = seconds.toFixed(0).toString().length < 2 ? `0${seconds.toFixed(0).toString()}` : seconds.toFixed(0).toString();
  let coordinate = `${decimal}${finalMinutes.toString()}${finalSeconds.toString()}${milliseconds.toString()}`;
  return coordinate;
};

export const addCoordinateString = (
  deg: number,
  coord: string,
  type: string
) => {
  let newCoord: string = "";
  switch (type) {
    case "x":
      if (deg < 0) {
        newCoord = `${coord}W`;
      } else {
        newCoord = `${coord}E`;
      }
      break;
    case "y":
      {
        if (deg < 0) {
          newCoord = `${coord}S`;
        } else {
          newCoord = `${coord}N`;
        }
        break;
      }

      
  }
  return newCoord;
};
