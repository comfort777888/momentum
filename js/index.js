import playList from "./playList.js";

/*----------------------TIME AND DATE-----------------------------------*/
const time = document.querySelector(".time");

function showTime() {
  const date = new Date();
  const currentTime = date.toLocaleTimeString();
  time.textContent = currentTime;
  setTimeout(showTime, 1000);
}

const date = document.querySelector(".date");

function showDate() {
  const dateInit = new Date();
  const options = { weekday: "long", month: "long", day: "numeric" };
  const currentDate = dateInit.toLocaleDateString("en-US", options);
  date.textContent = currentDate;
}

/*------------------GREETINGS----------------------------*/
const greeting = document.querySelector(".greeting");

function getTimeOfDay(hours) {
  if (hours >= 0 && hours < 6) {
    return "night";
  } else if (hours >= 6 && hours < 12) {
    return "morning";
  } else if (hours >= 12 && hours < 18) {
    return "afternoon";
  } else {
    return "evening";
  }
}

const dateCurrent = new Date();
const hours = dateCurrent.getHours();
const timeOfDay = getTimeOfDay(hours);

function showGreeting() {
  const greetingText = `Good ${timeOfDay},`;
  greeting.textContent = greetingText;
}

const name = document.querySelector(".name");
name.value = "[Enter name]";

function setLocalStorage() {
  localStorage.setItem("name", name.value);

  localStorage.setItem("city", city.value);
}
window.addEventListener("beforeunload", setLocalStorage);

function getLocalStorage() {
  if (localStorage.getItem("name")) {
    name.value = localStorage.getItem("name");
  }

  if (localStorage.getItem("city")) {
    city.value = localStorage.getItem("city");
  }
}
window.addEventListener("load", getLocalStorage);

showTime(showGreeting(), showDate());

/*---------------------IMAGE SLIDER----------------------------------------------- */
const body = document.querySelector("body");

let randomNum;

function getRandomNum(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNum;
}

randomNum = getRandomNum(1, 20);

function setBg() {
  let bgNum = randomNum.toString().padStart(2, "0");
  const img = new Image();
  img.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`;
  img.onload = () => {
    body.style.backgroundImage = `url('${img.src}')`;
  };
}

setBg();

const slideNext = document.querySelector(".slide-next");
const slidePrev = document.querySelector(".slide-prev");

function getSlideNext() {
  if (randomNum >= 20) {
    randomNum = 1;
  } else {
    randomNum++;
  }
  setBg();
}

function getSlidePrev() {
  if (randomNum > 1) {
    randomNum--;
  }
  if (randomNum === 1) {
    randomNum = 20;
  }
  setBg();
}

slideNext.addEventListener("click", getSlideNext);
slidePrev.addEventListener("click", getSlidePrev);

/*----------------------weather widget-----------------------------------------------------------*/

const weatherIcon = document.querySelector(".weather-icon");
const temperature = document.querySelector(".temperature");
const weatherDescription = document.querySelector(".weather-description");
const wind = document.querySelector(".wind");
const humidity = document.querySelector(".humidity");
const city = document.querySelector(".city");
city.value = "Astana";

async function getWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=en&appid=bfe45eea8c514df15859cd46c1e7c0aa&units=metric`;
  const res = await fetch(url);
  const data = await res.json();

  weatherIcon.className = "weather-icon owf";
  weatherIcon.classList.add(`owf-${data.weather[0].id}`);
  temperature.textContent = `${data.main.temp.toFixed(0)}°C`;
  weatherDescription.textContent = data.weather[0].description;
  wind.textContent = `Wind speed: ${data.wind.speed.toFixed(0)} m/s`;
  humidity.textContent = `Humidity: ${data.main.humidity.toFixed(0)}%`;
}

document.addEventListener("DOMContentLoaded", getWeather);
city.addEventListener("change", getWeather);

/*---------------------quote of the day widget--------------------------------------*/
const quote = document.querySelector(".quote");
const author = document.querySelector(".author");
const btnChangeQuote = document.querySelector(".change-quote");

async function getQuotes() {
  const quotes = "./../assets/quotes.json";
  const res = await fetch(quotes);
  const data = await res.json();
  let randomQuoteNum = getRandomNum(0, data.length - 1);
  quote.textContent = data[randomQuoteNum].quote;
  author.textContent = data[randomQuoteNum].author;
}

document.addEventListener("DOMContentLoaded", getQuotes);
btnChangeQuote.addEventListener("click", getQuotes);

/*------------------------audio player------------------------------------------*/
const playListContainer = document.querySelector(".play-list");

playList.forEach((el) => {
  const li = document.createElement("li");
  li.classList.add("play-item");
  li.textContent = el.title;
  playListContainer.append(li);
});

let audio = new Audio();
let isPlay = true;
const play = document.querySelector(".play");
let playNum = 0;
const allSongs = document.querySelectorAll(".play-item");

function playPause() {
  if (isPlay) {
    play.classList.add("pause");
    audio.play();
    allSongs[playNum].classList.add("activeSong");
    isPlay = false;
  } else {
    play.classList.remove("pause");
    audio.pause();
    isPlay = true;
  }
}

// automatically play the next song at the end of the audio object's duration
audio.addEventListener("ended", function () {
  nextSong();
});

play.addEventListener("click", () => {
  audio.src = playList[playNum].src;
  playPause();
});

function nextSong() {
  playNum++;
  if (playNum >= playList.length) {
    playNum = 0;
  }
  audio.src = playList[playNum].src;
  isPlay = true;
  if (playNum === 0) {
    allSongs[playList.length - 1].classList.remove("activeSong");
  } else {
    allSongs[playNum - 1].classList.remove("activeSong");
  }
  playPause();
}

function previousSong() {
  playNum--;
  if (playNum < 0) {
    playNum = playList.length - 1;
  }
  audio.src = playList[playNum].src;
  isPlay = true;
  if (playNum === playList.length - 1) {
    allSongs[0].classList.remove("activeSong");
  } else {
    allSongs[playNum + 1].classList.remove("activeSong");
  }
  playPause();
}

const play_prev = document.querySelector(".play-prev");
const play_next = document.querySelector(".play-next");
play_prev.addEventListener("click", previousSong);
play_next.addEventListener("click", nextSong);
