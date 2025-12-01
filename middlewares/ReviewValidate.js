// server side validation middleware for the review

const {listingSchema,reviewSchema}=require("../schema.js")// important think is the requering the object 
const expressError=require("../utils/expressError");
module.exports.validatereview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errmsg = error.details.map(el => el.message).join(",");
    throw new expressError(400, errmsg);
  } else {
    next();
  }
};


