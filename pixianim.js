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
    autoPlay: true,
    delay: 0,
    scale: 1,
    firstIndex : 0,
    lastIndex : 0,
    digit : 1,
    imagePrefix: '',
    canvasID: '',
    position:{
      x: 0,
      y: 0
    },
    suffix:'jpg',
  },
  _super: function(options){
    var _self = this;
    // Find here a way to compare passed options to default options
    _self.options = options;
    _self.loop = null;
  },
  construct: function (options) {
    var _self = this;
    // Options
    _self._super(options);
    _self.stage = new PIXI.Container();
    // create a renderer instance
    _self.createRenderer();
    _self.init();
  },
  init: function() {
    var _self = this;

    // create a new loader
    _self.loader = PIXI.loader;
    _self.loader.add( _self.options.name, _self.options.jsonPath)
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
      _self.loop = requestAnimationFrame(animate);
      _self.renderer.render(_self.stage);
    };
  },
  play: function(){
    var _self = this;
    _self.animation.play();
  },
  playFromBeginning: function(createNewRenderer){
    var _self = this;
    if(createNewRenderer){
      _self.renderer = null;
      _self.createRenderer();
    }
    _self.animation.gotoAndPlay(0);
  },
  stop: function(){
    var _self = this;
    _self.animation.stop();
  },
  createRenderer: function(){
    var _self = this;
    _self.renderer = PIXI.autoDetectRenderer(
      _self.options.frameSize.width,
      _self.options.frameSize.height,
      {
        view: document.getElementById(this.options.canvasID),
        transparent: true,
        resolution: 1,
        antialias: true
      });
  },
  destroy: function(){
    var _self = this;
    cancelAnimationFrame(_self.loop);
    _self.animation.destroy(true, true);
    _self.renderer.destroy();
    _self.loader.reset();
  }
};
