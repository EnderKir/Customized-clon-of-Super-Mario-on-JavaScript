(function() {
  if (typeof Mario === "undefined") window.Mario = {};

  var Sprite = (Mario.Sprite = function(img, pos, size, speed, frames, once) {
    // url: путь к изображению
    // pos: x и y координаты изображения на спрайт карте
    // size: размеры (только одного кадры)
    // speed: скорость анимации в фрейм/с
    // frames: массив индексов фреймов в порядке анимации
    // dir: в каком направлении двигаться по спрайт карте: 'horizontal (по-умолчанию) или 'vertical'
    // once:true, если необходимо отобразить только один цикл анимации, false — по-умолчанию
    this.pos = pos;
    this.size = size;
    this.speed = speed;
    this._index = 0;
    this.img = img;
    this.once = once;
    this.frames = frames;
  });

  // Каждый Sprite объект имеет метод update, для обновления анимации,
  // и аргументом у него является дельта времени, также как и в нашем глобальном update.
  // Каждый спрайт должен быть обновлён для каждого фрейма
  Sprite.prototype.update = function(dt, gameTime) {
    if (gameTime && gameTime == this.lastUpdated) return;
    this._index += this.speed * dt;
    if (gameTime) this.lastUpdated = gameTime;
  };

  Sprite.prototype.setFrame = function(frame) {
    this._index = frame;
  };

  // Метод для отрисовки себя. Он следит за тем, какой кадр должен быть отрисован,
  // рассчитывает его координаты на спрайт карте, и вызывает ctx.drawImage для отрисовки кадра.
  Sprite.prototype.render = function(ctx, posx, posy, vX, vY) {
    var frame;

    if (this.speed > 0) {
      var max = this.frames.length;
      var idx = Math.floor(this._index);
      frame = this.frames[idx % max];

      if (this.once && idx >= max) {
        this.done = true;
        return;
      }
    } else {
      frame = 0;
    }

    var x = this.pos[0];
    var y = this.pos[1];

    x += frame * this.size[0];
    // Мы используем 3-ю форм drawImage, которая позволяет нам указать размер спрайта,
    // смещении и направлении раздельно.
    // ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    ctx.drawImage(
      // resources.get(this.img),
      controller.getImage(this.img),
      x + 1 / 3,
      y + 1 / 3,
      this.size[0] - 2 / 3,
      this.size[1] - 2 / 3,
      Math.round(posx - vX),
      Math.round(posy - vY),
      this.size[0],
      this.size[1]
    );
  };
})();
