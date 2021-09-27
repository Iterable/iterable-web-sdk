import { config } from './config';

describe('Config', () => {
  it('should get config', () => {
    expect(config.getConfig('logLevel')).toBe('none');
  });

  it('should set config', () => {
    config.setConfig({ logLevel: 'verbose' });
    expect(config.getConfig('logLevel')).toBe('verbose');
  });
});
