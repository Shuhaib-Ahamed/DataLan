import express from "express";
import routes from "./api/index.js";
import { failed } from "./utils/responseApi.js";
import expresConfig from "./middlewares/express.js";
import configueDatabase from "./config/database.js";
import dotenv from "dotenv";

// Initializes App
const app = express();

// Declare port
const port = process.env.PORT || 9000;

dotenv.config();

// Initialize Database
configueDatabase();

// Attach middleares
expresConfig(app);

/**
 * Check API health.
 */
app.get(`/`, (req, res) => {
  res.send("SERVER IS UP AND RUNNING!");
});

/**
 * SERVERS APIs
 */
routes(app);

/**
 * Catch 404 and forward to error handle.
 */
app.use((req, res, next) => {
  const err = new Error("Resource Not Found");
  console.log(err);
  err["status"] = 404;
  next(err);
});

/**
 * Global error catcher.
 */
app.use((err, req, res, next) => {
  console.log(err);
  failed(res, err.status || 500, err.message);
});

app.listen(port, (err) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log(`Server listening on port: ${port}`);
});
