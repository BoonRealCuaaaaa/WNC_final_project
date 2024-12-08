import Ajv from "ajv";

export default function (schema) {
   return function (req, res, next) {
      const ajv = new Ajv();
      const validate = ajv.compile(schema);

      if (!validate(req.body)) {
         return res.status(400).json(validate.errors);
      }

      next();
   };
}
