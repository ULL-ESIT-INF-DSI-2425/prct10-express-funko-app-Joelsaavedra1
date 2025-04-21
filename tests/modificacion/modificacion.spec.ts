import { describe, test, expect } from "vitest";
import request from "supertest";
import { app } from "../../src/modificacion/server/server.js";
import {
  readNote,
  loadNotes,
} from "../../src/modificacion/functions/functions.js";

describe("LoadNotes", () => {
  test("Should load notes successfully using then and catch", () => {
    return loadNotes().then((data) => {
      expect(data).toBe(
        '[{"title":"Blue note","body":"This is a blue note","color":"blue"},{"title":"Green note","body":"This is a green note","color":"green"},{"title":"Yellow note","body":"This is a yellow note","color":"yellow"},{"title":"Red note","body":"This is a red note","color":"red"},{"title":"Magenta note","body":"This is a magenta note","color":"magenta"}]',
      );
    });
  });
});

describe("ReadNote", () => {
  test("Should read note successfully using then and catch", () => {
    return readNote("Blue note").then((data) => {
      expect(data).toEqual({
        type: "read",
        success: true,
        notes: [
          {
            title: "Blue note",
            body: "This is a blue note",
            color: "blue",
          },
        ],
      });
    });
  });
  test("Should not find the note and return success as false", () => {
    return readNote("Nonexistent note").then((data) => {
      expect(data).toEqual({
        type: "read",
        success: false,
        notes: undefined,
      });
    });
  });
});

describe("Server", () => {
  test("Should return note using GET", async () => {
    const response = await request(app).get("/notes?title=Blue%20note");
    expect(response.body.notes[0].color).toBe("blue");
    expect(response.body.notes[0].title).toBe("Blue note");
  });

  test("Should return error if no title is provided", async () => {
    const response = await request(app).get("/notes");
    expect(response.body.error).toBe("A title has to be provided");
  });

  test("Should return error if note is not found", async () => {
    const response = await request(app).get("/notes?title=Nonexistent%20note");
    expect(response.body.error).toBe("No note was found");
  });
});
