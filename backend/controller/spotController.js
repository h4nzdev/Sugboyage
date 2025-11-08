// controller/SpotsController.js
import Spots from "../model/spotModel.js";

export const getSpots = async (req, res) => {
  try {
    const Spotss = await Spots.find();
    res.json(Spotss);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSpotsById = async (req, res) => {
  try {
    const spot = await Spots.findById(req.params.id);

    if (!spot) {
      return res.status(404).json({ message: "Spot not found" });
    }

    res.json(spot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addSpots = async (req, res) => {
  try {
    const newSpots = new Spots(req.body);
    await newSpots.save();
    res.status(201).json(newSpots);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
