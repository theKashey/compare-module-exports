function generate(libraryName) {

  let hasError = false;

  function testFunction(a, b, file, name) {
    if (a.length !== b.length) {
      if (a.toString().indexOf('_could_be_any_') < 0) {
        console.error(name + ': in' + file + '\n\t\t' + a.toString() + '\n\tdoes not match\n\t\t' + b.toString());
        throw new Error(libraryName + ': function argument mismatch: ' + file + ': ' + name);
      }
    }
  }

  function test(a, b, file, name, options) {
    if (!b) {
      throw new Error(libraryName + ': mocked export "' + name + '" does not exists in ' + file);
    }
    const typeOfA = typeof a;
    const typeOfB = typeof b;
    if (typeOfA !== typeOfB) {
      throw new Error(libraryName + ': exported type mismatch: ' + file + ':' + name + '. Expected ' + typeOfB + ', got ' + typeOfA + '');
    }
    if (typeOfA === 'function') {
      if (!options.noFunctionCompare) {
        return testFunction(a, b, file, name);
      }
    }
  }

  function matchExports(realExports, mockedExports, realFile, mockFile, options = {}) {
    hasError = false;
    const typeOfA = typeof mockedExports;
    const typeOfB = typeof realExports
    if (typeOfA !== typeOfB) {
      console.error(
        libraryName + ': mock ' + mockFile + ' exports does not match a real file.' +
        ' Expected ' + typeOfB + ', got ' + typeOfA + ''
      );
      return true;
    }
    if (typeof mockedExports === 'function') {
      try {
        test(mockedExports, realExports, realFile, 'exports', options);
      } catch (e) {
        console.error(e.message, '\n');
        hasError = true;
      }
    } else if (typeof mockedExports === 'object') {
      Object.keys(mockedExports).forEach(key => {
        try {
          test(mockedExports[key], realExports[key], realFile, key, options)
        } catch (e) {
          console.error(e.message, '\n');
          hasError = true;
        }
      });
    }
    return hasError;
  }

  function tryMatchExports(realExports, mockedExports, realFile, mockFile, options = {}) {
    if(matchExports(realExports, mockedExports, realFile, mockFile, options)){
      return matchExports(realExports, { default: mockedExports }, realFile, mockFile, options)
    }
    return false;
  }

  return tryMatchExports;
}

module.exports = generate;