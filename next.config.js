require("dotenv").config();

module.exports = {
  poweredByHeader: false,
  webpack5: true,
  env: {
    NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLEKEY:
      process.env.NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLEKEY,
    NEXT_PUBLIC_STRIPE_LIVE_PUBLISHABLEKEY:
      process.env.NEXT_PUBLIC_STRIPE_LIVE_PUBLISHABLEKEY,
  },
};
