import { number, object, string } from 'yup';

export const inAppMessagesParamSchema = object().shape({
  displayInterval: number(),
  onOpenScreenReaderMessage: string(),
  onOpenNodeToTakeFocus: string(),
  count: number().required(),
  packageName: string().required()
});

export default inAppMessagesParamSchema;
