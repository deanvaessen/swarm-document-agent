/*eslint-disable */

/**
 * { item_description }
 */
import Command from '@ckeditor/ckeditor5-core/src/command/command';
import toMarkdown from 'to-markdown';
import marked from 'marked';

export default class ToMarkdownCommand extends Command {
	_doExecute() {

		// Set variables
		const editor = this.editor;
		const post = editor.getData();

			//const editorEngine = window.swarmagent.editor.engine;
			//const post = editorEngine.getData();
		const convertedPost = toMarkdown(post)

		// Update on screen
		editor.setData(convertedPost);

		// Disable editing buttons
		//xx
			//console.log(editorEngine);
			//console.log(editorEngine.view);
	}
}