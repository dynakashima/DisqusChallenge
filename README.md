===========================
========== SETUP ==========
===========================
*** tests for code is at the bottom of autocorrect.js ***
*** run these commands before starting ***
npm install --save collections
node autocorrect.js

==============================
========== SOLUTION ==========
==============================
Basic approach to this problem is to first 
1) 	read in the large text file representing the dictionary

2) 	and then convert it into a set for constant lookup time on queries.

3)	based on the incorrect word, generate possible words based on the
	constraints given in the spec i.e. (duplicates, lowercase, and 
	incorrect vowels) this approach is as follows.

		3.1)	generate all of the possiblites for repeated letters

		3.2) 	generate all of the possibilites for vowels for each
				possiblity of the repeated letters

		3.3)	query all of the possibilites against the dictionary


====================================
========== KNOWN PROBLEMS ==========
====================================
Due to some time constraints I was unable to finish certain aspects
of the spec most are in my opinion minor and with a few hours I should
be able to finish but I wanted to submit on time.

1)	does not have REPL aka prompt this could be added just need to look
	up how it is done in node (first time).  Has to be run as described 
	in Setup section above although tests still exist if you look
	at the bottom of autocorrect.js.

2)	cap check does not very robust since I would return the uncapitalized
	version of the word which i noticed is not always the case within the
	dictionary. should be easy fix where I keep track of the original AND
	the lowercase version when reading in the dictionary and return the
	original instead of the lowercase version. Would still allow constant
	lookup if we use the lowercase version as the key.

3)	As described in the solution there can be multiple matches found for
	a given incorrect input which is why weke (weka or wake) example when 
	run does not pass.  This can also be fixed by prioritizing the multiple 
	results at the end by most similar to original word.  This would require 
	a function that would give weights or distances between words that someone 
	would define. (read this online -> Levenshtein distance). From there it 
	would just be prioritizing/sorting of possible words and returning top 
	value.

4) 	did not have to create the second problem i.e. incorrect word generator.
	But, itshould be pretty similar to code to where i generated the 
	possibilties with some constraints (example limit on repeated letters etc).