const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;
const transform = require('./move-props-on-react-component');

const transformOptions = {
  componentName: 'SomeComponent',
  propToMove: 'someProp',
};

defineInlineTest(
  transform,
  { ...transformOptions },
  `
      <${transformOptions.componentName} ${transformOptions.propToMove}={'hello'} />
  `,
  `
      <${transformOptions.componentName}>{'hello'}</${transformOptions.componentName}>
  `,
  'move props (make specified prop component child)'
);

defineInlineTest(
  transform,
  { ...transformOptions },
  `
      <${transformOptions.componentName} ${transformOptions.propToMove}={'hello'} testProp={'remains as is'} />
  `,
  `
      <${transformOptions.componentName} testProp={'remains as is'}>{'hello'}</${transformOptions.componentName}>
  `,
  'move props (make specified prop component child, and leave other props as is)'
);
