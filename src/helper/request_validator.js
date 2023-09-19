const { badReqResponse } = require('../helper/response_utility');

async function validateRequest(req, res, next, schema, type = "body") {
  const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true, // remove unknown props
  };
  try {
    switch (type) {
      case "query":
        value = await schema.validateAsync(req.query, options);
        break;
      case "param":
        value = await schema.validateAsync(req.params, options);
        break;
      default:
        value = await schema.validateAsync(req.body, options);
        break;

    }
    next();
  } catch (err) {
    console.error('>>>', err);
    return badReqResponse(req, res, err.message);
  }
}

module.exports = { validateRequest };
