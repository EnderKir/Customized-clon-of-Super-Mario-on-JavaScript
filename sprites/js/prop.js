(function() {
    if (typeof Mario === 'undefined')
    window.Mario = {};
  
    // Реквизит - это не сущность, поэтому их даже не нужно наследовать
    var Prop = Mario.Prop = function(pos, sprite) {
      this.pos = pos;
      this.sprite = sprite;
    }
  
    // Но в любом случае отрисовочка та же
    Prop.prototype.render = function(ctx, vX, vY) {
      this.sprite.render(ctx, this.pos[0], this.pos[1], vX, vY);
    }
  })();