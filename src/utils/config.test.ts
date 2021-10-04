import { config } from './config';

describe('Config', () => {
  it('should get config', () => {
    expect(config.getConfig('logLevel')).toBe('none');
    expect(config.getConfig('baseURL')).toBe('https://api.iterable.com/api');
  });

  it('should set config', () => {
    config.setConfig({ logLevel: 'verbose', baseURL: 'https://google.com' });
    expect(config.getConfig('logLevel')).toBe('verbose');
    expect(config.getConfig('baseURL')).toBe('https://google.com');
  });
});
