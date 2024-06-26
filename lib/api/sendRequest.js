import "isomorphic-unfetch";
import getRootUrl from "./getRootUrl";

const ROOT_URL = getRootUrl();

export default async function sendRequest(path, options = {}) {
  const headers = {
    ...(options.headers || {}),
    "Content-type": "application/json; charset=UTF-8",
  };

  const response = await fetch(`${ROOT_URL}${path}`, {
    method: "POST",
    credentials: "include",
    ...options,
    headers,
  });

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error);
  }

  return data;
}
