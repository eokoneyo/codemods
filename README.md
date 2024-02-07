## codemods

Utilities for change management 😉

### replace imports

```shell
jscodeshift --extensions=js,ts,tsx --parser=tsx --ignore-pattern="~/Developer/kibana/{(node_modules|config|data|target|licenses)/*,(packages|plugins|x-pack)/**/*.d.ts}" -t ~/Developer/codemods/transforms/replace-import.js ~/Developer/kibana/* --currentImportPackage="@kbn/kibana-react-plugin/public" --targetImportPackage="@kbn/shared-ux-link-redirect-app" --identifier="RedirectAppLinks"
```

### rename component props

```shell
jscodeshift --extensions=js,ts,tsx --parser=tsx --ignore-pattern="~/Developer/kibana/{(node_modules|config|data|target|licenses)/*,(packages|plugins|x-pack)/**/*.d.ts}" -t ~/Developer/codemods/transforms/update-props-for-react-component.js ~/Developer/kibana/* --oldProp="application" --newProp="coreStart" --componentName="RedirectAppLinks"
```

### delete component props

```shell
jscodeshift --extensions=js,ts,tsx --parser=tsx --ignore-pattern="~/Developer/kibana/{(node_modules|config|data|target|licenses)/*,(packages|plugins|x-pack)/**/*.d.ts}" -t ~/Developer/codemods/transforms/remove-props-from-react-component.js ~/Developer/kibana/* --componentName="RedirectAppLinks" --propsToDelete="someProp,anotherProp"
```
