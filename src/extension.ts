import * as vscode from 'vscode';
import { removeComments, CommentRemoverOptions } from './parser/commentRemover';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    'smartCommentRemover.removeComments',
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showInformationMessage('Smart Comment Remover: No active text editor found.');
        return;
      }

      const document = editor.document;
      const selection = editor.selection;
      const languageId = document.languageId;

      // Read extension options from VS Code Settings
      const config = vscode.workspace.getConfiguration('smartCommentRemover');
      const options: CommentRemoverOptions = {
        preserveShebang: config.get<boolean>('preserveShebang', true),
        preserveDirectives: config.get<boolean>('preserveDirectives', false),
        collapseEmptyLines: config.get<boolean>('collapseEmptyLines', true),
      };

      const isSelectionEmpty = selection.isEmpty;
      const targetRange = isSelectionEmpty
        ? new vscode.Range(0, 0, document.lineCount, 0)
        : new vscode.Range(selection.start, selection.end);

      const targetText = document.getText(targetRange);

      if (!targetText.trim()) {
        return;
      }

      try {
        const cleanedText = removeComments(targetText, languageId, options);

        if (cleanedText === targetText) {
          vscode.window.setStatusBarMessage('Smart Comment Remover: No comments to remove.', 3000);
          return;
        }

        const success = await editor.edit((editBuilder) => {
          editBuilder.replace(targetRange, cleanedText);
        });

        if (success) {
          vscode.window.setStatusBarMessage(
            isSelectionEmpty
              ? 'Smart Comment Remover: Removed comments from document.'
              : 'Smart Comment Remover: Removed comments from selection.',
            3000
          );
        }
      } catch (err: any) {
        vscode.window.showErrorMessage(
          `Smart Comment Remover failed: ${err.message || err.toString()}`
        );
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
