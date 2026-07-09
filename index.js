import express from "express";
import "dotenv/config";
import axios from "axios";
import crypto from "crypto";
import cors from "cors";
import ResHelper from "./helper/ResHelper.js";
import dataRoutes from "./routes/dataRoutes.js";
import SQL_DB from "./config/SQL_DB.js";
import dropTables from "./config/dropTables.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.use("/", dataRoutes);

app.get("/", (req, res) => {
  ResHelper(res, 200, true, "Server is runing Perfectly", null);
});

const startServer = async () => {
  try {
    await SQL_DB();
    // await dropTables(); // for deleting all the tables
    app.listen(PORT, () => {
      console.log(`🚀 Server Running : http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("❌ Server Start Failed");
    console.log(error.message);
  }
};

startServer();
