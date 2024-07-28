import Joi from 'joi';
import JoiObjectId from 'joi-objectid';

Joi.objectId = JoiObjectId(Joi);

export const createOrderSchema = Joi.object({
  course_id: Joi.objectId().required(),
  payment_info: Joi.string().required()
});
