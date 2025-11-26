# Crimean Tatar Transliterator

A Google Docs Add-on for bidirectional transliteration between Crimean Tatar Cyrillic and Latin scripts.

## Overview

This add-on provides accurate transliteration between Crimean Tatar Cyrillic and Latin alphabets, following the official orthography rules. It supports both directions:
- **Cyrillic → Latin** (Кириллица → Латиница)
- **Latin → Cyrillic** (Латиница → Кириллица)

The transliteration engine implements complex vowel harmony rules, context-sensitive character mappings, and handles edge cases to ensure accurate conversion.

## Features

- ✅ **Bidirectional transliteration** - Convert text in both directions
- ✅ **Vowel harmony support** - Correctly handles soft/hard vowel distinctions (ö/o, ü/u)
- ✅ **Context-aware conversion** - Special handling for word boundaries and character sequences
- ✅ **Case preservation** - Maintains lowercase, Title Case, and ALL CAPS
- ✅ **Selection or full document** - Process selected text or entire document
- ✅ **Official orthography** - Follows rules from [ana-yurt.com](https://ana-yurt.com/qrt/krymskotatarskiy-latinskiy-alfavit-pravila-chteniya-napisaniya)

## Installation

### For Users

1. Open your Google Doc
2. Go to **Extensions** → **Apps Script**
3. Copy the contents of the following files into the Apps Script editor:
   - `Code.js`
   - `Transliteration.js`
   - `Sidebar.html`
4. Copy the contents of `appsscript.json` to replace the default manifest
5. Save the project
6. Refresh your Google Doc
7. The add-on will appear under **Extensions** → **Crimean Tatar Transliterator**

### For Developers

```bash
# Clone the repository
git clone <repository-url>
cd crimean-transliterator

# Install clasp (Google Apps Script CLI)
npm install -g @google/clasp

# Login to your Google account
clasp login

# Create a new Apps Script project (or use existing)
clasp create --type docs --title "Crimean Tatar Transliterator"

# Push code to Apps Script
clasp push
```

## Usage

1. Open a Google Doc with Crimean Tatar text
2. Go to **Extensions** → **Crimean Tatar Transliterator** → **Open Transliterator**
3. A sidebar will appear with two buttons:
   - **Cyrillic → Latin** - Convert Cyrillic text to Latin
   - **Latin → Cyrillic** - Convert Latin text to Cyrillic
4. Choose whether to process:
   - **Selected text only** (if you have text selected)
   - **Whole document** (if no selection)
5. Click the appropriate button to transliterate

## Examples

### Cyrillic to Latin
```
Input:  УСТА КЪУШ. ТУРКМЕН ЭФСАНЕСИ.
Output: USTA QUŞ. TURKMEN EFSANESİ.

Input:  Биз машнанен кетемиз Куня-Урьгенч шеэрге.
Output: Biz maşnanen ketemiz Kunâ-Ürgenç şeerge.
```

### Latin to Cyrillic
```
Input:  Merhaba, nasılsıñız?
Output: Мерхаба, насылсынъыз?

Input:  Qırımtatar tili çoq güzel.
Output: Къырымтатар тили чокъ гюзель.
```

## Character Mappings

### Cyrillic → Latin

| Cyrillic | Latin | Notes |
|----------|-------|-------|
| А а | A a | |
| Б б | B b | |
| В в | V v | |
| Г г | G g | |
| Гъ гъ | Ğ ğ | |
| Д д | D d | |
| Дж дж | C c | |
| Е е | Ye ye / E e | ye at word start, e after consonants |
| Ё ё | Yo yo / Ö ö | yo at word start, ö after consonants |
| Ж ж | J j | |
| З з | Z z | |
| И и | İ i | Dotted i |
| Й й | Y y | |
| К к | K k | |
| Къ къ | Q q | |
| Л л | L l | |
| М м | M m | |
| Н н | N n | |
| Нъ нъ | Ñ ñ | |
| О о | Ö ö / O o | Vowel harmony rules apply |
| П п | P p | |
| Р р | R r | |
| С с | S s | |
| Т т | T t | |
| У у | Ü ü / U u | Vowel harmony rules apply |
| Ф ф | F f | |
| Х х | H h | |
| Ц ц | Ts ts | |
| Ч ч | Ç ç | |
| Ш ш | Ş ş | |
| Щ щ | Şç şç | |
| Ы ы | I ı | Dotless i |
| Э э | E e | |
| Ю ю | Yü yü / Ü ü | yü at word start, ü after consonants |
| Я я | Ya ya / Â â | ya at word start, â after consonants |

### Special Rules

#### Vowel Harmony (О/У)
The transliteration engine automatically determines whether to use:
- **Soft vowels**: ö, ü (in words with е, ё, и, ю, я, ь)
- **Hard vowels**: o, u (in words with а, ы, or after къ/гъ)

Examples:
- `корюнди` → `köründi` (soft word)
- `сувнен` → `suvnen` (hard exception)
- `къуллеси` → `qullesi` (hard after q)

## Technical Details

### Files

- **Code.js** - Google Apps Script server-side logic (menu, document manipulation)
- **Transliteration.js** - Core transliteration engine with all conversion rules
- **Sidebar.html** - Client-side UI for the add-on
- **appsscript.json** - Manifest file with OAuth scopes and metadata

### OAuth Scopes

The add-on requires the following permissions:
- `https://www.googleapis.com/auth/documents.currentonly` - Access the current document
- `https://www.googleapis.com/auth/drive.file` - Access files created/opened by the add-on
- `https://www.googleapis.com/auth/script.locale` - Display content in user's language

### Testing

Run local tests using Node.js:

```bash
# Create a test file combining the engine and test cases
cat Transliteration.js test_local.js > test_run.js

# Run tests
node test_run.js

# Clean up
rm test_run.js
```

## Development

### Project Structure

```
crimean-transliterator/
├── Code.js                 # Apps Script server-side code
├── Transliteration.js      # Core transliteration engine
├── Sidebar.html           # UI sidebar
├── appsscript.json        # Manifest
├── .gitignore             # Git ignore rules
├── .agent/
│   ├── PROJECT_RULES.md   # Development guidelines
│   └── workflows/         # Deployment workflows
├── samples/               # Test files (not in git)
└── test_local.js          # Local test suite
```

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Running Tests

All changes to transliteration logic must pass the comprehensive test suite:

```javascript
// Example test cases
{ input: "туркмен", expected: "turkmen" },
{ input: "къуллеси", expected: "qullesi" },
{ input: "учмагьа", expected: "uçmaga" },
{ input: "учип", expected: "üçip" },
```

## Known Limitations

- Soft sign (ь) insertion after л is heuristic-based and may need manual correction in rare cases
- Proper nouns may require exception list updates
- Some loanwords may not follow standard vowel harmony rules

## References

- [Official Crimean Tatar Latin Alphabet Rules](https://ana-yurt.com/qrt/krymskotatarskiy-latinskiy-alfavit-pravila-chteniya-napisaniya)
- [Google Apps Script Documentation](https://developers.google.com/apps-script)
- [Google Docs Add-on Guide](https://developers.google.com/apps-script/add-ons/docs)

## License

MIT License

Copyright (c) 2025 Server Izetov

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Author

**Server Izetov**

This is an experimental project fully developed with the [Antigravity](https://deepmind.google/technologies/antigravity/) framework by Google DeepMind - an advanced agentic coding assistant that enables natural language-driven software development.

The entire codebase, including the transliteration engine, Google Apps Script integration, and comprehensive test suite, was created through conversational AI pair programming.

## Support

For issues, questions, or contributions, please [open an issue](link-to-issues) or contact [your-contact].

---

**Note**: This add-on follows the official Crimean Tatar orthography rules and is designed to handle the complexities of vowel harmony and context-sensitive character mappings accurately.
