/**
 *
 * @param {*} file
 * @param {import('jscodeshift').API} api
 * @param {object} options
 * @param {string} options.componentName
 * @param {string} options.oldProp
 * @param {string} options.newProp
 * @param {string} options.nestOldAsObject
 */
module.exports = function updateComponentPropsTransformer(file, api, options) {
  const j = api.jscodeshift;

  const root = j(file.source);

  const matchedComponents = root
    .find(j.JSXOpeningElement)
    .filter((path) => {
      return path.node.name.name === options.componentName;
    })
    .find(j.JSXAttribute)
    .filter((path) => {
      return path.node.name.name === options.oldProp;
    });

  if (matchedComponents.size()) {
    matchedComponents.forEach((path) => {
      const newAttribute = j.jsxAttribute(
        j.jsxIdentifier(options.newProp),
        j.jsxExpressionContainer(
          options.nestOldAsObject
            ? j.objectExpression([j.property('init', path.node.name, path.node.value.expression)])
            : path.node.value.expression
        )
      );

      path.replace(newAttribute);
    });

    return root.toSource();
  }
};
