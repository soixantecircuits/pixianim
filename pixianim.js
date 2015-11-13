PixiAnim = function(options){
  this.construct(options);
  return this;
};

PixiAnim.prototype = {
  options: {
    name: 'animation',
    frameSize: {
      width: 0,
      height: 0
    },
    stage: undefined,
    renderer: undefined,
    jsonPath:'',
    imagePrefix : '',
    pixiStage: undefined,
    loop: true,
    delay: 0,
    suffix:'jpg',
    firstIndex : 0,
    lastIndex : 0,
    digit : 1,
    canvasID: '',
    position:{
      x: 0,
      y: 0
    },
    autoPlay: true
  },
  _super: function(options){
    var _self = this;
    _self.options = Object.assign(_self.options, options);
  },
  construct: function (options) {
    var _self = this;
    // Options
    _self._super(options);
    _self.stage = new PIXI.Stage();
    // create a renderer instance
    _self.renderer = PIXI.autoDetectRenderer(
      _self.options.frameSize.width,
      _self.options.frameSize.height,
      {
        view: document.getElementById(this.options.canvasID),
        transparent: true,
        resolution: 1,
        antialias: true
      },
      false);
    _self.init();
  },
  init: function() {
    var _self = this;

    // create a new loader
    var loader = PIXI.loader;
    // loader.reset();
    loader.add( _self.options.name, _self.options.jsonPath)
      .load(onAssetsLoaded);

    function onAssetsLoaded() {
      //// create an array to store the textures
      var animationTextures = [];
      for (var i = _self.options.firstIndex; i <= _self.options.lastIndex; i++) {
        var texture = PIXI.Texture.fromFrame(_self.options.imagePrefix + zeroPad(i, _self.options.digit) + "." + _self.options.suffix);
        animationTextures.push(texture);
      };

      _self.animation = new PIXI.extras.MovieClip(animationTextures);
      _self.animation.scale.x = _self.animation.scale.y = _self.options.scale;
      _self.animation.animationSpeed = _self.options.speed;
      _self.animation.loop = _self.options.loop;
      if (_self.options.autoPlay){
        _self.animation.play();
      }

      _self.stage.addChild(_self.animation);
      animate();
    }

    function zeroPad(num, places) {
      var zero = places - num.toString().length + 1;
      return new Array(+(zero > 0 && zero)).join("0") + num;
    };

    function animate() {
      requestAnimationFrame(animate);
      _self.renderer.render(_self.stage);
    };
  },
  play: function(){
    var _self = this;
    _self.animation.play();
  },
  stop: function(){
    var _self = this;
    _self.animation.stop();
  }
};
