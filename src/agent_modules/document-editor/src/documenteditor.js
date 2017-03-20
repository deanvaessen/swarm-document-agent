/*******************************
 * [documenteditor.js]
 * The core markdown-editor js file.
 ******************************/
/*eslint-disable */
/**
* { Dependencies }
*/
	// Support functions
	import support from './helpers/core/index.js';

	// Vendor functions
	const toMarkdown = require('to-markdown');
	import marked from './helpers/vendor/marked.js';

	//CKEDITOR
	import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classic';

	import Enter from '@ckeditor/ckeditor5-enter/src/enter';
	import Typing from '@ckeditor/ckeditor5-typing/src/typing';
	import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
	import Undo from '@ckeditor/ckeditor5-undo/src/undo';
	import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
	//import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
	import Image from '@ckeditor/ckeditor5-image/src/image';
	import List from '@ckeditor/ckeditor5-list/src/list';
	import Link from '@ckeditor/ckeditor5-link/src/link';
	import Headings from '@ckeditor/ckeditor5-heading/src/heading';




	//import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
	//import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
	import TestEngine from './helpers/core/buttons/testengine';
	import Test from './helpers/core/buttons/test';


/**
* { App }
*/
const index = (function() {

	/**
	* { Init }
	* Init the app
	*/
	const init = (function(requestedPostURL, requestedReadURL) {
		/**
		* { Variables }
		*/
		let postURL, readURL;

			//Set up the markdown render options
			const renderer = new marked.Renderer();

		/**
		 * Grab configuration items
		 * First check to see if we have a configuration file and grab all the variables
		 */
		support.init.conf(function(editorConfigurationObject){

			// If no base readURL was given, look in a fallback directory
			if (!requestedReadURL && editorConfigurationObject.readURL === 'unknown'){
				readURL = '/bzzr:/';
			} else if (requestedReadURL) {
				readURL = requestedReadURL;
			} else if (editorConfigurationObject.readURL !== 'unknown') {
				readURL = editorConfigurationObject.readURL;
			}

			// If no base postURL was given, look in a fallback directory
			if (!requestedPostURL && editorConfigurationObject.postURL === 'unknown'){
				postURL = '/bzzr:/';
			} else if (requestedPostURL) {
				postURL = requestedPostURL;
			} else if (editorConfigurationObject.postURL !== 'unknown') {
				postURL = editorConfigurationObject.postURL;
			}

			//console.log(readURL, postURL);

			/**
			 * { submitPost }
			 * Submit the post
			 */


			const submitPost = (post)=> {
				//console.log('I am posting....');
				//console.log(post);

				// Convert to markdown
				const convertedPost = toMarkdown(post);

				//console.log('Converted post:');
				//console.log(convertedPost);

				// Post to a URL
				support.communicate.post(convertedPost, postURL, (responseText, responseStatus) => {
					// Callback to navigate to URL
						//console.log('responseText:', responseText);
						//console.log('responseStatus:', responseStatus);

					if (responseStatus != 200){
						document.getElementById('markdownEditor').value = 'Oops! We could not post this document. <br /> Error: <br />' + responseText;
						document.title = 'Post error!';
					} else if (responseStatus == 200) {
						const postedURL = 'index.html#' + responseText;

						window.location.href = postedURL;
					}
				});
			};

			/**
			 * { CKEDITOR }
			 * Init the editor on page and set up submit button
			 */
/*			const editor = window.CKEDITOR.replace('markdownEditor'); // bind editor

			editor.addCommand('postSubmition', { // create named command for post submition
				exec : function() {
					submitPost(window.CKEDITOR.instances.markdownEditor.getData());
				}
			});

			editor.ui.addButton('submitpost', { // add new button and bind our command
				label : 'Submit post',
				command : 'postSubmition',
				toolbar : 'styles'
			});
*/

			try {
				ClassicEditor.create(document.querySelector('#markdownEditor'), {
					plugins : [
							//Autoformat,
							//ArticlePreset,
							Enter,
							Headings,
							Typing,
							Paragraph,
							Undo,
							Bold,
							//Italic,
							Image,
							Link,
							List,
							Test
						],
						toolbar: [
							'headings',
							'bold',
							'italic',
							'link',
							'unlink',
							'bulletedList',
							'numberedList',
							'undo',
							'redo'
						 ]
				}).then((editor) => {
					window.editor = editor;

					// Add our custom buttons






				})
				.catch((err) => {
					console.error(err.stack);
				});
			} catch (err) {
				showCompatibilityMessage();
			}

			function showCompatibilityMessage() {
				const editorElement = document.querySelector('#markdownEditor');
				const message = document.createElement('p');

				message.innerHTML = `
					<h2>That's a shame...</h2>
					<p>We're not proud of this but this early developer preview does not work in your web browser.</p>
					<p>Please consider using <a href="https://www.google.com/chrome/">Google Chrome</a> instead.</p>
					<p>We're terribly sorry.</p>
				`;

				message.classList.add('message');

				editorElement.style.display = 'none';
				editorElement.parentNode.insertBefore(message, editorElement);
			}



			/**
			 * { catch a fragmentRequest }
			 * On incoming URL, save the location of the markdown file that you want to edit
			 */
			const fragmentRequest = function() {

				if (window.location.hash) {
					const swarmFragment = window.location.hash.substring(1);

					/**
					 * Grab a document and render it to the container
					 */
					const swarmDocumentPath = readURL + swarmFragment;

					/*eslint-disable */
					const xhr = new XMLHttpRequest();
					/*eslint-enable */

					xhr.onreadystatechange = function() {

						if (xhr.readyState === 4) {

						/**
						 *
						 * Verify URL to check for illegal characters
						 * Verify content type to filter out HTML
						 */
							// Check content type to filter out HTML documents
							// (mind that a 404 always returns an html document so filter)
							const requestContentType = this.getResponseHeader('content-type'),
								contentTypeVerification = support.verify.contentType(requestContentType),
								validContentType = contentTypeVerification.validity,
								contentValidityError = contentTypeVerification.error;

							if (!validContentType && xhr.status != '404') {
								console.log(contentValidityError);

								document.getElementById('markdownEditor').value = 'Oops! We could not find this document.';
								document.title = 'Document error!';

								return;
							}

							/**
								* Check if a document was grabbed or not, handle errors
								*/
							if (xhr.status == '404') {
								document.getElementById('markdownEditor').value = 'Oops! We could not find this document.';
								document.title = 'Document error!';

							} else {
								// Input the document document
								const content = marked(xhr.responseText, { renderer : renderer });

								document.getElementById('markdownEditor').value = content;
							}
						}
					};

					// Send request
					xhr.open('GET', swarmDocumentPath, true);
					xhr.send();
				} else {
					// No request made
					return;
				}
			};

		// Set the fragmentChange function to run each time the window on hash event fires
		window.onhashchange = fragmentRequest;

		// Run the function
		fragmentRequest();
		});
	}());

	return {
		init : init
	};
}());

/**
 * Export
 */
export default index;
