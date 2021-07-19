/**
 * @jest-environment jsdom
 */
import {
  addButtonAttrsToAnchorTag,
  filterHiddenInAppMessages,
  sortInAppMessages,
  trackMessagesDelivered
} from './utils';
import { trackInAppDelivery } from '../events';
import { messages } from '../__data__/inAppMessages';

jest.mock('../events', () => ({
  trackInAppDelivery: jest.fn().mockReturnValue(null)
}));

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
            read: undefined
          },
          {
            ...messages[1],
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
      trackMessagesDelivered([{ messageId: '123' }, { messageId: '234' }]);
      expect((trackInAppDelivery as any).mock.calls.length).toBe(2);
    });
  });

  describe('DOM Manipulation', () => {
    it('should add button attrs to element', () => {
      const el = document.createElement('div');
      addButtonAttrsToAnchorTag(el, 'hello');

      expect(el.getAttribute('aria-label')).toBe('hello');
      expect(el.getAttribute('role')).toBe('button');
      expect(el.getAttribute('href')).toBe('javascript:undefined');
    });
  });
});
