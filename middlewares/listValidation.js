// server side validation for listing
const expressError=require("../utils/expressError");
const {listingSchema}=require("../schema.js")

module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errmsg = error.details.map(el => el.message).join(",");
    throw new expressError(400, errmsg);
  } else {
    next();
  }
};