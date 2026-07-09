import axios from "axios";
import { toJson } from "../utils/toJson.js";

const auroraService = async (action, body) => {
  try {
    const response = await axios.post(
      `${process.env.BASE_URL}/AuroraAPI.xml?${action}`,
      body,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    return await toJson(response.data);
  } catch (error) {
    throw error;
  }
};

export default auroraService;
