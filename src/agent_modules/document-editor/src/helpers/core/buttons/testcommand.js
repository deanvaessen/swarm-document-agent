/*eslint-disable */
import Command from '@ckeditor/ckeditor5-core/src/command/command';

export default class EnterCommand extends Command {
	_doExecute() {
		/*const doc = this.editor.document;
		const batch = doc.batch();

		doc.enqueueChanges( () => {
			enterBlock( this.editor.data, batch, doc.selection, doc.schema );

			this.fire( 'afterExecute', { batch } );
		} );*/

		console.log('hey baby');
	}
}