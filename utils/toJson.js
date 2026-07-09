import xml2js from "xml2js";

const toJson = (data) =>
  xml2js.parseStringPromise(data, {
    explicitArray: false,
  });

export { toJson };
