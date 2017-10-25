var Event = require('bcore/event');
var $ = require('jquery');
var _ = require('lodash');
//require('./sineWaveCircle.js');
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
    //this.container.html(data[0].value)
    
      $("canvas").clearRect(10, 10, 100, 100);
    this.container.append('<script language="javascript" type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r71/three.min.js"></script>')
    //如果有需要的话,更新样式


  

window.addEventListener("load", function () {

  var r=4;
  var s_r=r/20+Math.sin(0)*r/20;
  var num_of_corners=7;
  var obj_resolution=360;
  var linewidth=0.04;

  
  var _w=window.innerWidth;
  var _h=window.innerHeight;

  var aspect = _w/ _h;
  var scene = new THREE.Scene(); 
  console.log(scene);
  var camera = new THREE.PerspectiveCamera(cfg.farclose, _w/_h, 0.1, 1000 );
  camera.position.z = 10; 
  var renderer = new THREE.WebGLRenderer({ antialias: true } ); 
  renderer.setClearColor(new THREE.Color(0x221f26, 1.0));
  renderer.setSize( _w, _h ); 
  document.getElementById("chart").appendChild( renderer.domElement );

  var group = new THREE.Object3D();
  var sub_group = new THREE.Object3D();
  var all_vertices=[];
  var all_sub_vertices=[];

  var objects=[];
  var sub_objects=[];
  var num=3;
  var dstnc=0.2;
  var border=0.04;
  var colors=[0x379392,0x2E4952,0x0BC9C7];

  for(var i=0;i<num;i++){
    var obj=create_mesh(colors[i],1+linewidth*0.8*i,all_vertices,i);
    objects.push(obj);
    sub_group   .add(obj);
    obj.rotation.y =Math.PI/180*180;
  } 


  group.rotation.x = sub_group.rotation.x = Math.PI/180*360;
  scene.add(group);
  scene.add(sub_group);

  function create_mesh(clr,r_coof,ver_arr,wave_type){
    var geometry = new THREE.BufferGeometry();
    var points=generate_points(r,s_r,5,wave_type);
    var points2=generate_points(r*(1-linewidth),s_r,5,wave_type);
    var vertices =generate_vertices(points,points2);
    ver_arr.push(vertices);
    geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    var material = new THREE.MeshBasicMaterial( { color: clr,wireframe:false } );
    var mesh = new THREE.Mesh( geometry, material );
    mesh.anim_shape=num_of_corners;
    mesh.anim=-1;
    mesh.r_coof=r_coof;
    mesh.wave_type=wave_type;
    return mesh;
  }

  function generate_points(radius,wave_height,anim_shape,wave_type){

    var new_poistions=[];
    for (var i = 0; i <=  obj_resolution; i++) {
      var angle=2*Math.PI/obj_resolution*i;
      var raidus_addon=0;
      var speed_incrementer=counter/40;
      var sine_pct=0.5;

      if(i<sine_pct*obj_resolution||i==obj_resolution){
        var smoothing_amount=0.14;
        var smooth_pct=1;
        if(i<sine_pct*obj_resolution*smoothing_amount)smooth_pct=i/(sine_pct*obj_resolution*smoothing_amount);
        if(i>sine_pct*obj_resolution*(1-smoothing_amount)&&i<=sine_pct*obj_resolution)smooth_pct=(sine_pct*obj_resolution-i)/(sine_pct*obj_resolution*smoothing_amount);
        if(i==obj_resolution)smooth_pct=0;

        if(wave_type==1) raidus_addon=wave_height*smooth_pct*Math.cos((angle+speed_incrementer)*anim_shape);
        if(wave_type==0) raidus_addon=wave_height*smooth_pct*Math.sin((angle+speed_incrementer)*anim_shape);
        if(wave_type==2) raidus_addon=wave_height*smooth_pct*Math.cos((angle+Math.PI/180*120+speed_incrementer)*anim_shape);
      }

      var x = (radius+raidus_addon) * Math.cos(angle+speed_incrementer);
      var y = (radius+raidus_addon) * Math.sin(angle+speed_incrementer);
      var z=0;

      new_poistions.push([x,y,z]);
    }

    return new_poistions;
  }


  function generate_vertices(points,points2){
   var vertexPositions=[];
   var center_point=[0,0,0];

   for (var i = 0; i <  points.length-1; i++) {
    vertexPositions.push(points[i],points2[i],points[i+1]);
    vertexPositions.push(points2[i],points2[i+1],points[i+1]);
  }
  vertexPositions.push(points[ points.length-1],points2[points.length-1],points[0]);
  vertices = new Float32Array( vertexPositions.length * 3 ); 

  for ( var i = 0; i < vertexPositions.length; i++ )
  {
    vertices[ i*3 + 0 ] = vertexPositions[i][0];
    vertices[ i*3 + 1 ] = vertexPositions[i][1];
    vertices[ i*3 + 2 ] = vertexPositions[i][2];
  }


  return vertices;
}

function update_vertices_v_2(points,points2,my_arr){

  var vertexPositions=[];

  for (var i = 0; i <  points.length-1; i++) {
    vertexPositions.push(points[i],points2[i],points[i+1]);
    vertexPositions.push(points2[i],points2[i+1],points[i+1]);
  }

  vertexPositions.push(points[ points.length-1],points2[points.length-1],points[0]);

  for ( var i = 0; i < vertexPositions.length; i++ ){
    my_arr[ i*3 + 0 ] = vertexPositions[i][0];
    my_arr[ i*3 + 1 ] = vertexPositions[i][1];
    my_arr[ i*3 + 2 ] = vertexPositions[i][2];
  }

}


var last_anim=false;
var delay_time=0.3;
var anim_time=2.12;
var rot_angle=90;
var counter=0;
var counter_anim=0;
var frame=0;
var frame_num=0;
var loop = function loop() {
  requestAnimationFrame(loop);

  for (var k = 0; k <  objects.length; k++) {
    var time=(counter+k)/60;
    var time_sin=Math.sin(time*4);

    var obj=objects[k];
    var rad=r*obj.r_coof;
    s_r=rad/15;
    var points=generate_points(rad,s_r,obj.anim_shape,obj.wave_type); 
    var points2=generate_points(rad*(1-linewidth),s_r,obj.anim_shape,obj.wave_type); 
    update_vertices_v_2(points,points2, all_vertices[k]);
    obj.geometry.attributes.position.needsUpdate = true;

  }

  renderer.render(scene, camera);
  counter++;

};





loop();

}, false);



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