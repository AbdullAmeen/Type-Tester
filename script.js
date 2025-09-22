const words =
  "The wind whispered softly through the trees as the early morning light began to spill across the quiet meadow where birds sang cheerfully and small animals darted between the tall grasses while a young writer sat beneath an old oak tree scribbling ideas into a worn notebook dreaming of distant lands and untold stories that lived only in the corners of her mind the pages filled quickly with thoughts of brave heroes ancient prophecies hidden kingdoms and magical creatures that soared through endless skies or lurked in deep enchanted forests she imagined a world where time moved differently where the stars told secrets and the moon watched over all who dared to dream she wrote of friendships forged in fire of battles fought with honor and of love found in the most unexpected places her hand moved faster than her thoughts trying to capture every fleeting image and every whisper of inspiration that came with the rising sun as the shadows shifted and the world around her came alive with golden light she smiled knowing that within those simple words lay entire worlds waiting to be explored by anyone willing to read and believe in the impossible and she promised herself that no matter how hard the journey she would keep writing because her stories deserved to be told and her imagination was a gift she would never let go of no matter how many doubts tried to silence her voice".split(
    " "
  );

let wordsCount = words.length;
const gameTime = 3 * 1000; // 1 minute
window.timer = null;
window.gameStart = null;

function addClass(el, name) {
  el.className += " " + name;
}
function removeClass(el, name) {
  el.className = el.className.replace(name, "");
}

function randomWord() {
  const randonIndex = Math.floor(Math.random() * wordsCount);
  return words[randonIndex];
}

function formatCode(word) {
  return `<div class="word"><span class="letter">${word
    .split("")
    .join('</span><span class="letter">')}</span></div>`;
}

function newGame() {
  document.querySelector("#words").innerHTML = "";

  for (let i = 0; i < 2000; i++) {
    document.querySelector("#words").innerHTML += formatCode(randomWord());
  }
  addClass(document.querySelector(".word"), "current");
  addClass(document.querySelector(".letter"), "current");
}

function getWpm(){
  const words = [...document.querySelectorAll(".word")];
  const lastTypedWord = document.querySelector(".word.current");
  const lastTypedWordIndex = words.indexOf(lastTypedWord);
  const TypedWords = words.slice(0, lastTypedWordIndex);
  const correctWords = TypedWords.filter(word => {
    const letters = [...word.children];
    const incorrectLetters = letters.filter(letter => letter.className.includes("incorrect"));
    const correctLetters = letters.filter(letter => letter.className.includes("correct"));

    return incorrectLetters.length === 0 && correctLetters.length > 0;
  })
  return 23;
}

function gameOver() {
  clearInterval(window.timer);
  document.querySelector("#game").classList.add("over");
  document.getElementById('wpm').innerHTML = getWpm();
}

document.querySelector("#game").addEventListener("keypress", (e) => {
  const key = e.key;
  const currentWord = document.querySelector(".word.current");
  const currentLetter = document.querySelector(".letter.current");
  const expected = currentLetter?.innerHTML || " ";
  const isLetter = key.length === 1 && key !== " ";
  const isSpace = key === " ";
  const isBackSpace = key === "Backspace";
  const isFirstLetter = currentLetter === currentWord.firstChild;

  if (document.querySelector("#game.over")) {
    return;
  }

  console.log(key, expected);

  if (!window.timer && isLetter) {
    window.timer = setInterval(() => {
      if (!window.gameStart) {
        window.gameStart = new Date().getTime();
      }
      const currentTime = new Date().getTime();
      const msPassed = currentTime - window.gameStart;
      const sPassed = Math.round(msPassed / 1000);
      const sLeft = gameTime / 1000 - sPassed;
      if (sLeft <= 0) {
        gameOver();
      }
      document.getElementById("info").innerHTML = sLeft + "";
    }, 1000);
  }

  if (isLetter) {
    if (currentLetter) {
      addClass(currentLetter, key === expected ? "correct" : "incorrect");
      removeClass(currentLetter, "current");
      if (currentLetter.nextSibling) {
        addClass(currentLetter.nextSibling, "current");
      }
    }
  }

  if (isSpace) {
    if (expected !== " ") {
      const letterToInvalidate = [
        ...document.querySelectorAll(".word.current .letter:not(.correct)"),
      ];
      letterToInvalidate.forEach((letter) => {
        letter.classList.add("incorrect");
      });
    } else {
      const incorrectLetter = document.createElement("span");
      incorrectLetter.innerHTML = key;
      incorrectLetter.className = "letter incorrect extra";
      currentWord.appendChild(incorrectLetter);
    }

    currentWord.classList.remove("current");
    currentWord.nextElementSibling?.classList.add("current");

    if (currentLetter) {
      removeClass(currentLetter, "current");
    }
    addClass(currentWord.nextSibling.firstChild, "current");
  }

  if (isBackSpace) {
    if (currentLetter && isFirstLetter) {
      //make priw word currnt, last letter current
      currentWord.classList.remove("current");
      currentWord.previousElementSibling.classList.add("current");
      currentLetter.classList.remove("current");

      const prevWordLastLetter = currentWord.previousElementSibling.lastElementChild;
      prevWordLastLetter.classList.add("current");
      prevWordLastLetter.classList.remove("incorrect");
      prevWordLastLetter.classList.remove("correct");
    }
    if (currentLetter && !isFirstLetter) {
      currentLetter.classList.remove("current");
      currentLetter.previousSibling.classList.add("current");
      currentWord.previousSibling.classList.remove("incorrect");
      currentWord.previousSibling.classList.remove("correct");
    }
    if (!currentLetter) {
      addClass(currentWord.lastChild, "current");
      removeClass(currentWord.lastChild, "incorrect");
      removeClass(currentWord.lastChild, "correct");
    }
  }

  //move lines
  if (currentWord.getBoundingClientRect().top > 250) {
    const words = document.getElementById("words");
    const margin = parseInt(words.style.marginTop || "0px");
    words.style.marginTop = margin - 35 + "px";
  }

  // move cursor
  const nextLetter = document.querySelector(".letter.current");
  const nextWord = document.querySelector(".word.current");
  const cursor = document.querySelector("#cursor");
  cursor.style.top =
    (nextLetter || nextWord).getBoundingClientRect().top + 2 + "px";
  cursor.style.left =
    (nextLetter || nextWord).getBoundingClientRect()[
      nextLetter ? "left" : "right"
    ] + "px";
});

newGame();
