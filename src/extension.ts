import vscode from 'vscode';
import has from 'lodash.has';

const { init, localize } = require('vscode-nls-i18n');

const NPM_TRENDS = 'https://www.npmtrends.com';

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
      return {
        contents: [`${localize('npm-trends.key')}: ${NPM_TRENDS}/${packageName}`],
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
