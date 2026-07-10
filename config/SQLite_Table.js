import { database } from "./SQLite_DB.js";

// ==========================
// Trend Log Master
// ==========================
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

    CREATE INDEX IF NOT EXISTS idx_trendlog_master
    ON trendlog(host, instance);

    CREATE INDEX IF NOT EXISTS idx_trendlog_created
    ON trendlog(created_at);
  `);

  console.log("Trendlog table is ready 😇");
};

// ==========================
// Trend Log History
// ==========================
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

    CREATE INDEX IF NOT EXISTS idx_trendlog_data_id
    ON trendlog_data(trendlog_id);

    CREATE INDEX IF NOT EXISTS idx_trendlog_data_time
    ON trendlog_data(time);

    CREATE INDEX IF NOT EXISTS idx_trendlog_data_both
    ON trendlog_data(trendlog_id, time);
  `);

  console.log("Trendlog Data table is ready 😇");
};

// ==========================
// Utility Master
// ==========================
export const EnergylogTable = async () => {
  await database.exec(`
    CREATE TABLE IF NOT EXISTS utility (
      id INTEGER PRIMARY KEY AUTOINCREMENT,

      name TEXT,
      description TEXT,

      host TEXT NOT NULL,
      instance TEXT NOT NULL,
      parameter TEXT NOT NULL,

      utilityType TEXT,

      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

      UNIQUE(host, instance, parameter)
    );

    CREATE INDEX IF NOT EXISTS idx_utility_master
    ON utility(host, instance, parameter);

    CREATE INDEX IF NOT EXISTS idx_utility_created
    ON utility(created_at);
  `);

  console.log("Utility table is ready 😇");
};

// ==========================
// Utility History
// ==========================
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

    CREATE INDEX IF NOT EXISTS idx_utility_data_id
    ON utility_data(utility_id);

    CREATE INDEX IF NOT EXISTS idx_utility_data_time
    ON utility_data(time);

    CREATE INDEX IF NOT EXISTS idx_utility_data_both
    ON utility_data(utility_id, time);
  `);

  console.log("Utility Data table is ready 😇");
};
