let intervalID;
const getElem= id => document.getElementById(`${id}`);
const exitGame = function() {
  let xhr = new XMLHttpRequest();
  xhr.open("DELETE", '/player');
  xhr.send();
  goToHome();
};
const goToBoard = function() {
  location.href = 'game/board/';
};
const goToHome = function() {
  location.href = 'index.html';
};
const updateSeconds = function() {
  let secondBlock = getElem('sec');
  let seconds = +(secondBlock.innerText);
  seconds--;
  secondBlock.innerHTML = seconds;
};

const showColor = function(players){
  let overlay = document.querySelector(".overlay");
  let colorHolder = getElem('color');
  let playerName = getElem('userName').innerText;
  let player = players.find((player)=>player.name == playerName);
  colorHolder.style.backgroundColor = player.color;
  overlay.classList.remove('hide');
  overlay.classList.add('show');
};

const updatePlayers = function() {
  if (this.responseText == "") {
    goToHome();
    return;
  }
  let players = JSON.parse(this.responseText).players;
  if (players == undefined) {
    return;
  }
  players.forEach((player, index) => {
    if(index>3) {
      return;
    }
    if(getElem(`player${index+2}`)!=undefined){
      getElem(`player${index+2}`).value ="";
    }
    getElem(`player${index+1}`).value = player.name;
  });
  if (players.length < 4) {
    return;
  }
  let timer = getElem('Timer');
  showColor(players);
  getElem('message').style.visibility = 'hidden';
  timer.style.visibility = 'visible';
  setInterval(updateSeconds, 1000);
  setTimeout(goToBoard, 3000);
  clearInterval(intervalID);
};
const updateGameName = function() {
  let gameName = this.responseText;
  getElem('gameName').innerText = gameName;
};
const updateUserName = function() {
  let userName = this.responseText;
  getElem('userName').innerText = userName;
};
const setGameName = function() {
  let xhr = new XMLHttpRequest();
  xhr.addEventListener('load', updateGameName);
  xhr.open("GET", '/gameName');
  xhr.send();
};
const setUserName = function() {
  let xhr = new XMLHttpRequest();
  xhr.addEventListener('load', updateUserName);
  xhr.open("GET", '/userName');
  xhr.send();
};
const getStatus = function() {
  let gameName = getElem('gameName').innerText;
  let xhr = new XMLHttpRequest();
  xhr.addEventListener("load", updatePlayers);
  xhr.open("GET", '/getStatus');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send();
};

const begin = function() {
  setGameName();
  setUserName();
  getStatus();
  intervalID = setInterval(getStatus, 1000);
};
window.onload = begin;
