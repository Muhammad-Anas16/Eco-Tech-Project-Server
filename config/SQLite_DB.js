import sqlite3 from "sqlite3";
import { open } from "sqlite";
import "dotenv/config";
import {
  TrendingLogTable,
  TrendingLogDataTable,
  EnergylogTable,
  EnergylogDataTable,
} from "./SQLite_Table.js";

let database;

const SQLite_DB = async () => {
  try {
    database = await open({
      filename: "./eco-tech.db",
      driver: sqlite3.Database,
    });

    await database.exec("PRAGMA foreign_keys = ON;");

    console.log("SQLite Database Connected 😃");

    await TrendingLogTable();
    await TrendingLogDataTable();
    await EnergylogTable();
    await EnergylogDataTable();

    console.log("All SQLite tables are ready ⚡");
  } catch (error) {
    console.log("SQLite Database Error ❌");
    console.log(error.message);
    throw error;
  }
};

export { database };
export default SQLite_DB;
