import express from "express";
import {
  getSpots,
  addSpots,
  getSpotsById,
} from "../controller/spotController.js";

const spotRouter = express.Router();

spotRouter.get("/", getSpots);
spotRouter.post("/", addSpots);
spotRouter.get("/:id", getSpotsById);

export default spotRouter;
