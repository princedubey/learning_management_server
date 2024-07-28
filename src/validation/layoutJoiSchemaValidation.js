import Joi from 'joi';

export const layoutSchema = Joi.object({
  type: Joi.string().valid('BANNER', 'FAQ', 'CATEGORIES').required(),
  image: Joi.alternatives().conditional('type', {
    is: 'BANNER',
    then: Joi.string().uri().required(),
    otherwise: Joi.forbidden()
  }),
  title: Joi.alternatives().conditional('type', {
    is: 'BANNER',
    then: Joi.string().required(),
    otherwise: Joi.forbidden()
  }),
  sub_title: Joi.alternatives().conditional('type', {
    is: 'BANNER',
    then: Joi.string().required(),
    otherwise: Joi.forbidden()
  }),
  faq: Joi.alternatives().conditional('type', {
    is: 'FAQ',
    then: Joi.array().items(
      Joi.object({
        question: Joi.string().required(),
        answer: Joi.string().required(),
      })
    ).required(),
    otherwise: Joi.forbidden()
  }),
  categories: Joi.alternatives().conditional('type', {
    is: 'CATEGORIES',
    then: Joi.array().items(
      Joi.object({
        title: Joi.string().required(),
      })
    ).required(),
    otherwise: Joi.forbidden()
  })
});
