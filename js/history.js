// グローバル変数
var WatchPosition = {
  count: 0 ,
  lastTime: 0 ,
  map: null ,
  svp: null,
  marker: null ,
} ;

function init() {
  var path = document.getElementById('path').value;
  console.log(path);
}

function initialize()
{
  // draw(lat, lng)
  // 位置情報
  var encodedPath = document.getElementById('path').value;
  console.log(encodedPath);
  var path = google.maps.geometry.encoding.decodePath(encodedPath);
  // var latlng = new google.maps.LatLng( 34.075517, 134.558618 ); 
  var center = path[0];
  // Google Mapsに書き出し
  // 地図の新規出力
  WatchPosition.map = new google.maps.Map( document.getElementById( 'map-canvas' ) , {
    zoom: 15 ,        // ズーム値
    center: center ,    // 中心座標 [latlng]
    streetViewControl: false,
  } ) ;

  review();

  // マーカーの新規出力
  WatchPosition.marker = new google.maps.Marker( {
    map: WatchPosition.map ,
    position: center ,
  } ) ;
  // else
  // {
  //   // 地図の中心を変更
  //   WatchPosition.map.setCenter( latlng ) ;
  //   WatchPosition.svp.setPosition( latlng );

  //   // マーカーの場所を変更
  //   WatchPosition.marker.setPosition( latlng ) ;
  // }
  for (var i = 0; i < path.length-1; i++) {
    drawHistory(path[i], path[i+1]);
  }
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
  poly.setMap(WatchPosition.map);
}

/* ロード時に初期化 */
google.maps.event.addDomListener(window, 'load', initialize);
