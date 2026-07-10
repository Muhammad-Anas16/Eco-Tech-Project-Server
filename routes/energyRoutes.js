import express from "express";
import ResHelper from "../helper/ResHelper.js";
import { database } from "../config/SQLite_DB.js";

const router = express.Router();

//    Get All Energy Logs
router.get("/", async (req, res) => {
  try {
    const rows = await database.all(`
      SELECT *
      FROM utility
      ORDER BY id DESC
    `);

    ResHelper(res, 200, true, "Energy Logs", rows);
  } catch (error) {
    ResHelper(res, 500, false, error.message, null);
  }
});

//    Get Single Energy Log + History
router.get("/:instance/:parameter", async (req, res) => {
  try {
    const energy = await database.get(
      `
      SELECT *
      FROM utility
      WHERE instance = ?
        AND parameter = ?
      `,
      [req.params.instance, req.params.parameter],
    );

    if (!energy) {
      return ResHelper(res, 404, false, "Energy Log Not Found", null);
    }

    const history = await database.all(
      `
      SELECT
        id,
        time,
        value,
        unit,
        created_at
      FROM utility_data
      WHERE utility_id = ?
      ORDER BY time DESC
      `,
      [energy.id],
    );

    ResHelper(res, 200, true, "Energy Log", {
      energy,
      history,
    });
  } catch (error) {
    ResHelper(res, 500, false, error.message, null);
  }
});

//    Delete Energy Log + History
router.delete("/:instance/:parameter", async (req, res) => {
  try {
    const energy = await database.get(
      `
      SELECT id
      FROM utility
      WHERE instance = ?
        AND parameter = ?
      `,
      [req.params.instance, req.params.parameter],
    );

    if (!energy) {
      return ResHelper(res, 404, false, "Energy Log Not Found", null);
    }

    // Delete history
    await database.run(
      `
      DELETE FROM utility_data
      WHERE utility_id = ?
      `,
      [energy.id],
    );

    // Delete master record
    await database.run(
      `
      DELETE FROM utility
      WHERE id = ?
      `,
      [energy.id],
    );

    ResHelper(res, 200, true, "Energy Log Deleted Successfully", null);
  } catch (error) {
    ResHelper(res, 500, false, error.message, null);
  }
});

export default router;
