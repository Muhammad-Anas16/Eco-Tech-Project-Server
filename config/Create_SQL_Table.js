// import { database } from "./SQL_DB.js";

// export const TrendingLogTable = async () => {
//   try {
//     await database.execute(`
//       CREATE TABLE IF NOT EXISTS trendlog (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         host VARCHAR(50) NOT NULL,
//         instance VARCHAR(50) NOT NULL,
//         description VARCHAR(255),
//         loggedHost VARCHAR(50),
//         loggedInstance VARCHAR(50),
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

//         UNIQUE KEY unique_trendlog (host, instance)
//       )
//     `);

//     console.log("Trendlog table is ready 😇");
//   } catch (error) {
//     console.log("Table Creation Error 🤬");
//     console.log(error.message);
//     throw error;
//   }
// };

// export const TrendingLogDataTable = async () => {
//   try {
//     await database.execute(`
//       CREATE TABLE IF NOT EXISTS trendlog_data (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         time DATETIME(3) NOT NULL,
//         value DECIMAL(10,6) NOT NULL,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         UNIQUE KEY unique_trendlog_data (time)
//       )
//     `);

//     console.log("Trendlog Data table is ready  😇");
//   } catch (error) {
//     console.log("Table Creation Error 🤬");
//     console.log(error.message);
//     throw error;
//   }
// };

// export const EnergylogTable = async () => {
//   try {
//     await database.execute(`
//       CREATE TABLE IF NOT EXISTS utility (
//         id INT AUTO_INCREMENT PRIMARY KEY,

//         name VARCHAR(255) NOT NULL,
//         description TEXT,
//         host VARCHAR(50) NOT NULL,
//         instance VARCHAR(50) NOT NULL,
//         utilityType VARCHAR(100),
//         parameter VARCHAR(50),

//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

//         UNIQUE KEY unique_utility (host, instance)
//       )
//     `);

//     console.log("Utility table is ready  😇");
//   } catch (error) {
//     console.log("Utility Table Creation Error 🤬");
//     console.log(error.message);
//     throw error;
//   }
// };

import { database } from "./SQL_DB.js";

/* Trend Log Master */
export const TrendingLogTable = async () => {
  await database.execute(`
    CREATE TABLE IF NOT EXISTS trendlog (
      id INT AUTO_INCREMENT PRIMARY KEY,

      host VARCHAR(50) NOT NULL,
      instance VARCHAR(50) NOT NULL,

      description VARCHAR(255),
      loggedHost VARCHAR(50),
      loggedInstance VARCHAR(50),

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      UNIQUE KEY unique_trendlog (host, instance)
    )
  `);

  console.log("Trendlog table is ready 😇");
};

/* Trend Log History */
// export const TrendingLogDataTable = async () => {
//   await database.execute(`
//     CREATE TABLE IF NOT EXISTS trendlog_data (

//       id BIGINT AUTO_INCREMENT PRIMARY KEY,

//       host VARCHAR(50) NOT NULL,
//       instance VARCHAR(50) NOT NULL,

//       time DATETIME(3) NOT NULL,

//       value DECIMAL(18,6),

//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

//       INDEX idx_trend (host,instance,time)

//     )
//   `);

//   console.log("Trendlog Data table is ready 😇");
// };

export const TrendingLogDataTable = async () => {
  await database.execute(`
    CREATE TABLE IF NOT EXISTS trendlog_data (

      id BIGINT AUTO_INCREMENT PRIMARY KEY,

      host VARCHAR(50) NOT NULL,
      instance VARCHAR(50) NOT NULL,

      time DATETIME(3) NOT NULL,

      value DECIMAL(18,6),

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      INDEX idx_trend (host, instance, time),

      UNIQUE KEY unique_trend_history (host, instance, time)

    )
  `);

  console.log("Trendlog Data table is ready 😇");
};

/* Energy Master */
export const EnergylogTable = async () => {
  await database.execute(`
    CREATE TABLE IF NOT EXISTS utility (

      id INT AUTO_INCREMENT PRIMARY KEY,

      name VARCHAR(255),

      description TEXT,

      host VARCHAR(50) NOT NULL,

      instance VARCHAR(50) NOT NULL,

      utilityType VARCHAR(100),

      parameter VARCHAR(50),

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      UNIQUE KEY unique_utility (host,instance)

    )
  `);

  console.log("Utility table is ready 😇");
};

/* Energy History */
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

//       INDEX idx_energy (host,instance,time)

//     )
//   `);

//   console.log("Utility Data table is ready 😇");
// };

export const EnergylogDataTable = async () => {
  await database.execute(`
    CREATE TABLE IF NOT EXISTS utility_data (

      id BIGINT AUTO_INCREMENT PRIMARY KEY,

      host VARCHAR(50) NOT NULL,
      instance VARCHAR(50) NOT NULL,
      parameter VARCHAR(50),

      time DATETIME(3) NOT NULL,

      value DECIMAL(18,6),

      unit VARCHAR(30),

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      INDEX idx_energy (host, instance, time),

      UNIQUE KEY unique_energy_history (host, instance, parameter, time)

    )
  `);

  console.log("Utility Data table is ready 😇");
};
