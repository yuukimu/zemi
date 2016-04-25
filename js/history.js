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
    scrollwheel: true,
  } ) ;

  review();

  // マーカーの新規出力
  WatchPosition.marker = new google.maps.Marker( {
    map: WatchPosition.map,
    position: center,
  } ) ;
  console.log(google.maps.geometry.spherical.computeLength(path));
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
  WatchPosition.count++;
  var center = path[idx+1];

  // カメラ方向の自動変更
  if (WatchPosition.count < 5 || WatchPosition.count % 4 == 0) {
    var heading = google.maps.geometry.spherical.computeHeading(path[idx], path[idx+1]);
    heading = Math.round(heading / 10) * 10;
    var povopts = { heading: heading ,pitch:10, zoom:1 };
    console.log(heading);
    WatchPosition.svp.setPov(povopts);
    console.log(WatchPosition.count);
  }

  // 地図の中心を変更
  WatchPosition.map.setCenter( center );
  WatchPosition.svp.setPosition( center );

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

  /*******インドアビュー無効テスト********/
  // var viewS = new google.maps.StreetViewService;
  // viewS.getPanorama(
  //   {
  //     location: WatchPosition.map.getCenter(),
  //     preference: google.maps.StreetViewPreference.NEAREST,
  //     source: google.maps.StreetViewSource.OUTDOOR
  //   },
  //   function(data, status){
  //   if(status=="OK"){
  //     WatchPosition.svp = new google.maps.StreetViewPanorama(
  //     document.getElementById("gsv-canvas"),{
  //       addressControlOptions:"BOTTOM_RIGHT",
  //       clickToGo:false,
  //       linksControl:false,
  //       scrollwheel:false,
  //       position : data.location.latLng
  //     });
  //     WatchPosition.map.setStreetView(WatchPosition.svp);
  //   }
  // });
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
