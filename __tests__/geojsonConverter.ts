import GeojsonConverter from "../geojsonConverter";
describe("geojsonConverter", () => {
  it("should take a geojson polygon and create an array of analyst dms coordinates", () => {
    const newMexico = {
        type: "Polygon",
        coordinates: [
          [
            [-109.0283203125, 37.00255267215955],
            [-109.05029296875, 31.27855085894653],
            [-108.08349609375, 31.3348710339506],
            [-108.17138671875, 31.82156451492074],
            [-102.98583984374999, 32.045332838858506],
            [-103.0517578125, 36.96744946416934],
            [-109.0283203125, 37.00255267215955],
          ],
        ],
    };

    const analystCoordinates = GeojsonConverter(newMexico);
    console.log(JSON.stringify(analystCoordinates))
    expect(analystCoordinates).toBeDefined();
  });
});
