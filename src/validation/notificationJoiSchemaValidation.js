import Joi from 'joi';
import JoiObjectId from 'joi-objectid';

Joi.objectId = JoiObjectId(Joi);
// Schema for updating a notification
export const updateNotificationSchema = Joi.object({
  notification_id: Joi.objectId().required(),
  is_read: Joi.boolean().required()
});
