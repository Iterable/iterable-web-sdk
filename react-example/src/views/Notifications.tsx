import { Notification } from '@iterable/web-sdk';

export const Notifications = () => {
  return (
    <Notification
      title="Notification Title"
      description="A demo notification here"
      primaryButtonLabel="OK"
      secondaryButtonLabel="Cancel"
      onClickPrimaryBtn={() => {
        console.log('primary btn clicked!');
      }}
      onClickSecondaryBtn={() => {
        console.log('secondary btn clicked!');
      }}
    />
  );
};

export default Notifications;
