// import express from "express";
// import { database } from "../config/SQLite_DB.js";
// import ResHelper from "../helper/ResHelper.js";

// const router = express.Router();

// //    Get All Trend Logs
// router.get("/", async (req, res) => {
//   try {
//     const rows = await database.all(`
//       SELECT *
//       FROM trendlog
//       ORDER BY id DESC
//     `);

//     ResHelper(res, 200, true, "Trend Logs", rows);
//   } catch (error) {
//     ResHelper(res, 500, false, error.message, null);
//   }
// });
// //    Get Single Trend Log + History
// router.get("/:instance", async (req, res) => {
//   try {
//     const trend = await database.get(
//       `
//       SELECT *
//       FROM trendlog
//       WHERE instance = ?
//       `,
//       [req.params.instance],
//     );

//     if (!trend) {
//       return ResHelper(res, 404, false, "Trend Log Not Found", null);
//     }

//     const history = await database.all(
//       `
//       SELECT
//         id,
//         time,
//         value,
//         created_at
//       FROM trendlog_data
//       WHERE trendlog_id = ?
//       ORDER BY time DESC
//       `,
//       [trend.id],
//     );

//     ResHelper(res, 200, true, "Trend Log", {
//       trend,
//       history,
//     });
//   } catch (error) {
//     ResHelper(res, 500, false, error.message, null);
//   }
// });

// //    Delete Trend Log + History
// router.delete("/:instance", async (req, res) => {
//   try {
//     const trend = await database.get(
//       `
//       SELECT id
//       FROM trendlog
//       WHERE instance = ?
//       `,
//       [req.params.instance],
//     );

//     if (!trend) {
//       return ResHelper(res, 404, false, "Trend Log Not Found", null);
//     }

//     // History delete
//     await database.run(
//       `
//       DELETE FROM trendlog_data
//       WHERE trendlog_id = ?
//       `,
//       [trend.id],
//     );

//     // Master delete
//     await database.run(
//       `
//       DELETE FROM trendlog
//       WHERE id = ?
//       `,
//       [trend.id],
//     );

//     ResHelper(res, 200, true, "Trend Log Deleted Successfully", null);
//   } catch (error) {
//     ResHelper(res, 500, false, error.message, null);
//   }
// });

// export default router;

// import express from "express";
// import { database } from "../config/SQLite_DB.js";
// import ResHelper from "../helper/ResHelper.js";

// import auroraService from "../services/auroraService.js";
// import { getTrend, getTrendData } from "../utils/getBody.js";
// import {
//   saveTrendLogs,
//   saveTrendLogData,
// } from "../services/saveDataService.js";

// const router = express.Router();

// // ==========================
// // Get All Trend Logs
// // ==========================
// router.get("/", async (req, res) => {
//   try {
//     // 1. Instant response from SQLite
//     const rows = await database.all(`
//       SELECT *
//       FROM trendlog
//       ORDER BY id DESC
//     `);

//     ResHelper(res, 200, true, "Trend Logs", rows);

//     // 2. Background Sync
//     setImmediate(async () => {
//       try {
//         const response = await auroraService("getTrendlog", getTrend());

//         const trendLogs = response?.response?.trendlog || [];

//         await saveTrendLogs(trendLogs);

//         console.log("✅ Trend Logs Updated");
//       } catch (err) {
//         console.log("❌ Background Trend Sync Failed");
//         console.log(err.message);
//       }
//     });
//   } catch (error) {
//     ResHelper(res, 500, false, error.message, null);
//   }
// });

// // ==========================
// // Get Single Trend Log + History
// // ==========================
// router.get("/:instance", async (req, res) => {
//   try {
//     // 1. Instant SQLite Response
//     const trend = await database.get(
//       `
//       SELECT *
//       FROM trendlog
//       WHERE instance = ?
//       `,
//       [req.params.instance],
//     );

//     if (!trend) {
//       return ResHelper(res, 404, false, "Trend Log Not Found", null);
//     }

//     const history = await database.all(
//       `
//       SELECT
//         id,
//         time,
//         value,
//         created_at
//       FROM trendlog_data
//       WHERE trendlog_id = ?
//       ORDER BY time DESC
//       `,
//       [trend.id],
//     );

//     ResHelper(res, 200, true, "Trend Log", {
//       trend,
//       history,
//     });

//     // 2. Background Sync
//     setImmediate(async () => {
//       try {
//         const response = await auroraService(
//           "getTrendlogData",
//           getTrendData({
//             instance: req.params.instance,
//           }),
//         );

//         await saveTrendLogData(
//           response.response.host,
//           response.response.instance,
//           response.response.record,
//         );

//         console.log(`✅ Trend History Updated: ${req.params.instance}`);
//       } catch (err) {
//         console.log(`❌ Trend History Sync Failed: ${req.params.instance}`);
//         console.log(err.message);
//       }
//     });
//   } catch (error) {
//     ResHelper(res, 500, false, error.message, null);
//   }
// });

// export default router;

import express from "express";
import { database } from "../config/SQLite_DB.js";
import ResHelper from "../helper/ResHelper.js";

import auroraService from "../services/auroraService.js";
import { getTrend, getTrendData } from "../utils/getBody.js";
import {
  saveTrendLogs,
  saveTrendLogData,
} from "../services/saveDataService.js";

const router = express.Router();

// ======================================
// Get All Trend Logs
// Online First -> SQLite Fallback
// ======================================
router.get("/", async (req, res) => {
  try {
    try {
      // Get Latest Trend Logs From Aurora
      const response = await auroraService("getTrendlog", getTrend());

      const trendLogs = response?.response?.trendlog || [];

      // Save Latest Data Into SQLite
      await saveTrendLogs(trendLogs);

      // Return Latest Data
      return ResHelper(res, 200, true, "Trend Logs", trendLogs);
    } catch (err) {
      console.log("Aurora Offline -> Returning SQLite Data");
    }

    // SQLite Fallback
    const rows = await database.all(`
      SELECT *
      FROM trendlog
      ORDER BY id DESC
    `);

    ResHelper(res, 200, true, "Trend Logs (SQLite)", rows);
  } catch (error) {
    ResHelper(res, 500, false, error.message, null);
  }
});

// ======================================
// Get Single Trend Log + History
// Online First -> SQLite Fallback
// ======================================
router.get("/:instance", async (req, res) => {
  try {
    try {
      // Get Latest Trend History From Aurora
      const response = await auroraService(
        "getTrendlogData",
        getTrendData({
          instance: req.params.instance,
        }),
      );

      // Save Latest History Into SQLite
      await saveTrendLogData(
        response.response.host,
        response.response.instance,
        response.response.record,
      );

      // Read Updated Data From SQLite
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

      return ResHelper(res, 200, true, "Trend Log", {
        trend,
        history,
      });
    } catch (err) {
      console.log("Aurora Offline -> Returning SQLite Data");
    }

    // SQLite Fallback
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

    ResHelper(res, 200, true, "Trend Log (SQLite)", {
      trend,
      history,
    });
  } catch (error) {
    ResHelper(res, 500, false, error.message, null);
  }
});

// ======================================
// Delete Trend Log + History
// ======================================
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

    await database.run(
      `
      DELETE FROM trendlog_data
      WHERE trendlog_id = ?
      `,
      [trend.id],
    );

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
