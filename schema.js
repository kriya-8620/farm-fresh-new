const Joi = require('joi');

module.exports.farmerSchema = Joi.object({
       farmer: Joi.object({
        farmer_name: Joi.string().required(),
        aadhar_no: Joi.number().integer().min(100000000000).max(999999999999).required(),  // 12-digit integer
        mobile_no: Joi.number().integer().min(1000000000).max(9999999999).required(),  // 10-digit integer
        gender: Joi.string().required(),
        district: Joi.string().required(),
        block: Joi.string().required(),
        pincode: Joi.number().integer().min(100000).max(999999).required(),  // 6-digit integer
    }).required(),
});



module.exports.cropSchema = Joi.object({
       crop: Joi.object({
        crops: Joi.string().required(),
        district: Joi.string().required(),
        location: Joi.string().required(),
        date: Joi.date().required(),
        quantity: Joi.number().required(),
        price: Joi.number().required(),
        total: Joi.number().required(),
    }).required(),
});


