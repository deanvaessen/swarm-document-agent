/*eslint-disable */
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import TestCommand from './testcommand';

const ITALIC = 'italic';

/**
 * The XXX engine feature.
 *
 * It registers the `XXX` command and introduces the `XXX` attribute in the model which renders to the view
 * as an `<em>` element.
 *
 * @extends module:core/plugin~Plugin
 */
export default class ItalicEngine extends Plugin {
	init() {
		const editor = this.editor;
		editor.commands.set( ITALIC, new TestCommand( editor ) );
	}
}