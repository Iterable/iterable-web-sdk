/**
  sends aria-live messages when new content mounts. Useful for in-app messaging
  to let the user know an iframe message has opened

  @thanks https://a11y-guidelines.orange.com/en/web/components-examples/make-a-screen-reader-talk/
*/
export declare const srSpeak: (text: string, priority?: "polite" | "assertive" | undefined) => void;
export default srSpeak;
