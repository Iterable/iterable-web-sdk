/* number of MS to wait between in-app messages to show the next one */
export const DISPLAY_INTERVAL_DEFAULT = 30000;

/* how many times we try to create a new user when _setUserID_ is invoked */
export const RETRY_USER_ATTEMPTS = 0;

export const BASE_URL = process.env.BASE_URL || 'https://api.iterable.com/api';

/* 
  API payload _platform_ param which is send up automatically 
  with tracking and getMessage requests 
*/
export const WEB_PLATFORM = 'Web';

/* how long animations fade/side in for. */
export const ANIMATION_DURATION = 400;

export const ANIMATION_STYLESHEET = `
  @keyframes fadein {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @-moz-keyframes fadein {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @-webkit-keyframes fadein {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @-ms-keyframes fadein {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slidein {
    100% { transform: translateX(0%) }
  }

  @-moz-keyframes slidein {
    100% { -moz-transform: translateX(0%) }
  }

  @-webkit-keyframes slidein {
    100% { -webkit-transform: translateX(0%) }
  }

  @-ms-keyframes slidein {
    100% { -ms-transform: translateX(0%) }
  }

  @keyframes slideout {
    0% { transform: translateX(0%) }
    100% { transform: translateX(150%) }
  }

  @-moz-keyframes slideout {
    0% { transform: translateX(0%) }
    100% { -moz-transform: translateX(150%) }
  }

  @-webkit-keyframes slideout {
    0% { transform: translateX(0%) }
    100% { -webkit-transform: translateX(150%) }
  }

  @-ms-keyframes slideout {
    0% { transform: translateX(0%) }
    100% { -ms-transform: translateX(150%) }
  }

  .slide-in {
    -webkit-animation: slidein ${ANIMATION_DURATION}ms forwards;
    -moz-animation: slidein ${ANIMATION_DURATION}ms forwards;
    -ms-animation: slidein ${ANIMATION_DURATION}ms forwards;
    -o-animation: slidein ${ANIMATION_DURATION}ms forwards;
    animation: slidein ${ANIMATION_DURATION}ms forwards;
  }

  .slide-out {
    -webkit-animation: slideout ${ANIMATION_DURATION}ms forwards;
    -moz-animation: slideout ${ANIMATION_DURATION}ms forwards;
    -ms-animation: slideout ${ANIMATION_DURATION}ms forwards;
    -o-animation: slideout ${ANIMATION_DURATION}ms forwards;
    animation: slideout ${ANIMATION_DURATION}ms forwards;
  }

  .fade-in {
    -webkit-animation: fadein ${ANIMATION_DURATION}ms;
    -moz-animation: fadein ${ANIMATION_DURATION}ms;
    -ms-animation: fadein ${ANIMATION_DURATION}ms;
    -o-animation: fadein ${ANIMATION_DURATION}ms;
    animation: fadein ${ANIMATION_DURATION}ms;
  }

  .fade-out {
    visibility: hidden;
    opacity: 0;
    -webkit-transition: visibility 0s ${ANIMATION_DURATION}ms, opacity ${ANIMATION_DURATION}ms linear;
    -moz-transition: visibility 0s ${ANIMATION_DURATION}ms, opacity ${ANIMATION_DURATION}ms linear;
    -ms-transition: visibility 0s ${ANIMATION_DURATION}ms, opacity ${ANIMATION_DURATION}ms linear;
    -o-transition: visibility 0s ${ANIMATION_DURATION}ms, opacity ${ANIMATION_DURATION}ms linear;
    transition: visibility 0s ${ANIMATION_DURATION}ms, opacity ${ANIMATION_DURATION}ms linear;
  }
`;

/* 
  all except script 
  src: https://developer.mozilla.org/en-US/docs/Web/HTML/Element
*/
export const ALLOWED_HTML_TAGS = [
  '!DOCTYPE',
  'a',
  'abbr',
  'acronym',
  'address',
  'applet',
  'area',
  'article',
  'aside',
  'audio',
  'b',
  'base',
  'basefont',
  'bdo',
  'big',
  'blockquote',
  'body',
  'br',
  'button',
  'canvas',
  'caption',
  'center',
  'cite',
  'code',
  'col',
  'colgroup',
  'datalist',
  'dd',
  'del',
  'dfn',
  'div',
  'dl',
  'dt',
  'em',
  'embed',
  'fieldset',
  'figcaption',
  'figure',
  'font',
  'footer',
  'form',
  'frame',
  'frameset',
  'head',
  'header',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'hr',
  'html',
  'i',
  'iframe',
  'img',
  'input',
  'ins',
  'kbd',
  'label',
  'legend',
  'li',
  'link',
  'main',
  'map',
  'mark',
  'meta',
  'meter',
  'nav',
  'noscript',
  'object',
  'ol',
  'optgroup',
  'option',
  'p',
  'param',
  'pre',
  'progress',
  'q',
  's',
  'samp',
  'section',
  'select',
  'small',
  'source',
  'span',
  'strike',
  'strong',
  'style',
  'sub',
  'sup',
  'table',
  'tbody',
  'td',
  'textarea',
  'tfoot',
  'th',
  'thead',
  'time',
  'title',
  'tr',
  'u',
  'ul',
  'var',
  'video',
  'wbr'
];

/*
  everything except global event handlers (e.g. "onclick")
  src: https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes
*/
export const ALLOWED_HTML_ATTRIBUTES = [
  'accept',
  'accept-charset',
  'accesskey',
  'action',
  'align',
  'allow',
  'alt',
  'async',
  'autocapitalize',
  'autocomplete',
  'autofocus',
  'autoplay',
  'buffered',
  'capture',
  'challenge',
  'charset',
  'checked',
  'cite',
  'class',
  'code',
  'codebase',
  'cols',
  'colspan',
  'content',
  'contenteditable',
  'contextmenu',
  'controls',
  'coords',
  'crossorigin',
  'csp',
  'data',
  'data-*',
  'datetime',
  'decoding',
  'default',
  'defer',
  'dir',
  'dirname',
  'disabled',
  'download',
  'draggable',
  'enctype',
  'enterkeyhint',
  'for',
  'form',
  'formaction',
  'formenctype',
  'formmethod',
  'formnovalidate',
  'formtarget',
  'headers',
  'hidden',
  'high',
  'href',
  'hreflang',
  'http-equiv',
  'icon',
  'id',
  'importance',
  'integrity',
  'intrinsicsize',
  'inputmode',
  'ismap',
  'itemprop',
  'keytype',
  'kind',
  'label',
  'lang',
  'language',
  'list',
  'loop',
  'low',
  'manifest',
  'max',
  'maxlength',
  'minlength',
  'media',
  'method',
  'min',
  'multiple',
  'muted',
  'name',
  'novalidate',
  'open',
  'optimum',
  'pattern',
  'ping',
  'placeholder',
  'poster',
  'preload',
  'radiogroup',
  'readonly',
  'referrerpolicy',
  'rel',
  'required',
  'reversed',
  'rows',
  'rowspan',
  'sandbox',
  'scope',
  'scoped',
  'selected',
  'shape',
  'size',
  'sizes',
  'slot',
  'span',
  'spellcheck',
  'src',
  'srcdoc',
  'srclang',
  'srcset',
  'start',
  'step',
  'style',
  'summary',
  'tabindex',
  'target',
  'title',
  'translate',
  'type',
  'usemap',
  'value',
  'width',
  'wrap'
];
