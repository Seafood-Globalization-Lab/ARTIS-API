// Modules
import request from "supertest";
import app from "../app";


// tests for endpoint /sciname
describe("supplemental tables", () => {

    // GET requests tests
    describe('GET /', () => {

        /* needs to:
           - return a 200 status code
           - be a non-empty array
           - all elements are non empty strings */
        it("should return all scinames", async () => {
            const tblNameVar = 'sciname';
            const scinameVar = 'sciname';
            const testURL = "/supplemental" + "?table=" + tblNameVar + "&variable=" + scinameVar;
            const res = await request(app).get(testURL);
            expect(res.status).toBe(200);
            expect(res.body[scinameVar].length).toBeGreaterThan(0);
            res.body[scinameVar].forEach((element: string) => {
              expect(typeof element).toBe("string");
              expect(element.length).toBeGreaterThan(0);
            });
          });
          
          /* needs to:
           - return a 200 status code
           - be a non-empty array */
          
          it("should return all common_names", async () => {
            const tblNameVar = 'sciname';
            const scinameVar = 'common_name';
            const testURL = "/supplemental?table=" + tblNameVar + "&variable=" + scinameVar;
            const res = await request(app).get(testURL);
            expect(res.status).toBe(200);
            expect(res.body[scinameVar].length).toBeGreaterThan(0);
            res.body[scinameVar].forEach((element: string) => {
              expect(typeof element).toBe("string");
              expect(element.length).toBeGreaterThan(0);
            });
          });
          

          /* needs to:
          - return a 200 status code
          - return a filtered query for sciname table
          - example: all thunnus in
          */
         
         it("should return filtered query", async () => {
          const tableVar: string = "sciname";
          const outputCols: string = "sciname,common_name,isscaap,genus";
          const testURL: string = "/supplemental/query?table=" + tableVar + "&cols_wanted=" + outputCols + "&search_criteria=1" + "&genus=thunnus";

          const res = await request(app).get(testURL);

          expect(res.status).toBe(200);
          expect(res.body.length).toBeGreaterThan(0);

          res.body.forEach((elem: any) => {

            // Check element structure
            expect(Object.keys(elem).length).toEqual(4);

            // Check that responses agree with search criteria
            expect(elem["genus"]).toBe("thunnus");
          });
         });

         /* needs to:
         - return a 204 status code
         - return an empty body back */
         it("should return an empty response", async() => {
          const tableVar: string = "sciname";
          const outputCols: string = "sciname,common_name";
          const testURL: string = "/supplemental/query?table=" + tableVar + "&cols_wanted=" + outputCols + "&search_criteria=1" + "&sciname=doesntexist";

          const res = await request(app).get(testURL);

          expect(res.status).toBe(204);
          expect(Object.keys(res.body).length).toBe(0);
         });

          /* needs to:
           - return a 400 status code */ 
          
          it("should error when request is malformed", async() => {
            const testURL: string = "/supplemental?variable=1";
            const res = await request(app).get("/supplemental");
            expect(res.status).toBe(400);
          });

    });
});
