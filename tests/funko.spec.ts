import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { Funko } from "../src/types/funko.js";
import { FunkoGenre } from "../src/types/funkoGenre.js";
import { FunkoType } from "../src/types/funkoType.js";
import { app } from "../src/server/server.js";
import {
  addFunko,
  updateFunko,
  deleteFunko,
  showFunko,
  listFunkos,
  __dirname,
} from "../src/funkoManager/funkoManager.js";
import request from "supertest";
import * as fs from "fs/promises";
import * as path from "path";

const userName = "test";
const userPath = path.join(__dirname, userName);

const testFunko: Funko = {
  ID: 1,
  name: "Spider-Man",
  description: "Spider-Man from Marvel Comics",
  type: FunkoType.POP,
  genre: FunkoGenre.MOVIES_TV,
  franchise: "Marvel",
  num_franchise: 234,
  exclusive: true,
  special_specs: "Glow in the Dark",
  market_value: 35,
};

const testFunko2: Funko = {
  ID: 2,
  name: "Batman",
  description: "Batman from DC Comics",
  type: FunkoType.POP,
  genre: FunkoGenre.MOVIES_TV,
  franchise: "DC Comics",
  num_franchise: 456,
  exclusive: true,
  special_specs: "Metallic",
  market_value: 40,
};

beforeEach(async () => {
  await fs.rm(userPath, { recursive: true, force: true });
});

afterEach(async () => {
  await fs.rm(userPath, { recursive: true, force: true });
});

describe("FunkoManager", () => {
  test("Should add a Funko", async () => {
    const response = await addFunko(userName, testFunko);
    expect(response.success).toBe(true);
    expect(response.message).toBe("Funko added");
  });

  test("Should not add a Funko with an existing ID", async () => {
    await addFunko(userName, testFunko);
    const response = await addFunko(userName, testFunko);
    expect(response.success).toBe(false);
    expect(response.message).toBe(
      `Funko with ID ${testFunko.ID} already exists`,
    );
  });

  test("Should return an error when adding a Funko with an invalid ID", async () => {
    const invalidFunko = { ...testFunko, ID: -1 };
    const response = await addFunko(userName, invalidFunko);
    expect(response.success).toBe(false);
    expect(response.message).toBe("Funko ID is not valid");
  });

  test("Should update a Funko", async () => {
    await addFunko(userName, testFunko);
    const updatedFunko = { ...testFunko, name: "Venom" };
    const response = await updateFunko(userName, updatedFunko);
    expect(response.success).toBe(true);
    expect(response.message).toBe("Funko updated");
  });

  test("Should return an error when updating a non-existent Funko", async () => {
    const response = await updateFunko(userName, testFunko);
    expect(response.success).toBe(false);
    expect(response.message).toBe("Funko not found");
  });

  test("Should delete a Funko", async () => {
    await addFunko(userName, testFunko);
    const response = await deleteFunko(userName, testFunko.ID);
    expect(response.success).toBe(true);
    expect(response.message).toBe("Funko deleted");
  });

  test("Should return an error when deleting non-existent Funko", async () => {
    const response = await deleteFunko(userName, 1);
    expect(response.success).toBe(false);
    expect(response.message).toBe("Funko not found");
  });

  test("Should list all the user's Funkos", async () => {
    await addFunko(userName, testFunko);
    await addFunko(userName, testFunko2);
    const response = await listFunkos(userName);
    expect(response.success).toBe(true);
    expect(response.message).toBe("Funkos found");
    expect(response.funkos?.length).toBe(2);
  });

  test("Should return an error when listing Funkos for a non-existent user", async () => {
    const response = await listFunkos("non_existent_user");
    expect(response.success).toBe(false);
    expect(response.message).toBe("User directory not found");
  });

  test("Should show a Funko given its ID", async () => {
    await addFunko(userName, testFunko);
    const response = await showFunko(userName, testFunko.ID);
    expect(response.success).toBe(true);
    expect(response.message).toBe("Funko found");
    expect(response.funko?.name).toBe(testFunko.name);
  });

  test("Should return an error when showing a non-existent Funko", async () => {
    const response = await showFunko(userName, 1);
    expect(response.success).toBe(false);
    expect(response.message).toBe("Funko not found");
  });
});

describe("Server", () => {
  test("Should get a Funko using GET with ID", async () => {
    await request(app).post("/funkos?user=test").send(testFunko);
    const serverResponse = await request(app).get("/funkos?user=test&ID=1");
    expect(serverResponse.body.success).toBe(true);
    expect(serverResponse.body.message).toBe("Funko found");
    expect(serverResponse.body.funko.name).toBe("Spider-Man");
  });

  test("Should return an error when getting non-existent Funko using Get", async () => {
    const serverResponse = await request(app).get("/funkos?user=test&ID=1");
    expect(serverResponse.body.success).toBe(false);
    expect(serverResponse.body.message).toBe("Funko not found");
  });

  test("Should list all Funkos using GET without ID", async () => {
    await request(app).post("/funkos?user=test").send(testFunko);
    await request(app).post("/funkos?user=test").send(testFunko2);
    const serverResponse = await request(app).get("/funkos?user=test");
    expect(serverResponse.body.success).toBe(true);
    expect(serverResponse.body.message).toBe("Funkos found");
    expect(serverResponse.body.funkos.length).toBe(2);
  });
  test("Should return an error when listing Funkos for a non-existent user using GET", async () => {
    const serverResponse = await request(app).get(
      "/funkos?user=non_existent_user",
    );
    expect(serverResponse.body.success).toBe(false);
    expect(serverResponse.body.message).toBe("User directory not found");
  });

  test("Should add a Funko using POST", async () => {
    const serverResponse = await request(app)
      .post("/funkos?user=test")
      .send(testFunko);
    expect(serverResponse.body.success).toBe(true);
    expect(serverResponse.body.message).toBe("Funko added");
  });

  test("Should return an error when adding a Funko with an existing ID using POST", async () => {
    await request(app).post("/funkos?user=test").send(testFunko);
    const serverResponse = await request(app)
      .post("/funkos?user=test")
      .send(testFunko);
    expect(serverResponse.body.success).toBe(false);
    expect(serverResponse.body.message).toBe(
      `Funko with ID ${testFunko.ID} already exists`,
    );
  });

  test("Should delete a Funko using DELETE", async () => {
    await request(app).post("/funkos?user=test").send(testFunko);
    const serverResponse = await request(app)
      .delete("/funkos?user=test&ID=1")
      .send();
    expect(serverResponse.body.success).toBe(true);
    expect(serverResponse.body.message).toBe("Funko deleted");
  });

  test("Should return an error when deleting a non-existent Funko using DELETE", async () => {
    const serverResponse = await request(app)
      .delete("/funkos?user=test&ID=1")
      .send();
    expect(serverResponse.body.success).toBe(false);
    expect(serverResponse.body.message).toBe("Funko not found");
  });

  test("Should update a Funko using PATCH", async () => {
    await request(app).post("/funkos?user=test").send(testFunko);
    const updatedFunko = { ...testFunko, name: "Venom" };
    const serverResponse = await request(app)
      .patch("/funkos?user=test")
      .send(updatedFunko);
    expect(serverResponse.body.success).toBe(true);
    expect(serverResponse.body.message).toBe("Funko updated");
  });

  test("Should return an error when updating a non-existent Funko using PATCH", async () => {
    const serverResponse = await request(app)
      .patch("/funkos?user=test")
      .send(testFunko);
    expect(serverResponse.body.success).toBe(false);
    expect(serverResponse.body.message).toBe("Funko not found");
  });
});
