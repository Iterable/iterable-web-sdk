/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
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

interface Props {
  setConsent?: (accept: boolean) => void;
}

export const AUTTesting: FC<Props> = ({ setConsent }) => {
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

  const formAttr = { 'data-test': 'events-form' };
  const inputAttr = { 'data-test': 'events-input' };
  const responseAttr = { 'data-test': 'events-response' };

  const acceptCookie = () => setConsent(true);

  const declineCookie = () => setConsent(false);

  const renderCookieConsent = setConsent && (
    <div id="cookie-consent-container" data-test="cookie-consent">
      <h3>We value your privacy</h3>
      <p>
        We use cookies to enhance your browsing experience, serve personalized
        ads or content, and analyze our traffic. By clicking &quot;Accept&quot;,
        you consent to our use of cookies.
      </p>
      <div>
        <Button onClick={acceptCookie} data-test="accept-cookies">
          Accept
        </Button>
        <Button onClick={declineCookie} data-test="decline-cookies">
          Decline
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <h1 data-test="commerce-heading">Commerce Endpoints</h1>
      <Heading>POST /updateCart</Heading>
      <EndpointWrapper>
        <Form onSubmit={handleUpdateCart} data-test="updatecart-form">
          <label htmlFor="item-1">Enter valid JSON</label>
          <TextField
            value={cartItem}
            onChange={(e) => setCartItem(e.target.value)}
            id="item-1"
            placeholder='e.g. {"items":[{"name":"piano","id":"fdsafds"}]}'
            data-test="updatecart-input"
          />
          <Button
            disabled={isUpdatingCart}
            type="submit"
            data-test="updatecart-submit"
          >
            Submit
          </Button>
        </Form>
        <Response data-test="updatecart-response">
          {updateCartResponse}
        </Response>
      </EndpointWrapper>
      <Heading>POST /trackPurchase</Heading>
      <EndpointWrapper>
        <Form onSubmit={handleTrackPurchase} data-test="trackpurchase-form">
          <label htmlFor="item-2">Enter valid JSON</label>
          <TextField
            value={purchaseItem}
            onChange={(e) => setPurchaseItem(e.target.value)}
            id="item-2"
            placeholder='e.g. {"items":[{"id":"fdsafds","price":100}]}'
            data-test="trackpurchase-input"
          />
          <Button
            disabled={isTrackingPurchase}
            type="submit"
            data-test="trackpurchase-submit"
          >
            Submit
          </Button>
        </Form>
        <Response data-test="trackpurchase-response">
          {trackPurchaseResponse}
        </Response>
      </EndpointWrapper>
      <h1 data-test="user-heading">User Endpoint</h1>
      <Heading>POST /users/update</Heading>
      <EndpointWrapper>
        <Form onSubmit={handleUpdateUser} data-test="updateuser-form">
          <label htmlFor="item-1">Enter valid JSON here</label>
          <TextField
            value={userDataField}
            onChange={(e) => setUserDataField(e.target.value)}
            id="item-1"
            placeholder="e.g. phone_number"
            data-test="updateuser-input"
            required
          />
          <Button
            disabled={isUpdatingUser}
            type="submit"
            data-test="updateuser-submit"
          >
            Submit
          </Button>
        </Form>
        <Response data-test="updateuser-response">
          {updateUserResponse}
        </Response>
      </EndpointWrapper>
      <h1 data-test="events-heading">Events Endpoint</h1>
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
          <Button
            disabled={isTrackingEvent}
            type="submit"
            data-test="events-submit"
          >
            Submit
          </Button>
        </Form>
        <Response {...responseAttr}>{trackResponse}</Response>
      </EndpointWrapper>
      {renderCookieConsent}
    </>
  );
};

export default AUTTesting;
