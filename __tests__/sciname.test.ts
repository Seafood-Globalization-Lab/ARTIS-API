
import request from "supertest";

import app from "../app";

describe("sciname metadata", () => {

    describe('GET /', () => {
        it("should return all scinames", async () => {
            const scinameVar = 'common_name';
            const res = await request(app).get("/sciname").send({variable: scinameVar});
            expect(res.status).toBe(200);
            expect(res.body[scinameVar].length).toBeGreaterThan(0);
          });
        
          it("should return all common_names", async () => {
            const scinameVar = 'common_name';
            const res = await request(app).get("/sciname").send({variable: scinameVar});
            expect(res.status).toBe(200);
            expect(res.body[scinameVar].length).toBeGreaterThan(0);
          });

          it("should error when request is malformed", async() => {
            const scinameVar = 'sciname';
            const res = await request(app).get("/sciname").send({variable: 1});
            expect(res.status).toBe(400);
          })
    });
});