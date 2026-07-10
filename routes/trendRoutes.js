import express from "express";
import { database } from "../config/SQLite_DB.js";
import ResHelper from "../helper/ResHelper.js";

const router = express.Router();

//    Get All Trend Logs
router.get("/", async (req, res) => {
  try {
    const rows = await database.all(`
      SELECT *
      FROM trendlog
      ORDER BY id DESC
    `);

    ResHelper(res, 200, true, "Trend Logs", rows);
  } catch (error) {
    ResHelper(res, 500, false, error.message, null);
  }
});

//    Get Single Trend Log + History
router.get("/:instance", async (req, res) => {
  try {
    const trend = await database.get(
      `
      SELECT *
      FROM trendlog
      WHERE instance = ?
      `,
      [req.params.instance],
    );

    if (!trend) {
      return ResHelper(res, 404, false, "Trend Log Not Found", null);
    }

    const history = await database.all(
      `
      SELECT
        id,
        time,
        value,
        created_at
      FROM trendlog_data
      WHERE trendlog_id = ?
      ORDER BY time DESC
      `,
      [trend.id],
    );

    ResHelper(res, 200, true, "Trend Log", {
      trend,
      history,
    });
  } catch (error) {
    ResHelper(res, 500, false, error.message, null);
  }
});

//    Delete Trend Log + History
router.delete("/:instance", async (req, res) => {
  try {
    const trend = await database.get(
      `
      SELECT id
      FROM trendlog
      WHERE instance = ?
      `,
      [req.params.instance],
    );

    if (!trend) {
      return ResHelper(res, 404, false, "Trend Log Not Found", null);
    }

    // History delete
    await database.run(
      `
      DELETE FROM trendlog_data
      WHERE trendlog_id = ?
      `,
      [trend.id],
    );

    // Master delete
    await database.run(
      `
      DELETE FROM trendlog
      WHERE id = ?
      `,
      [trend.id],
    );

    ResHelper(res, 200, true, "Trend Log Deleted Successfully", null);
  } catch (error) {
    ResHelper(res, 500, false, error.message, null);
  }
});

export default router;
