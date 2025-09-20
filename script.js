const words =
  "The wind whispered softly through the trees as the early morning light began to spill across the quiet meadow where birds sang cheerfully and small animals darted between the tall grasses while a young writer sat beneath an old oak tree scribbling ideas into a worn notebook dreaming of distant lands and untold stories that lived only in the corners of her mind the pages filled quickly with thoughts of brave heroes ancient prophecies hidden kingdoms and magical creatures that soared through endless skies or lurked in deep enchanted forests she imagined a world where time moved differently where the stars told secrets and the moon watched over all who dared to dream she wrote of friendships forged in fire of battles fought with honor and of love found in the most unexpected places her hand moved faster than her thoughts trying to capture every fleeting image and every whisper of inspiration that came with the rising sun as the shadows shifted and the world around her came alive with golden light she smiled knowing that within those simple words lay entire worlds waiting to be explored by anyone willing to read and believe in the impossible and she promised herself that no matter how hard the journey she would keep writing because her stories deserved to be told and her imagination was a gift she would never let go of no matter how many doubts tried to silence her voice".split(
    " "
  );

let wordsCount = words.length;

function addClass(el, name){
      el.className += ' ' + name;
}
function removeClass(el, name){
      el.className = el.className.replace(name, '');
}

function randomWord() {
  const randonIndex = Math.floor(Math.random() * wordsCount);
  return words[randonIndex];
}

function formatCode(word) {
  return `<div class="word"><span class="letter">${word.split("").join('</span><span class="letter">')}</span></div>`;
}

function newGame() {
  document.querySelector("#words").innerHTML = "";

  for (let i = 0; i < 2000; i++) {
    document.querySelector("#words").innerHTML += formatCode(randomWord());
  }
  addClass(document.querySelector('.word'), 'current');
  addClass(document.querySelector('.letter'), 'current')
}

document.querySelector('#game').addEventListener("keypress", (e)=> {
      const key = e.key;
      const currentWord= document.querySelector('.word.current');
      const currentLetter = document.querySelector('.letter.current');
      const expected = currentLetter.innerHTML;
      const isLetter = key.length === 1 && key !== ' ';
      const isSpace = key === ' ';

      console.log(key, expected);

      if(isLetter) {
        if (currentLetter) {
          addClass(currentLetter, key === expected ? 'correct' : 'incorrect');
          removeClass(currentLetter, 'current');
          addClass(currentLetter.nextSibling, 'current')
        }
      }

      if (isSpace) {
         if (expected !== ' ') {
          const letterToInvalidate = [...document.querySelectorAll('.word.current .letter:not(.correct)')];
          letterToInvalidate.forEach(letter => {
            letter.classList.add('incorrect');
          })
         }
      }

      removeClass(currentWord, 'current');
      addClass(currentWord.nextSibling, 'current')

      if (currentLetter) {
        removeClass(currentLetter, 'current');
      }
      addClass(currentWord.nextSibling.firstChild, 'current');
      
})

newGame();
