const checkList = document.getElementById('list1');
checkList.getElementsByClassName('anchor')[0].onclick = function () {
  if (checkList.classList.contains('visible'))
    checkList.classList.remove('visible');
  else checkList.classList.add('visible');
};

const container = document.querySelector('#container');
const spec = document.querySelector('.specialChars');
const com = document.querySelector('.commas');
const space = document.querySelector('.spaces');
const punc = document.querySelector('.punctuation');
const lowerCase = document.querySelector('.lowerCaseLetters')
const caseSens = document.querySelector('#case-sensitive')

caseSens.addEventListener('input', () => caseSensCheck())
spec.addEventListener('input', () => specCheck()); 

const caseSensCheck = () => {
  if(caseSens.checked){
    lowerCase.checked = false;
    lowerCase.disabled = true;
  }
  else {
    lowerCase.disabled = false;
    lowerCase.checked = true;
  }
}

const specCheck = () => {
  if (!spec.checked) {
    com.disabled = true;
    space.disabled = true;
    punc.disabled = true;
    com.checked = false;
    space.checked = false;
    punc.checked = false;
  }
  if (spec.checked) {
    com.disabled = false;
    space.disabled = false;
    punc.disabled = false;
  }
};

caseSensCheck();
specCheck();

const capitalLetters = /[A-Z]+/g;
const lowerCaseLetters = /[a-z]+/g;
const numbers = /\d+/g;
const spaces = /\s+/g;
const commas = /[,;]+/g;
const punctuation = /[.!?\\]+/g;
const specialChars = /[\W|_]+/g;

const regex = [
  capitalLetters,
  lowerCaseLetters,
  numbers,
  specialChars,
  spaces,
  commas,
  punctuation,
];
const include = document.querySelectorAll('#includes');

const speed = document.querySelector('#speed');
const start = document.querySelector('#start');
const reset = document.querySelector('#reset');

const input = document.querySelector('#word');
const header = document.querySelector('#inputValue');

start.addEventListener('click', () =>
  areThereDuplicates(input.value, speed.value)
);
reset.addEventListener('click', () => resetInput(speed.value));
reset.style.visibility = 'hidden';

let collection = {};
let collected = {};

const areThereDuplicates = async (string, delay) => {
  if (Object.keys(collection).length !== 0) return;

  string = string.trim();
  input.value = input.value.trim();
  
  if(caseSens.checked){
    string = string.toUpperCase()
    input.value = input.value.toUpperCase()
  }

  for (let i = 0; i < include.length; i++) {
    if (!include[i].checked) {
      string = string.replace(regex[i], '');
      input.value = string.replace(regex[i], '');
    }
  }
console.log(input.value)
  header.innerHTML = input.value;
  const headerArr = header.innerText.split('');
  // Adds an individual class to each letter in the input.
  // This allows us to have the option to change the color of the text
  const heading = headerArr
    .map((val) => `<span class='heading ${val}'> ${val} </span>`)
    .join('');
  header.innerHTML = heading;
  // Input value becomes an empty string when you run the function
  input.value = '';
  try {
    for (let val in string) {
      // Creates the initial Object so it can make it easier for us to loop through the array
      const value = string[val];
      collection[value] = (collection[value] || 0) + 1;
    }
    for (let val in collection) {
      // This loops gives us the ability to animate the "display of values" (1 by 1) on the page as we are going through the values of the object
      const exclamationMark = val === '!' ? 'Punctuation' : val;
      let content = document.createElement('div');
      let letter = document.createElement('p');
      let box = document.createElement('div');
      letter.innerText = val;
      box.innerHTML = 0;
      container.appendChild(content).className = 'content';
      content.appendChild(letter).className = `letter${exclamationMark} chars`;
      content.appendChild(box).className = `box${exclamationMark} boxes`;
      await new Promise((resolve, reject) => setTimeout(resolve, delay / 4));
    }
    reset.style.visibility = 'visible';
    for (let val in string) {
      const value = string[val];
      const exclamationMark = value === '!' ? 'Punctuation' : `${value}`;
      // Need this logic so we won't get undefined for our results.
      collected[value] = (collected[value] || 0) + 1;
      let letter = document.getElementsByClassName(`letter${exclamationMark}`);
      const num = document.getElementsByClassName(`box${exclamationMark}`);
      const headingLetter = document.getElementsByClassName(`heading`);
      letter[0].style.backgroundColor = 'blue';
      num[0].innerHTML = collected[value];
      headingLetter[val].style.color = 'green';
      await new Promise((resolve, reject) => setTimeout(resolve, delay));
      letter[0].style.backgroundColor = 'white';
      await new Promise((resolve, reject) => setTimeout(resolve, delay / 2.5));
      letter[0].style.backgroundColor = 'white';
    }
  } catch (error) {
    console.log(error);
  }
};

const resetInput = async (delay) => {
  const el = document.querySelectorAll('.content');
  reset.style.visibility = 'hidden';
  for (let i = el.length - 1; i >= 0; i--) {
    el[i].remove();
    await new Promise((resolve, reject) => setTimeout(resolve, delay / 5));
  }
  header.innerHTML = '';
  collection = {};
  collected = {};
};
