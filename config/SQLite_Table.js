// // import { database } from "./SQL_DB.js";

// // export const TrendingLogTable = async () => {
// //   try {
// //     await database.execute(`
// //       CREATE TABLE IF NOT EXISTS trendlog (
// //         id INT AUTO_INCREMENT PRIMARY KEY,
// //         host VARCHAR(50) NOT NULL,
// //         instance VARCHAR(50) NOT NULL,
// //         description VARCHAR(255),
// //         loggedHost VARCHAR(50),
// //         loggedInstance VARCHAR(50),
// //         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

// //         UNIQUE KEY unique_trendlog (host, instance)
// //       )
// //     `);

// //     console.log("Trendlog table is ready 😇");
// //   } catch (error) {
// //     console.log("Table Creation Error 🤬");
// //     console.log(error.message);
// //     throw error;
// //   }
// // };

// // export const TrendingLogDataTable = async () => {
// //   try {
// //     await database.execute(`
// //       CREATE TABLE IF NOT EXISTS trendlog_data (
// //         id INT AUTO_INCREMENT PRIMARY KEY,
// //         time DATETIME(3) NOT NULL,
// //         value DECIMAL(10,6) NOT NULL,
// //         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
// //         UNIQUE KEY unique_trendlog_data (time)
// //       )
// //     `);

// //     console.log("Trendlog Data table is ready  😇");
// //   } catch (error) {
// //     console.log("Table Creation Error 🤬");
// //     console.log(error.message);
// //     throw error;
// //   }
// // };

// // export const EnergylogTable = async () => {
// //   try {
// //     await database.execute(`
// //       CREATE TABLE IF NOT EXISTS utility (
// //         id INT AUTO_INCREMENT PRIMARY KEY,

// //         name VARCHAR(255) NOT NULL,
// //         description TEXT,
// //         host VARCHAR(50) NOT NULL,
// //         instance VARCHAR(50) NOT NULL,
// //         utilityType VARCHAR(100),
// //         parameter VARCHAR(50),

// //         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

// //         UNIQUE KEY unique_utility (host, instance)
// //       )
// //     `);

// //     console.log("Utility table is ready  😇");
// //   } catch (error) {
// //     console.log("Utility Table Creation Error 🤬");
// //     console.log(error.message);
// //     throw error;
// //   }
// // };

// import { database } from "./SQLite_DB.js";

// /* Trend Log Master */
// export const TrendingLogTable = async () => {
//   await database.execute(`
//     CREATE TABLE IF NOT EXISTS trendlog (
//       id INT AUTO_INCREMENT PRIMARY KEY,

//       host VARCHAR(50) NOT NULL,
//       instance VARCHAR(50) NOT NULL,

//       description VARCHAR(255),
//       loggedHost VARCHAR(50),
//       loggedInstance VARCHAR(50),

//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

//       UNIQUE KEY unique_trendlog (host, instance)
//     )
//   `);

//   console.log("Trendlog table is ready 😇");
// };

// /* Trend Log History */
// // export const TrendingLogDataTable = async () => {
// //   await database.execute(`
// //     CREATE TABLE IF NOT EXISTS trendlog_data (

// //       id BIGINT AUTO_INCREMENT PRIMARY KEY,

// //       host VARCHAR(50) NOT NULL,
// //       instance VARCHAR(50) NOT NULL,

// //       time DATETIME(3) NOT NULL,

// //       value DECIMAL(18,6),

// //       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

// //       INDEX idx_trend (host,instance,time)

// //     )
// //   `);

// //   console.log("Trendlog Data table is ready 😇");
// // };

// export const TrendingLogDataTable = async () => {
//   await database.execute(`
//     CREATE TABLE IF NOT EXISTS trendlog_data (

//       id BIGINT AUTO_INCREMENT PRIMARY KEY,

//       host VARCHAR(50) NOT NULL,
//       instance VARCHAR(50) NOT NULL,

//       time DATETIME(3) NOT NULL,

//       value DECIMAL(18,6),

//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

//       INDEX idx_trend (host, instance, time),

//       UNIQUE KEY unique_trend_history (host, instance, time)

//     )
//   `);

//   console.log("Trendlog Data table is ready 😇");
// };

// /* Energy Master */
// export const EnergylogTable = async () => {
//   await database.execute(`
//     CREATE TABLE IF NOT EXISTS utility (

//       id INT AUTO_INCREMENT PRIMARY KEY,

//       name VARCHAR(255),

//       description TEXT,

//       host VARCHAR(50) NOT NULL,

//       instance VARCHAR(50) NOT NULL,

//       utilityType VARCHAR(100),

//       parameter VARCHAR(50),

//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

//       UNIQUE KEY unique_utility (host,instance)

//     )
//   `);

//   console.log("Utility table is ready 😇");
// };

// /* Energy History */
// // export const EnergylogDataTable = async () => {
// //   await database.execute(`
// //     CREATE TABLE IF NOT EXISTS utility_data (

// //       id BIGINT AUTO_INCREMENT PRIMARY KEY,

// //       host VARCHAR(50) NOT NULL,

// //       instance VARCHAR(50) NOT NULL,

// //       parameter VARCHAR(50),

// //       time DATETIME(3) NOT NULL,

// //       value DECIMAL(18,6),

// //       unit VARCHAR(30),

// //       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

// //       INDEX idx_energy (host,instance,time)

// //     )
// //   `);

// //   console.log("Utility Data table is ready 😇");
// // };

// export const EnergylogDataTable = async () => {
//   await database.execute(`
//     CREATE TABLE IF NOT EXISTS utility_data (

//       id BIGINT AUTO_INCREMENT PRIMARY KEY,

//       host VARCHAR(50) NOT NULL,
//       instance VARCHAR(50) NOT NULL,
//       parameter VARCHAR(50),

//       time DATETIME(3) NOT NULL,

//       value DECIMAL(18,6),

//       unit VARCHAR(30),

//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

//       INDEX idx_energy (host, instance, time),

//       UNIQUE KEY unique_energy_history (host, instance, parameter, time)

//     )
//   `);

//   console.log("Utility Data table is ready 😇");
// };

import { database } from "./SQLite_DB.js";

//  Trend Log Master
export const TrendingLogTable = async () => {
  await database.exec(`
    CREATE TABLE IF NOT EXISTS trendlog (
      id INTEGER PRIMARY KEY AUTOINCREMENT,

      host TEXT NOT NULL,
      instance TEXT NOT NULL,

      description TEXT,
      loggedHost TEXT,
      loggedInstance TEXT,

      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

      UNIQUE(host, instance)
    );
  `);

  console.log("Trendlog table is ready 😇");
};

//  Trend Log History
export const TrendingLogDataTable = async () => {
  await database.exec(`
    CREATE TABLE IF NOT EXISTS trendlog_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,

      trendlog_id INTEGER NOT NULL,

      time TEXT NOT NULL,
      value REAL,

      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (trendlog_id)
        REFERENCES trendlog(id)
        ON DELETE CASCADE,

      UNIQUE(trendlog_id, time)
    );

    CREATE INDEX IF NOT EXISTS idx_trendlog_data
    ON trendlog_data(trendlog_id, time);
  `);

  console.log("Trendlog Data table is ready 😇");
};

//  Utility Master
export const EnergylogTable = async () => {
  await database.exec(`
    CREATE TABLE IF NOT EXISTS utility (
      id INTEGER PRIMARY KEY AUTOINCREMENT,

      name TEXT,
      description TEXT,

      host TEXT NOT NULL,
      instance TEXT NOT NULL,

      utilityType TEXT,
      parameter TEXT,

      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

      UNIQUE(host, instance)
    );
  `);

  console.log("Utility table is ready 😇");
};

//  Utility History
export const EnergylogDataTable = async () => {
  await database.exec(`
    CREATE TABLE IF NOT EXISTS utility_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,

      utility_id INTEGER NOT NULL,

      time TEXT NOT NULL,
      value REAL,
      unit TEXT,

      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (utility_id)
        REFERENCES utility(id)
        ON DELETE CASCADE,

      UNIQUE(utility_id, time)
    );

    CREATE INDEX IF NOT EXISTS idx_utility_data
    ON utility_data(utility_id, time);
  `);

  console.log("Utility Data table is ready 😇");
};
