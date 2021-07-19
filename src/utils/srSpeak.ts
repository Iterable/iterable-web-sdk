/**
  sends aria-live messages when new content mounts. Useful for in-app messaging
  to let the user know an iframe message has opened

  @thanks https://a11y-guidelines.orange.com/en/web/components-examples/make-a-screen-reader-talk/
*/
export const srSpeak = (text: string, priority: 'polite' | 'assertive') => {
  const el = document.createElement('div');
  const id = 'speak-' + Math.random().toString(36).substr(2, 9);
  el.setAttribute('id', id);
  el.setAttribute('aria-live', priority || 'polite');
  /* 
    _display: none_ would cause the SR to not read the message so this just
    hides the message visibly, while still appearing in the DOM
    
    https://snook.ca/archives/html_and_css/hiding-content-for-accessibility 
  */
  el.style.cssText = `
    position: absolute !important;
    height: 1px;
    width: 1px;
    overflow: hidden;
    clip: rect(1px 1px 1px 1px);
    clip: rect(1px, 1px, 1px, 1px);
  `;
  el.classList.add('sr-only');
  document.body.appendChild(el);
  const elementById: HTMLElement | null = document.getElementById(id);

  if (elementById) {
    global.setTimeout(() => {
      elementById.innerText = text;
    }, 100);

    global.setTimeout(() => {
      document.body.removeChild(elementById);
    }, 1000);
  }
};

export default srSpeak;
