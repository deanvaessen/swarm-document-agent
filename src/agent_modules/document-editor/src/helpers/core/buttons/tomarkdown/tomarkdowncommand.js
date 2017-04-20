/**
 * { ToMarkdownCommand }
 * Converts the post into markdown for the viewer
 */
import Command from '@ckeditor/ckeditor5-core/src/command/command';
import toMarkdown from 'to-markdown';
import marked from 'marked';

// Disable editing buttons
function disableCallback( evt, data ) {
	data.isEnabled = false;
	evt.stop();
}

// Command class
export default class ToMarkdownCommand extends Command {

	_doExecute() {

		/**
		 * { Variables & config }
		 */
		//const editor = this.editor;
		const editor = window.swarmagent.editor.engine;
		const post = editor.getData();
		const store = window.swarmagent.editor.store;

		marked.setOptions({
			renderer : new marked.Renderer()
		});

			//const editorEngine = window.swarmagent.editor.engine;
			//const post = editorEngine.getData();

		/**
		 * { Update the UI }
		 * Disable editing buttons
		 */
		// Do not disable these
		// This is currently not used as CKEDITOR does not allow Markdown conversion properly as it is not a textfield and we need to use this to fix an issue with linebreaks
		const exclusionArray = [
			//'DeleteCommand',
			//'UndoCommand',
			//'RedoCommand',
			//'InputCommand',
			//'EnterCommand',
			//'Submit'
		];

		if (!store.markdownMode.isActive){
			editor.commands.forEach( ( command ) => {
				if (exclusionArray.indexOf(command.constructor.name) == -1 && command != this){
					command.on( 'refreshState', disableCallback );
					command.refreshState();
				}
			} );

			// Update on screen
				//editor.setData(toMarkdown(post));
				const ckeditorContentElement = document.getElementsByClassName('ck-editor__main')[0];
				const markdownFieldElement = document.getElementById('markdownField');

				markdownFieldElement.value = toMarkdown(post);
				ckeditorContentElement.style.display = 'none';
				markdownFieldElement.style.display = 'block';

			store.markdownMode.isActive = true;

		} else if (store.markdownMode.isActive) {
			editor.commands.forEach( ( command ) => {
				if (exclusionArray.indexOf(command.constructor.name) == -1 && command != this){
					command.off( 'refreshState', disableCallback );
					command.refreshState();
				}
			} );

			const ckeditorContentElement = document.getElementsByClassName('ck-editor__main')[0];
			const markdownFieldElement = document.getElementById('markdownField');
			const editedMarkdown = markdownFieldElement.value;

			ckeditorContentElement.style.display = 'block';
			markdownFieldElement.style.display = 'none';

			editor.setData(marked(editedMarkdown));

			store.markdownMode.isActive = false;
		}
	}
}
