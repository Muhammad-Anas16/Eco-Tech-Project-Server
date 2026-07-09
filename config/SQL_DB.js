import mysql from "mysql2/promise";
import "dotenv/config";
import {
  EnergylogDataTable,
  EnergylogTable,
  TrendingLogDataTable,
  TrendingLogTable,
} from "./Create_SQL_Table.js";

let database;

const SQL_DB = async () => {
  try {
    // Connect without selecting any database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    console.log("My SQL Connected 😃");

    // Create database if not exists
    await connection.execute(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``,
    );

    console.log(`Database '${process.env.DB_NAME}' is ready 😃`);

    await connection.end();

    // Connect to actual database
    database = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log("SQL Database Connected ⚡");

    // create Table

    await TrendingLogTable();
    await TrendingLogDataTable();
    await EnergylogTable();
    await EnergylogDataTable();

    // const [rows] = await database.execute("SELECT DATABASE() AS databaseName");
    // const [rows] = await database.execute("SELECT * FROM trendlog_data");

    // console.log(rows[0]);
  } catch (error) {
    console.log("Database Error ❌");
    console.log(error.message);
    throw error;
  }
};

export { database };
export default SQL_DB;
