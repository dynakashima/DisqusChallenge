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

// Synchronous read

var data = fs.readFileSync('dictionary.txt');
var lowerData = data.toString().trim().split('\n').map(function(word) {
	return word.toLowerCase();
})
var dictionary = new Set(lowerData);

// mock dictionary for development
// var dictionary = new Set([
// 	'inside',
// 	'job',
// 	'sheep',
// 	'conspiracy',
// 	'wake'
// ]);
function Pair(letter, freq) {
    this.letter = letter;
    this.frequency = freq
}

var VOWELS = new Set(['a', 'e', 'i', 'o', 'u']);
function isVowel(letter) {return VOWELS.contains(letter);}


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

var autocorrect = function(word) {
	// handle lowercase
	word = word.toLowerCase();
	// var possibilities = [word.toLowerCase()];
	var allPossibles = new Set();
	
	// first handle repeated elements
	var freqArr = frequencyArray(word);
	var repeatPossibles = genRepeatLetters(freqArr);
	
	// exit early if repeats produces correct result
	// aka prioritize for repeats
	var repIntersction = repeatPossibles.intersection(dictionary);
	if (repIntersction.length !== 0) {
		return repIntersction.pop();
	}

	// second for each of the elements in returned repeated set
	// create vowel possibilites and add to set
	repeatPossibles.forEach(function(word) {
		var vowelPossForWord = genVowelWordsHelper(word);
		allPossibles.addEach(vowelPossForWord);
	});


	// intersection are the elements that exist in both sets
	// if none exists then no match has occurred
	// this could be changed to then return all possible matches

	var allIntersection = allPossibles.intersection(dictionary);
	
	// comment to hide all possibilties
	console.log(allIntersection.toArray());

	if (allIntersection.length === 0) {
		return 'NO CORRECTION';
	}
	else {
		return allIntersection.pop();
	}
};

//////////////////////////////////////////
/////////////// TEST UTILS ///////////////
//////////////////////////////////////////
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

// // check repeated letters
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

var abcTest = frequencyArray('aaabbcdd');
var abcPossibles = genRepeatLetters(abcTest);
assert(arraysEqual(abcPossibles.toArray(), [
	'abcd',
	'aabcd',
	'aaabcd',
	'abbcd',
	'aabbcd',
	'aaabbcd',
	'abcdd',
	'aabcdd',
	'aaabcdd',
	'abbcdd',
	'aabbcdd',
	'aaabbcdd' ]), true);


// check vowels
assert(arraysEqual(genVowelWordsHelper('hajk').toArray(),[
	'hajk',
	'hejk',
	'hijk',
	'hojk',
	'hujk' ]), true);
assert(genVowelWordsHelper('hajek').length, 25);
assert(arraysEqual(genVowelWordsHelper('hajek').toArray(), [ 
	'hajak',
	'hejak',
	'hijak',
	'hojak',
	'hujak',
	'hajek',
	'hejek',
	'hijek',
	'hojek',
	'hujek',
	'hajik',
	'hejik',
	'hijik',
	'hojik',
	'hujik',
	'hajok',
	'hejok',
	'hijok',
	'hojok',
	'hujok',
	'hajuk',
	'hejuk',
	'hijuk',
	'hojuk',
	'hujuk' ]), true);

// some fail since I return first possibility not just the one
// closest to original word which would require some definition
assert(autocorrect('sheeeeep'), 'sheep');
assert(autocorrect('jjoobbb'), 'job');
assert(autocorrect('weke'), 'wake');
assert(autocorrect('CUNsperrICY'), 'conspiracy');
