fittest(function(test) {
  const ps = state.sandbox.document.querySelectorAll('iframe');

  test.assert(ps.length, 1);
});
