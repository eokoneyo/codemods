const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;
const transform = require('./update-props-for-react-component');

const transformOptions = {
  componentName: 'RedirectAppLinks',
  oldProp: 'application',
  newProp: 'coreStart',
};

defineInlineTest(
  transform,
  {
    ...transformOptions,
    nestOldAsObject: true,
  },
  `
    <${transformOptions.componentName} application={value} />
`,
  `
    <${transformOptions.componentName} coreStart={{
        application: value
    }} />
`,
  'update component props (nest prop to be updated as object)'
);

defineInlineTest(
  transform,
  transformOptions,
  `
    <${transformOptions.componentName} application={value} />
`,
  `
    <${transformOptions.componentName} coreStart={value} />
`,
  'update component props (replace prop name as is)'
);
