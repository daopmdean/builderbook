import sendRequest from "./sendRequest";

const BASE_PATH = "/api/v1/admin";

export const getBookListApiMethod = () => {
  return sendRequest(`${BASE_PATH}/books`, { method: "GET" });
};
