import { InAppMessage } from './types';
import { WebInAppDisplaySettings } from "./";
export declare const addStyleSheeet: (doc: Document, style: string) => void;
export declare const preloadImages: (imageLinks: string[], callback: () => void) => void;
export declare const filterHiddenInAppMessages: (messages?: Partial<InAppMessage>[]) => Partial<InAppMessage>[];
export declare const sortInAppMessages: (messages?: Partial<InAppMessage>[]) => Partial<InAppMessage>[];
export declare const generateLayoutCSS: (baseCSSText: string, position: WebInAppDisplaySettings['position']) => string;
/**
 *
 * @param html html you want to paint to the DOM inside the iframe
 * @param callback method to run after HTML has been written to iframe
 * @param srMessage The message you want the screen reader to read when popping up the message
 * @returns { HTMLIFrameElement }
 */
export declare const paintIFrame: (html: string, position: WebInAppDisplaySettings['position'], shouldAnimate?: boolean | undefined, srMessage?: string | undefined) => Promise<HTMLIFrameElement>;
export declare const addButtonAttrsToAnchorTag: (node: Element, ariaLabel: string) => void;
export declare const trackMessagesDelivered: (messages: Partial<InAppMessage>[] | undefined, packageName: string) => Promise<any>;
export declare const paintOverlay: (color?: string, opacity?: number, shouldAnimate?: boolean) => HTMLDivElement;
