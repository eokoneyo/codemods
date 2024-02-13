## codemods

This repository contains a handful of codemod utility scripts for use with [JSCodeShift](https://github.com/facebook/jscodeshift) to orchestrate change management within a codebase.

## Getting Started

```shell
npm install -g jscodeshift
git clone https://github.com/eokoneyo/codemods.git
jscodeshift -t <path-to-codemod-script> <file>
```

## Included Scripts

The following examples below assumes the following scripts are applying an operation on the [kibana](https://github.com/elastic/kibana) repository, and aims to operate on both javascript and typescript files, it also specifies specific directories to ignore whilst attempting to run the transform.
It's also important to note that when specifying ignore patterns, because it accepts only glob patterns the example provided wouldn't actually work as is, as the value passed to the `--ignore-pattern` option is used as is, so the tilde notation wouldn't be expanded.

### replace import source

```shell
jscodeshift --extensions=js,ts,tsx --parser=tsx --ignore-pattern="~/Developer/kibana/{(node_modules|config|data|target|licenses)/*,(packages|plugins|x-pack)/**/*.d.ts}" -t ~/Developer/codemods/transforms/replace-import.js ~/Developer/kibana/* --currentImportPackage="@kbn/kibana-react-plugin/public" --targetImportPackage="@kbn/shared-ux-link-redirect-app" --identifier="RedirectAppLinks"
```

### rename react component props

```shell
jscodeshift --extensions=js,ts,tsx --parser=tsx --ignore-pattern="~/Developer/kibana/{(node_modules|config|data|target|licenses)/*,(packages|plugins|x-pack)/**/*.d.ts}" -t ~/Developer/codemods/transforms/update-props-for-react-component.js ~/Developer/kibana/* --oldProp="application" --newProp="coreStart" --componentName="RedirectAppLinks"
```

### delete react component props

```shell
jscodeshift --extensions=js,ts,tsx --parser=tsx --ignore-pattern="~/Developer/kibana/{(node_modules|config|data|target|licenses)/*,(packages|plugins|x-pack)/**/*.d.ts}" -t ~/Developer/codemods/transforms/remove-props-from-react-component.js ~/Developer/kibana/* --componentName="RedirectAppLinks" --propsToDelete="someProp,anotherProp"
```

### rename props for react component

```shell
jscodeshift --extensions=js,ts,tsx --parser=tsx --ignore-pattern="~/Developer/kibana/{(node_modules|config|data|target|licenses)/*,(packages|plugins|x-pack)/**/*.d.ts}" -t ~/Developer/codemods/transforms/rename-props-for-react-component.js ~/Developer/kibana/* --oldProp="application" --newProp="coreStart" --componentName="RedirectAppLinks"
```
