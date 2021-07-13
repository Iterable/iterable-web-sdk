import { InAppMessage } from './types';

export const filterHiddenInAppMessages = (
  messages: Partial<InAppMessage>[] = []
) => {
  return messages.filter((eachMessage) => {
    return (
      !eachMessage.read &&
      eachMessage.trigger?.type !== 'never' &&
      !!eachMessage.content?.html
    );
  });
};

export const sortInAppMessages = (messages: Partial<InAppMessage>[] = []) => {
  return messages
    .sort((a, b) => {
      /* sort by priority level */
      if ((a.priorityLevel || 0) > (b.priorityLevel || 0)) {
        return -1;
      }
      if ((a.priorityLevel || 0) < (b.priorityLevel || 0)) {
        return 1;
      }
      return 0;
    })
    .sort((a, b) => {
      /* then by createdAt timestamp */
      if ((a.createdAt || 0) < (b.createdAt || 0)) {
        return -1;
      }
      if ((a.createdAt || 0) > (b.createdAt || 0)) {
        return 1;
      }
      return 0;
    });
};
