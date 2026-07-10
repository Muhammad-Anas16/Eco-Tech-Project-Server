// // import { database } from "../config/SQL_DB.js";

// // /* Trend Logs */
// // export const saveTrendLogs = async (trendlogs) => {
// //   for (const item of trendlogs) {
// //     await database.execute(
// //       `
// //       INSERT IGNORE INTO trendlog
// //       (host,instance,description,loggedHost,loggedInstance)

// //       VALUES (?,?,?,?,?)
// //       `,

// //       [
// //         item.host,
// //         item.instance,
// //         item.description,
// //         item.loggedHost,
// //         item.loggedInstance,
// //       ],
// //     );
// //   }
// // };

// // /* Trend History */

// // export const saveTrendLogData = async (host, instance, records) => {
// //   for (const item of records) {
// //     await database.execute(
// //       `
// //       INSERT INTO trendlog_data
// //       (host,instance,time,value)

// //       VALUES (?,?,?,?)
// //       `,

// //       [host, instance, item.time, item.value],
// //     );
// //   }
// // };

// // /* Energy Logs */

// // export const saveEnergyLogs = async (energylogs) => {
// //   for (const item of energylogs) {
// //     await database.execute(
// //       `
// //       INSERT IGNORE INTO utility
// //       (name,description,host,instance,utilityType,parameter)

// //       VALUES (?,?,?,?,?,?)
// //       `,

// //       [
// //         item.name,
// //         item.description,
// //         item.host,
// //         item.instance,
// //         item.utilityType,
// //         item.parameter,
// //       ],
// //     );
// //   }
// // };

// // /* Energy History */

// // export const saveEnergyLogData = async (host, instance, parameter, records) => {
// //   for (const item of records) {
// //     await database.execute(
// //       `
// //       INSERT INTO utility_data
// //       (host,instance,parameter,time,value,unit)

// //       VALUES (?,?,?,?,?,?)
// //       `,

// //       [host, instance, parameter, item.time, item.value, item.unit],
// //     );
// //   }
// // };

// import { database } from "../config/SQLite_DB.js";

// /* Save Trend Logs */
// export const saveTrendLogs = async (trendlogs) => {
//   for (const item of trendlogs) {
//     await database.execute(
//       `
//       INSERT IGNORE INTO trendlog
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

// /* Save Trend History */
// export const saveTrendLogData = async (host, instance, records) => {
//   for (const item of records) {
//     await database.execute(
//       `
//       INSERT IGNORE INTO trendlog_data
//       (host, instance, time, value)
//       VALUES (?, ?, ?, ?)
//       `,
//       [host, instance, item.time, item.value],
//     );
//   }
// };

// /* Save Energy Logs */
// export const saveEnergyLogs = async (energylogs) => {
//   for (const item of energylogs) {
//     await database.execute(
//       `
//       INSERT IGNORE INTO utility
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

// /* Save Energy History */
// export const saveEnergyLogData = async (host, instance, parameter, records) => {
//   for (const item of records) {
//     await database.execute(
//       `
//       INSERT IGNORE INTO utility_data
//       (host, instance, parameter, time, value, unit)
//       VALUES (?, ?, ?, ?, ?, ?)
//       `,
//       [host, instance, parameter, item.time, item.value, item.unit],
//     );
//   }
// };

import { database } from "../config/SQLite_DB.js";

//  Save Trend Logs
export const saveTrendLogs = async (trendlogs) => {
  for (const item of trendlogs) {
    await database.run(
      `
      INSERT OR IGNORE INTO trendlog
      (host, instance, description, loggedHost, loggedInstance)
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        item.host,
        item.instance,
        item.description,
        item.loggedHost,
        item.loggedInstance,
      ],
    );
  }
};
//  Save Trend History
export const saveTrendLogData = async (host, instance, records) => {
  const trendlog = await database.get(
    `
    SELECT id
    FROM trendlog
    WHERE host = ? AND instance = ?
    `,
    [host, instance],
  );

  if (!trendlog) return;

  for (const item of records) {
    await database.run(
      `
      INSERT OR IGNORE INTO trendlog_data
      (trendlog_id, time, value)
      VALUES (?, ?, ?)
      `,
      [trendlog.id, item.time, item.value],
    );
  }
};

//  Save Energy Logs
export const saveEnergyLogs = async (energylogs) => {
  for (const item of energylogs) {
    await database.run(
      `
      INSERT OR IGNORE INTO utility
      (name, description, host, instance, utilityType, parameter)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        item.name,
        item.description,
        item.host,
        item.instance,
        item.utilityType,
        item.parameter,
      ],
    );
  }
};

//  Save Ener
export const saveEnergyLogData = async (host, instance, parameter, records) => {
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

  for (const item of records) {
    await database.run(
      `
      INSERT OR IGNORE INTO utility_data
      (utility_id, time, value, unit)
      VALUES (?, ?, ?, ?)
      `,
      [utility.id, item.time, item.value, item.unit],
    );
  }
};
