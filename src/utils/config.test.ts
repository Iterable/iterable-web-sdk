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

  describe('enableUnknownActivation deprecation alias', () => {
    let warnSpy: jest.SpyInstance;

    beforeEach(() => {
      warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
      config.setConfig({ enableUnknownUserActivation: false });
    });

    afterEach(() => {
      warnSpy.mockRestore();
    });

    it('forwards legacy enableUnknownActivation to enableUnknownUserActivation', () => {
      config.setConfig({ enableUnknownActivation: true });
      expect(config.getConfig('enableUnknownUserActivation')).toBe(true);
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('enableUnknownActivation')
      );
    });

    it('prefers enableUnknownUserActivation when both are supplied', () => {
      config.setConfig({
        enableUnknownActivation: false,
        enableUnknownUserActivation: true
      });
      expect(config.getConfig('enableUnknownUserActivation')).toBe(true);
      expect(warnSpy).not.toHaveBeenCalled();
    });
  });
});
