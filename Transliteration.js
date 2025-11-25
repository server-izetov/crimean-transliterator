/**
 * Transliterates text based on the specified mode.
 *
 * @param {string} text The text to transliterate.
 * @param {string} mode The mode: 'cyr2lat' or 'lat2cyr'.
 * @return {string} The transliterated text.
 */
function transliterateText(text, mode) {
    if (!text) return "";

    if (mode === 'cyr2lat') {
        return cyrillicToLatin(text);
    } else {
        return latinToCyrillic(text);
    }
}

function isVowel(char) {
    return /[аеёиоуыэюяАЕЁИОУЫЭЮЯ]/.test(char);
}

function isSoftVowel(char) {
    return /[еёиюяЕЁИЮЯ]/.test(char);
}

function isLatinVowel(char) {
    return /[aeiouöüâAEIOUÖÜÂ]/.test(char);
}

function isLatinSoftVowel(char) {
    return /[eiöüEIÖÜ]/.test(char);
}

function cyrillicToLatin(text) {
    var result = "";
    var len = text.length;

    for (var i = 0; i < len; i++) {
        var char = text[i];
        var nextChar = (i + 1 < len) ? text[i + 1] : "";
        var prevChar = (i - 1 >= 0) ? text[i - 1] : "";

        var lowerChar = char.toLowerCase();
        var isUpper = char !== lowerChar;

        // Helper to match case
        var matchCase = function (str) {
            if (!str) return "";
            if (isUpper) {
                if (str.length > 1 && nextChar && nextChar === nextChar.toUpperCase()) {
                    return str.toUpperCase(); // ALL CAPS
                }
                return str.charAt(0).toUpperCase() + str.slice(1); // Title Case
            }
            return str;
        };

        // 1. Handle Multi-character sequences first

        // Нъ -> Ñ
        if (lowerChar === 'н' && nextChar.toLowerCase() === 'ъ') {
            result += matchCase("ñ");
            i++; continue;
        }

        // Къ -> Q
        if (lowerChar === 'к' && nextChar.toLowerCase() === 'ъ') {
            result += matchCase("q");
            i++; continue;
        }

        // Гъ -> Ğ
        if (lowerChar === 'г' && nextChar.toLowerCase() === 'ъ') {
            result += matchCase("ğ");
            i++; continue;
        }

        // Дж -> C
        if (lowerChar === 'д' && nextChar.toLowerCase() === 'ж') {
            result += matchCase("c");
            i++; continue;
        }

        // 2. Handle Context-sensitive vowels

        // Helper to check if char is a Cyrillic letter
        var isCyrillic = function (c) {
            return /[а-яА-ЯёЁ]/.test(c);
        };

        // Е -> ye (start of word, after vowel, after ь/ъ) / e (else)
        if (lowerChar === 'е') {
            // Start of word means: i===0 OR prevChar is NOT a Cyrillic letter
            if (i === 0 || !isCyrillic(prevChar) || isVowel(prevChar) || prevChar === 'ь' || prevChar === 'ъ' || prevChar === 'Ь' || prevChar === 'Ъ') {
                result += matchCase("ye");
            } else {
                result += matchCase("e");
            }
            continue;
        }

        // Ё -> yo (start of word, after vowel, after ь/ъ) / ö (after consonant)
        if (lowerChar === 'ё') {
            if (i === 0 || !isCyrillic(prevChar) || isVowel(prevChar) || prevChar === 'ь' || prevChar === 'ъ' || prevChar === 'Ь' || prevChar === 'Ъ') {
                result += matchCase("yo");
            } else {
                result += matchCase("ö");
            }
            continue;
        }

        // Ю -> yü/yu (start of word, after vowel, after ь/ъ) / ü (after consonant)
        if (lowerChar === 'ю') {
            if (i === 0 || !isCyrillic(prevChar) || isVowel(prevChar) || prevChar === 'ь' || prevChar === 'ъ' || prevChar === 'Ь' || prevChar === 'Ъ') {
                // Heuristic: Check vowel harmony of the REST of the word to decide yü vs yu
                // If unsure, default to yü (common in soft words) or yu?
                // Rule: "affixes with e -> yü", "affixes with a -> yu"
                // Let's scan ahead for the next vowel
                var isSoft = true; // Default to soft
                for (var k = i + 1; k < len; k++) {
                    if (isVowel(text[k])) {
                        if ("аоуы".indexOf(text[k].toLowerCase()) !== -1) {
                            isSoft = false;
                        }
                        break; // Found next vowel
                    }
                    // Stop at word boundary
                    if (!isCyrillic(text[k])) break;
                }

                result += matchCase(isSoft ? "yü" : "yu");
            } else {
                result += matchCase("ü");
            }
            continue;
        }

        // Я -> ya (start of word, after vowel, after ь/ъ) / â (after consonant)
        if (lowerChar === 'я') {
            if (i === 0 || !isCyrillic(prevChar) || isVowel(prevChar) || prevChar === 'ь' || prevChar === 'ъ' || prevChar === 'Ь' || prevChar === 'Ъ') {
                result += matchCase("ya");
            } else {
                result += matchCase("â");
            }
            continue;
        }

        // 3. Handle Special Consonants

        // Ц -> ts
        if (lowerChar === 'ц') {
            result += matchCase("ts");
            continue;
        }

        // Щ -> şç
        if (lowerChar === 'щ') {
            result += matchCase("şç");
            continue;
        }

        // Ж -> j (since we already handled dzh -> c)
        if (lowerChar === 'ж') {
            result += matchCase("j");
            continue;
        }

        // Й -> y
        if (lowerChar === 'й') {
            result += matchCase("y");
            continue;
        }

        // 4. Handle Vowels I/Y

        // И -> i (dotted)
        if (lowerChar === 'и') {
            // Special handling for Uppercase И -> İ
            if (isUpper) result += "İ";
            else result += "i";
            continue;
        }

        // Ы -> ı (dotless)
        if (lowerChar === 'ы') {
            // Special handling for Uppercase Ы -> I
            if (isUpper) result += "I";
            else result += "ı";
            continue;
        }

        // Э -> e
        if (lowerChar === 'э') {
            result += matchCase("e");
            continue;
        }

        // 5. Ignored characters
        if (lowerChar === 'ь' || lowerChar === 'ъ') {
            continue; // Skip
        }

        // 7. Handle O and U with Vowel Harmony (Softness)
        // О -> ö (if word is soft) / o (else)
        if (lowerChar === 'о') {
            // Find the word boundaries around current char
            var wordStart = i;
            while (wordStart > 0 && /[а-яА-ЯёЁ]/.test(text[wordStart - 1])) wordStart--;
            var wordEnd = i;
            while (wordEnd < len && /[а-яА-ЯёЁ]/.test(text[wordEnd])) wordEnd++;
            var word = text.substring(wordStart, wordEnd);
            var lowerWord = word.toLowerCase();

            // Exceptions where O stays O despite soft vowels (Force Hard)
            // "bob", "yok", "horezm" (proper noun), "kunâ" (proper noun part?)
            var exceptionsHard = ["bob", "yok", "хорезм", "куня"];

            var isHardException = false;
            for (var k = 0; k < exceptionsHard.length; k++) {
                // Check if word starts with exception root?
                // "хорезм" -> "хорезмнин". "куня" -> "куня-ургенч" (word is "куня").
                if (lowerWord === exceptionsHard[k] || lowerWord.indexOf(exceptionsHard[k]) === 0) {
                    isHardException = true; break;
                }
            }

            if (isHardException) {
                result += matchCase("o");
                continue;
            }

            // Check for softness in the word
            var isSoft = /[ьЬеЕёЁиИюЮяЯ]/.test(word);

            if (isSoft) {
                result += matchCase("ö");
            } else {
                result += matchCase("o");
            }
            continue;
        }

        // У -> ü (if word is soft) / u (else)
        if (lowerChar === 'у') {
            var wordStart = i;
            while (wordStart > 0 && /[а-яА-ЯёЁ]/.test(text[wordStart - 1])) wordStart--;
            var wordEnd = i;
            while (wordEnd < len && /[а-яА-ЯёЁ]/.test(text[wordEnd])) wordEnd++;
            var word = text.substring(wordStart, wordEnd);
            var lowerWord = word.toLowerCase();

            // Exceptions where U stays U despite soft vowels (Force Hard)
            // "suv" (water) -> "suvnen" (hard root, soft suffix)
            // "munkun" (user preference)
            // "kunâ" (if it contains u?) -> "куня" has u.
            var exceptionsHardU = [
                "сув", "мункунь", "куня"
            ];

            var isHardExceptionU = false;
            for (var k = 0; k < exceptionsHardU.length; k++) {
                if (lowerWord === exceptionsHardU[k] || lowerWord.indexOf(exceptionsHardU[k]) === 0) {
                    isHardExceptionU = true;
                    break;
                }
            }

            if (isHardExceptionU) {
                result += matchCase("u");
                continue;
            }

            // Exceptions where U becomes Ü (Force Soft) - usually covered by heuristic, but good for safety
            var exceptionsÜ = ["ургенч", "умер", "усеин", "учь", "учюн", "уйле", "ульке", "умют", "урьмет", "устюнде", "усть"];

            var isExceptionÜ = false;
            for (var k = 0; k < exceptionsÜ.length; k++) {
                if (lowerWord === exceptionsÜ[k] || lowerWord.indexOf(exceptionsÜ[k]) === 0) {
                    isExceptionÜ = true; break;
                }
            }

            if (isExceptionÜ) {
                result += matchCase("ü");
                continue;
            }

            if (/[ьЬеЕёЁиИюЮяЯ]/.test(word)) {
                result += matchCase("ü");
            } else {
                result += matchCase("u");
            }
            continue;
        }
        // 6. Simple Mapping
        var map = {
            'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
            'з': 'z', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
            'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
            'ф': 'f', 'х': 'h', 'ч': 'ç', 'ш': 'ş'
        };

        if (map[lowerChar]) {
            result += matchCase(map[lowerChar]);
        } else {
            // Keep original if not Cyrillic or unknown
            result += char;
        }
    }
    return result;
}

function latinToCyrillic(text) {
    var result = "";
    var len = text.length;

    for (var i = 0; i < len; i++) {
        var char = text[i];
        var nextChar = (i + 1 < len) ? text[i + 1] : "";
        var nextNextChar = (i + 2 < len) ? text[i + 2] : "";
        var prevChar = (i - 1 >= 0) ? text[i - 1] : "";

        var lowerChar = char.toLowerCase();
        var isUpper = char !== lowerChar;

        var matchCase = function (str) {
            if (!str) return "";
            if (isUpper) {
                // Debug logging
                // console.log("matchCase: " + str + ", nextChar: " + nextChar);
                if (str.length > 1 && nextChar && nextChar === nextChar.toUpperCase() && /[A-ZÖÜİÂ]/.test(nextChar)) {
                    // Added check for actual letter to avoid matching spaces/punctuation as "upper"
                    return str.toUpperCase(); // ALL CAPS
                }
                return str.charAt(0).toUpperCase() + str.slice(1);
            }
            return str;
        };

        // Exception: Türk -> Турк (to handle TÜRKMEN -> ТУРКМЕН)
        if (lowerChar === 't' && text.substr(i, 4).toLowerCase() === 'türk') {
            var segment = text.substr(i, 4);
            var isAllUpper = segment === segment.toUpperCase();
            var isTitle = segment[0] === segment[0].toUpperCase();

            if (isAllUpper) result += "ТУРК";
            else if (isTitle) result += "Турк";
            else result += "турк";

            i += 3;
            continue;
        }

        // Multi-char sequences

        // ts -> ц
        if (lowerChar === 't' && nextChar.toLowerCase() === 's') {
            result += matchCase("ц");
            i++; continue;
        }

        // şç -> щ
        if (lowerChar === 'ş' && nextChar.toLowerCase() === 'ç') {
            result += matchCase("щ");
            i++; continue;
        }

        // ya -> я
        if (lowerChar === 'y' && nextChar.toLowerCase() === 'a') {
            result += matchCase("я");
            i++; continue;
        }

        // ye -> е (start/after vowel) or just е?
        // In Cyrillic, 'е' at start is 'ye' sound.
        // So 'ye' -> 'е' always works for 'ye' sound.
        // But what about 'e' -> 'э' (start) vs 'е' (consonant)?
        if (lowerChar === 'y' && nextChar.toLowerCase() === 'e') {
            result += matchCase("е");
            i++; continue;
        }

        // yo -> ё
        if (lowerChar === 'y' && nextChar.toLowerCase() === 'o') {
            result += matchCase("ё");
            i++; continue;
        }

        // yu -> ю
        if (lowerChar === 'y' && nextChar.toLowerCase() === 'u') {
            result += matchCase("ю");
            i++; continue;
        }

        // yü -> ю
        if (lowerChar === 'y' && nextChar.toLowerCase() === 'ü') {
            result += matchCase("ю");
            i++; continue;
        }

        // Single chars

        // â -> я
        if (lowerChar === 'â') {
            result += matchCase("я");
            continue;
        }

        // ö -> ё (after consonant) / о (start? no, ö is always soft)
        // Actually rule says: ö -> ё (after consonant).
        // What if start? 'örnek' -> 'орьнек'.
        // So ö at start -> о + soft sign somewhere?
        // Rule 3: "ö reads as ё in söyle". "örnek -> орьнек".
        // So ö -> ё (after consonant).
        // ö -> о (start). And likely implies softness later.
        if (lowerChar === 'ö') {
            if (i === 0 || isLatinVowel(prevChar)) {
                // Start of word: örnek -> орьнек. öz -> озь.
                // It maps to 'о'. The softness 'ь' usually comes after the NEXT consonant.
                // This is hard to automate perfectly.
                // Let's map to 'о' and hope for best, or 'ё' if we want to preserve sound?
                // But 'ё' at start is 'yo'. 'örnek' is not 'yörnek'.
                // So it must be 'о'.
                result += matchCase("о");
            } else {
                result += matchCase("ё");
            }
            continue;
        }

        // ü -> ю (after consonant) / у (start?)
        // üç -> учь. sürmek -> сюрмек.
        // So ü -> ю (after consonant).
        // ü -> у (start).
        if (lowerChar === 'ü') {
            if (i === 0 || isLatinVowel(prevChar)) {
                result += matchCase("у");
            } else {
                result += matchCase("ю");
            }
            continue;
        }

        // e -> э (start of word or after vowel) / е (after consonant)
        if (lowerChar === 'e') {
            // Check if start of string, after vowel, or after non-letter (word boundary)
            var isWordStart = i === 0 || /[^a-zA-ZñÑçÇşŞğĞıİöÖüÜâÂ]/.test(prevChar);
            if (isWordStart || isLatinVowel(prevChar)) {
                result += matchCase("э");
            } else {
                result += matchCase("е");
            }
            continue;
        }

        // c -> дж
        if (lowerChar === 'c') {
            result += matchCase("дж");
            continue;
        }

        // ç -> ч
        if (lowerChar === 'ç') {
            result += matchCase("ч");
            continue;
        }

        // ş -> ш
        if (lowerChar === 'ş') {
            result += matchCase("ш");
            continue;
        }

        // ğ -> гъ
        if (lowerChar === 'ğ') {
            result += matchCase("гъ");
            continue;
        }

        // ñ -> нъ
        if (lowerChar === 'ñ') {
            result += matchCase("нъ");
            continue;
        }

        // q -> къ
        if (lowerChar === 'q') {
            result += matchCase("къ");
            continue;
        }

        // j -> ж
        if (lowerChar === 'j') {
            result += matchCase("ж");
            continue;
        }

        // ı -> ы
        if (lowerChar === 'ı') {
            result += matchCase("ы");
            continue;
        }

        // i -> и
        if (lowerChar === 'i' || char === 'İ') {
            result += isUpper ? "И" : "и";
            continue;
        }

        // y -> й
        if (lowerChar === 'y') {
            result += matchCase("й");
            continue;
        }

        // Simple Map
        var map = {
            'a': 'а', 'b': 'б', 'v': 'в', 'g': 'г', 'd': 'д',
            'z': 'з', 'k': 'к', 'l': 'л', 'm': 'м', 'n': 'н',
            'o': 'о', 'p': 'п', 'r': 'р', 's': 'с', 't': 'т',
            'u': 'у', 'f': 'ф', 'h': 'х'
        };

        if (map[lowerChar]) {
            var cyr = map[lowerChar];
            result += matchCase(cyr);

            // Heuristic for 'ь' insertion
            // If we just wrote 'л' (from 'l') and the word is "soft" (contains e, i, ö, ü)
            // and 'l' is at end of word or before consonant -> 'ль'
            // Example: kelmek -> келмек -> want кельмек
            // til -> тил -> want тиль
            // ol -> ол (hard) -> ол
            if (lowerChar === 'l') {
                // Check if word is soft (look ahead and behind for soft vowels)
                // This is expensive to check every time.
                // Simplified: Check if PREVIOUS vowel was soft?
                // 'kel' -> 'e' is soft.
                // 'til' -> 'i' is soft.
                // 'gol' -> 'o' is hard.

                // Find last vowel
                var lastVowel = null;
                for (var k = i - 1; k >= 0; k--) {
                    if (isLatinVowel(text[k])) {
                        lastVowel = text[k];
                        break;
                    }
                    if (/[^a-zA-ZñÑçÇşŞğĞıİöÖüÜâÂ]/.test(text[k])) break; // word boundary
                }

                if (lastVowel && isLatinSoftVowel(lastVowel)) {
                    // Check if next is consonant or end of word
                    if (!nextChar || !isLatinVowel(nextChar)) {
                        result += "ь";
                    }
                }
            }

        } else {
            result += char;
        }
    }

    return result;
}
