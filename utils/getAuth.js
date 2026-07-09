import crypto from "crypto";

const getAuth = () => {
  return crypto
    .createHash("md5")
    .update(process.env.BASE_PASSWORD)
    .digest("hex");
};

export { getAuth };
