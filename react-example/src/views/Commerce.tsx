import { FC, FormEvent, useState } from 'react';
import { updateCart, trackPurchase } from '@iterable/web-sdk';
import { TextField } from '../components/TextField';
import {
  StyledButton,
  EndpointWrapper,
  Form,
  Heading,
  Response
} from './Components.styled';

interface Props {}

export const Commerce: FC<Props> = () => {
  const [updateCartResponse, setUpdateCartResponse] = useState<string>(
    'Endpoint JSON goes here'
  );
  const [trackPurchaseResponse, setTrackPurchaseResponse] = useState<string>(
    'Endpoint JSON goes here'
  );

  const [cartItem, setCartItem] = useState<string>('');
  const [purchaseItem, setPurchaseItem] = useState<string>('');

  const [isUpdatingCart, setUpdatingCart] = useState<boolean>(false);
  const [isTrackingPurchase, setTrackingPurchase] = useState<boolean>(false);

  const handleUpdateCart = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdatingCart(true);
    try {
      updateCart({
        items: [{ name: cartItem, id: 'fdsafds', price: 100, quantity: 2 }]
      })
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
  };

  const handleTrackPurchase = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTrackingPurchase(true);
    try {
      trackPurchase({
        items: [{ name: purchaseItem, id: 'fdsafds', price: 100, quantity: 2 }],
        total: 200
      })
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
  };

  return (
    <>
      <h1>Commerce Endpoints</h1>
      <Heading>POST /updateCart</Heading>
      <EndpointWrapper>
        <Form onSubmit={handleUpdateCart} data-qa-cart-submit>
          <label htmlFor="item-1">Enter Item Name</label>
          <TextField
            value={cartItem}
            onChange={(e) => setCartItem(e.target.value)}
            id="item-1"
            placeholder="e.g. keyboard"
            data-qa-cart-input
          />
          <StyledButton disabled={isUpdatingCart} type="submit">
            Submit
          </StyledButton>
        </Form>
        <Response data-qa-cart-response>{updateCartResponse}</Response>
      </EndpointWrapper>
      <Heading>POST /trackPurchase</Heading>
      <EndpointWrapper>
        <Form onSubmit={handleTrackPurchase} data-qa-purchase-submit>
          <label htmlFor="item-2">Enter Item Name</label>
          <TextField
            value={purchaseItem}
            onChange={(e) => setPurchaseItem(e.target.value)}
            id="item-2"
            placeholder="e.g. keyboard"
            data-qa-purchase-input
          />
          <StyledButton disabled={isTrackingPurchase} type="submit">
            Submit
          </StyledButton>
        </Form>
        <Response data-qa-purchase-response>{trackPurchaseResponse}</Response>
      </EndpointWrapper>
    </>
  );
};
