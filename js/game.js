// указывает браузеру на то, что вы хотите произвести анимацию,
// и просит его запланировать перерисовку на следующем кадре анимации
var requestAnimFrame = (function() {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();
window.cancelAnimFrame = (function() { // Нигде не использую но пусть будет)))
  return (
    window.cancelAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    function(callback) {
      window.clearTimeout(callback);
    }
  );
})();
// Переменная для отслеживания старта/конца игрового процесса
var isInit = false;

// создаем канвас
var canvas = document.createElement("canvas");
canvas.classList.add("hide");
var ctx = canvas.getContext("2d");
var updateables = []; // массив сущностей
var fireballs = [];
var player = new Mario.Player([0, 0]);
canvas.width = 762;
canvas.height = 720;
ctx.scale(3, 3);
document.body.appendChild(canvas);

//viewport
var vX = 0,
  vY = 0,
  vWidth = 256,
  vHeight = 240;

//загрузка картинок для игры
resources.load([
  "sprites/player.png",
  "sprites/enemy.png",
  "sprites/tiles.png",
  "sprites/playerl.png",
  "sprites/items.png",
  "sprites/enemyr.png"
]);
// Вызываем resources.load со всеми изображениями для загрузки, и затем вызываем resources.onReady
//  для создания callback на событие загрузки всех данных. resources.load не используется позже в игре,
//  только в время старта
// Загруженные изображения хранятся в кеше в resourcesCache, и когда все изображения буду загружены,
//  будут вызваны все callback'и. Теперь мы можем просто сделать так:

// resources.onReady(init);
var level;
var requestId;

//initialize
var lastTime;
function init() {
  gameTime = 0;
  Mario.oneone();
  lastTime = Date.now();
  if (!isInit) {
    main();
    isInit = true;
  }
}

var gameTime;

//настраиваем игровой цикл
function main() {
  var now = Date.now();
  var dt = (now - lastTime) / 1000.0;

  update(dt);
  render(); // функция, которая вызывается игровым циклом для отображения сцены каждого фрейма

  lastTime = now;
   requestId = requestAnimFrame(main);
}

//обновляем каждый кадр
function update(dt) {
  gameTime += dt;

  handleInput(dt); // обработка нажатий
  updateEntities(dt, gameTime); //обновление сущностей

  checkCollisions(); //обнаружение столкновений
}

// обработка нажатия клавишь
function handleInput(dt) {
  if (player.piping || player.dying || player.noInput) return; //don't accept input

  if (input.isDown("RUN")) {
    player.run();
  } else {
    player.noRun();
  }
  if (input.isDown("JUMP")) {
    player.jump();
  } else {
    //we need this to handle the timing for how long you hold it
    player.noJump();
  }

  if (input.isDown("DOWN")) {
    player.crouch();
  } else {
    player.noCrouch();
  }

  if (input.isDown("LEFT")) {
    // 'd' or left arrow
    player.moveLeft();
  } else if (input.isDown("RIGHT")) {
    // 'k' or right arrow
    player.moveRight();
  } else {
    player.noWalk();
  }
}

// Обновление движения всех сущностей
function updateEntities(dt, gameTime) {
  player.update(dt, vX);
  updateables.forEach(function(ent) {
    ent.update(dt, gameTime);
  });

  //This should stop the jump when he switches sides on the flag.
  if (player.exiting) {
    if (player.pos[0] > vX + 96) vX = player.pos[0] - 96;
  } else if (level.scrolling && player.pos[0] > vX + 80) {
    vX = player.pos[0] - 80;
  }

  if (player.powering.length !== 0 || player.dying) {
    return;
  }

  level.items.forEach(function(ent) {
    ent.update(dt);
  });

  level.enemies.forEach(function(ent) {
    ent.update(dt, vX);
  });

  fireballs.forEach(function(fireball) {
    fireball.update(dt);
  });

  level.pipes.forEach(function(pipe) {
    pipe.update(dt);
  });
}

// Обнаружение столкновений
function checkCollisions() {
  if (player.powering.length !== 0 || player.dying) {
    return;
  } // в этих случаях не проверяем
  player.checkCollisions();

  //Apparently for each will just skip indices where things were deleted.
  level.items.forEach(function(item) {
    item.checkCollisions();
  });
  level.enemies.forEach(function(ent) {
    ent.checkCollisions();
  });
  fireballs.forEach(function(fireball) {
    fireball.checkCollisions();
  });
  level.pipes.forEach(function(pipe) {
    pipe.checkCollisions();
  });
}

// Рисуем саму игру
function render() {
  // console.log(gameTime);
  let currentTime = `Game time: ${parseFloat(gameTime.toFixed(3))}`;
  updateables = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = level.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'black';
  ctx.font = 'italic 8px sans-serif';
  ctx.fillText(currentTime, 170, 20);

  // Сначала рисуем пейзаж
  for (var i = 0; i < 15; i++) {
    for (var j = Math.floor(vX / 16) - 1; j < Math.floor(vX / 16) + 20; j++) {
      if (level.scenery[i][j]) {
        renderEntity(level.scenery[i][j]);
      }
    }
  }

  // Теперь вещи и врагов
  level.items.forEach(function(item) {
    renderEntity(item);
  });

  level.enemies.forEach(function(enemy) {
    renderEntity(enemy);
  });

  fireballs.forEach(function(fireball) {
    renderEntity(fireball);
  });

  // Теперь рисуем все статические сущности
  for (var i = 0; i < 15; i++) {
    for (var j = Math.floor(vX / 16) - 1; j < Math.floor(vX / 16) + 20; j++) {
      if (level.statics[i][j]) {
        renderEntity(level.statics[i][j]);
      }
      if (level.blocks[i][j]) {
        renderEntity(level.blocks[i][j]);
        updateables.push(level.blocks[i][j]);
      }
    }
  }

  // Рисуем игрока
  if (player.invincibility % 2 === 0) {
    renderEntity(player);
  }

  // Так как марио идёт В трубы, то трубы рисуются после
  level.pipes.forEach(function(pipe) {
    renderEntity(pipe);
  });
}

// Отрисовка сущностей
function renderEntity(entity) {
  entity.render(ctx, vX, vY);
}

function backToMenu() {
  canvas.classList.add("hide");
  mainMenu.classList.remove("hide");
  controllerBar.classList.add('hide');
  cancelAnimFrame(requestId);
  isInit = false;
}

function reset() {
  init();
}
