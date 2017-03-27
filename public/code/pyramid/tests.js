fittest(function(test) {
  state.sandbox.printCookies(3)
  const pre = state.sandbox.document.querySelector('pre').outerHTML;

  test.assert(pre,
`<pre>
  🍪
 🍪🍪
🍪🍪🍪
</pre>`);
});

fittest(function(test) {
  state.sandbox.printCookies(6)
  const pre = state.sandbox.document.querySelector('pre').outerHTML;

  test.assert(pre,
`<pre>
     🍪
    🍪🍪
   🍪🍪🍪
  🍪🍪🍪🍪
 🍪🍪🍪🍪🍪
🍪🍪🍪🍪🍪🍪
</pre>`);
});
