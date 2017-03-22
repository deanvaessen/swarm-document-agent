/*eslint-disable */
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import SubmitCommand from './submitcommand';

/**
 * The XXX engine feature.
 *
 * It registers the `XXX` command and introduces the `XXX` attribute in the model which renders to the view
 * as an `<em>` element.
 *
 * @extends module:core/plugin~Plugin
 */
export default class SubmitEngine extends Plugin {
	init() {
		const editor = this.editor;
		editor.commands.set( 'SubmitDocument', new SubmitCommand( editor ) );
	}
}