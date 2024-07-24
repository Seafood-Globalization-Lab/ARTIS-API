// // Modules
// import request from "supertest";
// import app from "../app";

// // tests for endpoint /sciname
// describe("snet table", () => {

//     // GET requests tests
//     describe('GET /', () => {

//         /* needs to:
//            - return a 200 status code
//            - be a non-empty array
//            - all elements are non empty strings */

//         it("should return live weight summarized by exporter (CHN, USA, RUS) and year", async () => {

//             const outputCols: string = "exporter_iso3c,year,method";
//             const weightOutput: string = "live_weight_t";
//             const cols_wantedRegExp: string = "^exporter_iso3c$|^year$|^method$";
//             const exporters: string = "CHN,USA,RUS";
//             const exportersRegExp: string = "^CHN$|^USA$|^RUS$";
//             const methods: string = "capture";
//             const start_year = 2017;
//             const end_year = 2019;

//             const testURL = "/snet/query?cols_wanted=" + outputCols +
//                 "&weight_type=" + weightOutput +
//                 "&search_criteria=" + 1 +
//                 "&method=" + methods +
//                 "&exporter_iso3c=" + exporters +
//                 "&start_year=" + start_year +
//                 "&end_year=" + end_year;

//             const res = await request(app).get(testURL);

//             expect(res.status).toBe(200);
//             expect(res.body.length).toBeGreaterThan(0);

//             // Checking every element in the body
//             res.body.forEach((elem: any) => {

//                 // Check Return properties for each object
//                 expect(Object.keys(elem).length).toEqual(4);

//                 // Checking method
//                 expect(typeof elem["method"]).toBe("string");
//                 expect(elem["method"]).toBe(methods);
//                 // Checking min and max year
//                 expect(elem["year"]).toBeGreaterThanOrEqual(start_year);
//                 expect(elem["year"]).toBeLessThanOrEqual(end_year);
//                 // Check to include only requested exporters
//                 expect(elem["exporter_iso3c"]).toEqual(expect.stringMatching(exportersRegExp));

//             });
//         });

//         /* needs to:
//             - return a 204 status code
//             - due to non-existent sciname */

//         it("should return an empty response", async() => {
//             const outputCols: string = "exporter_iso3c,year,method";
//             const weightOutput: string = "live_weight_t";
//             const exporters: string = "CHN,USA,RUS";
//             const sciname: string = "doesntexist";
//             const start_year = 2017;
//             const end_year = 2019;

//             const testURL = "/snet/query?cols_wanted=" + outputCols +
//                 "&weight_type=" + weightOutput +
//                 "&search_criteria=" + 1 +
//                 "&sciname=" + sciname +
//                 "&exporter_iso3c=" + exporters +
//                 "&start_year=" + start_year +
//                 "&end_year=" + end_year;

//             const res = await request(app).get(testURL);

//             expect(res.status).toBe(204);
//             expect(Object.keys(res.body).length).toBe(0);
//         });

//         /* needs to:
//            - return a 400 status code */

//         it("should error when request is malformed", async() => {
//             const colsOutputs = "exporter_iso3c,year";
//             const weight_type = "live_wgt"; // Note this is the incorrect column name should be: live_weight_t
//             const start_year = 2017;
//             const end_year = 2019;

//             const testURL = "/snet/query?cols_wanted=" + colsOutputs +
//                 "&weight_type=" + weight_type +
//                 "&start_year=" + start_year +
//                 "&end_year=" + end_year;

//             const res = await request(app).get(testURL);
//             expect(res.status).toBe(400);

//         });
//     });
// });
