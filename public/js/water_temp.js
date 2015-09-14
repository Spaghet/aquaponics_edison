(function (){// -------------- これより下、関数型プログラムであったほうが楽な関数s なんで、無視しておｋ

// valの存在確認プレディゲート と valがtrueを返すリテラルかを確認するプレディゲート
function existy (val) { return val != null}　
function truthy (val) { return (val !== false) && existy(val)} //valがtrueなやつかどうか確認プレディゲート
function fail   (msg) { throw new Error(msg)} //エラーを吐く

function always(VALUE) { //valueを常に返すクロージャ
  return function() {
    return VALUE;
  };
}

function doWhen (cond, func) { //ifをカプセル化したやつ
  if (truthy(cond))
  return func();

  else
  return undefined;
}

// ----------------------------------
//objectの宣言


function Graph(obj) {
  var self = this;
  self.width = obj.width | 800;
  self.height = obj.height | 400;
  self.margin = 40;
  if(!existy(obj.data))
  fail("GRAPH.DATA::UNDEFINED")
  self.data = obj.data;

  return {
    set : function (key, value){
      doWhen(!existy(self[key]), function(){
        fail(key + ":: NOT FOUND");
      });
      self[key] = value;
    },
    get : function(key){return self[key]}
  }
}

function LG () {
  LG.graph;
  return {
    init: function(obj){
      LG.graph = new Graph(obj);
      return this;
    },
    render:10


  }
}


function auto_set () {

}

// 表示サイズを設定
var margin = {
  top   : 40,
  right : 40,
  bottom: 40,
  left  : 40
};

var size = {
  width : 1366,
  height: 590/3
};


// アニメーション判定フラグ
var isAnimated = false;


// 元の表示サイズを保持しておく
margin.original = clone(margin);
size.original = clone(size);

// 縦横比率と現在の倍率を保持しておく
size.scale = 1;
size.aspect = size.width / size.height;



// 表示するデータ
var data =[
{value: 24.335236261486692,
date: "2015-01-28"},

{value: 24.086511834531663,
date: "2015-02-28"},

{value: 24.16942832729206,
date: "2015-03-28"},

{value: 23.50580313888993,
date: "2015-04-28"},

{value: 24.00358614316591,
date: "2015-05-28"},

{value: 24.16942832729206,
date: "2015-06-28"},

{value: 24.252336257667963,
date: "2015-07-28"},

{value: 23.75474750870748,
date: "2015-08-28"},

{value: 24.00358614316591,
date: "2015-09-28"},

{value: 23.92065061655103,
date: "2015-10-28"},

{value: 24.666769715603294,
date: "2015-11-28"},

{value: 24.666769715603294,
date: "2015-12-28"}
];



// 時間のフォーマット
var parseDate = d3.time.format("%Y-%m-%d").parse;


// SVG、縦横軸などの設定
var win = d3.select(window);
var svg = d3.select("#water_temp");
var g = svg.append("g");
var x = d3.time.scale();
var y = d3.scale.linear();

var xAxis = d3.svg.axis()
.scale(x)
.orient("bottom")
.tickFormat(d3.time.format("%m"));

var yAxis = d3.svg.axis()
.scale(y)
.orient("left");

var line = d3.svg.line()
.x(function(d){ return x(d.date); })
.y(function(d){ return y(d.value); })
.interpolate("basis");


// 描画
function render(){
  data.forEach(function(d){
    d.date = parseDate(d.date);
    d.value = +d.value;
  });

  x.domain(d3.extent(data, function(d){ return d.date; }));
  y.domain(d3.extent(data, function(d){ return d.value; }));

  g.append("g")
  .attr("class", "x axis");

  g.append("g")
  .attr("class", "y axis")
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", ".7em")
  .style("text-anchor", "end")
  .text("値の単位");

  g.append("path")
  .attr("class", "line");
}


// グラフサイズの更新
function update(){

  // SVGのサイズを取得
  size.width = parseInt(svg.style("width"));
  size.height = size.width / size.aspect;

  // 現在の倍率を元に余白の量も更新
  // 最小値がそれぞれ30pxになるように調整しておく
  size.scale = size.width / size.original.width;
  margin.top    = Math.max(30, margin.original.top * size.scale);
  margin.right  = Math.max(30, margin.original.right * size.scale);
  margin.bottom = Math.max(30, margin.original.bottom * size.scale);
  margin.left   = Math.max(30, margin.original.left * size.scale);

  // <svg>のサイズを更新
  svg
  .attr("width", size.width)
  .attr("height", size.height);

  // 縦横の最大幅を新しいサイズに合わせる
  x.range([0, size.width - margin.left - margin.right]);
  y.range([size.height - margin.top - margin.bottom, 0]);

  // 中心位置を揃える
  g.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // 横軸の位置
  g.selectAll("g.x")
  .attr("transform", "translate(0, " + ( size.height - margin.top - margin.bottom ) + ")")
  .call(xAxis);

  // 縦軸の位置
  g.selectAll("g.y")
  .call(yAxis);

  // 折れ線の位置
  if( isAnimated ){
    g.selectAll("path.line")
    .datum(data)
    .attr("d", line);
  }
}


// アニメーションを実行
function animate(){

  // アニメーション用のダミーデータ
  var dummy = [];
  data.forEach(function(d, i){
    dummy[i] = clone(d);
    dummy[i].value = 23.5;
  });

  g.selectAll("path.line")
  .datum(dummy)
  .attr("d", line)
  .transition()
  .delay(500)
  .duration(1000)
  .ease("back-out")
  .attr("d", line(data))
  .each("end", function(){
    isAnimated = true;
    update();
  });
}


// オブジェクトのコピーを作成する簡易ヘルパー
function clone(obj){
  var copy = {};
  for( var key in obj ){
    if( obj.hasOwnProperty(key) ) copy[key] = obj[key];
  }
  return copy;
}


//extra
!function(e){function t(n){if(a[n])return a[n].exports;var r=a[n]={exports:{},id:n,loaded:!1};return e[n].call(r.exports,r,r.exports,t),r.loaded=!0,r.exports}var n=window.webpackJsonp;window.webpackJsonp=function(o,c){for(var s,i,l=0,p=[];l<o.length;l++)i=o[l],r[i]&&p.push.apply(p,r[i]),r[i]=0;for(s in c)e[s]=c[s];for(n&&n(o,c);p.length;)p.shift().call(null,t);return c[0]?(a[0]=0,t(0)):void 0};var a={},r={0:0};return t.e=function(e,n){if(0===r[e])return n.call(null,t);if(void 0!==r[e])r[e].push(n);else{r[e]=[n];var a=document.getElementsByTagName("head")[0],o=document.createElement("script");o.type="text/javascript",o.charset="utf-8",o.async=!0,o.src=t.p+""+e+"."+({1:"app"}[e]||e)+".js",a.appendChild(o)}},t.m=e,t.c=a,t.p="",t(0)}([function(){!function(e,t,n,a,r,o,c){e.GoogleAnalyticsObject=r,e[r]=e[r]||function(){(e[r].q=e[r].q||[]).push(arguments)},e[r].l=1*new Date,o=t.createElement(n),c=t.getElementsByTagName(n)[0],o.async=1,o.src=a,c.parentNode.insertBefore(o,c)}(window,document,"script","//www.google-analytics.com/analytics.js","ga"),ga("create","UA-40730305-1","auto"),ga("send","pageview")}]);



// 初期化
$("body").append('<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">')
.append('<style>.axis path,.axis line {fill:none;stroke:#666;shape-rendering:crispEdges;}.x.axis path {display:none;}.line {fill:none;stroke:#1572F9;stroke-width:1.5px;}text {font-size:8px;}svg {width:100%;}@media screen and (max-width:700px){text {font-size:8px;}.line {stroke-width:1px;}}</style>');



render();
update();
animate();
win.on("resize", update);
})();
