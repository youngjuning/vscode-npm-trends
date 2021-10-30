import vscode from 'vscode';
import has from 'lodash.has';

const { init, localize } = require('vscode-nls-i18n');

const NPM_TRENDS = 'https://www.npmtrends.com';
const NPM_PACKAGE = 'https://www.npmjs.com/package';
const JSDELIVR = 'https://www.jsdelivr.com/package/npm';

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "vscode-npm-trends" is now active!');
  init(context.extensionPath);
  const provideHover = (
    document: vscode.TextDocument,
    position: vscode.Position,
    _token: vscode.CancellationToken
  ) => {
    const line = document.lineAt(position);
    const documentTextObject = JSON.parse(document.getText());
    const isWordRange = document.getWordRangeAtPosition(position);
    const packageName = line.text.replaceAll(/"/g, '').replaceAll(/ /g, '').split(':')[0];
    if (
      isWordRange &&
      (has(documentTextObject, ['dependencies', packageName]) ||
        has(documentTextObject, ['devDependencies', packageName]) ||
        has(documentTextObject, ['optionalDependencies', packageName]) ||
        has(documentTextObject, ['peerDependencies', packageName]))
    ) {
      const str = new vscode.MarkdownString();
      str.appendText(`${localize('npm-trends.key')}: ${NPM_TRENDS}/${packageName}`);
      str.appendText(`\n\n`);
      str.appendText(`${localize('npm-package.key')}: ${NPM_PACKAGE}/${packageName}`);
      str.appendText(`\n\n`);
      str.appendText(`jedelivr: ${JSDELIVR}/${packageName}`);
      return {
        contents: [str],
      };
    }
    return null;
  };

  const npmSelector: vscode.DocumentSelector = {
    language: 'json',
    scheme: 'file',
    pattern: '**/package.json',
  };

  context.subscriptions.push(
    vscode.languages.registerHoverProvider(npmSelector, {
      provideHover,
    })
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
