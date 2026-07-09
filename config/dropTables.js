import { database } from "./SQL_DB.js";

const dropTables = async () => {
  try {
    await database.execute("DROP TABLE IF EXISTS trendlog_data");
    await database.execute("DROP TABLE IF EXISTS trendlog");
    await database.execute("DROP TABLE IF EXISTS utility_data");
    await database.execute("DROP TABLE IF EXISTS utility");

    console.log("🗑️ All tables dropped successfully");
  } catch (error) {
    console.log(error.message);
  }
};

export default dropTables;
