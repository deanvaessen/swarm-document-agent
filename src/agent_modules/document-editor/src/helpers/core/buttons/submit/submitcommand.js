/*eslint-disable */
import Command from '@ckeditor/ckeditor5-core/src/command/command';

export default class SubmitCommand extends Command {
	_doExecute() {

		// Set variables
		const editor = this.editor;
		const post = editor.getData();

			//const editor = window.swarmagent.editor;
			//const post = editor.engine.getData();

		// Send the post call
			//editor.submitPost(post);
		window.swarmagent.editor.submitPost(post);
	}
}