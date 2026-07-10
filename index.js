import express from "express";
import "dotenv/config";
import axios from "axios";
import crypto from "crypto";
import cors from "cors";
import ResHelper from "./helper/ResHelper.js";
import SQLite_DB from "./config/SQLite_DB.js";
import dataRoutes from "./routes/dataRoutes.js";
import trendRoutes from "./routes/trendRoutes.js";
import energyRoutes from "./routes/energyRoutes.js";
// import startSyncService from "./services/syncService.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.use("/", dataRoutes);
app.use("/api/trend", trendRoutes);
app.use("/api/energy", energyRoutes);

app.get("/", (req, res) => {
  ResHelper(res, 200, true, "Server is runing Perfectly", null);
});

const startServer = async () => {
  try {
    await SQLite_DB();
    // startSyncService();
    app.listen(5000, "0.0.0.0", () => {
      console.log("Access from network: http://192.168.1.106:5000");
    });
  } catch (error) {
    console.log("❌ Server Start Failed");
    console.log(error.message);
  }
};

startServer();
