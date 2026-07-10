// import { database } from "../config/SQLite_DB.js";

// //  Save Trend Logs
// export const saveTrendLogs = async (trendlogs) => {
//   for (const item of trendlogs) {
//     await database.run(
//       `
//       INSERT OR IGNORE INTO trendlog
//       (host, instance, description, loggedHost, loggedInstance)
//       VALUES (?, ?, ?, ?, ?)
//       `,
//       [
//         item.host,
//         item.instance,
//         item.description,
//         item.loggedHost,
//         item.loggedInstance,
//       ],
//     );
//   }
// };
// //  Save Trend History
// export const saveTrendLogData = async (host, instance, records) => {
//   const trendlog = await database.get(
//     `
//     SELECT id
//     FROM trendlog
//     WHERE host = ? AND instance = ?
//     `,
//     [host, instance],
//   );

//   if (!trendlog) return;

//   for (const item of records) {
//     await database.run(
//       `
//       INSERT OR IGNORE INTO trendlog_data
//       (trendlog_id, time, value)
//       VALUES (?, ?, ?)
//       `,
//       [trendlog.id, item.time, item.value],
//     );
//   }
// };

// //  Save Energy Logs
// export const saveEnergyLogs = async (energylogs) => {
//   for (const item of energylogs) {
//     await database.run(
//       `
//       INSERT OR IGNORE INTO utility
//       (name, description, host, instance, utilityType, parameter)
//       VALUES (?, ?, ?, ?, ?, ?)
//       `,
//       [
//         item.name,
//         item.description,
//         item.host,
//         item.instance,
//         item.utilityType,
//         item.parameter,
//       ],
//     );
//   }
// };

// //  Save Ener
// export const saveEnergyLogData = async (host, instance, parameter, records) => {
//   const utility = await database.get(
//     `
//     SELECT id
//     FROM utility
//     WHERE host = ?
//       AND instance = ?
//       AND parameter = ?
//     `,
//     [host, instance, parameter],
//   );

//   if (!utility) return;

//   for (const item of records) {
//     await database.run(
//       `
//       INSERT OR IGNORE INTO utility_data
//       (utility_id, time, value, unit)
//       VALUES (?, ?, ?, ?)
//       `,
//       [utility.id, item.time, item.value, item.unit],
//     );
//   }
// };

import { database } from "../config/SQLite_DB.js";

// ==============================
// Save Trend Logs
// ==============================
export const saveTrendLogs = async (trendlogs = []) => {
  await database.exec("BEGIN");

  try {
    const stmt = await database.prepare(`
      INSERT OR IGNORE INTO trendlog
      (host, instance, description, loggedHost, loggedInstance)
      VALUES (?, ?, ?, ?, ?)
    `);

    for (const item of trendlogs) {
      await stmt.run(
        item.host,
        item.instance,
        item.description,
        item.loggedHost,
        item.loggedInstance,
      );
    }

    await stmt.finalize();
    await database.exec("COMMIT");
  } catch (err) {
    await database.exec("ROLLBACK");
    throw err;
  }
};

// ==============================
// Save Trend History
// ==============================
export const saveTrendLogData = async (host, instance, records = []) => {
  const trendlog = await database.get(
    `
    SELECT id
    FROM trendlog
    WHERE host = ? AND instance = ?
    `,
    [host, instance],
  );

  if (!trendlog) return;

  await database.exec("BEGIN");

  try {
    const stmt = await database.prepare(`
      INSERT OR IGNORE INTO trendlog_data
      (trendlog_id, time, value)
      VALUES (?, ?, ?)
    `);

    for (const item of records) {
      await stmt.run(trendlog.id, item.time, item.value);
    }

    await stmt.finalize();
    await database.exec("COMMIT");
  } catch (err) {
    await database.exec("ROLLBACK");
    throw err;
  }
};

// ==============================
// Save Energy Logs
// ==============================
export const saveEnergyLogs = async (energylogs = []) => {
  await database.exec("BEGIN");

  try {
    const stmt = await database.prepare(`
      INSERT OR IGNORE INTO utility
      (name, description, host, instance, utilityType, parameter)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    for (const item of energylogs) {
      await stmt.run(
        item.name,
        item.description,
        item.host,
        item.instance,
        item.utilityType,
        item.parameter,
      );
    }

    await stmt.finalize();
    await database.exec("COMMIT");
  } catch (err) {
    await database.exec("ROLLBACK");
    throw err;
  }
};

// ==============================
// Save Energy History
// ==============================
export const saveEnergyLogData = async (
  host,
  instance,
  parameter,
  records = [],
) => {
  const utility = await database.get(
    `
    SELECT id
    FROM utility
    WHERE host = ?
      AND instance = ?
      AND parameter = ?
    `,
    [host, instance, parameter],
  );

  if (!utility) return;

  await database.exec("BEGIN");

  try {
    const stmt = await database.prepare(`
      INSERT OR IGNORE INTO utility_data
      (utility_id, time, value, unit)
      VALUES (?, ?, ?, ?)
    `);

    for (const item of records) {
      await stmt.run(utility.id, item.time, item.value, item.unit);
    }

    await stmt.finalize();
    await database.exec("COMMIT");
  } catch (err) {
    await database.exec("ROLLBACK");
    throw err;
  }
};
