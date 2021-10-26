import sanitize from 'sanitize-html';
import { ALLOWED_HTML_ATTRIBUTES, ALLOWED_HTML_TAGS } from '../../constants';

export const sanitizeHTML = (text: string) =>
  sanitize(text, {
    allowedTags: ALLOWED_HTML_TAGS,
    allowVulnerableTags: true,
    allowedAttributes: {
      '*': ALLOWED_HTML_ATTRIBUTES
    },
    allowedSchemes: [
      'http',
      'https',
      'ftp',
      'mailto',
      'itbl',
      'iterable',
      'action'
    ],
    disallowedTagsMode: 'escape'
  }).trim();

export default sanitizeHTML;
