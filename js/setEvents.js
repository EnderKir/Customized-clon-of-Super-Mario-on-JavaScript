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
  if (!document.getElementById("MainMenu")) {
    let place = document.getElementById("place");
    let menu = `<div class="MainMenu" id="MainMenu">
    <div class="hello" id="hello">Hello, my dear ...</div>
    <img src="Mario.jpg" alt="Марио" class="marioPic" />
    <img src="badguy.jpg" alt="Плохой парень" class="badguyPic" />
    <div class="header">
      <div class="name elegantshadow">
        <h1>MARIO</h1>
      </div>
      <div class="author">
        <p>by Alex Kirillov</p>
      </div>
    </div>
    <div class="main">
      <div class="button">
        <button class="but" id="startButton">Start game</button>
      </div>
      <div class="button">
        <button class="but" id='openRecords'>Records</button>
      </div>
      <div class="button">
        <button class="but" id="changeLogo">
          Input Name ( necessarily to start )
        </button>
      </div>
      <div class="button">
        <button class="but" id="openLinks">My links</button>
      </div>
    </div>
  </div>`;
    place.innerHTML = menu;
  }
  if (!document.getElementById("controllerBar")) {
    let controllerBar = document.createElement("div");
    controllerBar.id = "controllerBar";
    controllerBar.classList.add("controllerBar");
    controllerBar.classList.add("hide");
    controllerBar.innerHTML = ` <button class="but1" id="backToMainMenu">Back To Menu</button><br />
    <button class="but1" id="resetGame">Reset Game</button> `;
    document.body.appendChild(controllerBar);
  }
  addModals();
  setButtonsEvents();
  checkName();
  controller.loadPictures();
};
function setButtonsEvents() {
  let startButton = document.getElementById("startButton");
  if (!localStorage.getItem("name")) {
    startButton.disabled = true;
  }
  let mainMenu = document.getElementById("MainMenu");
  let cancel = document.querySelector(".modal__cancel");
  let close = document.querySelector(".modal__close");
  let inputName = document.getElementById("name");
  let save = document.querySelector(".modal__save");
  let changeLogo = document.getElementById("changeLogo");
  let openLinks = document.getElementById("openLinks");
  let links = document.getElementById("links");
  let closeLinks = document.getElementById("closeLinks");
  let openRecords = document.getElementById("openRecords");
  let records = document.getElementById("records");
  let closeRecords = document.getElementById("closeRecords");
  let localResult = document.getElementById("localResult");
  let controllerBar = document.getElementById("controllerBar");
  let backToMainMenu = document.getElementById("backToMainMenu");
  let resetGame = document.getElementById("resetGame");
  openRecords.addEventListener("click", function(e) {
    let localRes = localStorage.getItem("result");
    if (localRes) {
      localResult.innerHTML = `
      Best local result -- ${Math.floor(localRes * 100) / 100}`;
    } else {
      // prettier-ignore
      localResult.innerHTML = ` No local result (you must complete the game at least once)`
    }
    e.preventDefault();
    records.classList.remove("hide");
  });
  closeRecords.addEventListener("click", function(e) {
    e.preventDefault();
    records.classList.add("hide");
  });
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
    if (inputName.value != "" && inputName.value.length < 14) {
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
  backToMainMenu.addEventListener("click", function(e) {
    e.preventDefault();
    canvas.classList.add("hide");
    mainMenu.classList.remove("hide");
    controllerBar.classList.add("hide");
    controller.backToMenu();
  });
  resetGame.addEventListener("click", function(e) {
    e.preventDefault();
    controller.reset();
    resetGame.blur();
    canvas.focus();
  });
}
function addModals() {
  let modal = document.getElementById("modal");
  if (!modal) {
    let modalDiv = document.createElement("div");
    modalDiv.id = "modal";
    modalDiv.classList.add("modal");
    modalDiv.classList.add("hide");
    modalDiv.innerHTML = `<header class="modal__header">
    <a href="#" class="modal__close" title="Закрыть модальное окно"
      >Закрыть</a
    >
    <h2>Enter your name</h2>
  </header>

  <main class="modal__content">
    <div class="form-field">
      <label for="name">Your Name:</label>
      <input class="input__default" type="text" id="name" name="name" />
    </div>
  </main>

  <footer class="modal__footer">
    <button class="modal__cancel" title="Отмена">
      Close
    </button>
    <button id="modal-save" class="modal__save" title="Сохранить">
      Save
    </button>
  </footer>`;
    document.body.appendChild(modalDiv);
  }
  let links = document.getElementById("links");
  if (!links) {
    let linksDiv = document.createElement("div");
    linksDiv.id = "links";
    linksDiv.classList.add("modal");
    linksDiv.classList.add("hide");
    linksDiv.innerHTML = ` <main class="modal__content">
    <p>https://www.linkedin.com/in/alexkirillov99/</p>
    <p>https://github.com/EnderKir</p>
  </main>
  <footer class="modal__footer">
    <button class="modal__cancel" title="Отмена" id="closeLinks">
      Close
    </button>
  </footer>`;
    document.body.appendChild(linksDiv);
  }
  let records = document.getElementById("records");
  if (!records) {
    let recordsDiv = document.createElement("div");
    recordsDiv.id = "records";
    recordsDiv.classList.add("modal");
    recordsDiv.classList.add("hide");
    recordsDiv.innerHTML = `<main class="modal__content">
    <p>The best result of the author -- 22s</p>
    <p id='localResult'></p>
  </main>
  <footer class="modal__footer">
    <button class="modal__cancel" title="Отмена" id="closeRecords">
      Close
    </button>
  </footer>`;
    document.body.appendChild(recordsDiv);
  }
}
