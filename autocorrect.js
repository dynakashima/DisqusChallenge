/*
# Word Correction Take-Home

Write a program in JavaScript that reads a large list of English words 
(e.g. from /usr/share/dict/words on a unix system) into memory, and 
then reads words from stdin, and prints either the best spelling 
correction, or "NO CORRECTION" if no suitable correction can be found.

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


Your solution should be faster than O(n) per word checked, where n is 
the length of the dictionary. That is to say, you can't scan the 
dictionary every time you want to spellcheck a word.

If there are many possible corrections of an input word, your program 
can choose one in any way you like, however your results *must* match 
the examples above (e.g. "sheeeeep" should return "sheep" and not 
"shap").


## Incorrect Word Generator

Write a second program that generates words with spelling mistakes of 
the above form, starting with correctly spelled English words. Pipe its
output into the first program and verify that there are no occurrences 
of "NO CORRECTION" in the output.
*/

var fs = require("fs");
var Set = require("collections/set");
var Dict = require("collections/dict");
var Deque = require("collections/deque");

// Synchronous read

// var data = fs.readFileSync('dictionary.txt');
// var dictionary = data.toString().trim().split('\n');

// mock dictionary for development
var dictionary = new Set([
	'inside',
	'job',
	'sheep',
	'conspiracy'
]);
function Pair(letter, freq) {
    this.letter = letter;
    this.frequency = freq
}

var VOWELS = new Set(['a', 'e', 'i', 'o', 'u']);
function isVowel(letter) {return VOWELS.contains(letter);}

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

// ver similar to gen repeat letters which takes in a word
// and for each word will return a set that has 
// where you start if it is a vowel
function genVowelWordsHelper(word) {
	var retSet = new Set(['']);

	for (var i = 0; i < word.length; i++) {
		var letter = word[i];
		if (isVowel(letter)) {
			var tempSet = retSet.clone();
			retSet.clear();
			VOWELS.forEach(function(vowel) {
				var aSet = addLettersToSet(vowel, tempSet);
				retSet.addEach(aSet);
			});
		}
		else {
			retSet = addLettersToSetHelper(letter, 1, retSet);
		}
	};
	return retSet;
}
// console.log(genVowelWordsHelper('hjk').toArray())
// console.log(genVowelWordsHelper('hajk').toArray())
// should be 
// ['hajk', 'hejk', 'hijk', 'hojk', 'hujk']
// console.log(genVowelWordsHelper('hajek').toArray())

// should be 
// [ 'hajak',
//   'hejak',
//   'hijak',
//   'hojak',
//   'hujak',
//   'hajek',
//   'hejek',
//   'hijek',
//   'hojek',
//   'hujek',
//   'hajik',
//   'hejik',
//   'hijik',
//   'hojik',
//   'hujik',
//   'hajok',
//   'hejok',
//   'hijok',
//   'hojok',
//   'hujok',
//   'hajuk',
//   'hejuk',
//   'hijuk',
//   'hojuk',
//   'hujuk' ]

// algorithm goes like this... 
// create a set if the frequency of letter is one add
// letter to end of every element of the array if it is
function genRepeatLetters(frequencies) {
	var toRet = new Set(['']);

	frequencies.forEach(function(pair) {
		var letter = pair.letter;
		var freq = pair.frequency;
		toRet = addLettersToSetHelper(letter, freq, toRet);
	});
	return toRet;
};

var a = new Pair('a', 3);
var c = new Pair('c', 1)
var b = new Pair('b', 2);
// console.log(genRepeatLetters([a,c,b]).toArray());

// should produce 
// [ 'acb', 'aacb', 'aaacb', 'acbb', 'aacbb', 'aaacbb' ]

// helper function to that given a letter and a frequency:f
// will make f copies of the current set and return a new
// and for each copy, will append the letter f times
// should return 'a', 'aa', 'aaa'
function addLettersToSetHelper(letter, frequency, currSet) {
	var letToAppend = '';
	
	var retSet = new Set();
	
	for (var j = 0; j < frequency; j++) {
		var tempSet = currSet.clone();
		letToAppend += letter;
		var setToAdd = addLettersToSet(letToAppend, tempSet);
		retSet.addEach(setToAdd);
	};
	return retSet;
}
// console.log(addLettersToSetHelper('a', 3, new Set([''])).toArray());
// console.log(addLettersToSetHelper('b', 2, new Set(['a', 'aa', 'aaa'])).toArray());



// returns a new set with letters added doesNot modify inputSet
function addLettersToSet(letters, set) {
	var setToRet = new Set();
	set.forEach(function(key) {
		setToRet.add(key + letters);
	});
	return setToRet;
}

// var testSet = new Set(['a','aa', 'aaa']);

// console.log(testSet.toArray())
// console.log(addLettersToSet('e', testSet).toArray());

// build array with count of elements and letter as key
// this is just for ease to elinate checks within the 
// program for if we are in a duplicate
var frequencyArray = function(word) {
	var prevLetter = word[0];
	var toBuild = [new Pair(prevLetter, 1)];
	
	for (var i = 1; i < word.length; i++) {
		var currLetter = word[i];
		if (currLetter === prevLetter) {
			var pair = toBuild.peekBack();
			pair.frequency += 1;
		}
		else {
			toBuild.push(new Pair(currLetter, 1));
			prevLetter = currLetter;
		}
	};
	return toBuild;
};
// console.log(frequencyArray('helloo'));
// console.log(genRepeatLetters(frequencyArray('helloo')).toArray());

// test cases
function assert(actual, expected) {
	if (expected !== actual) { 
		console.error(
			'FAILED -> got:', actual + ',',
			'expected:', expected
		);
		return 1;
	}
	console.log('passed')
	return 0;
}
// copied from internet to save time helper for array equals testing
function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  a.sort();
  b.sort();
  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}


///////////////////////////////////////
/////////////// TESTING ///////////////
///////////////////////////////////////

// check lowercase
assert(autocorrect('inSIDE'), 'inside');

// check dictionary lookup
assert(autocorrect('asldfjldasjf'), 'NO CORRECTION');

// check repeated letters
var sheeptest = frequencyArray('sheeeeeeep');
var sheepresult = genRepeatLetters(sheeptest);
assert(arraysEqual(sheepresult.toArray(),[
	'shep',
	'sheep',
	'sheeep',
	'sheeeep',
	'sheeeeep',
	'sheeeeeep',
	'sheeeeeeep' ]), true);

assert(genVowelWordsHelper('hajek').length, 25);

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
