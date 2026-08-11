const express = require("express");
const router = express.Router({ mergeParams: true });
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder");
const Listing = require("../model/listing");
const Booking = require("../model/booking");
const { isloggedin } = require("../middlewares/islogedin");
const wrapAsyc = require("../utils/wrapAsyc");

// 1. Create Stripe Checkout Session
router.post("/checkout", isloggedin, wrapAsyc(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listing");
  }

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [{
      price_data: {
        currency: "inr",
        product_data: {
          name: listing.title,
          description: listing.description ? listing.description.substring(0, 100) : "Property Booking",
          images: [listing.image.url],
        },
        unit_amount: listing.price * 100, // Stripe expects paise for INR
      },
      quantity: 1,
    }],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/listing/${id}?payment=success`,
    cancel_url: `${req.protocol}://${req.get("host")}/listing/${id}?payment=failed`,
    metadata: {
      listingId: id,
      userId: req.user._id.toString()
    }
  });

  res.redirect(303, session.url);
}));

module.exports = router;
