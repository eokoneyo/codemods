const assert = require('assert');

/**
 *
 * @param {*} file
 * @param {import('jscodeshift').API} api
 * @param {object}  options
 * @param {string}  options.identifier
 * @param {string}  options.currentImportPackage
 * @param {string}  options.targetImportPackage
 * @param {boolean} [options.rewriteAsDefault]
 * @param {boolean} [options.rewriteAsNamespaceImport]
 * @returns
 *
 */
module.exports = function replaceImportTransformer(file, api, options) {
  assert.notStrictEqual(
    options.rewriteAsDefault && options.rewriteAsNamespaceImport,
    true,
    'options `rewriteAsDefault` and `rewriteAsNamespaceImport` cannot both be specified as true'
  );

  const j = api.jscodeshift;

  const root = j(file.source).find(j.ImportDeclaration);

  const currentDeclarations = root.filter((path) => path.node.source.value === options.currentImportPackage);

  if (currentDeclarations.size()) {
    // identifier of specific import we want to replace
    const identifierSpecifier = currentDeclarations.find(j.ImportSpecifier).filter((path) => {
      return path.node.imported.name === options.identifier;
    });

    if (identifierSpecifier.size()) {
      // Ideally the same import shouldn't be present in the same file more than once
      assert.equal(identifierSpecifier.size(), 1);

      const identifierDeclaration = identifierSpecifier.closest(j.ImportDeclaration);

      const targetDeclaration = root.filter((path) => path.node.source.value === options.targetImportPackage);

      // an import declaration for the target exists already
      if (targetDeclaration.size()) {
        // we use the import specifier as is and place new identifier as last import specifier
        targetDeclaration.find(j.ImportSpecifier).at(-1).insertAfter(identifierSpecifier.nodes());
      } else {
        const newImport = j.importDeclaration(
          options.rewriteAsDefault
            ? [j.importDefaultSpecifier(j.identifier(options.identifier))]
            : options.rewriteAsNamespaceImport
            ? [j.importNamespaceSpecifier(j.identifier(options.identifier))]
            : // remap as is used in the module it is imported from to the new module
              identifierSpecifier.nodes(),
          j.stringLiteral(options.targetImportPackage)
        );

        identifierDeclaration.at(-1).insertAfter(newImport);
      }

      // declaration only references our identifier we can safely remove it's entire declaration
      if (identifierDeclaration.find(j.ImportSpecifier).size() === 1) {
        identifierDeclaration.remove();
      } else {
        // only remove our identifier from the declaration then
        identifierSpecifier.remove();
      }
    }

    return root.toSource();
  }
};
