class randomWriter {
  // _chainLength;
  // the ngram size

  // _dictionary;
  /* an object of key value pairs
    type: {
      string: [string]
    }
  */

  // _startPoints;
  // [string]
  // represents the beginning of a tweet.

  constructor(ngramSize) {
    this._dictionary = {};
    this._startPoints = [];
    this._chainLength = ngramSize;
  }

  read(string) {
    /* 
      Reads in an object 
        - Adds the first word to the _startPoints array
        - Adds each item of the _chainLength to the dictionary with the following word as the value
        - Adds an end character to the last ngram
    */

    // convert to a usable format
    const wordArray = string.split(' ');

    // create an array large enough to work with
    const workingArray = new Array(this._chainLength + 1);

    for (let i = 0; i < workingArray.length; i++) {
      // map the first items to the array
      workingArray[i] = wordArray[i];
    }

    // add the start point
    this._addStartPoint(workingArray);
    // add the first item to the dictionary
    this._addWordsToDictionary(workingArray);

    for (let i = workingArray.length; i < wordArray.length; i++) {
      // remove the first element
      workingArray.shift();
      // add a new element to the end of the working array
      workingArray.push(wordArray[i]);
      // add the item to the dictionary
      this._addWordsToDictionary(workingArray);
    }

    workingArray.shift();
    // add a possible stop character for the last element
    this._addStopCharacter(workingArray);

    console.log(this._dictionary);
  }

  write(constraint) {
    /*
      Writes out a message
        - Starts at a start point
        - Ends when it hits an end character or exceeds a limit
          - That does not mean that it is less than this limit
    */
    let guardedConstraint;

    if (constraint) {
      guardedConstraint = constraint;
    } else {
      guardedConstraint = 244;
    }

    const startPoint = this._randomItemFromArray(this._startPoints);
    let workingArray = startPoint.split(' ');
    let outputString = '';

    for (let i = 0; i < workingArray.length; i++) {
      outputString += workingArray[i] + ' ';
    }

    while (
      workingArray[workingArray.length - 1] != null &&
      outputString.length < guardedConstraint
    ) {
      workingArray = this._addItemFromDictionary(workingArray);

      if (workingArray[workingArray.length - 1]) {
        outputString += workingArray[workingArray.length - 1] + ' ';

        workingArray.shift();
      }
    }

    return outputString;
  }

  writeStringShorterThan(upperBound) {
    let writing = true;
    let output = '';
    while (writing) {
      output = this.write(upperBound);
      if (output.length < upperBound) {
        writing = false;
      }
    }
    return output;
  }

  _addStartPoint(array) {
    // add the key value that will be derived from this array, to the start points
    this._startPoints.push(this._fetchKey(array));
  }

  _addWordsToDictionary(array) {
    /*
      Adds words to the dictionary
        - Key is everything except the last value of the array
        - Value is the last value of the array
    */
    let key = this._fetchKey(array);
    let value = array[array.length - 1];

    this._guardedAddToDictionary(key, value);
  }

  _addStopCharacter(array) {
    /*
      Adds a null value to the value array for this key
        - This essentially tracks the likelyhood of this key being the last words in a message
        - This is not a set, tracking frequency
        - This will be used to stop writing
    */

    let key = this._fetchKey(array);

    this._guardedAddToDictionary(key, null);
  }

  _fetchKey(array) {
    // fetches the key value from the array

    let key = '';

    for (let i = 0; i < this._chainLength; i++) {
      key += array[i];
      if (i < this._chainLength - 1) {
        // if we aren't dealing with the last value, put a space after it.
        key += ' ';
      }
    }

    return key;
  }

  _guardedAddToDictionary(key, value) {
    // check if the value exists.
    if (this._dictionary[key]) {
      // if it does, add to the array.
      this._dictionary[key].push(value);
    } else {
      // otherwise, create an array with this value.
      this._dictionary[key] = [value];
    }
  }

  _randomValueFromKey(key) {
    // Selects a random item from the possibles that follow this key

    const listOfPossibles = this._dictionary[key];
    // this is an array of strings, one may potentially be an end of tweet character
    // it may also be null

    if (listOfPossibles) {
      // return a random item from that array
      return this._randomItemFromArray(listOfPossibles);
    } else {
      // otherwise return null.
      return null;
    }
  }

  _randomItemFromArray(array) {
    // get a random number that is not 1
    let rand = 1;
    while (rand === 1) {
      rand = Math.random();
    }
    // turn that into an index
    const randIndex = Math.floor(rand * array.length);
    // then return the item at that index
    return array[randIndex];
  }

  _addItemFromDictionary(array) {
    const key = this._fetchKey(array);
    const value = this._randomValueFromKey(key);
    // make this functional
    array.push(value);
    return array;
  }
}

module.exports.writer = randomWriter;
