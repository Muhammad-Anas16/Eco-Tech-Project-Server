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
  saveEnergyLogData,
  saveEnergyLogs,
  saveTrendLogData,
  saveTrendLogs,
} from "../services/saveDataService.js";
import {
  getEnergyLogData,
  getEnergyLogs,
  getTrendLogData,
  getTrendLogs,
} from "../services/getSQLDataService.js";

const router = express.Router();

/* Get All Trend Logs */
router.get("/trend", async (req, res) => {
  try {
    const data = await auroraService("getTrendlog", getTrend());
    const saveInSQL = await saveTrendLogs(data?.response?.trendlog);

    const sqlData = await getTrendLogs();
    ResHelper(res, 200, true, "Getting Trend Logs", sqlData);
  } catch (error) {
    ResHelper(res, 500, false, error.message, null);
  }
});

/* Get Trend Log Data */
router.get("/trend/:instance", async (req, res) => {
  try {
    const data = await auroraService(
      "getTrendlogData",
      getTrendData({
        instance: req.params.instance,
      }),
    );
    const saveInSQL = await saveTrendLogData(
      data.response.host,
      data.response.instance,
      data.response.record,
    );
    const sqlData = await getTrendLogData(req.params.instance);
    ResHelper(res, 200, true, "Getting Trend Log Data", sqlData);
  } catch (error) {
    ResHelper(res, 500, false, error.message, null);
  }
});

/* Get All Energy Logs */
router.get("/energy", async (req, res) => {
  try {
    const data = await auroraService("getEnergylog", getEnergy());
    const saveInSQL = await saveEnergyLogs(data?.response?.energylog);

    const sqlData = await getEnergyLogs();

    ResHelper(res, 200, true, "Getting Energy Logs", sqlData);
  } catch (error) {
    ResHelper(res, 500, false, error.message, null);
  }
});

/* Get Energy Log Data */
router.get("/energy/:instance/:parameter", async (req, res) => {
  try {
    const data = await auroraService(
      "getEnergylogData",
      getEnergyData({
        instance: req.params.instance,
        parameter: req.params.parameter,
      }),
    );

    const saveInSQL = await saveEnergyLogData(
      data.response.host,
      data.response.instance,
      data.response.parameter,
      data.response.record,
    );

    const sqlData = await getEnergyLogData(
      req.params.instance,
      req.params.parameter,
    );

    ResHelper(res, 200, true, "Getting Energy Log Data", sqlData);
  } catch (error) {
    ResHelper(res, 500, false, error.message, null);
  }
});

/* Get Users */
router.get("/users", async (req, res) => {
  try {
    const data = await auroraService("getUser", getUsers());

    ResHelper(res, 200, true, "Getting Users", data);
  } catch (error) {
    ResHelper(res, 500, false, error.message, null);
  }
});

/* Get Groups */
router.get("/groups", async (req, res) => {
  try {
    const data = await auroraService("getGroup", getGroups());

    ResHelper(res, 200, true, "Getting Groups", data);
  } catch (error) {
    ResHelper(res, 500, false, error.message, null);
  }
});

export default router;
