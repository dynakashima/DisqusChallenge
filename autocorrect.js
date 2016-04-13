/*
# Word Correction Take-Home

Write a program in JavaScript that reads a large list of English words 
(e.g. from /usr/share/dict/words on a unix system) into memory, and then 
reads words from stdin, and prints either the best spelling correction, 
or "NO CORRECTION" if no suitable correction can be found.

The program should print "> " as a prompt before reading each word, 
and should loop until killed.

For example:

    $node ./spellcorrecter.js
    > sheeeeep
    sheep
    > CUNsperrICY
    conspiracy
    > sheeple
    NO CORRECTION

The class of spelling mistakes to be corrected is as follows:

1. Case (upper/lower) errors `inSIDE -> inside`
2. Repeated letters `jjoobbb -> job`
3. Incorrect vowels `weke -> wake`
4. Any combination of the above types of errors 
`CUNsperrICY -> conspiracy`
conspiracy
consperrICY


Your solution should be faster than O(n) per word checked, where n is the
length of the dictionary. That is to say, you can't scan the dictionary 
every time you want to spellcheck a word.

If there are many possible corrections of an input word, your program can
choose one in any way you like, however your results *must* match the 
examples above (e.g. "sheeeeep" should return "sheep" and not "shap").


## Incorrect Word Generator

Write a second program that generates words with spelling mistakes of the
above form, starting with correctly spelled English words. Pipe its output
into the first program and verify that there are no occurrences of 
"NO CORRECTION" in the output.
*/

var fs = require("fs");
var Set = require("collections/set");
var Dict = require("collections/dict");
var Deque = require("collections/deque");

// Synchronous read

// var data = fs.readFileSync('dictionary.txt');
// var dictionary = data.toString().trim().split('\n');
var dictionary = new Set([
	'inside',
	'job',
	'sheep',
	'conspiracy'
]);

var VOWELS = new Set(['a', 'e', 'i', 'o', 'u']);

var autocorrect = function(word) {
	// handle lowercase

	var possibilities = [word.toLowerCase()];

	for (var i = 0; i < possibilities.length; i++) {
		var possibility = possibilities[i];
		if (dictionary.contains(possibility)) {
			return possibility;
		}
	};
	return 'NO CORRECTION';
};

function genVowelWords(word) {

}

var genRepeatLetters = function(word) {

};

function Pair(letter, freq) {
    this.letter = letter;
    this.freq = freq
}

// build array with count of elements and letter as key
var frequencyArray = function(word) {
	var prevLetter = word[0];
	var toBuild = [new Pair(prevLetter, 1)];
	
	for (var i = 1; i < word.length; i++) {
		var currLetter = word[i];
		if (currLetter === prevLetter) {
			var pair = toBuild.peekBack();
			pair.freq += 1;
		}
		else {
			toBuild.push(new Pair(currLetter, 1));
			prevLetter = currLetter;
		}
	};
	return toBuild;
};

// test cases
function assert(actual, expected) {
	if (expected !== actual) { 
		console.error('FAILED -> got:', actual + ',', 'expected:', expected);
		return 1;
	}
	console.log('passed')
	return 0;
}

assert(autocorrect('inSIDE'), 'inside');
assert(autocorrect('asldfjldasjf'), 'NO CORRECTION');
// assert(genRepeatLetters('abbc'), [
// 	'abbc',
// 	'abc'
// ])

// assert(genRepeatLetters('aabbc'), [
// 	'aabbc',
// 	'abbc',
// 	'aabc',
// 	'abc'
// ])
// assert(genRepeatLetters('aaabbc'), [
// 	'aaabbc'
// 	'aabbc',
// 	'abbc',
// 	'aaabc',
// 	'aabc',
// 	'abc'
// ]);

// assert(autocorrect('sheeeeep'), 'sheep');

// assert(autocorrect('jjoobbb'), 'job');
// assert(autocorrect('jjoobbb'), 'job');
// assert(autocorrect('weke'), 'wake');
// assert(autocorrect('CUNsperrICY'), 'conspiracy');
