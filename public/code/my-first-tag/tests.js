fittest(function(test) {
  const ps = state.sandbox.document.querySelectorAll('p');

  test.assert(ps.length, 2);
});
