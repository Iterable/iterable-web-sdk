import { FC } from 'react';
import {
  track,
  trackInAppClick,
  trackInAppClose,
  trackInAppConsume,
  trackInAppDelivery,
  trackInAppOpen
} from '@iterable/web-sdk';
import { EventsForm } from '../components/EventsForm';

interface Props {}

export const Events: FC<Props> = () => (
  <>
    <h1>Events Endpoints</h1>
    <EventsForm
      heading="/track"
      endpointName="track"
      method={track}
      needsEventName
    />
    <EventsForm
      heading="/trackInAppClick"
      endpointName="track-click"
      method={trackInAppClick}
    />
    <EventsForm
      heading="/trackInAppClose"
      endpointName="track-close"
      method={trackInAppClose}
    />
    <EventsForm
      heading="/inAppConsume"
      endpointName="track-consume"
      method={trackInAppConsume}
    />
    <EventsForm
      heading="/trackInAppDelivery"
      endpointName="track-delivery"
      method={trackInAppDelivery}
    />
    <EventsForm
      heading="/trackInAppOpen"
      endpointName="track-open"
      method={trackInAppOpen}
    />
  </>
);
