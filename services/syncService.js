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

let isSyncRunning = false;

const BATCH_SIZE = 5;

// ==========================
// Batch Processor
// ==========================
const processInBatches = async (items, handler) => {
  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const batch = items.slice(i, i + BATCH_SIZE);

    await Promise.allSettled(batch.map((item) => handler(item)));
  }
};

// ==========================
// Sync Trend Logs
// ==========================
const syncTrendLogs = async () => {
  console.log("📥 Syncing Trend Logs...");

  const response = await auroraService("getTrendlog", getTrend());

  const trendLogs = response?.response?.trendlog || [];

  console.log(`✅ Trend Logs Found: ${trendLogs.length}`);

  await saveTrendLogs(trendLogs);

  await processInBatches(trendLogs, async (item) => {
    try {
      console.log(`↳ Trend History: ${item.instance}`);

      const trendData = await auroraService(
        "getTrendlogData",
        getTrendData({
          instance: item.instance,
        }),
      );

      await saveTrendLogData(
        trendData.response.host,
        trendData.response.instance,
        trendData.response.record || [],
      );
    } catch (err) {
      console.log(`❌ Trend ${item.instance}`);
      console.log(err.message);
    }
  });

  console.log("✅ Trend Sync Completed");
};

// ==========================
// Sync Energy Logs
// ==========================
const syncEnergyLogs = async () => {
  console.log("📥 Syncing Energy Logs...");

  const response = await auroraService("getEnergylog", getEnergy());

  const energyLogs = response?.response?.energylog || [];

  console.log(`✅ Energy Logs Found: ${energyLogs.length}`);

  await saveEnergyLogs(energyLogs);

  await processInBatches(energyLogs, async (item) => {
    try {
      console.log(`↳ Energy History: ${item.instance} (${item.parameter})`);

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
        energyData.response.record || [],
      );
    } catch (err) {
      console.log(`❌ Energy ${item.instance} (${item.parameter})`);
      console.log(err.message);
    }
  });

  console.log("✅ Energy Sync Completed");
};

// ==========================
// Run Sync
// ==========================
export const runSync = async () => {
  if (isSyncRunning) {
    console.log("⏳ Previous Sync Still Running...");
    return;
  }

  isSyncRunning = true;

  try {
    console.log("\n==============================");
    console.log("🔄 Starting SQLite Sync...");
    console.log("==============================");

    await syncTrendLogs();
    await syncEnergyLogs();

    console.log("🎉 SQLite Sync Finished");
  } catch (err) {
    console.log("❌ Sync Failed");
    console.log(err.message);
  } finally {
    isSyncRunning = false;
  }
};

// ==========================
// Auto Sync
// ==========================
const startSyncService = () => {
  console.log("🚀 Auto Sync Service Started");

  const execute = async () => {
    await runSync();

    setTimeout(execute, 10000);
  };

  execute();
};

export default startSyncService;
