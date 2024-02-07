const assert = require('assert');

/**
 *
 * @param {*} file
 * @param {import('jscodeshift').API} api
 * @param {object}  options
 * @param {string}  options.identifier
 * @param {string}  options.currentExportPackage
 * @param {string}  options.targetExportPackage
 * @returns
 *
 */
module.exports = function replaceExportTransformer(file, api, options) {
  const j = api.jscodeshift;

  const root = j(file.source).find(j.ExportNamedDeclaration);

  const currentDeclarations = root.filter((path) => {
    return path.node.source && path.node.source.value === options.currentExportPackage;
  });

  if (currentDeclarations.size()) {
    // identifier of specific export we want to replace from all named export declaration
    const identifierSpecifier = currentDeclarations.find(j.ExportSpecifier).filter((path) => {
      return path.node.local.name === options.identifier;
    });

    if (identifierSpecifier.size()) {
      // The same export shouldn't be present in the same file more than once
      assert.equal(identifierSpecifier.size(), 1);

      const identifierDeclaration = identifierSpecifier.closest(j.ExportNamedDeclaration);

      const targetDeclaration = root.filter((path) => path.node.source.value === options.targetExportPackage);

      // an existing import declaration for the target exist already
      if (targetDeclaration.size()) {
        // we use the import specifier as is and place new identifier as last import specifier
        targetDeclaration.find(j.ExportSpecifier).at(-1).insertAfter(identifierSpecifier.nodes());
      } else {
        const newExport = j.exportNamedDeclaration(
          null,
          identifierSpecifier.nodes(),
          j.stringLiteral(options.targetExportPackage)
        );

        identifierDeclaration.at(-1).insertAfter(newExport);
      }

      // current export declaration only references our specifier so can safely remove it's entire declaration
      if (identifierDeclaration.find(j.ExportSpecifier).size() === 1) {
        identifierDeclaration.remove();
      } else {
        // only remove our identifier from the declaration then
        identifierSpecifier.remove();
      }
    }

    return root.toSource();
  }
};
