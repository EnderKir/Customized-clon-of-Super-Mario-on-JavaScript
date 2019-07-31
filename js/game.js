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
window.cancelAnimFrame = (function() {
  // Нигде не использую но пусть будет)))
  return (
    window.cancelAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    function(callback) {
      window.clearTimeout(callback);
    }
  );
})();


//MODAL
// Переменная для отслеживания старта/конца игрового процесса
var isInit = false;
var level;
var requestId;
var lastTime;
var gameTime;
//viewport
var vX = 0,
  vY = 0,
  vWidth = 256,
  vHeight = 240;

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
var model = {
  //настраиваем игровой цикл
  main: function() {
    var now = Date.now();
    var dt = (now - lastTime) / 1000.0;
    this.update(dt);
    view.render(); // функция, которая вызывается игровым циклом для отображения сцены каждого фрейма

    lastTime = now;
    requestId = requestAnimFrame(() => {
      this.main();
    });
  },
  //обновляем каждый кадр
  update: function(dt) {
    gameTime += dt;

    this.handleInput(dt); // обработка нажатий
    this.updateEntities(dt, gameTime); //обновление сущностей

    this.checkCollisions(); //обнаружение столкновений
  },
  // обработка нажатия клавишь
  handleInput: function(dt) {
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
  },
  // Обновление движения всех сущностей
  updateEntities: function(dt, gameTime) {
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
  },
  // Обнаружение столкновений
  checkCollisions: function() {
    if (player.powering.length !== 0 || player.dying) return; // в этих случаях не проверяем
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
  },
  initLevel: function() {
    view.createLevel();
    gameTime = 0;
    lastTime = Date.now();
  }
};
//VIEW
var view = {
  createLevel: function() {
    Mario.oneone();
  },
  // Рисуем саму игру
  render: function() {
    let currentTime = `Game time: ${parseFloat(gameTime.toFixed(3))}`;
    updateables = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = level.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "black";
    ctx.font = "italic 8px sans-serif";
    ctx.fillText(currentTime, 170, 20);

    // Сначала рисуем пейзаж
    for (var i = 0; i < 15; i++) {
      for (var j = Math.floor(vX / 16) - 1; j < Math.floor(vX / 16) + 20; j++) {
        if (level.scenery[i][j]) {
          this.renderEntity(level.scenery[i][j]);
        }
      }
    }

    // Теперь вещи и врагов
    level.items.forEach(function(item) {
      view.renderEntity(item);
    });

    level.enemies.forEach(function(enemy) {
      view.renderEntity(enemy);
    });

    fireballs.forEach(function(fireball) {
      view.renderEntity(fireball);
    });

    // Теперь рисуем все статические сущности
    for (var i = 0; i < 15; i++) {
      for (var j = Math.floor(vX / 16) - 1; j < Math.floor(vX / 16) + 20; j++) {
        if (level.statics[i][j]) {
          this.renderEntity(level.statics[i][j]);
        }
        if (level.blocks[i][j]) {
          this.renderEntity(level.blocks[i][j]);
          updateables.push(level.blocks[i][j]);
        }
      }
    }

    // Рисуем игрока
    if (player.invincibility % 2 === 0) {
      this.renderEntity(player);
    }

    // Так как марио идёт В трубы, то трубы рисуются после
    level.pipes.forEach(function(pipe) {
      view.renderEntity(pipe);
    });
  },
  // Отрисовка сущностей
  renderEntity(entity) {
    entity.render(ctx, vX, vY);
  }
};
//CONTROLLER
var controller = {
  //загрузка картинок для игры
  loadPictures: function() {
    resources.load([
      "sprites/player.png",
      "sprites/enemy.png",
      "sprites/tiles.png",
      "sprites/playerl.png",
      "sprites/items.png",
      "sprites/enemyr.png"
    ]);
  },
  //initialize
  init: function() {
    model.initLevel();
    if (!isInit) {
      model.main();
      isInit = true;
    }
  },
  reset: function() {
    this.init();
  },
  backToMenu: function() {
    cancelAnimFrame(requestId);
    isInit = false;
  }
};


