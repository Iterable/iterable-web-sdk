import { array, boolean, number, object, string } from 'yup';

const userShape = object().shape({
  dataFields: object(),
  preferUserId: boolean(),
  mergeNestedObjects: boolean()
});

const itemShape = object().shape({
  id: string().required(),
  sku: string(),
  name: string().required(),
  description: string(),
  categories: array(string()),
  price: number().required(),
  quantity: number().required(),
  imageUrl: string(),
  url: string(),
  dataFields: object()
});

export const updateCartSchema = object().shape({
  user: userShape,
  items: array(itemShape).required()
});

export const trackPurchaseSchema = object().shape({
  id: string(),
  user: userShape,
  items: array(itemShape).required(),
  campaignId: string(),
  templateId: string(),
  total: number().required(),
  createdAt: number(),
  dataFields: object()
});
