const assert = require('assert');

/**
 *
 * @param {*} file
 * @param {import('jscodeshift').API} api
 * @param {object} options
 * @param {string} options.componentName
 * @param {string} options.propToMove - component to operate on
 */
module.exports = function moveComponentPropTransformer(file, api, options) {
  const j = api.jscodeshift;

  const root = j(file.source);

  assert.strictEqual(/[a-zA-Z]*/.test(options.propToMove), true);

  const matchedComponents = root.find(j.JSXOpeningElement).filter((path) => {
    return path.node.name.name === options.componentName && path.node.selfClosing === true;
  });

  if (matchedComponents.size()) {
    matchedComponents.find(j.JSXAttribute).forEach((attributeAST, idx) => {
      if (options.propToMove.indexOf(attributeAST.node.name.name) >= 0) {
        const componentForMatchedAttribute = attributeAST.parent.parentPath;

        componentForMatchedAttribute.replace(
          new j.jsxElement.from({
            openingElement: new j.jsxOpeningElement(
              j.jsxIdentifier(componentForMatchedAttribute.node.openingElement.name.name),
              componentForMatchedAttribute.node.openingElement.attributes.filter(
                (node) => node.name.name !== attributeAST.node.name.name
              ),
              false
            ),
            closingElement: new j.jsxClosingElement(
              j.jsxIdentifier(componentForMatchedAttribute.node.openingElement.name.name)
            ),
            children: [attributeAST.node.value],
          })
        );

        attributeAST.prune();
      }
    });

    return root.toSource();
  }
};
