// import express from "express";
// import auroraService from "../services/auroraService.js";
// import {
//   getTrend,
//   getTrendData,
//   getEnergy,
//   getEnergyData,
//   getUsers,
//   getGroups,
// } from "../utils/getBody.js";
// import ResHelper from "../helper/ResHelper.js";
// import {
//   saveEnergyLogData,
//   saveEnergyLogs,
//   saveTrendLogData,
//   saveTrendLogs,
// } from "../services/saveDataService.js";
// import {
//   getEnergyLogData,
//   getEnergyLogs,
//   getTrendLogData,
//   getTrendLogs,
// } from "../services/getSQLDataService.js";

// const router = express.Router();

// /* Get All Trend Logs */
// router.get("/trend", async (req, res) => {
//   try {
//     const data = await auroraService("getTrendlog", getTrend());
//     const saveInSQL = await saveTrendLogs(data?.response?.trendlog);

//     const sqlData = await getTrendLogs();
//     ResHelper(res, 200, true, "Getting Trend Logs", sqlData);
//   } catch (error) {
//     ResHelper(res, 500, false, error.message, null);
//   }
// });

// /* Get Trend Log Data */
// router.get("/trend/:instance", async (req, res) => {
//   try {
//     const data = await auroraService(
//       "getTrendlogData",
//       getTrendData({
//         instance: req.params.instance,
//       }),
//     );
//     const saveInSQL = await saveTrendLogData(
//       data.response.host,
//       data.response.instance,
//       data.response.record,
//     );
//     const sqlData = await getTrendLogData(req.params.instance);
//     ResHelper(res, 200, true, "Getting Trend Log Data", sqlData);
//   } catch (error) {
//     ResHelper(res, 500, false, error.message, null);
//   }
// });

// /* Get All Energy Logs */
// router.get("/energy", async (req, res) => {
//   try {
//     const data = await auroraService("getEnergylog", getEnergy());
//     const saveInSQL = await saveEnergyLogs(data?.response?.energylog);

//     const sqlData = await getEnergyLogs();

//     ResHelper(res, 200, true, "Getting Energy Logs", sqlData);
//   } catch (error) {
//     ResHelper(res, 500, false, error.message, null);
//   }
// });

// /* Get Energy Log Data */
// router.get("/energy/:instance/:parameter", async (req, res) => {
//   try {
//     const data = await auroraService(
//       "getEnergylogData",
//       getEnergyData({
//         instance: req.params.instance,
//         parameter: req.params.parameter,
//       }),
//     );

//     const saveInSQL = await saveEnergyLogData(
//       data.response.host,
//       data.response.instance,
//       data.response.parameter,
//       data.response.record,
//     );

//     const sqlData = await getEnergyLogData(
//       req.params.instance,
//       req.params.parameter,
//     );

//     ResHelper(res, 200, true, "Getting Energy Log Data", sqlData);
//   } catch (error) {
//     ResHelper(res, 500, false, error.message, null);
//   }
// });

// /* Get Users */
// router.get("/users", async (req, res) => {
//   try {
//     const data = await auroraService("getUser", getUsers());

//     ResHelper(res, 200, true, "Getting Users", data);
//   } catch (error) {
//     ResHelper(res, 500, false, error.message, null);
//   }
// });

// /* Get Groups */
// router.get("/groups", async (req, res) => {
//   try {
//     const data = await auroraService("getGroup", getGroups());

//     ResHelper(res, 200, true, "Getting Groups", data);
//   } catch (error) {
//     ResHelper(res, 500, false, error.message, null);
//   }
// });

// export default router;

import express from "express";
import auroraService from "../services/auroraService.js";
import {
  getTrend,
  getTrendData,
  getEnergy,
  getEnergyData,
  getUsers,
  getGroups,
} from "../utils/getBody.js";
import ResHelper from "../helper/ResHelper.js";

import {
  saveTrendLogs,
  saveTrendLogData,
  saveEnergyLogs,
  saveEnergyLogData,
} from "../services/saveDataService.js";

import {
  getTrendLogs,
  getTrendLogData,
  getEnergyLogs,
  getEnergyLogData,
} from "../services/getSQLDataService.js";

const router = express.Router();

//  Get All Trend Logs
// router.get("/trend", async (req, res) => {
//   try {
//     try {
//       const data = await auroraService("getTrendlog", getTrend());
//       await saveTrendLogs(data?.response?.trendlog || []);
//     } catch (err) {
//       console.log("Aurora Offline -> Returning SQLite Data");
//     }

//     const sqlData = await getTrendLogs();

//     ResHelper(res, 200, true, "Getting Trend Logs", sqlData);
//   } catch (error) {
//     ResHelper(res, 500, false, error.message, null);
//   }
// });

router.get("/trend", async (req, res) => {
  try {
    const data = await auroraService("getTrendlog", getTrend());
    const check = data?.response?.trendlog;
    ResHelper(res, 200, true, "Get Trend Successfully", check);
  } catch (error) {
    ResHelper(res, 500, false, error.message, null);
  }
});

//  Get Trend Log Data
// router.get("/trend/:instance", async (req, res) => {
//   try {
//     try {
//       const data = await auroraService(
//         "getTrendlogData",
//         getTrendData({
//           instance: req.params.instance,
//         }),
//       );

//       await saveTrendLogData(
//         data.response.host,
//         data.response.instance,
//         data.response.record,
//       );
//     } catch (err) {
//       console.log("Aurora Offline -> Returning SQLite Data");
//     }

//     const sqlData = await getTrendLogData(req.params.instance);

//     ResHelper(res, 200, true, "Getting Trend Log Data", sqlData);
//   } catch (error) {
//     ResHelper(res, 500, false, error.message, null);
//   }
// });

router.get("/trend/:instance", async (req, res) => {
  try {
    const data = await auroraService(
      "getTrendlogData",
      getTrendData({
        instance: req.params.instance,
      }),
    );
    const check = data?.response?.record;
    if (!check) {
      ResHelper(res, 200, true, "Get But Data is Null", null);
    }
    ResHelper(res, 200, true, "Get Trend Data Successfully", check);
  } catch (error) {
    ResHelper(res, 500, false, error.message, null);
  }
});

//  Get All Energy Logs
// router.get("/energy", async (req, res) => {
//   try {
//     try {
//       const data = await auroraService("getEnergylog", getEnergy());

//       await saveEnergyLogs(data?.response?.energylog || []);
//     } catch (err) {
//       console.log("Aurora Offline -> Returning SQLite Data");
//     }

//     const sqlData = await getEnergyLogs();

//     ResHelper(res, 200, true, "Getting Energy Logs", sqlData);
//   } catch (error) {
//     ResHelper(res, 500, false, error.message, null);
//   }
// });
router.get("/energy", async (req, res) => {
  try {
    const data = await auroraService("getEnergylog", getEnergy());
    const check = data?.response?.energylog;
    ResHelper(res, 200, true, "Get Energy Successfully", check);
  } catch (error) {
    ResHelper(res, 500, false, error.message, null);
  }
});

//  Get Energy Log Data
// router.get("/energy/:instance/:parameter", async (req, res) => {
//   try {
//     try {
//       const data = await auroraService(
//         "getEnergylogData",
//         getEnergyData({
//           instance: req.params.instance,
//           parameter: req.params.parameter,
//         }),
//       );

//       await saveEnergyLogData(
//         data.response.host,
//         data.response.instance,
//         data.response.parameter,
//         data.response.record,
//       );
//     } catch (err) {
//       console.log("Aurora Offline -> Returning SQLite Data");
//     }

//     const sqlData = await getEnergyLogData(
//       req.params.instance,
//       req.params.parameter,
//     );

//     ResHelper(res, 200, true, "Getting Energy Log Data", sqlData);
//   } catch (error) {
//     ResHelper(res, 500, false, error.message, null);
//   }
// });

router.get("/energy/:instance/:parameter", async (req, res) => {
  try {
    const data = await auroraService(
      "getEnergylogData",
      getEnergyData({
        instance: req.params.instance,
        parameter: req.params.parameter,
      }),
    );
    const check = data?.response?.record;
    if (!check) {
      ResHelper(res, 200, true, "Get But Data is Null", null);
    }
    ResHelper(res, 200, true, "Get Energy Log Data Successfully", check);
  } catch (error) {
    ResHelper(res, 500, false, error.message, null);
  }
});

export default router;
