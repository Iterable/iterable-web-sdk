import { Banner } from '@iterable/web-sdk';

export const BannerView = () => {
  return (
    <Banner
      body="Hello World!"
      buttonText="OK"
      heading="A banner view interface"
      logo="https://www.google.com/images/branding/googlelogo/1x/googlelogo_dark_color_272x92dp.png"
    />
  );
};

export default BannerView;
