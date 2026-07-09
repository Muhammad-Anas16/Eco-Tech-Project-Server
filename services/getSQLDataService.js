import { database } from "../config/SQL_DB.js";

/* Get Trend Logs */
export const getTrendLogs = async () => {
  const [rows] = await database.execute(`
    SELECT *
    FROM trendlog
    ORDER BY id DESC
  `);

  return rows;
};

/* Get Trend Log Data */
export const getTrendLogData = async (instance) => {
  const [rows] = await database.execute(
    `
    SELECT *
    FROM trendlog_data
    WHERE instance = ?
    ORDER BY time DESC
    `,
    [instance],
  );

  return rows;
};

/* Get Energy Logs */
export const getEnergyLogs = async () => {
  const [rows] = await database.execute(`
    SELECT *
    FROM utility
    ORDER BY id DESC
  `);

  return rows;
};

/* Get Energy Log Data */
export const getEnergyLogData = async (instance, parameter) => {
  const [rows] = await database.execute(
    `
    SELECT *
    FROM utility_data
    WHERE instance = ? AND parameter = ?
    ORDER BY time DESC
    `,
    [instance, parameter],
  );

  return rows;
};
