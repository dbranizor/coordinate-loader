import { point } from "turf";

export enum Hemesphere {
  NORTH = "N",
  SOUTH = "S",
  EAST = "E",
  WEST = "W",
}

export const parseDDMMSSMM = (coordinate: string): any => {
  let coords = coordinate.split("/");
  let lat, lon;
  if (coords.length !== 2) {
    console.error(`Incorrect Data Passed Through: ${coordinate}`);
    return;
  }

  coords.forEach((c) => {
    let lat: number;
    let lon: number;
    const hem = c[c.length - 1];
    switch (hem) {
      case Hemesphere.NORTH:
        const tempLat: string = c.slice(0, -1);
        if (tempLat.length !== 10) {
          lat = addBuffer(tempLat);
        } 
        const deg = +tempLat.slice(0, 3);
        let min = +tempLat.slice(3, 5);
        min = min / 60;
        let sec = +tempLat.slice(5, 7);
        sec = sec / 3600;
        let mm = +tempLat.slice(7, 10);
        mm = mm / 3600000;
        lat = deg + min + sec + mm;
        break;
      case Hemesphere.SOUTH:
        break;
      case Hemesphere.EAST:
        break;
      case Hemesphere.WEST:
        break;
      default:
        console.error(`Incorrect Coordinate Passed Through: ${c} - ${hem}`);
    }
  });

  const latVal = +coords[0].slice(0, -1);
  const lonVal = +coords[0].slice(0, -1);
  return null;
};


export const addBuffer = (coordinate: string) => {
  const buffAmmount = 10 - coordinate.length;
  for (let i = 0; i <= buffAmmount; i++) {
    coordinate = `0${coordinate}`;
  }
  return +coordinate;
};
