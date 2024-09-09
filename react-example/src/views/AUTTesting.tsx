/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, FormEvent, useState } from 'react';
import {
  updateCart,
  trackPurchase,
  UpdateCartRequestParams,
  TrackPurchaseRequestParams,
  updateUser,
  UpdateUserParams,
  track,
  InAppTrackRequestParams
} from '@iterable/web-sdk';
import { TextField } from '../components/TextField';
import {
  Button,
  EndpointWrapper,
  Form,
  Heading,
  Response
} from './Components.styled';

interface Props {}

export const AUTTesting: FC<Props> = () => {
  const [updateCartResponse, setUpdateCartResponse] = useState<string>(
    'Endpoint JSON goes here'
  );
  const [trackPurchaseResponse, setTrackPurchaseResponse] = useState<string>(
    'Endpoint JSON goes here'
  );

  const [cartItem, setCartItem] = useState<string>(
    '{"items":[{"name":"piano","id":"fdsafds","price":100,"quantity":2}, {"name":"piano2","id":"fdsafds2","price":100,"quantity":5}]}'
  );

  const [purchaseItem, setPurchaseItem] = useState<string>(
    '{"items":[{"name":"Black Coffee","id":"fdsafds","price":100,"quantity":2}], "total": 100}'
  );

  const [isUpdatingCart, setUpdatingCart] = useState<boolean>(false);
  const [isTrackingPurchase, setTrackingPurchase] = useState<boolean>(false);
  const [userDataField, setUserDataField] = useState<string>(
    ' { "dataFields": {"email": "user@example.com","furniture": [{"furnitureType": "Sofa","furnitureColor": "White","lengthInches": 40,"widthInches": 60},{"furnitureType": "Sofa","furnitureColor": "Gray","lengthInches": 20,"widthInches": 30}] }}'
  );
  const [isUpdatingUser, setUpdatingUser] = useState<boolean>(false);
  const [updateUserResponse, setUpdateUserResponse] = useState<string>(
    'Endpoint JSON goes here'
  );

  const [trackResponse, setTrackResponse] = useState<string>(
    'Endpoint JSON goes here'
  );

  const eventInput =
    '{"eventName":"button-clicked", "dataFields": {"browserVisit.website.domain":"https://mybrand.com/socks"}}';
  const [trackEvent, setTrackEvent] = useState<string>(eventInput);
  const [isTrackingEvent, setTrackingEvent] = useState<boolean>(false);

  const handleParseJson = (isUpdateCartCalled: boolean) => {
    try {
      // Parse JSON and assert its type
      if (isUpdateCartCalled) {
        const parsedObject = JSON.parse(cartItem) as UpdateCartRequestParams;
        return parsedObject;
      }
      const parsedObject = JSON.parse(
        purchaseItem
      ) as TrackPurchaseRequestParams;
      return parsedObject;
    } catch (error) {
      if (isUpdateCartCalled) {
        setUpdateCartResponse(JSON.stringify(error.message));
      } else setTrackPurchaseResponse(JSON.stringify(error.message));
      return error;
    }
  };

  const handleParseUserJson = () => {
    try {
      // Parse JSON and assert its type
      return JSON.parse(userDataField) as UpdateUserParams;
    } catch (error) {
      setUpdateUserResponse(JSON.stringify(error.message));
      return error;
    }
  };

  const handleUpdateCart = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const jsonObj: UpdateCartRequestParams = handleParseJson(true);
    if (jsonObj) {
      setUpdatingCart(true);
      try {
        updateCart(jsonObj)
          .then((response: any) => {
            setUpdateCartResponse(JSON.stringify(response.data));
            setUpdatingCart(false);
          })
          .catch((e: any) => {
            setUpdateCartResponse(JSON.stringify(e));
            setUpdatingCart(false);
          });
      } catch (error) {
        setUpdateCartResponse(JSON.stringify(error.message));
        setUpdatingCart(false);
      }
    }
  };

  const handleTrackPurchase = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const jsonObj: TrackPurchaseRequestParams = handleParseJson(false);
    if (jsonObj) {
      setTrackingPurchase(true);
      try {
        trackPurchase(jsonObj)
          .then((response: any) => {
            setTrackingPurchase(false);
            setTrackPurchaseResponse(JSON.stringify(response.data));
          })
          .catch((e: any) => {
            setTrackingPurchase(false);
            setTrackPurchaseResponse(JSON.stringify(e));
          });
      } catch (error) {
        setTrackingPurchase(false);
        setTrackPurchaseResponse(JSON.stringify(error.message));
      }
    }
  };

  const handleUpdateUser = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const jsonObj = handleParseUserJson();
    if (jsonObj) {
      setUpdatingUser(true);
      try {
        updateUser(jsonObj)
          .then((response: any) => {
            setUpdateUserResponse(JSON.stringify(response.data));
            setUpdatingUser(false);
          })
          .catch((e: any) => {
            setUpdateUserResponse(JSON.stringify(e));
            setUpdatingUser(false);
          });
      } catch (error) {
        setUpdateUserResponse(JSON.stringify(error.message));
        setUpdatingUser(false);
      }
    }
  };

  const handleParseTrackJson = () => {
    try {
      // Parse JSON and assert its type
      const parsedObject = JSON.parse(trackEvent) as InAppTrackRequestParams;
      return parsedObject;
    } catch (error) {
      setTrackResponse(JSON.stringify(error.message));
      return error;
    }
  };

  const handleTrack = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTrackingEvent(true);

    const jsonObj = handleParseTrackJson();
    if (jsonObj) {
      const conditionalParams = jsonObj;

      try {
        track({
          ...conditionalParams,
          deviceInfo: {
            appPackageName: 'my-website'
          }
        })
          .then((response: any) => {
            setTrackResponse(JSON.stringify(response.data));
            setTrackingEvent(false);
          })
          .catch((e: any) => {
            if (e && e.response && e.response.data) {
              setTrackResponse(JSON.stringify(e.response.data));
            } else {
              setTrackResponse(JSON.stringify(e));
            }
            setTrackingEvent(false);
          });
      } catch (error) {
        setTrackResponse(JSON.stringify(error.message));
        setTrackingEvent(false);
      }
    }
  };

  const formAttr = { 'data-qa-track-submit': true };
  const inputAttr = { 'data-qa-track-input': true };
  const responseAttr = { 'data-qa-track-response': true };

  return (
    <>
      <h1>Commerce Endpoints</h1>
      <Heading>POST /updateCart</Heading>
      <EndpointWrapper>
        <Form onSubmit={handleUpdateCart} data-qa-cart-submit>
          <label htmlFor="item-1">Enter valid JSON</label>
          <TextField
            value={cartItem}
            onChange={(e) => setCartItem(e.target.value)}
            id="item-1"
            placeholder='e.g. {"items":[{"name":"piano","id":"fdsafds"}]}'
            data-qa-cart-input
          />
          <Button disabled={isUpdatingCart} type="submit">
            Submit
          </Button>
        </Form>
        <Response data-qa-cart-response>{updateCartResponse}</Response>
      </EndpointWrapper>
      <Heading>POST /trackPurchase</Heading>
      <EndpointWrapper>
        <Form onSubmit={handleTrackPurchase} data-qa-purchase-submit>
          <label htmlFor="item-2">Enter valid JSON</label>
          <TextField
            value={purchaseItem}
            onChange={(e) => setPurchaseItem(e.target.value)}
            id="item-2"
            placeholder='e.g. {"items":[{"id":"fdsafds","price":100}]}'
            data-qa-purchase-input
          />
          <Button disabled={isTrackingPurchase} type="submit">
            Submit
          </Button>
        </Form>
        <Response data-qa-purchase-response>{trackPurchaseResponse}</Response>
      </EndpointWrapper>
      <h1>User Endpoint</h1>
      <Heading>POST /users/update</Heading>
      <EndpointWrapper>
        <Form onSubmit={handleUpdateUser} data-qa-update-user-submit>
          <label htmlFor="item-1">Enter valid JSON here</label>
          <TextField
            value={userDataField}
            onChange={(e) => setUserDataField(e.target.value)}
            id="item-1"
            placeholder="e.g. phone_number"
            data-qa-update-user-input
            required
          />
          <Button disabled={isUpdatingUser} type="submit">
            Submit
          </Button>
        </Form>
        <Response data-qa-update-user-response>{updateUserResponse}</Response>
      </EndpointWrapper>
      <h1>Events Endpoint</h1>
      <Heading>POST /track</Heading>
      <EndpointWrapper>
        <Form onSubmit={handleTrack} {...formAttr}>
          <label htmlFor="item-1">{'Enter valid JSON'}</label>
          <TextField
            value={trackEvent}
            onChange={(e) => setTrackEvent(e.target.value)}
            id="item-1"
            placeholder='e.g. {"eventName":"button-clicked"}'
            {...inputAttr}
          />
          <Button disabled={isTrackingEvent} type="submit">
            Submit
          </Button>
        </Form>
        <Response {...responseAttr}>{trackResponse}</Response>
      </EndpointWrapper>
    </>
  );
};

export default AUTTesting;
