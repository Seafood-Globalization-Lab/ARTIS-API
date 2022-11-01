
import request from "supertest";

import app from "../app";

describe("Get /", () => {

    describe('sciname metadata', () => {
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
    });
});