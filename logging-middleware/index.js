import axios from "axios";

const ENDPOINT = "http://20.244.56.144/evaluation-service/logs";

export async function Log(appStack, logLevel, logPackage, logMessage, authToken) {
  try {
    const { data } = await axios.post(
      ENDPOINT,
      {
        stack: appStack,
        level: logLevel,
        package: logPackage,
        message: logMessage,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  } catch (err) {
    return { error: true, info: err.message };
  }
}
