const fetch = require("node-fetch");
const logger = require("./logger");

require("dotenv").config();

const LIST_IDS = {
  signedup: process.env.MAILCHIMP_SIGNEDUP_LIST_ID,
  purchased: process.env.MAILCHIMP_PURCHASED_LIST_ID,
};

function callAPI({ path, method, data }) {
  const ROOT_URI = `https://${process.env.MAILCHIMP_REGION}.api.mailchimp.com/3.0`;

  return fetch(`${ROOT_URI}${path}`, {
    method,
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${Buffer.from(
        `apikey:${process.env.MAILCHIMP_API_KEY}`
      ).toString("base64")}`,
    },
    body: JSON.stringify(data),
  });
}

async function addToMailchimp({ email, listName }) {
  const data = {
    // eslint-disable-next-line
    email_address: email,
    status: "subscribed",
  };

  const path = `/lists/${LIST_IDS[listName]}/members/`;
  logger.info("---addToMailchimp---", email);
  await callAPI({ path, method: "POST", data });
}

exports.addToMailchimp = addToMailchimp;
