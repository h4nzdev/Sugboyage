import mongoose from "mongoose";

const spotSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  type: { type: String, required: true },
  category: { type: String, required: true },
  rating: { type: String },
  reviews: { type: Number },
  price: { type: String },
  distance: { type: String },
  featured: { type: Boolean },
  geofence: { type: Boolean },
  color: { type: String },
  days: { type: String },
  description: { type: String },
  image: { type: String },
  image_url: { type: String },
  activities: [String],
  source: { type: String },
  scraped_at: { type: Date },
  ml_validated: { type: Boolean },
});

const Spots = mongoose.model("spots", spotSchema);

export default Spots;
