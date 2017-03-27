(function() {
  var Test = function(description) {
    var results = [];

    return {
      assert: function(a, b) {
        results.push({
          expr: JSON.stringify(a) + ' === ' + JSON.stringify(b),
          ok: a === b
        });
      },
      description: description,
      results: results
    };
  };

  var fittest = function(tests, description) {
    var test = new Test(description);

    tests(test);

    if (!fittest.tests) {
      fittest.tests = [test];
    } else {
      fittest.tests.push(test);
    }
  };

  fittest.ok = function() {
    var tests = fittest.tests || [];

    for (test of tests) {
      var testOk = true;

      for (result of test.results) {
        if (!result.ok) {
          testOk = false;
          break;
        }
      }

      if (!testOk) {
        return testOk;
      }
    }

    return true;
  };

  fittest.reset = function() {
    fittest.results = [];
    fittest.tests = [];
  };

  fittest.stats = function() {
    var tests = fittest.tests || [];
    var stats = {
      total: 0,
      ok: 0,
      fail: 0
    };

    for (test of tests) {
      for (result of test.results) {
        if (result.ok) {
          stats.ok++;
        } else {
          stats.fail++;
        }

        stats.total++;
      }
    }

    return stats;
  };

  window.fittest = fittest;
})();
