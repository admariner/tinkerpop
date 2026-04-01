const { override, babelInclude, removeModuleScopePlugin } = require('customize-cra');
const path = require('path');

// Real path to the gremlin-javascript language source (via file: symlink in node_modules)
const gremlinLanguageSrc = path.resolve(
  'node_modules/gremlin/lib/language'
);
// Also include the real filesystem path in case webpack resolves the symlink
const gremlinLanguageReal = path.resolve(
  '../../../../crew/spm/gremlin-js/gremlin-javascript/lib/language'
);

module.exports = override(
  // Remove CRA's ModuleScopePlugin which blocks imports from outside src/.
  // Required because the gremlin language translators live in the crew workspace
  // (outside the project root) and are referenced via a file: package dependency.
  removeModuleScopePlugin(),
  babelInclude([
    path.resolve('src'),
    gremlinLanguageSrc,
    gremlinLanguageReal,
  ]),
  (config) => {
    // Map 'gremlin/language' directly to TypeScript source, bypassing the
    // exports field which points to build/esm/ (not yet built for dev workflow).
    config.resolve.alias = {
      ...config.resolve.alias,
      'gremlin/language': path.resolve(
        'node_modules/gremlin/lib/language'
      ),
    };

    // Allow webpack to resolve .js extensions as .ts in translator source files
    // (translator files use ESM-style 'import from ./Foo.js' convention)
    config.resolve.extensionAlias = {
      '.js': ['.ts', '.js'],
    };

    return config;
  }
);
