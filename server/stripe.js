const Stripe = require("stripe");
const lodash = require("lodash");

const Book = require("./models/Book");
const User = require("./models/User");
const getRootURL = require("../lib/api/getRootUrl");
const logger = require("./logger");

const dev = process.env.NODE_ENV !== "production";
const API_KEY = dev
  ? process.env.STRIPE_TEST_SECRETKEY
  : process.env.STRIPE_LIVE_SECRETKEY;

const ROOT_URL = getRootURL;

const stripeInstance = new Stripe(API_KEY, { apiVersion: "2020-03-02" });

function stripeCheckoutCallback({ server }) {
  server.get("/stripe/checkout-completed/:sessionId", async (req, res) => {
    const { sessionId } = req.params;
    const session = await retrieveSession({ sessionId });

    try {
      if (
        !session ||
        !session.metadata ||
        !session.metadata.userId ||
        !session.metadata.bookId ||
        !session.metadata.redirectUrl
      ) {
        throw new Error("Wrong session.");
      }

      const user = await User.findById(
        session.metadata.userId,
        "_id email purchasedBookIds freeBookIds"
      ).lean();
      if (!user) {
        throw new Error("User not found.");
      }

      const book = await Book.findOne(
        { _id: session.metadata.bookId },
        "name slug price"
      ).lean();
      if (!book) {
        throw new Error("Book not found.");
      }

      if (session.mode === "payment") {
        await Book.buy({
          book,
          user,
          stripeCharge: lodash.get(session, "payment_intent.charges.data.0"),
        });
      } else {
        throw new Error("Wrong session mode.");
      }

      res.redirect(`${ROOT_URL}${session.metadata.redirectUrl}`);
    } catch (err) {
      console.error(err);
      res.redirect(
        `${ROOT_URL}${session.metadata.redirectUrl}?error=${err.message || err.toString()}`
      );
    }
  });
}

function retrieveSession({ sessionId }) {
  return stripeInstance.checkout.sessions.retrieve(sessionId, {
    expand: ["payment_intent", "payment_intent.payment_method"],
  });
}

function createSession({ userId, bookId, bookSlug, userEmail, redirectUrl }) {
  logger.debug(
    "stripe createSession",
    userId,
    bookId,
    bookSlug,
    userEmail,
    redirectUrl
  );

  return stripeInstance.checkout.sessions.create({
    customer_email: userEmail,
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [{ price: getBookPriceId(bookSlug), quantity: 1 }],
    success_url: `${ROOT_URL}/stripe/checkout-completed/{CHECKOUT_SESSION_ID}`,
    cancel_url: `${ROOT_URL}${redirectUrl}?checkout_canceled=1`,
    metadata: { userId, bookId, redirectUrl },
  });
}

function getBookPriceId(bookSlug) {
  let priceId;

  if (bookSlug === "book-a") {
    priceId = dev
      ? process.env.STRIPE_TEST_DEMO_BOOK_PRICE_ID
      : process.env.STRIPE_LIVE_DEMO_BOOK_PRICE_ID;
  } else if (bookSlug === "second-book") {
    priceId = dev
      ? process.env.STRIPE_TEST_SECOND_BOOK_PRICE_ID
      : process.env.STRIPE_LIVE_SECOND_BOOK_PRICE_ID;
  } else {
    throw new Error("Wrong book");
  }

  return priceId;
}

exports.stripeCheckoutCallback = stripeCheckoutCallback;
exports.createSession = createSession;
