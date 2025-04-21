import express from "express";
import { readNote } from "../functions/functions.js";

const app = express();

app.get("/notes", (req, res) => {
  if (!req.query.title) {
    res.send({
      error: "A title has to be provided",
    });
  } else {
    readNote(req.query.title as string)
      .then((data) => {
        if (!data.success) {
          res.send({
            error: `No note was found`,
          });
        } else {
          res.send({
            notes: data.notes,
          });
        }
      })
      .catch((err) => {
        res.send({
          error: err,
        });
      });
  }
});

app.listen(3000, () => {
  console.log("Server is up on port 3000");
});

export { app };
