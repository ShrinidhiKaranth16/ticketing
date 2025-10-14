import request from "supertest";
import { app } from "../../app";

it("clears the session cookie on signout", async () => {
    const signupResponse = await request(app)
      .post("/api/users/signup")
      .send({ email: "test@test.com", password: "password" })
      .expect(201);
  
    const signoutResponse = await request(app)
      .post("/api/users/signout")
      .send({})
      .expect(200);
  
    const cookie = signoutResponse.get("Set-Cookie");
  
    expect(cookie).toBeDefined();
    expect(cookie![0]).toMatch(/^session=;/); 
    expect(cookie![0]).toMatch(/Expires=Thu, 01 Jan 1970/i); 
  });
  
