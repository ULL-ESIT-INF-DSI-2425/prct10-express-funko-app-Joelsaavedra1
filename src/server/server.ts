import { Funko } from "../types/funko.js";
import {
  addFunko,
  updateFunko,
  deleteFunko,
  listFunkos,
  showFunko,
} from "../funkoManager/funkoManager.js";
import express from "express";

const app = express();
app.disable('x-powered-by');
const port = 3000;
app.use(express.json());

app.get("/funkos", async (req, res) => {
  const userName = req.query.user as string;
  if (!req.query.ID) {
    const serverResponse = await listFunkos(userName);
    res.json(serverResponse);
  } else {
    const funkoID = Number(req.query.ID);
    const serverResponse = await showFunko(userName, funkoID);
    res.json(serverResponse);
  }
});

app.post("/funkos", async (req, res) => {
  const userName = req.query.user as string;
  const funko = req.body as Funko;
  const serverResponse = await addFunko(userName, funko);
  res.json(serverResponse);
});

app.delete("/funkos", async (req, res) => {
  const userName = req.query.user as string;
  const funkoID = Number(req.query.ID);
  const serverResponse = await deleteFunko(userName, funkoID);
  res.json(serverResponse);
});

app.patch("/funkos", async (req, res) => {
  const userName = req.query.user as string;
  const funko = req.body as Funko;
  const serverResponse = await updateFunko(userName, funko);
  res.json(serverResponse);
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

export { app };
