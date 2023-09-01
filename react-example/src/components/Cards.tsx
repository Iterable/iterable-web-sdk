import { FC } from 'react';
import { Card } from '@iterable/web-sdk';

export const Cards = () => {
  return (
    <Card
      text="Hello World!"
      title="Random Card"
      imgSrc="https://www.google.com/images/branding/googlelogo/1x/googlelogo_dark_color_272x92dp.png"
    />
  );
};

export default Cards;
