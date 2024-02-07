const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;
const transform = require('./remove-props-from-react-component');

const transformOptions = {
  componentName: 'SomeComponent',
  propsToDelete: 'onEnd,onStart',
};

defineInlineTest(
  transform,
  {
    ...transformOptions,
    nestOldAsObject: true,
  },
  `
    <${transformOptions.componentName} ${transformOptions.propsToDelete
      .split(/\,/)
      .map((propName, idx) => `${propName}={()=>{}}`)
      .join(' ')} />
`,
  `
    <${transformOptions.componentName} />
`,
  'delete props (deletes specified prop)'
);

defineInlineTest(
  transform,
  {
    ...transformOptions,
    nestOldAsObject: true,
  },
  `
    <${transformOptions.componentName} snowflakeProp={'❄️'} ${transformOptions.propsToDelete
      .split(/\,/)
      .map((propName) => `${propName}={()=>{}}`)
      .join(' ')} />
`,
  `
    <${transformOptions.componentName} snowflakeProp={'❄️'} />
`,
  'delete props (ignores props not specified)'
);
