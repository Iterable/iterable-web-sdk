import { IterableActionRunner } from './IterableActionRunner';
import { IterableConfig } from './IterableConfig';
import { IterableActionSource } from '../embedded/types';

describe('IterableActionRunner', () => {
  const openAction = { type: 'openUrl', data: 'https://example.com' };

  beforeEach(() => {
    IterableConfig.urlHandler = null;
    IterableConfig.customActionHandler = null;
    IterableConfig.openLinksInNewTab = true;
    jest.restoreAllMocks();
  });

  it('should return false when action is null', () => {
    const result = IterableActionRunner.executeAction(
      null,
      null,
      IterableActionSource.EMBEDDED
    );
    expect(result).toBe(false);
  });

  it('should open URL in new tab by default', () => {
    const openSpy = jest.spyOn(window, 'open').mockImplementation();

    IterableActionRunner.executeAction(
      null,
      openAction,
      IterableActionSource.EMBEDDED
    );

    expect(openSpy).toHaveBeenCalledWith('https://example.com', '_blank');
  });

  it('should open URL in same tab when openLinksInNewTab is false', () => {
    IterableConfig.openLinksInNewTab = false;
    const assignMock = jest.fn();
    Object.defineProperty(window, 'location', {
      value: { assign: assignMock },
      writable: true
    });

    IterableActionRunner.executeAction(
      null,
      openAction,
      IterableActionSource.EMBEDDED
    );

    expect(assignMock).toHaveBeenCalledWith('https://example.com');
  });

  it('should use urlHandler when configured', () => {
    const handleIterableURL = jest.fn().mockReturnValue(true);
    IterableConfig.urlHandler = { handleIterableURL };

    const result = IterableActionRunner.executeAction(
      null,
      openAction,
      IterableActionSource.EMBEDDED
    );

    expect(result).toBe(true);
    expect(handleIterableURL).toHaveBeenCalledWith(
      'https://example.com',
      expect.objectContaining({ action: openAction })
    );
  });

  it('should fall back to default open when urlHandler returns false', () => {
    const handleIterableURL = jest.fn().mockReturnValue(false);
    IterableConfig.urlHandler = { handleIterableURL };
    const openSpy = jest.spyOn(window, 'open').mockImplementation();

    IterableActionRunner.executeAction(
      null,
      openAction,
      IterableActionSource.EMBEDDED
    );

    expect(openSpy).toHaveBeenCalledWith('https://example.com', '_blank');
  });

  it('should call customActionHandler for non-URL actions', () => {
    const handleIterableCustomAction = jest.fn().mockReturnValue(true);
    IterableConfig.customActionHandler = { handleIterableCustomAction };

    const customAction = { type: 'customType', data: 'someData' };
    const result = IterableActionRunner.executeAction(
      null,
      customAction,
      IterableActionSource.EMBEDDED
    );

    expect(result).toBe(true);
    expect(handleIterableCustomAction).toHaveBeenCalled();
  });
});
