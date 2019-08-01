var startButton = document.getElementById("startButton");
if (!localStorage.getItem("name")) {
  startButton.disabled = true;
}
var mainMenu = document.getElementById("MainMenu");
var controllerBar = document.getElementById("controllerBar");
var backToMainMenu = document.getElementById("backToMainMenu");
var resetGame = document.getElementById("resetGame");
var cancel = document.querySelector(".modal__cancel");
var close = document.querySelector(".modal__close");
var inputName = document.getElementById("name");
var save = document.querySelector(".modal__save");
var changeLogo = document.getElementById("changeLogo");
var openLinks = document.getElementById("openLinks");
var links = document.getElementById("links");
var closeLinks = document.getElementById("closeLinks");
var openRecords = document.getElementById('openRecords');
var records = document.getElementById('records');
var closeRecords = document.getElementById('closeRecords');
var localResult = document.getElementById('localResult');
openRecords.addEventListener('click', function(e) {
  let localRes = localStorage.getItem('result');
  if (localRes) {
    localResult.innerHTML = `
    Best local result -- ${Math.floor(localRes * 100) / 100}`;
  } else {
    // prettier-ignore
    localResult.innerHTML = ` No local result (you must complete the game at least once)`
  }
  e.preventDefault();
  records.classList.remove('hide');
})
closeRecords.addEventListener('click', function(e) {
  e.preventDefault();
  records.classList.add('hide');
})
openLinks.addEventListener("click", function() {
  links.classList.remove("hide");
});
closeLinks.addEventListener("click", function() {
  links.classList.add("hide");
});
startButton.addEventListener("click", function(e) {
  e.preventDefault();
  if (!isInit) {
    mainMenu.classList.add("hide");
    canvas.classList.remove("hide");
    controllerBar.classList.remove("hide");
    controller.init();
  }
});
backToMainMenu.addEventListener("click", function(e) {
  canvas.classList.add("hide");
  mainMenu.classList.remove("hide");
  controllerBar.classList.add("hide");
  e.preventDefault();
  controller.backToMenu();
});
resetGame.addEventListener("click", function(e) {
  e.preventDefault();
  controller.reset();
  resetGame.blur();
  canvas.focus();
});

cancel.addEventListener("click", function(e) {
  e.preventDefault();
  modal.classList.add("hide");
  mainMenu.classList.add("modal-overlay");
});
close.addEventListener("click", function(e) {
  e.preventDefault();
  modal.classList.add("hide");
  mainMenu.classList.add("modal-overlay");
});
save.addEventListener("click", function(e) {
  if (inputName.value != "") {
    let name = inputName.value;
    localStorage.setItem("name", name);
    let container = document.getElementById("hello");
    container.innerHTML = `Hello my dear ${name}`;
    inputName.value = "";
    inputName.style.borderColor = "green";
    startButton.disabled = false;
  } else {
    inputName.style.borderColor = "red";
  }
});
changeLogo.addEventListener("click", function(e) {
  e.preventDefault();
  modal.classList.remove("hide");
  mainMenu.classList.add("modal-overlay");
});
function checkName() {
  let playerName = localStorage.getItem("name");
  if (playerName || playerName != undefined) {
    let container = document.getElementById("hello");
    container.innerHTML = `Hello my dear ${playerName}`;
  } else {
    modal.classList.remove("hide");
    mainMenu.classList.add("modal-overlay");
  }
}
window.onload = function() {
  checkName();
  controller.loadPictures();
};
