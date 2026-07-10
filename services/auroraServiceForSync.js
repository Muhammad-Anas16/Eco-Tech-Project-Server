import axios from "axios";
import { toJson } from "../utils/toJson.js";

const auroraServiceForSync = async (action, body) => {
  try {
    console.log(`➡️ Aurora Request: ${action}`);

    const response = await axios.post(
      `${process.env.BASE_URL}/AuroraAPI.xml?${action}`,
      body,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        timeout: 10000, // 10 seconds
      },
    );

    console.log(`✅ Aurora Response: ${action}`);

    return await toJson(response.data);
  } catch (error) {
    console.log(`❌ Aurora Error: ${action}`);

    if (error.code === "ECONNABORTED") {
      console.log("Request Timeout");
    } else {
      console.log(error.message);
    }

    throw error;
  }
};

export default auroraServiceForSync;
