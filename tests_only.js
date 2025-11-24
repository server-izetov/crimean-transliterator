
// Tests
var tests = [
    { input: "джан", expected: "can", mode: "cyr2lat" },
    { input: "аджеба", expected: "aceba", mode: "cyr2lat" },
    { input: "эгер", expected: "eger", mode: "cyr2lat" },
    { input: "келе", expected: "kele", mode: "cyr2lat" },
    { input: "гъам", expected: "ğam", mode: "cyr2lat" },
    { input: "ынтылма", expected: "ıntılma", mode: "cyr2lat" },
    { input: "ичмек", expected: "içmek", mode: "cyr2lat" },
    { input: "желатин", expected: "jelatin", mode: "cyr2lat" },
    { input: "манъа", expected: "maña", mode: "cyr2lat" },
    { input: "сёйле", expected: "söyle", mode: "cyr2lat" },
    { input: "ёкъ", expected: "yoq", mode: "cyr2lat" },
    { input: "къалмакъ", expected: "qalmaq", mode: "cyr2lat" },
    { input: "шимди", expected: "şimdi", mode: "cyr2lat" },
    { input: "учь", expected: "üç", mode: "cyr2lat" },
    { input: "сюрмек", expected: "sürmek", mode: "cyr2lat" },
    { input: "яхшы", expected: "yahşı", mode: "cyr2lat" },
    { input: "селям", expected: "selâm", mode: "cyr2lat" },
    { input: "акция", expected: "aktsiya", mode: "cyr2lat" },
    { input: "ящик", expected: "yaşçik", mode: "cyr2lat" },

    // User reported bug
    { input: "УСТА КЪУШ. ТУРКМЕН ЭФСАНЕСИ.", expected: "USTA QUŞ. TÜRKMEN EFSANESİ.", mode: "cyr2lat" },
    { input: "USTA QUŞ. TÜRKMEN EFSANESİ.", expected: "УСТА КЪУШ. ТУРКМЕН ЭФСАНЕСИ.", mode: "lat2cyr" },

    // Reverse
    { input: "can", expected: "джан", mode: "lat2cyr" },
    { input: "söyle", expected: "сёйле", mode: "lat2cyr" },
    { input: "kelmek", expected: "кельмек", mode: "lat2cyr" }
];

var failed = 0;
tests.forEach(function (t) {
    var actual = transliterateText(t.input, t.mode);
    if (actual !== t.expected) {
        console.log("FAIL: " + t.input + " -> " + actual + " (expected " + t.expected + ")");
        failed++;
    } else {
        console.log("PASS: " + t.input + " -> " + actual);
    }
});

if (failed === 0) console.log("All tests passed!");
else console.log(failed + " tests failed.");
