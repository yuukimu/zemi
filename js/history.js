/*******  history.js *******/

// グローバル変数
var WatchPosition = {
  count: 0 ,
  lastTime: 0 ,
  map: null ,
  svp: null,
  marker: null ,
} ;

var line_list = new google.maps.MVCArray();

var encodedPath;
var path;
var idx;
var auto_id = null
var oldHeading = null;

function init() {
  var path = document.getElementById('path').value;
  console.log(path);
}

function initialize()
{
  encodedPath = document.getElementById('path').value;
  path = google.maps.geometry.encoding.decodePath(encodedPath);
  idx = 0;
  var center = path[0];
  // Google Mapsに書き出し
  WatchPosition.map = new google.maps.Map( document.getElementById( 'map-canvas' ) , {
    zoom: 15 ,
    center: center ,
    streetViewControl: false,
    scrollwheel: false,
  } ) ;

  review();

  // マーカーの新規出力
  WatchPosition.marker = new google.maps.Marker( {
    map: WatchPosition.map ,
    position: center ,
  } ) ;
}

function reset() {
  if (confirm("リセットしますか？")) {
    idx = 0;
    clearInterval(auto_id);
    auto_id = null;
    line_list.forEach(function(line, i){
      line.setMap(null);
    });
    WatchPosition.map.setCenter( path[idx] );
    WatchPosition.svp.setPosition( path[idx] );
    WatchPosition.marker.setPosition( path[idx] );
  }
}

function next() {
  if (idx < path.length-2) {
    drawHistory(path[idx], path[idx+1]);
    update();
    idx++;
  } else {
    alert("最後の座標です。");
  }
}

function preview(argument) {
  if (idx > 1) {
    idx--;
    update();
  } else {
    alert("最初の座標です。");
  }
}

function auto() {
  if (auto_id == null) {
    auto_id = setInterval(function(){
      drawHistory(path[idx], path[idx+1]);
      update();
      idx++;
      if (idx >= path.length-2) {
        clearInterval(auto_id);
        auto_id = null;
        alert("移動が終了しました。");
        console.log("finish");
      }
    }, 800);
  }
}

function stop_timer() {
  clearInterval(auto_id);
  auto_id = null;
  console.log("timer stop.");
}

function update() {
  var center = path[idx];
  var heading = google.maps.geometry.spherical.computeHeading(path[idx], path[idx+1]);
  heading = Math.round(heading / 10) * 10;
  // if (oldHeading == null) {
  //   oldHeading = heading;
  // } else {
  //   var diff = Math.abs(heading - Math.abs(oldHeading));
  //   if (diff >= 180) {
  //     console.log("1: " + heading);
  //     var swap = heading;
  //     heading = oldHeading;
  //     oldHeading = swap;
  //     // heading = oldHeading;
  //   } 
  //   else if (diff >= 30 && diff < 100) {
  //     console.log("2: " + heading);
  //     heading = heading - 20;
  //   }
  //   oldHeading = heading;
  // }
  var povopts = { heading: heading ,pitch:10, zoom:1 };
  console.log(heading);
  var distance = google.maps.geometry.spherical.computeDistanceBetween(path[idx], path[idx+1]);
  console.log("distance = " + distance);
  if (distance > 20) {
    return false;
  }
  // 地図の中心を変更
  WatchPosition.map.setCenter( center );
  WatchPosition.svp.setPosition( center );
  WatchPosition.svp.setPov(povopts);

  // マーカーの場所を変更
  WatchPosition.marker.setPosition( center );
}

function review() {
  WatchPosition.svp = new google.maps.StreetViewPanorama(
    document.getElementById("gsv-canvas"),{
      addressControlOptions:"BOTTOM_RIGHT",
      clickToGo:false,
      linksControl:false,
      scrollwheel:false,
      position : WatchPosition.map.getCenter()
    });
  WatchPosition.map.setStreetView(WatchPosition.svp);
}

function drawHistory(p1, p2) {
  // ラインオプションを作成 
  var polyLineOptions = { 
    path: null, 
    strokeWeight: 8, 
    strokeColor: "#0000ff", 
    strokeOpacity: "0.5" 
  }; 
  var points = [];
  points.push(p1);
  points.push(p2);

  polyLineOptions.path = points; 
  var poly = new google.maps.Polyline(polyLineOptions);
  line_list.push(poly);
  poly.setMap(WatchPosition.map);
}

/* ロード時に初期化 */
google.maps.event.addDomListener(window, 'load', initialize);
