// Modules
import request from "supertest";
import app from "../app";

// tests for endpoint /sciname
describe("metadata tables", () => {

    // GET requests tests
    describe('GET /', () => {

        /* needs to:
           - return a 200 status code
           - be a non-empty array
           - all elements are non empty strings */
        it("should return all scinames", async () => {
            const scinameVar = 'sciname';
            const res = await request(app).get("/sciname").send({variable: scinameVar});
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
            const scinameVar = 'common_name';
            const res = await request(app).get("/sciname").send({variable: scinameVar});
            expect(res.status).toBe(200);
            expect(res.body[scinameVar].length).toBeGreaterThan(0);
            res.body[scinameVar].forEach((element: string) => {
              expect(typeof element).toBe("string");
              expect(element.length).toBeGreaterThan(0);
            });
          });

          /* needs to:
           - return a 400 status code */ 
          it("should error when request is malformed", async() => {
            const scinameVar = 'sciname';
            const res = await request(app).get("/sciname").send({variable: 1});
            expect(res.status).toBe(400);
          })
    });
});