import auroraService from "./auroraService.js";

import {
  getTrend,
  getTrendData,
  getEnergy,
  getEnergyData,
} from "../utils/getBody.js";

import {
  saveTrendLogs,
  saveTrendLogData,
  saveEnergyLogs,
  saveEnergyLogData,
} from "./saveDataService.js";

//    Sync Trend Logs
const syncTrendLogs = async () => {
  try {
    const response = await auroraService("getTrendlog", getTrend());

    const trendlogs = response?.response?.trendlog || [];

    await saveTrendLogs(trendlogs);

    for (const item of trendlogs) {
      try {
        const trendData = await auroraService(
          "getTrendlogData",
          getTrendData({
            instance: item.instance,
          }),
        );

        await saveTrendLogData(
          trendData.response.host,
          trendData.response.instance,
          trendData.response.record,
        );
      } catch (err) {
        console.log(`Trend History Failed: ${item.instance}`);
      }
    }

    console.log("✅ Trend Sync Completed");
  } catch (error) {
    console.log("❌ Trend Sync Failed");
    console.log(error.message);
  }
};

//    Sync Energy Logs
const syncEnergyLogs = async () => {
  try {
    const response = await auroraService("getEnergylog", getEnergy());

    const energylogs = response?.response?.energylog || [];

    await saveEnergyLogs(energylogs);

    for (const item of energylogs) {
      try {
        const energyData = await auroraService(
          "getEnergylogData",
          getEnergyData({
            instance: item.instance,
            parameter: item.parameter,
          }),
        );

        await saveEnergyLogData(
          energyData.response.host,
          energyData.response.instance,
          energyData.response.parameter,
          energyData.response.record,
        );
      } catch (err) {
        console.log(
          `Energy History Failed: ${item.instance} - ${item.parameter}`,
        );
      }
    }

    console.log("✅ Energy Sync Completed");
  } catch (error) {
    console.log("❌ Energy Sync Failed");
    console.log(error.message);
  }
};
//    Run Full Sync
export const runSync = async () => {
  console.log("🔄 Starting SQLite Sync...");

  await syncTrendLogs();
  await syncEnergyLogs();

  console.log("🎉 SQLite Sync Finished");
};

//    Auto Sync Every 5 Seconds
const startSyncService = () => {
  runSync();

  setInterval(async () => {
    await runSync();
  }, 5000);
};

export default startSyncService;
