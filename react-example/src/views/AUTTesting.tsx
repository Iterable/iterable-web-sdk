import { FC, FormEvent, useState } from 'react';
import TextField from 'src/components/TextField';
import {
  Button,
  EndpointWrapper,
  Form,
  Heading,
  Response
} from './Components.styled';

import {
  updateCart,
  trackPurchase,
  UpdateCartRequestParams,
  TrackPurchaseRequestParams,
  updateUser,
  UpdateUserParams,
  track
} from '@iterable/web-sdk';
import EventsForm from 'src/components/EventsForm';

interface Props {}

export const AUTTesting: FC<Props> = () => {
  const [updateCartResponse, setUpdateCartResponse] = useState<string>(
    'Endpoint JSON goes here'
  );
  const [trackPurchaseResponse, setTrackPurchaseResponse] = useState<string>(
    'Endpoint JSON goes here'
  );

  const [cartItem, setCartItem] = useState<string>(
    '{"items":[{"name":"piano","id":"fdsafds","price":100,"quantity":2}]}'
  );

  const [purchaseItem, setPurchaseItem] = useState<string>(
    '{"items":[{"name":"Black Coffee","id":"fdsafds","price":100,"quantity":2}], "total": 100}'
  );

  const [isUpdatingCart, setUpdatingCart] = useState<boolean>(false);
  const [isTrackingPurchase, setTrackingPurchase] = useState<boolean>(false);
  const [userDataField, setUserDataField] = useState<string>('');
  const [isUpdatingUser, setUpdatingUser] = useState<boolean>(false);
  const [updateUserResponse, setUpdateUserResponse] = useState<string>(
    'Endpoint JSON goes here'
  );
  const handleParseJson = (isUpdateCartCalled: boolean) => {
    try {
      // Parse JSON and assert its type
      // {"items":[{"name":"piano","id":"fdsafds","price":100,"quantity":2}]}
      if (isUpdateCartCalled) {
        const parsedObject = JSON.parse(cartItem) as UpdateCartRequestParams;
        return parsedObject;
      } else {
        const parsedObject = JSON.parse(
          purchaseItem
        ) as TrackPurchaseRequestParams;
        return parsedObject;
      }
    } catch (error) {
      if (isUpdateCartCalled)
        setUpdateCartResponse(JSON.stringify(error.message));
      else setTrackPurchaseResponse(JSON.stringify(error.message));
    }
  };

  const handleParseUserJson = () => {
    try {
      // Parse JSON and assert its type
      return JSON.parse(userDataField) as UpdateUserParams;
    } catch (error) {
      setUpdateUserResponse(JSON.stringify(error.message));
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
            setUpdateCartResponse(JSON.stringify(e.response.data));
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
    const jsonObj = handleParseJson(false);
    if (jsonObj) {
      setTrackingPurchase(true);
      try {
        trackPurchase({ ...jsonObj, total: 20 })
          .then((response: any) => {
            setTrackingPurchase(false);
            setTrackPurchaseResponse(JSON.stringify(response.data));
          })
          .catch((e: any) => {
            setTrackingPurchase(false);
            setTrackPurchaseResponse(JSON.stringify(e.response.data));
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
            setUpdateUserResponse(JSON.stringify(e.response.data));
            setUpdatingUser(false);
          });
      } catch (error) {
        setUpdateUserResponse(JSON.stringify(error.message));
        setUpdatingUser(false);
      }
    }
  };

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
      <EventsForm heading="/track" endpointName="track" method={track} isAUT />
    </>
  );
};

export default AUTTesting;
