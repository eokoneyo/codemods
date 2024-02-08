const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;
const transform = require('./replace-import.js');

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
    currentImportPackage: transformOptions.current,
    targetImportPackage: transformOptions.target,
  },
  `import {${transformOptions.identifier}} from "${transformOptions.current}";`,
  `import ${transformOptions.identifier} from "${transformOptions.target}";`,
  'replace import (single default)'
);

defineInlineTest(
  transform,
  {
    identifier: transformOptions.identifier,
    currentImportPackage: transformOptions.current,
    targetImportPackage: transformOptions.target,
  },
  `import {${transformOptions.identifier}} from "${transformOptions.current}";`,
  `import { ${transformOptions.identifier} } from "${transformOptions.target}";`,
  'replace import (single not default)'
);

defineInlineTest(
  transform,
  {
    rewriteAsNamespaceImport: true,
    identifier: transformOptions.identifier,
    currentImportPackage: transformOptions.current,
    targetImportPackage: transformOptions.target,
  },
  `import {${transformOptions.identifier}} from "${transformOptions.current}"`,
  `import * as ${transformOptions.identifier} from "${transformOptions.target}";`,
  'replace import (import namespace)'
);


defineInlineTest(
  transform,
  {
    identifier: transformOptions.identifier,
    aliasIdentifierTo: 'MagicLinks',
    currentImportPackage: transformOptions.current,
    targetImportPackage: transformOptions.target,
  },
  `import {${transformOptions.identifier}} from "${transformOptions.current}"`,
  `import { MagicLinks as ${transformOptions.identifier} } from "${transformOptions.target}";`,
  'replace import (alias import)'
);

defineInlineTest(
  transform,
  {
    identifier: transformOptions.identifier,
    currentImportPackage: transformOptions.current,
    targetImportPackage: transformOptions.target,
  },
  `import {${transformOptions.identifier}, SomeOther} from "${transformOptions.current}";`,
  `import { SomeOther } from "${transformOptions.current}";\nimport { ${transformOptions.identifier} } from "${transformOptions.target}";`,
  'replace import (multiple)'
);

defineInlineTest(
  transform,
  {
    identifier: transformOptions.identifier,
    currentImportPackage: transformOptions.current,
    targetImportPackage: transformOptions.target,
  },
  `import {${transformOptions.identifier}, SomeOther} from "${transformOptions.current}";\nimport { magicMethod } from "magic-package";`,
  `import { SomeOther } from "${transformOptions.current}";\nimport { ${transformOptions.identifier} } from "${transformOptions.target}";\nimport { magicMethod } from "magic-package";`,
  'replace import (only valid instance)'
);

defineInlineTest(
  transform,
  {
    identifier: transformOptions.identifier,
    currentImportPackage: transformOptions.current,
    targetImportPackage: transformOptions.target,
  },
  `import { SomeOther, ${transformOptions.identifier} } from "${transformOptions.current}";\nimport { ImportFromTarget } from "${transformOptions.target}"`,
  `import { SomeOther } from "${transformOptions.current}";\nimport { ImportFromTarget, ${transformOptions.identifier} } from "${transformOptions.target}";`,
  'replace import (includes it in existing matching target import declaration)'
);

defineInlineTest(
  transform,
  {
    identifier: transformOptions.identifier,
    currentImportPackage: transformOptions.current,
    targetImportPackage: transformOptions.target,
  },
  `import { SomeOther } from "${transformOptions.current}";`,
  `import { SomeOther } from "${transformOptions.current}";`,
  'replace import (ignores no match)'
);
