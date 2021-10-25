/**
 * @jest-environment jsdom
 */
import MockAdapter from 'axios-mock-adapter';
import { baseAxiosRequest } from '../../request';
import {
  addButtonAttrsToAnchorTag,
  filterHiddenInAppMessages,
  paintIFrame,
  paintOverlay,
  preloadImages,
  sortInAppMessages,
  trackMessagesDelivered
} from '../utils';
import { messages } from '../../__data__/inAppMessages';
import { srSpeak } from '../../utils/srSpeak';

jest.mock('../../utils/srSpeak', () => ({
  srSpeak: jest.fn()
}));

const mockRequest = new MockAdapter(baseAxiosRequest);

const mockMarkup = `
  <div>
    <p>Hello</p>
  </div
`;

describe('Utils', () => {
  describe('Filtering', () => {
    it('should filter out read messages', () => {
      expect(filterHiddenInAppMessages()).toEqual([]);
      expect(filterHiddenInAppMessages(messages).every((e) => !e?.read)).toBe(
        true
      );
      expect(
        filterHiddenInAppMessages([
          {
            ...messages[0],
            read: true
          },
          {
            ...messages[1],
            read: true
          }
        ]).length
      ).toBe(0);
      expect(
        filterHiddenInAppMessages([
          {
            ...messages[0],
            trigger: { type: 'good' },
            read: undefined
          },
          {
            ...messages[1],
            trigger: { type: 'good' },
            read: undefined
          }
        ]).length
      ).toBe(2);
    });

    it('should filter out trigger type "never" messages', () => {
      expect(
        filterHiddenInAppMessages(messages).every((e) => !e?.trigger?.type)
      ).not.toBe('never');
      expect(
        filterHiddenInAppMessages([
          {
            ...messages[0],
            trigger: { type: 'never' }
          },
          {
            ...messages[1],
            trigger: { type: 'never' }
          }
        ]).length
      ).toBe(0);
      expect(
        filterHiddenInAppMessages([
          {
            ...messages[0],
            trigger: undefined
          },
          {
            ...messages[1],
            trigger: undefined
          }
        ]).length
      ).toBe(2);
    });

    it('should filter out messages with no HTML body', () => {
      expect(
        filterHiddenInAppMessages(messages).every((e) => !!e?.content?.html)
      ).toBe(true);
      expect(
        filterHiddenInAppMessages([
          {
            ...messages[0],
            content: { ...messages[0].content, html: '' }
          },
          {
            ...messages[1],
            content: { ...messages[0].content, html: '<p>' }
          }
        ]).length
      ).toBe(1);
      expect(
        filterHiddenInAppMessages([
          {
            ...messages[0],
            content: undefined
          },
          {
            ...messages[1],
            content: undefined
          }
        ]).length
      ).toBe(0);
    });
  });

  describe('Sorting', () => {
    it('should sort messages by priority level, lesser ones first', () => {
      expect(sortInAppMessages()).toEqual([]);
      expect(
        sortInAppMessages([
          {
            ...messages[0],
            priorityLevel: undefined,
            createdAt: 1
          },
          {
            ...messages[1],
            priorityLevel: undefined,
            createdAt: 1
          }
        ])
      ).toEqual([
        {
          ...messages[0],
          priorityLevel: undefined,
          createdAt: 1
        },
        {
          ...messages[1],
          priorityLevel: undefined,
          createdAt: 1
        }
      ]);
      expect(
        sortInAppMessages([
          {
            ...messages[0],
            priorityLevel: 1,
            createdAt: 1
          },
          {
            ...messages[1],
            priorityLevel: 3,
            createdAt: 1
          },
          {
            ...messages[2],
            priorityLevel: 2,
            createdAt: 1
          }
        ])
      ).toEqual([
        {
          ...messages[0],
          priorityLevel: 1,
          createdAt: 1
        },
        {
          ...messages[2],
          priorityLevel: 2,
          createdAt: 1
        },
        {
          ...messages[1],
          priorityLevel: 3,
          createdAt: 1
        }
      ]);
      expect(
        sortInAppMessages([
          {
            ...messages[0],
            priorityLevel: 5,
            createdAt: 1
          },
          {
            ...messages[1],
            priorityLevel: 2,
            createdAt: 1
          },
          {
            ...messages[2],
            priorityLevel: 1,
            createdAt: 1
          }
        ])
      ).toEqual([
        {
          ...messages[2],
          priorityLevel: 1,
          createdAt: 1
        },
        {
          ...messages[1],
          priorityLevel: 2,
          createdAt: 1
        },
        {
          ...messages[0],
          priorityLevel: 5,
          createdAt: 1
        }
      ]);
    });

    it('should sort messages by createdAt value, lower ones first', () => {
      expect(
        sortInAppMessages([
          {
            ...messages[0],
            priorityLevel: 1,
            createdAt: undefined
          },
          {
            ...messages[1],
            priorityLevel: 1,
            createdAt: undefined
          }
        ])
      ).toEqual([
        {
          ...messages[0],
          priorityLevel: 1,
          createdAt: undefined
        },
        {
          ...messages[1],
          priorityLevel: 1,
          createdAt: undefined
        }
      ]);
      expect(
        sortInAppMessages([
          {
            ...messages[0],
            priorityLevel: 1,
            createdAt: 5
          },
          {
            ...messages[1],
            priorityLevel: 1,
            createdAt: 1
          },
          {
            ...messages[2],
            priorityLevel: 1,
            createdAt: 10
          }
        ])
      ).toEqual([
        {
          ...messages[1],
          priorityLevel: 1,
          createdAt: 1
        },
        {
          ...messages[0],
          priorityLevel: 1,
          createdAt: 5
        },
        {
          ...messages[2],
          priorityLevel: 1,
          createdAt: 10
        }
      ]);
      expect(
        sortInAppMessages([
          {
            ...messages[0],
            priorityLevel: 1,
            createdAt: 1
          },
          {
            ...messages[1],
            priorityLevel: 1,
            createdAt: 5
          },
          {
            ...messages[2],
            priorityLevel: 1,
            createdAt: 10
          }
        ])
      ).toEqual([
        {
          ...messages[0],
          priorityLevel: 1,
          createdAt: 1
        },
        {
          ...messages[1],
          priorityLevel: 1,
          createdAt: 5
        },
        {
          ...messages[2],
          priorityLevel: 1,
          createdAt: 10
        }
      ]);
    });

    it('should sort the messages by createdAt first then priority level', () => {
      expect(
        sortInAppMessages([
          {
            ...messages[0],
            priorityLevel: 100,
            createdAt: 5
          },
          {
            ...messages[1],
            priorityLevel: 300,
            createdAt: 1
          },
          {
            ...messages[2],
            priorityLevel: 300,
            createdAt: 10
          }
        ])
      ).toEqual([
        {
          ...messages[0],
          priorityLevel: 100,
          createdAt: 5
        },
        {
          ...messages[1],
          priorityLevel: 300,
          createdAt: 1
        },
        {
          ...messages[2],
          priorityLevel: 300,
          createdAt: 10
        }
      ]);

      expect(
        sortInAppMessages([
          {
            ...messages[0],
            priorityLevel: 700,
            createdAt: 23
          },
          {
            ...messages[1],
            priorityLevel: 500,
            createdAt: 55
          },
          {
            ...messages[2],
            priorityLevel: 100,
            createdAt: 100
          }
        ])
      ).toEqual([
        {
          ...messages[2],
          priorityLevel: 100,
          createdAt: 100
        },
        {
          ...messages[1],
          priorityLevel: 500,
          createdAt: 55
        },
        {
          ...messages[0],
          priorityLevel: 700,
          createdAt: 23
        }
      ]);
    });
  });

  describe('track in app delivery', () => {
    it('should call trackInAppDelivery X times for X messages', async () => {
      mockRequest.onPost('/events/trackInAppDelivery').reply(200, {});
      await trackMessagesDelivered(
        [{ messageId: '123' }, { messageId: '234' }],
        'my-lil-website'
      );
      expect(mockRequest.history.post.length).toBe(2);
    });

    it('should not reject if 400 responses happen', async () => {
      mockRequest.onPost('/events/trackInAppDelivery').reply(400, {});

      const response = await trackMessagesDelivered(
        [{ messageId: '123' }, { messageId: '234' }],
        'my-lil-website'
      );
      expect((response as any).response.status).toBe(400);
    });
  });

  describe('DOM Manipulation', () => {
    beforeAll(() => {
      jest.useFakeTimers();
    });
    beforeEach(() => {
      jest.clearAllTimers();
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    describe('painting the iframe', () => {
      it('should paint the iframe in the center of the screen', async () => {
        const iframe = await paintIFrame(mockMarkup, 'Center', false, 'hi');
        jest.advanceTimersByTime(2000);

        /* speed up time to past the setTimeout */
        const styles = getComputedStyle(iframe);
        expect(styles.position).toBe('fixed');
        expect(styles.left).toBe('0%');
        expect(styles.right).toBe('0%');
        expect(styles.top).toBe('0%');
        expect(styles.bottom).toBe('0%');
        expect(styles.zIndex).toBe('9999');
        expect(styles.width).toBe('50%');
      });

      it('should paint the iframe in the top-right of the screen', async () => {
        const iframe = await paintIFrame(mockMarkup, 'TopRight', false, 'hi');
        jest.advanceTimersByTime(2000);

        /* speed up time to past the setTimeout */
        const styles = getComputedStyle(iframe);
        expect(styles.position).toBe('fixed');
        expect(styles.left).toBe('');
        expect(styles.right).toBe('0%');
        expect(styles.top).toBe('0%');
        expect(styles.bottom).toBe('');
        expect(styles.zIndex).toBe('9999');
        expect(styles.width).toBe('33%');
      });

      it('should paint the iframe in the bottom-right of the screen', async () => {
        const iframe = await paintIFrame(
          mockMarkup,
          'BottomRight',
          false,
          'hi'
        );
        jest.advanceTimersByTime(2000);

        /* speed up time to past the setTimeout */
        const styles = getComputedStyle(iframe);
        expect(styles.position).toBe('fixed');
        expect(styles.left).toBe('');
        expect(styles.right).toBe('0%');
        expect(styles.bottom).toBe('0%');
        expect(styles.top).toBe('');
        expect(styles.zIndex).toBe('9999');
        expect(styles.width).toBe('33%');
      });

      it('should paint the iframe full-screen', async () => {
        const iframe = await paintIFrame(mockMarkup, 'Full', false, '');
        jest.advanceTimersByTime(2000);

        /* speed up time to past the setTimeout */
        const styles = getComputedStyle(iframe);
        expect(styles.position).toBe('fixed');
        expect(styles.left).toBe('0%');
        expect(styles.right).toBe('');
        expect(styles.bottom).toBe('');
        expect(styles.top).toBe('0%');
        expect(styles.zIndex).toBe('9999');
        expect(styles.height).toBe('100%');
        expect(styles.width).toBe('100%');
      });

      it('should paint TopRight iframes with custom offsets', async () => {
        const iframe = await paintIFrame(
          mockMarkup,
          'TopRight',
          false,
          '',
          '10px',
          '10px',
          '10px'
        );
        jest.advanceTimersByTime(2000);

        /* speed up time to past the setTimeout */
        const styles = getComputedStyle(iframe);
        expect(styles.position).toBe('fixed');
        expect(styles.left).toBe('');
        expect(styles.right).toBe('10px');
        expect(styles.bottom).toBe('');
        expect(styles.top).toBe('10px');
        expect(styles.zIndex).toBe('9999');
        expect(styles.width).toBe('33%');
      });

      it('should paint BottomRight iframes with custom offsets', async () => {
        const iframe = await paintIFrame(
          mockMarkup,
          'BottomRight',
          false,
          '',
          '10px',
          '10px',
          '10px'
        );
        jest.advanceTimersByTime(2000);

        /* speed up time to past the setTimeout */
        const styles = getComputedStyle(iframe);
        expect(styles.position).toBe('fixed');
        expect(styles.left).toBe('');
        expect(styles.right).toBe('10px');
        expect(styles.bottom).toBe('10px');
        expect(styles.top).toBe('');
        expect(styles.zIndex).toBe('9999');
        expect(styles.width).toBe('33%');
      });

      it('should call srSpeak if screen reader text passed', async () => {
        await paintIFrame(mockMarkup, 'Center', false, 'hi');

        expect((srSpeak as any).mock.calls.length).toBe(1);
      });

      it('should not call srSpeak if no screen reader text passed', async () => {
        await paintIFrame(mockMarkup, 'Center', false);

        expect((srSpeak as any).mock.calls.length).toBe(0);
      });

      describe('iframe on mobile sizes', () => {
        beforeAll(() => {
          Object.defineProperty(global, 'matchMedia', {
            value: (query: string) => ({
              matches: false,
              media: query,
              onchange: null,
              addListener: jest.fn(), // Deprecated
              removeListener: jest.fn(), // Deprecated
              addEventListener: jest.fn(),
              removeEventListener: jest.fn(),
              dispatchEvent: jest.fn()
            })
          });
        });

        it('should have correct width for centered-modal', async () => {
          const iframe = await paintIFrame(mockMarkup, 'Center', false, 'hi');
          jest.advanceTimersByTime(2000);

          /* speed up time to past the setTimeout */
          const styles = getComputedStyle(iframe);
          expect(styles.width).toBe('100%');
        });

        it('should have correct width for bottom-right modal', async () => {
          const iframe = await paintIFrame(mockMarkup, 'Center', false, 'hi');
          jest.advanceTimersByTime(2000);

          /* speed up time to past the setTimeout */
          const styles = getComputedStyle(iframe);
          expect(styles.width).toBe('100%');
        });

        it('should have correct width for top-right modal', async () => {
          const iframe = await paintIFrame(mockMarkup, 'Center', false, 'hi');
          jest.advanceTimersByTime(2000);

          /* speed up time to past the setTimeout */
          const styles = getComputedStyle(iframe);
          expect(styles.width).toBe('100%');
        });
      });
    });

    it('should add button attrs to element', () => {
      const el = document.createElement('div');
      addButtonAttrsToAnchorTag(el, 'hello');

      expect(el.getAttribute('aria-label')).toBe('hello');
      expect(el.getAttribute('role')).toBe('button');
      expect(el.getAttribute('href')).toBe('javascript:undefined');
    });

    it('should paint an overlay', () => {
      const overlay = paintOverlay('#222', 0.8);

      expect(overlay.tagName).toBe('DIV');
    });
  });

  describe('preloading images', () => {
    it('should instantly callback with no images provided', () => {
      const mockFn = jest.fn();

      preloadImages([], mockFn);

      expect(mockFn.mock.calls.length).toBe(1);
    });

    describe('image loading and error callbacks', () => {
      let mockOnLoad: any;
      let mockOnError: any;
      beforeAll(() => {
        Object.defineProperty(global.Image.prototype, 'onload', {
          get() {
            return this._onload;
          },
          set(onload: any) {
            mockOnLoad = onload;
            this._onload = onload;
          }
        });

        Object.defineProperty(global.Image.prototype, 'onerror', {
          get() {
            return this.onerror;
          },
          set(onerror: any) {
            mockOnError = onerror;
            this._onerror = onerror;
          }
        });
      });

      it('should not invoke callback if not all images are finished loading', () => {
        const mockCallback = jest.fn();
        preloadImages(
          ['htts://something.com/image.png', 'htts://something.com/image.jpg'],
          mockCallback
        );

        mockOnLoad();

        expect(mockCallback.mock.calls.length).toBe(0);
      });

      it('should not invoke callback if only some error', () => {
        const mockCallback = jest.fn();
        preloadImages(
          ['htts://something.com/image.png', 'htts://something.com/image.jpg'],
          mockCallback
        );

        mockOnError();

        expect(mockCallback.mock.calls.length).toBe(0);
      });

      it('should invoke callback if all images load', () => {
        const mockCallback = jest.fn();
        preloadImages(
          ['htts://something.com/image.png', 'htts://something.com/image.jpg'],
          mockCallback
        );

        mockOnLoad();
        mockOnLoad();

        expect(mockCallback.mock.calls.length).toBe(1);
      });

      it('should invoke callback if not all images error out', () => {
        const mockCallback = jest.fn();
        preloadImages(
          ['htts://something.com/image.png', 'htts://something.com/image.jpg'],
          mockCallback
        );

        mockOnError();
        mockOnError();

        expect(mockCallback.mock.calls.length).toBe(1);
      });

      it('should invoke callback if half error, half load', () => {
        const mockCallback = jest.fn();
        preloadImages(
          ['htts://something.com/image.png', 'htts://something.com/image.jpg'],
          mockCallback
        );

        mockOnError();
        mockOnLoad();

        expect(mockCallback.mock.calls.length).toBe(1);
      });
    });
  });
});
