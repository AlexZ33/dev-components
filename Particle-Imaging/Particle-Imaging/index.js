var Event = require('bcore/event');
var $ = require('jquery');
var _ = require('lodash');

//var Chart = require('XXX');

/**
 * 马良基础类
 */
module.exports = Event.extend(function Base(container, config) {
  this.config = {
    theme: {}
  }
  this.container = $(container);           //容器
  this.apis = config.apis;                 //hook一定要有
  this._data = null;                       //数据
  this.chart = null;                       //图表
  this.init(config);
}, {
  /**
   * 公有初始化
   */
  init: function (config) {
    //1.初始化,合并配置
    this.mergeConfig(config);
    //2.刷新布局,针对有子组件的组件 可有可无
    this.updateLayout();
    //3.子组件实例化
    //this.chart = new Chart(this.container[0], this.config);
    //4.如果有需要, 更新样式
    this.updateStyle();
  },
  /**
   * 绘制
   * @param data
   * @param options 不一定有
   * !!注意: 第二个参数支持config, 就不需要updateOptions这个方法了
   */
  render: function (data, config) {
    data = this.data(data);
    var cfg = this.mergeConfig(config);
    //更新图表
    //this.chart.render(data, cfg);
   // this.container.html(data[0].value)



    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext('2d');
    var img = document.createElement("img");
    img.setAttribute("id","logo");
    img.src="icon.png";


     //this.container.append(canvas).append(img)
    document.getElementById("chart").appendChild(canvas).appendChild(img);
    
    canvas.width = config.width;
    canvas.height = window.innerHeight;
     var mouseX = null, mouseY = null;
   var mouseRadius = 50;
     

  var RAF = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
          window.setTimeout(callback, 1000/60);
        };
  })();
  Array.prototype.forEach = function(callback) {
    for (var i = 0; i < this.length; i++) {
      callback.call((typeof this[i] === "object") ? this[i] : window, i, this[i]);
    }
  };
  window.onmousemove = function(e) {
    if (e.target.tagName == "CANVAS") {
      mouseX = e.clientX - e.target.getBoundingClientRect().left;
      mouseY = e.clientY - e.target.getBoundingClientRect().top;
    } else {
      mouseX = null;
      mouseY = null;
    }
  };
  var particleArray = [];
  var animateArray = [];
  var particleSize_x = 1;
  var particleSize_y = 2;
     


    var canvasHandle = {
    init: function() {
      this._reset();
      this._initImageData();
      this._execAnimate();
    },
    _reset: function() {
      particleArray.length = 0;
      animateArray.length = 0;
      this.ite = 100;
      this.start = 0;
      this.end = this.start + this.ite;
    },
    _initImageData: function() {
      this.imgx = (canvas.width - img.width) / 2;
      this.imgy = (canvas.height - img.height) / 2;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, this.imgx, this.imgy, img.width, img.height);
      var imgData = ctx.getImageData(this.imgx, this.imgy, img.width, img.height);
      for (var x = 0; x < img.width; x += particleSize_x) {
        for (var y = 0; y < img.height; y += particleSize_y) {
          var i = (y * imgData.width + x) * 4;
          if (imgData.data[i + 3] >= 125) {
            var color = "rgba(" + imgData.data[i] + "," + imgData.data[i + 1] + "," + imgData.data[i + 2] + "," + imgData.data[i + 3] + ")";
            var x_random = x + Math.random() * 20,
                vx = -Math.random() * 200 + 400,
                y_random = img.height / 2 - Math.random() * 40 + 20,
                vy;
            if (y_random < this.imgy + img.height / 2) {
              vy = Math.random() * 300;
            } else {
              vy = -Math.random() * 300;
            }
            particleArray.push(
                new Particle(
                    x_random + this.imgx,
                    y_random + this.imgy,
                    x + this.imgx,
                    y + this.imgy,
                    vx,
                    vy,
                    color
                )
            );
            particleArray[particleArray.length - 1].drawSelf();
          }
        }
      }
    },
    _execAnimate: function() {
      var that = this;
      particleArray.sort(function(a, b) {
        return a.ex - b.ex;
      });
      if (!this.isInit) {
        this.isInit = true;
        animate(function(tickTime) {
          if (animateArray.length < particleArray.length) {
            if (that.end > (particleArray.length - 1)) {
              that.end = (particleArray.length - 1)
            }
            animateArray = animateArray.concat(particleArray.slice(that.start, that.end))
            that.start += that.ite;
            that.end += that.ite;
          }
          animateArray.forEach(function(i) {
            this.update(tickTime);
          })
        })
      }
    }
  }
  var tickTime = 20; //animate time 
  function animate(tick) {
    if (typeof tick == "function") {
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      tick(tickTime);
      RAF(function() {
        animate(tick)
      })
    }
  }
  function Particle(x, y, ex, ey, vx, vy, color) {
    this.x = x;
    this.y = y;
    this.ex = ex;
    this.ey = ey;
    this.vx = vx;
    this.vy = vy;
    this.a = 1500;
    this.color = color;
    this.width = particleSize_x;
    this.height = particleSize_y;
    this.stop = false;
    this.static = false;
    this.maxCheckTimes = 10;
    this.checkLength = 5;
    this.checkTimes = 0;
  }
  var oldColor = "";
  Particle.prototype = {
    constructor: Particle,
    drawSelf: function() {
      if (oldColor != this.color) {
        ctx.fillStyle = this.color;
        oldColor = this.color
      }
      ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    },
    move: function(tickTime) {
      if (this.stop) {
        this.x = this.ex;
        this.y = this.ey;
      } else {
        tickTime = tickTime / 1000;
        var cx = this.ex - this.x;
        var cy = this.ey - this.y;
        var angle = Math.atan(cy / cx);
        var ax = Math.abs(this.a * Math.cos(angle));
        ax = this.x > this.ex ? -ax : ax
        var ay = Math.abs(this.a * Math.sin(angle));
        ay = this.y > this.ey ? -ay : ay;
        this.vx += ax * tickTime;
        this.vy += ay * tickTime;
        this.vx *= 0.95;
        this.vy *= 0.95;
        this.x += this.vx * tickTime;
        this.y += this.vy * tickTime;
        if (Math.abs(this.x - this.ex) <= this.checkLength && Math.abs(this.y - this.ey) <= this.checkLength) {
          this.checkTimes++;
          if (this.checkTimes >= this.maxCheckTimes) {
            this.stop = true;
          }
        } else {
          this.checkTimes = 0
        }
      }
    },
    update: function(tickTime) {
      this.move(tickTime);
      this.drawSelf();
      this._checkMouse();
    },
    _checkMouse: function() {
      var that = this;
      if (!mouseX) {
        goback();
        return;
      }
      var distance = Math.sqrt(Math.pow(mouseX - this.x, 2) + Math.pow(mouseY - this.y, 2));
      var angle = Math.atan((mouseY - this.y) / (mouseX - this.x));
      if (distance < mouseRadius) {
        this.stop = false;
        this.checkTimes = 0;
        if (!this.recordX) {
          this.recordX = this.ex;
          this.recordY = this.ey;
        }
        this.a = 2000 + 1000 * (1 - distance / mouseRadius);
        var xc = Math.abs((mouseRadius - distance) * Math.cos(angle));
        var yc = Math.abs((mouseRadius - distance) * Math.sin(angle));
        xc = mouseX > this.x ? -xc : xc;
        yc = mouseY > this.y ? -yc : yc;
        this.ex = this.x + xc;
        this.ey = this.y + yc;
      } else {
        goback();
      }
      function goback() {
        if (that.recordX) {
          that.stop = false;
          that.checkTimes = 0;
          that.a = 1500;
          that.ex = that.recordX;
          that.ey = that.recordY;
          that.recordX = null;
          that.recordY = null;
        }
      }
    }
  };
  //use image
  function useImage() {
    img = document.getElementById("logo");
    if (img.complete) {
      canvasHandle.init();
    } else {
      img.onload = function() {
        canvasHandle.init();
      }
    }
  }
  //use text
  function useText(text) {
    img = document.createElement('canvas');
    img.width = 600;
    img.height = 180;
    var imgctx = img.getContext("2d");
    imgctx.textAlign = "center";
    imgctx.textBaseline = "middle";
    imgctx.font = "100px 微软雅黑";
    imgctx.fillText(text || '猩猩助手', img.width / 2, img.height / 2);
    canvasHandle.init();
  }
  useImage()


    //如果有需要的话,更新样式
    this.updateStyle();
  },
  /**
   *
   * @param width
   * @param height
   */
  resize: function (width, height) {
    this.updateLayout(width, height);
    //更新图表
    //this.chart.render({
    //  width: width,
    //  height: height
    //})
  },
  /**
   * 每个组件根据自身需要,从主题中获取颜色 覆盖到自身配置的颜色中.
   * 暂时可以不填内容
   */
  setColors: function () {
    //比如
    //var cfg = this.config;
    //cfg.color = cfg.theme.series[0] || cfg.color;
  },
  /**
   * 数据,设置和获取数据
   * @param data
   * @returns {*|number}
   */
  data: function (data) {
    if (data) {
      this._data = data;
    }
    return this._data;
  },
  /**
   * 更新配置
   * 优先级: config.colors > config.theme > this.config.theme > this.config.colors
   * [注] 有数组的配置一定要替换
   * @param config
   * @private
   */
  mergeConfig: function (config) {
    if (!config) {return this.config}
    this.config.theme = _.defaultsDeep(config.theme || {}, this.config.theme);
    this.setColors();
    this.config = _.defaultsDeep(config || {}, this.config);
    return this.config;
  },
  /**
   * 更新布局
   * 可有可无
   */
  updateLayout: function () {},
  /**
   * 更新样式
   * 有些子组件控制不到的,但是需要控制改变的,在这里实现
   */
  updateStyle: function () {
    var cfg = this.config;
    this.container.css({
      'font-size': cfg.size + 'px',
      'color': cfg.color || '#fff'
    });
  },
  /**
   * 更新配置
   * !!注意:如果render支持第二个参数options, 那updateOptions不是必须的
   */
  //updateOptions: function (options) {},
  /**
   * 更新某些配置
   * 给可以增量更新配置的组件用
   */
  //updateXXX: function () {},
  /**
   * 销毁组件
   */
   destroy: function(){console.log('请实现 destroy 方法')}
});
