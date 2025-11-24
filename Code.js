/**
 * @OnlyCurrentDoc
 *
 * The above comment directs Apps Script to limit the scope of file
 * access for this add-on. It specifies that this add-on will only
 * attempt to read or modify the files in which the add-on is used,
 * and not all of the user's files. The authorization request message
 * presented to users will reflect this limited scope.
 */

/**
 * Creates a menu entry in the Google Docs UI when the document is opened.
 * This method is only used by the regular add-on, and is never called by
 * the mobile add-on version.
 *
 * @param {object} e The event parameter for a simple onOpen trigger. To
 *     determine which authorization mode (ScriptApp.AuthMode) the trigger is
 *     running in, inspect e.authMode.
 */
function onOpen(e) {
    DocumentApp.getUi().createAddonMenu()
        .addItem('Start Transliteration', 'showSidebar')
        .addToUi();
}

/**
 * Runs when the add-on is installed.
 * This method is only used by the regular add-on, and is never called by
 * the mobile add-on version.
 *
 * @param {object} e The event parameter for a simple onInstall trigger. To
 *     determine which authorization mode (ScriptApp.AuthMode) the trigger is
 *     running in, inspect e.authMode.
 */
function onInstall(e) {
    onOpen(e);
}

/**
 * Opens a sidebar in the document containing the add-on's user interface.
 * This method is only used by the regular add-on, and is never called by
 * the mobile add-on version.
 */
function showSidebar() {
    var ui = HtmlService.createHtmlOutputFromFile('Sidebar')
        .setTitle('Crimean Tatar Transliterator');
    DocumentApp.getUi().showSidebar(ui);
}

/**
 * Transliterates the selected text or the whole document.
 *
 * @param {string} mode The transliteration mode ('cyr2lat' or 'lat2cyr').
 * @param {boolean} selectionOnly True if only selected text should be processed.
 * @return {object} Result object with status and message.
 */
function processTransliteration(mode, selectionOnly) {
    try {
        var doc = DocumentApp.getActiveDocument();
        var body = doc.getBody();
        var textToProcess = "";
        var range = null;

        if (selectionOnly) {
            var selection = doc.getSelection();
            if (selection) {
                var elements = selection.getRangeElements();
                for (var i = 0; i < elements.length; i++) {
                    var element = elements[i];
                    // Only process text elements for now
                    if (element.getElement().getType() === DocumentApp.ElementType.TEXT) {
                        var textElement = element.getElement().asText();
                        var startOffset = element.isPartial() ? element.getStartOffset() : 0;
                        var endOffset = element.isPartial() ? element.getEndOffsetInclusive() : textElement.getText().length - 1;

                        var text = textElement.getText().substring(startOffset, endOffset + 1);
                        var transliterated = transliterateText(text, mode);

                        textElement.deleteText(startOffset, endOffset);
                        textElement.insertText(startOffset, transliterated);
                    }
                }
                return { success: true, message: "Selection transliterated." };
            } else {
                return { success: false, message: "No text selected." };
            }
        } else {
            // Process whole document
            // This is a naive implementation. For large docs, we might need to batch this.
            var text = body.getText();
            var transliterated = transliterateText(text, mode);
            body.setText(transliterated);
            return { success: true, message: "Document transliterated." };
        }
    } catch (e) {
        return { success: false, message: "Error: " + e.toString() };
    }
}
