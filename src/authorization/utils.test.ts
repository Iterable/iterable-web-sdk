import { getEpochDifferenceInMS, getEpochExpiryTimeInMS } from './utils';

describe('Utils', () => {
  it('should correctly decode JWT token and return exp time', () => {
    const token =
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MzA0MzI5MzYsImlhdCI6MTYzMDQyOTkzNiwiZW1haWwiOiJ3aWR0aC50ZXN0ZXJAZ21haWwuY29tIn0.v3kwvChK3zfrcHcZYG7kyuiUoMxQylLExieXRHOeK18';
    const token2 =
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MzA1MjIyNjUwMDAsImlhdCI6MTYzMDUyMTk2NTAwMCwiZW1haWwiOiJ3aWR0aC50ZXN0ZXJAZ21haWwuY29tIn0.vpVUJiXh9BEb5cELzdncUbiHEjcVdr3pH_VnSrHqLYY';
    expect(getEpochExpiryTimeInMS(token)).toBe(1630432936000);
    expect(getEpochExpiryTimeInMS(token2)).toBe(1630522265000);
    expect(getEpochExpiryTimeInMS('')).toBe(0);
    expect(getEpochExpiryTimeInMS('.')).toBe(0);
  });

  it('should correctly diff between 2 epoch times', () => {
    expect(getEpochDifferenceInMS(1630432936000, 1630516731000)).toBe(83795000);
    expect(getEpochDifferenceInMS(1630432936, 1630516731)).toBe(83795000);
  });
});
