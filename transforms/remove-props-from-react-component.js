/**
 *
 * @param {*} file
 * @param {import('jscodeshift').API} api
 * @param {object} options
 * @param {string} options.componentName
 * @param {string} options.propsToDelete - comma separated list of props to delete
 */
module.exports = function removeComponentPropsTransformer(file, api, options) {
  const j = api.jscodeshift;

  const root = j(file.source);

  const deleteList = options.propsToDelete.split(/\,/);

  const matchedComponents = root.find(j.JSXOpeningElement).filter((path) => {
    return path.node.name.name === options.componentName;
  });

  if (matchedComponents.size()) {
    matchedComponents.find(j.JSXAttribute).forEach((path) => {
      if (deleteList.indexOf(path.node.name.name) >= 0) {
        path.prune();
      }
    });

    return root.toSource();
  }
};
