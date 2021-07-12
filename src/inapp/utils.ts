export const showInAppMessagesOnInterval = (
  html: string,
  interval = 30000
): NodeJS.Timeout => {
  return setInterval(() => {
    console.log(html);
  }, interval);
};
