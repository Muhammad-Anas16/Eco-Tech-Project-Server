// import express from "express";
// import ResHelper from "../helper/ResHelper.js";
// import { database } from "../config/SQLite_DB.js";

// const router = express.Router();

// //    Get All Energy Logs
// router.get("/", async (req, res) => {
//   try {
//     const rows = await database.all(`
//       SELECT *
//       FROM utility
//       ORDER BY id DESC
//     `);

//     ResHelper(res, 200, true, "Energy Logs", rows);
//   } catch (error) {
//     ResHelper(res, 500, false, error.message, null);
//   }
// });

// //    Get Single Energy Log + History
// router.get("/:instance/:parameter", async (req, res) => {
//   try {
//     const energy = await database.get(
//       `
//       SELECT *
//       FROM utility
//       WHERE instance = ?
//         AND parameter = ?
//       `,
//       [req.params.instance, req.params.parameter],
//     );

//     if (!energy) {
//       return ResHelper(res, 404, false, "Energy Log Not Found", null);
//     }

//     const history = await database.all(
//       `
//       SELECT
//         id,
//         time,
//         value,
//         unit,
//         created_at
//       FROM utility_data
//       WHERE utility_id = ?
//       ORDER BY time DESC
//       `,
//       [energy.id],
//     );

//     ResHelper(res, 200, true, "Energy Log", {
//       energy,
//       history,
//     });
//   } catch (error) {
//     ResHelper(res, 500, false, error.message, null);
//   }
// });

// export default router;

// import express from "express";
// import ResHelper from "../helper/ResHelper.js";
// import { database } from "../config/SQLite_DB.js";

// import auroraService from "../services/auroraService.js";
// import { getEnergy, getEnergyData } from "../utils/getBody.js";
// import {
//   saveEnergyLogs,
//   saveEnergyLogData,
// } from "../services/saveDataService.js";

// const router = express.Router();

// // ==========================
// // Get All Energy Logs
// // ==========================
// router.get("/", async (req, res) => {
//   try {
//     // 1. Instant Response from SQLite
//     const rows = await database.all(`
//       SELECT *
//       FROM utility
//       ORDER BY id DESC
//     `);

//     ResHelper(res, 200, true, "Energy Logs", rows);

//     // 2. Background Sync
//     setImmediate(async () => {
//       try {
//         const response = await auroraService("getEnergylog", getEnergy());

//         const energyLogs = response?.response?.energylog || [];

//         await saveEnergyLogs(energyLogs);

//         console.log("✅ Energy Logs Updated");
//       } catch (err) {
//         console.log("❌ Background Energy Sync Failed");
//         console.log(err.message);
//       }
//     });
//   } catch (error) {
//     ResHelper(res, 500, false, error.message, null);
//   }
// });

// // ==========================
// // Get Single Energy Log + History
// // ==========================
// router.get("/:instance/:parameter", async (req, res) => {
//   try {
//     // 1. Instant SQLite Response
//     const energy = await database.get(
//       `
//       SELECT *
//       FROM utility
//       WHERE instance = ?
//       AND parameter = ?
//       `,
//       [req.params.instance, req.params.parameter],
//     );

//     if (!energy) {
//       return ResHelper(res, 404, false, "Energy Log Not Found", null);
//     }

//     const history = await database.all(
//       `
//       SELECT
//         id,
//         time,
//         value,
//         unit,
//         created_at
//       FROM utility_data
//       WHERE utility_id = ?
//       ORDER BY time DESC
//       `,
//       [energy.id],
//     );

//     ResHelper(res, 200, true, "Energy Log", {
//       energy,
//       history,
//     });

//     // 2. Background Sync
//     setImmediate(async () => {
//       try {
//         const response = await auroraService(
//           "getEnergylogData",
//           getEnergyData({
//             instance: req.params.instance,
//             parameter: req.params.parameter,
//           }),
//         );

//         await saveEnergyLogData(
//           response.response.host,
//           response.response.instance,
//           response.response.parameter,
//           response.response.record,
//         );

//         console.log(
//           `✅ Energy History Updated: ${req.params.instance}/${req.params.parameter}`,
//         );
//       } catch (err) {
//         console.log(
//           `❌ Energy History Sync Failed: ${req.params.instance}/${req.params.parameter}`,
//         );
//         console.log(err.message);
//       }
//     });
//   } catch (error) {
//     ResHelper(res, 500, false, error.message, null);
//   }
// });

// export default router;

import express from "express";
import ResHelper from "../helper/ResHelper.js";
import { database } from "../config/SQLite_DB.js";

import auroraService from "../services/auroraService.js";
import { getEnergy, getEnergyData } from "../utils/getBody.js";
import {
  saveEnergyLogs,
  saveEnergyLogData,
} from "../services/saveDataService.js";

const router = express.Router();

// ======================================
// Get All Energy Logs
// Online First -> SQLite Fallback
// ======================================
router.get("/", async (req, res) => {
  try {
    try {
      // Get Latest Data From Aurora
      const response = await auroraService("getEnergylog", getEnergy());

      const energyLogs = response?.response?.energylog || [];

      // Save Latest Data
      await saveEnergyLogs(energyLogs);

      // Return Latest Data
      return ResHelper(res, 200, true, "Energy Logs", energyLogs);
    } catch (err) {
      console.log("Aurora Offline -> Returning SQLite Data");
    }

    // SQLite Fallback
    const rows = await database.all(`
      SELECT *
      FROM utility
      ORDER BY id DESC
    `);

    ResHelper(res, 200, true, "Energy Logs (SQLite)", rows);
  } catch (error) {
    ResHelper(res, 500, false, error.message, null);
  }
});

// ======================================
// Get Single Energy Log + History
// Online First -> SQLite Fallback
// ======================================
router.get("/:instance/:parameter", async (req, res) => {
  try {
    try {
      // Get Latest History From Aurora
      const response = await auroraService(
        "getEnergylogData",
        getEnergyData({
          instance: req.params.instance,
          parameter: req.params.parameter,
        }),
      );

      // Save Latest History
      await saveEnergyLogData(
        response.response.host,
        response.response.instance,
        response.response.parameter,
        response.response.record,
      );

      // Get Updated Data From SQLite
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

      return ResHelper(res, 200, true, "Energy Log", {
        energy,
        history,
      });
    } catch (err) {
      console.log("Aurora Offline -> Returning SQLite Data");
    }

    // SQLite Fallback
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

    ResHelper(res, 200, true, "Energy Log (SQLite)", {
      energy,
      history,
    });
  } catch (error) {
    ResHelper(res, 500, false, error.message, null);
  }
});

export default router;
