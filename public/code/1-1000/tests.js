fittest(function(test) {
  const divs = state.sandbox.document.querySelectorAll('div');

  test.assert(divs.length, 1000);

  for (let i = 0; i < 1000; i++) {
    const number = divs[i] ? parseInt(divs[i].textContent) : null;

    test.assert(number, i + 1);
  }
});
