/*eslint-disable */
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ItalicEngine from './testengine';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import italicIcon from './icons/test.svg';

export default class Italic extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ ItalicEngine ];
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const t = editor.t;
		const command = editor.commands.get( 'italic' );
		const keystroke = 'CTRL+I';


		// Add italic button to feature components.
		editor.ui.componentFactory.add( 'italic', ( locale ) => {
			const view = new ButtonView( locale );

			view.set( {
				label: t( 'Italic' ),
				icon: italicIcon,
				keystroke,
				tooltip: true
			} );

			view.bind( 'isOn', 'isEnabled' ).to( command, 'value', 'isEnabled' );

			// Execute command.
			this.listenTo( view, 'execute', () => editor.execute( 'italic' ) );

			return view;
		} );

		// Set the Ctrl+I keystroke.
		editor.keystrokes.set( keystroke, 'italic' );
	}
}


