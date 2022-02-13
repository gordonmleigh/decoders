const fs = require('fs');
const path = require('path');

const SRC_DIR = path.resolve(__dirname, 'src');

module.exports = (request, options) => {
  const isNodeModuleRequest = !(
    request.startsWith('.') ||
    request.startsWith('/') ||
    request.startsWith('jest-sequencer-')
  );

  if (!isNodeModuleRequest && isSubDir(SRC_DIR, options.basedir)) {
    if (!fs.existsSync(path.join(options.basedir, request))) {
      // resolve missing '.js' paths for '.ts' instead
      request = request.replace(/\.js$/i, '.ts');
    }
  }
  // Call the defaultResolver, so we leverage its cache, error handling, etc.
  return options.defaultResolver(request, options);
};

function isSubDir(parent, dir) {
  if (parent === dir) {
    return true;
  }
  const relative = path.relative(parent, dir);
  return !!relative && !relative.startsWith('..') && !path.isAbsolute(relative);
}
