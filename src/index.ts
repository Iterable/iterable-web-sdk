export * from './authorization';
export * from './users';
export * from './inapp';
export * from './events';
export * from './commerce';
export * from './types';
export * from './embedded';
export * from './components/card';
export * from './components/banner';
export * from './components/notification';
export { config } from './utils/config';

export interface TextParentStyles {
  overflowWrap?: 'normal' | 'break-word' | 'initial' | 'inherit' | 'unset';
  margin?: string;
  flex?: string;
}
