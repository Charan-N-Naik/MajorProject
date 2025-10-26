//  used to server side validation
const Joi = require('joi');

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),          // title must be a string and required
    description: Joi.string().required(),    // description must be a string and required
    location: Joi.string().required(),       // location must be a string and required
    country: Joi.string().required(),        // country must be a string and required
    price: Joi.number().required().min(0),   // price must be a number, required, and >= 0
    image: Joi.string().allow('', null)      // image can be an empty string or null
  }).required()
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required()
  }).required()
});




