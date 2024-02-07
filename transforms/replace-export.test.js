const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;
const transform = require('./replace-export.js');

const transformOptions = {
  identifier: 'RedirectAppLinks',
  target: '@kbn/shared-ux-link-redirect-app',
  current: '@kbn/kibana-react-plugin/public',
};

defineInlineTest(
  transform,
  {
    rewriteAsDefault: true,
    identifier: transformOptions.identifier,
    currentExportPackage: transformOptions.current,
    targetExportPackage: transformOptions.target,
  },
  `export {${transformOptions.identifier}} from "${transformOptions.current}";`,
  `export { ${transformOptions.identifier} } from "${transformOptions.target}";`,
  'replace export (single default)'
);

defineInlineTest(
  transform,
  {
    identifier: transformOptions.identifier,
    currentExportPackage: transformOptions.current,
    targetExportPackage: transformOptions.target,
  },
  `export {${transformOptions.identifier}} from "${transformOptions.current}";`,
  `export { ${transformOptions.identifier} } from "${transformOptions.target}";`,
  'replace export (single not default)'
);

defineInlineTest(
  transform,
  {
    identifier: transformOptions.identifier,
    currentExportPackage: transformOptions.current,
    targetExportPackage: transformOptions.target,
  },
  `export {${transformOptions.identifier} as TestExport } from "${transformOptions.current}";`,
  `export { ${transformOptions.identifier} as TestExport } from "${transformOptions.target}";`,
  'replace export (single default exported as another value)'
);

defineInlineTest(
  transform,
  {
    identifier: transformOptions.identifier,
    currentExportPackage: transformOptions.current,
    targetExportPackage: transformOptions.target,
  },
  `export {${transformOptions.identifier}, SomeOther} from "${transformOptions.current}";`,
  `export { SomeOther } from "${transformOptions.current}";\nexport { ${transformOptions.identifier} } from "${transformOptions.target}";`,
  'replace export (multiple)'
);

defineInlineTest(
  transform,
  {
    identifier: transformOptions.identifier,
    currentExportPackage: transformOptions.current,
    targetExportPackage: transformOptions.target,
  },
  `export {${transformOptions.identifier}, SomeOther} from "${transformOptions.current}";\nexport { magicMethod } from "magic-package";`,
  `export { SomeOther } from "${transformOptions.current}";\nexport { ${transformOptions.identifier} } from "${transformOptions.target}";\nexport { magicMethod } from "magic-package";`,
  'replace export (only valid instance)'
);

defineInlineTest(
  transform,
  {
    identifier: transformOptions.identifier,
    currentExportPackage: transformOptions.current,
    targetExportPackage: transformOptions.target,
  },
  `export { SomeOther, ${transformOptions.identifier} } from "${transformOptions.current}";\nexport { ImportFromTarget } from "${transformOptions.target}"`,
  `export { SomeOther } from "${transformOptions.current}";\nexport { ImportFromTarget, ${transformOptions.identifier} } from "${transformOptions.target}";`,
  'replace export (includes it in existing matching target import declaration)'
);

defineInlineTest(
  transform,
  {
    identifier: transformOptions.identifier,
    currentExportPackage: transformOptions.current,
    targetExportPackage: transformOptions.target,
  },
  `export { SomeOther } from "${transformOptions.current}";`,
  `export { SomeOther } from "${transformOptions.current}";`,
  'replace export (ignores no match)'
);
