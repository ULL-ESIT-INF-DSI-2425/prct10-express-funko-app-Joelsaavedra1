import * as fs from "fs/promises";
import { Note, ResponseType } from "../types/types.js";

export const readNote = (title: string): Promise<ResponseType> => {
  return new Promise<ResponseType>((resolve, reject) => {
    loadNotes()
      .then((data) => {
        const notes: Note[] = JSON.parse(data);
        const foundNote = notes.find((note) => note.title === title);
        resolve({
          type: "read",
          success: foundNote ? true : false,
          notes: foundNote ? [foundNote] : undefined,
        } as ResponseType);
      })
      .catch((err) => {
        reject(new Error(`Error reading note: ${err.message}`));
      });
  });
};

export const loadNotes = (): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    fs.readFile("notes.json")
      .then((data) => resolve(data.toString()))
      .catch((err) =>
        reject(new Error(`Error reading notes file: ${err.message}`)),
      );
  });
};
