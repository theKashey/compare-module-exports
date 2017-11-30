function generate(libraryName) {

  let hasError = false;

  function testFunction(a, b, file, name) {
    if (a.length !== b.length) {
      console.error(name + ': in' + file + '\n\t\t' + a.toString() + '\n\tdoes not match\n\t\t' + b.toString());
      throw new Error(libraryName + ': function argument mismatch: ' + file + ': ' + name);
    }
  }

  function test(a, b, file, name) {
    if (!b) {
      throw new Error(libraryName + ': mocked export "' + name + '" does not exists in ' + file);
    }
    const typeOfA = typeof a;
    const typeOfB = typeof b;
    if (typeOfA !== typeOfB) {
      throw new Error(libraryName + ': exported type mismatch: ' + file + ':' + name + '. Expected ' + typeOfA + ', got ' + typeOfB + '');
    }
    if (typeOfA === 'function') {
      return testFunction(a, b, file, name);
    }
  }

  function matchExports(realExports, mockedExports, realFile, mockFile) {
    hasError = false;
    const typeOfA = typeof mockedExports;
    const typeOfB = typeof realExports
    if (typeOfA !== typeOfB) {
      console.error(
        libraryName + ': mock ' + mockFile + ' exports does not match a real file.' +
        ' Expected ' + typeOfA + ', got ' + typeOfB + ''
      );
      return true;
    }
    if (typeof mockedExports === 'function') {
      try {
        test(mockedExports, realExports, realFile, 'exports');
      } catch (e) {
        console.error(e.message, '\n');
        hasError = true;
      }
    } else if (typeof mockedExports === 'object') {
      Object.keys(mockedExports).forEach(key => {
        try {
          test(mockedExports[key], realExports[key], realFile, key)
        } catch (e) {
          console.error(e.message, '\n');
          hasError = true;
        }
      });
    }
    return hasError;
  }

  return matchExports;
}

module.exports = generate;