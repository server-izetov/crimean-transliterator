# Crimean Tatar Transliterator - Project Rules

## Project Overview
A Google Docs Add-on for bidirectional transliteration between Crimean Tatar Cyrillic and Latin scripts, following official orthography rules from ana-yurt.com.

## Core Transliteration Rules

### Cyrillic to Latin (cyr2lat)

#### Context-Sensitive Vowels
- **Е (ye/e)**: `ye` at word start or after vowels/ь/ъ, otherwise `e`
- **Ё (yo/ö)**: `yo` at word start or after vowels/ь/ъ, otherwise `ö`
- **Ю (yü/yu/ü)**: `yü/yu` at word start (harmony-based), otherwise `ü`
- **Я (ya/â)**: `ya` at word start or after vowels/ь/ъ, otherwise `â`

#### Vowel Harmony for О/У
**Default behavior**: Apply soft/hard harmony based on word composition
- **Soft indicators**: ь, е, ё, и, ю, я → use `ö`/`ü`
- **Hard indicators**: ы, а → force `o`/`u` (overrides soft indicators)

**Q/Ğ Constraint**: After `къ` or `гъ`, always use hard `o`/`u`

**Hard Exceptions** (always use `o`/`u` despite soft vowels):
- О: `bob`, `yok`, `хорезм`, `куня`
- У: `сув`, `мункунь`, `куня`, `турк`

**Soft Exceptions** (always use `ö`/`ü`):
- Ü: `ургенч`, `умер`, `усеин`, `учь`, `учюн`, `уйле`, `ульке`, `умют`, `урьмет`, `устюнде`, `усть`

#### Multi-Character Sequences
- `нъ` → `ñ`
- `къ` → `q`
- `гъ` → `ğ`
- `дж` → `c`

#### Special Consonants
- `ц` → `ts`
- `щ` → `şç`
- `ж` → `j`
- `й` → `y`

#### Dotted/Dotless I
- `и` → `i` (dotted), uppercase: `İ`
- `ы` → `ı` (dotless), uppercase: `I`

#### Ignored Characters
- `ь` and `ъ` are skipped (except in multi-char sequences)

### Latin to Cyrillic (lat2cyr)

#### Context-Sensitive Mappings
- **e**: `э` at word start or after vowels, otherwise `е`
- **ö**: `о` at word start or after vowels, otherwise `ё`
- **ü**: `у` at word start or after vowels, otherwise `ю`

#### Multi-Character Sequences
- `ts` → `ц`
- `şç` → `щ`
- `ya` → `я`
- `ye` → `е`
- `yo` → `ё`
- `yu` → `ю`
- `yü` → `ю`

#### Special Exception
- `türk` → `турк` (handles TÜRKMEN → ТУРКМЕН correctly)

#### Soft Sign Insertion
- After `l` (→ `л`): Insert `ь` if previous vowel is soft (e, i, ö, ü) and next char is consonant or end of word

## Testing Requirements

### Test Coverage Must Include
1. **Basic mappings**: All single-character and multi-character sequences
2. **Case handling**: lowercase, Title Case, ALL CAPS
3. **Vowel harmony**: Both soft and hard words
4. **Exceptions**: All hard/soft exception words
5. **Q/Ğ constraint**: Words with `къо`, `къу`, `гъо`, `гъу`
6. **Word boundaries**: Start-of-word logic for `я`, `е`, `ё`, `ю`
7. **Round-trip**: Cyrillic → Latin → Cyrillic should preserve meaning

### Critical Test Cases
```javascript
// Vowel harmony
{ input: "сувнен", expected: "suvnen" },      // Hard exception
{ input: "учмагьа", expected: "uçmaga" },     // Hard due to 'а'
{ input: "учип", expected: "üçip" },          // Soft due to 'и'
{ input: "огде", expected: "ögde" },          // Soft word
{ input: "корюнди", expected: "köründi" },    // Soft word

// Q/Ğ constraint
{ input: "къуллеси", expected: "qullesi" },   // Force hard 'u'
{ input: "къуруджылыгьыны", expected: "qurucılıgını" }, // Force hard, plus 'ы'

// Exceptions
{ input: "туркмен", expected: "turkmen" },    // Hard exception
{ input: "Куня-Ургенч", expected: "Kunâ-Ürgenç" }, // Mixed

// Word boundaries
{ input: " ешиль", expected: " yeşil" },      // Space before
{ input: "я", expected: "ya" },               // Start of text
```

## Code Organization

### File Structure
```
/home/ubuntu/projects/personal/crimean-transliterator/
├── Code.js                 # Google Apps Script server-side logic
├── Transliteration.js      # Core transliteration engine
├── Sidebar.html           # Client-side UI
├── appsscript.json        # Manifest with OAuth scopes
├── .gitignore             # Excludes samples/, node_modules/, .clasp.json
└── samples/               # Test files (not in git)
```

### Key Functions
- `transliterateText(text, mode)`: Main entry point
- `cyrillicToLatin(text)`: Cyrillic → Latin conversion
- `latinToCyrillic(text)`: Latin → Cyrillic conversion
- `isVowel(char)`, `isSoftVowel(char)`: Helper functions
- `matchCase(str)`: Preserves case (lowercase, Title, ALL CAPS)

## Development Workflow

### Making Changes
1. **Never auto-commit** unless explicitly requested by user
2. **Test locally** before deploying to Google Apps Script
3. **Run comprehensive tests** after any transliteration logic changes
4. **Preserve all test cases** - don't delete previous test files without asking

### Testing Locally
```bash
# Concatenate and run tests
cat Transliteration.js test_file.js > test_run.js && node test_run.js

# Clean up
rm test_run.js
```

### Deployment to Google Docs
User handles deployment manually via Google Apps Script editor. Never auto-deploy.

## Common Pitfalls

### Avoid These Mistakes
1. **Disabling vowel harmony heuristic** - It's needed for most words, use exceptions instead
2. **Forgetting Q/Ğ constraint** - Always check for `къ`/`гъ` before applying harmony
3. **Ignoring 'ы' and 'а'** - These override soft indicators
4. **Breaking word-start logic** - Check for non-Cyrillic prevChar, not just i===0
5. **Removing test cases** - Keep all tests to prevent regressions

### Code Cleanup Rules
1. **Remove verbose comments** - Keep only essential explanations
2. **Fix section numbering** - Ensure logical order
3. **Test after cleanup** - Syntax errors are easy to introduce
4. **Don't remove exception lists** - They're critical for correctness

## OAuth Scopes Required
```json
{
  "oauthScopes": [
    "https://www.googleapis.com/auth/documents.currentonly",
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/script.locale"
  ]
}
```

## Reference Documentation
- Official rules: https://ana-yurt.com/qrt/krymskotatarskiy-latinskiy-alfavit-pravila-chteniya-napisaniya
- Vowel harmony: Section 7.1 (first syllable rules)
- Exception words: Listed in official documentation

## Version History

### Latest (Current)
- ✅ Fixed all vowel harmony issues
- ✅ Implemented Q/Ğ constraint
- ✅ Added hard/soft exception lists
- ✅ Fixed word-start logic for я/е/ё/ю
- ✅ Refined 'ы'/'а' override logic
- ✅ All reported bugs resolved

### Known Limitations
- Soft sign insertion for `л` is heuristic-based (may need manual correction in edge cases)
- Proper nouns may require manual exception list updates
- Loanwords may not follow standard harmony rules

## User Preferences
- **No auto-commit**: Always wait for explicit user approval
- **Test thoroughly**: Run full test suite before claiming completion
- **Keep samples local**: samples/ folder excluded from git
- **Preserve test files**: Don't delete without asking
