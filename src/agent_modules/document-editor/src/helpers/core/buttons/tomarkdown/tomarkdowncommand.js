/*eslint-disable */

/**
 * { item_description }
 */
import Command from '@ckeditor/ckeditor5-core/src/command/command';
import toMarkdown from 'to-markdown';
import marked from 'marked';



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
			renderer: new marked.Renderer(),
			gfm: true,
			tables: true,
			breaks: false,
			pedantic: false,
			sanitize: false,
			smartLists: true,
			smartypants: false
		});

			//const editorEngine = window.swarmagent.editor.engine;
			//const post = editorEngine.getData();

		/**
		 * { Update the UI }
		 * Disable editing buttons
		 */


		// Disable editing buttons other than Markdown Mode
		const disableCallback = ( evt, data ) => {
			data.isEnabled = false;
			evt.stop();
		};

		if (!store.markdownMode.isActive){
			console.log('MarkdownMode is not active and button was pressed, so making Markdown mode active and disabling all other buttons.');
		 	console.log(editor.getData())
			editor.commands.forEach( ( command ) => {
				if (command.constructor.name !== 'ToMarkdownCommand') {
					command.on( 'refreshState', disableCallback );
					command.refreshState();
				}
			} );

			// Update on screen
			editor.setData(toMarkdown(post));

			store.markdownMode.isActive = true;

		} else if (store.markdownMode.isActive) {
			console.log('MarkdownMode is active and button was pressed, so making Markdown mode inactive and enabling all other buttons.');
		 	console.log(editor.getData())
		 	editor.commands.forEach( ( command ) => {
				if (command.constructor.name !== 'ToMarkdownCommand') {
					 command.off( 'refreshState', disableCallback );
					 command.refreshState();
				}
			 } );


			// Update on screen after first converting back to markdown to clear up the additional HTML
			editor.setData(marked(toMarkdown(post)));

			store.markdownMode.isActive = false;
		}
	}
}