// import { database } from "../config/SQLite_DB.js";

// /* Get Trend Logs */
// export const getTrendLogs = async () => {
//   const [rows] = await database.execute(`
//     SELECT *
//     FROM trendlog
//     ORDER BY id DESC
//   `);

//   return rows;
// };

// /* Get Trend Log Data */
// export const getTrendLogData = async (instance) => {
//   const [rows] = await database.execute(
//     `
//     SELECT *
//     FROM trendlog_data
//     WHERE instance = ?
//     ORDER BY time DESC
//     `,
//     [instance],
//   );

//   return rows;
// };

// /* Get Energy Logs */
// export const getEnergyLogs = async () => {
//   const [rows] = await database.execute(`
//     SELECT *
//     FROM utility
//     ORDER BY id DESC
//   `);

//   return rows;
// };

// /* Get Energy Log Data */
// export const getEnergyLogData = async (instance, parameter) => {
//   const [rows] = await database.execute(
//     `
//     SELECT *
//     FROM utility_data
//     WHERE instance = ? AND parameter = ?
//     ORDER BY time DESC
//     `,
//     [instance, parameter],
//   );

//   return rows;
// };

import { database } from "../config/SQLite_DB.js";

//  Get Trend Logs
export const getTrendLogs = async () => {
  const rows = await database.all(`
    SELECT *
    FROM trendlog
    ORDER BY id DESC
  `);

  return rows;
};

//  Get Trend Log Data
export const getTrendLogData = async (instance) => {
  const rows = await database.all(
    `
    SELECT
      td.id,
      t.host,
      t.instance,
      t.description,
      t.loggedHost,
      t.loggedInstance,
      td.time,
      td.value,
      td.created_at
    FROM trendlog_data td
    INNER JOIN trendlog t
      ON td.trendlog_id = t.id
    WHERE t.instance = ?
    ORDER BY td.time DESC
    `,
    [instance],
  );

  return rows;
};

//  Get Energy Logs
export const getEnergyLogs = async () => {
  const rows = await database.all(`
    SELECT *
    FROM utility
    ORDER BY id DESC
  `);

  return rows;
};

//  Get Energy Log Data
export const getEnergyLogData = async (instance, parameter) => {
  const rows = await database.all(
    `
    SELECT
      ud.id,
      u.name,
      u.description,
      u.host,
      u.instance,
      u.utilityType,
      u.parameter,
      ud.time,
      ud.value,
      ud.unit,
      ud.created_at
    FROM utility_data ud
    INNER JOIN utility u
      ON ud.utility_id = u.id
    WHERE u.instance = ?
      AND u.parameter = ?
    ORDER BY ud.time DESC
    `,
    [instance, parameter],
  );

  return rows;
};
