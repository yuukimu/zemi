// グローバル変数
var WatchPosition = {
  count: 0 ,
  lastTime: 0 ,
  map: null ,
  svp: null,
  marker: null ,
} ;

var startId = false;

// 座標のログを格納
var history = [];

// 成功した時の関数
function successFunc( position )
{
  // データの更新
  ++WatchPosition.count ;         // 処理回数
  var nowTime = ~~( new Date() / 1000 ) ; // UNIX Timestamp

  // 前回の書き出しから6秒以上経過していたら描写
  // 毎回HTMLに書き出していると、ブラウザがフリーズするため
  if( (WatchPosition.lastTime + 6) > nowTime )
  {
    return false ;
  }

  // 前回の時間を更新
  WatchPosition.lastTime = nowTime ;

  // 緯度
  var lat = position.coords.latitude;
  // 経度
  var lng = position.coords.longitude;
  // 位置情報
  var latlng = new google.maps.LatLng( lat , lng );
  if (startId) {
    // 信号待ちでの取得停止
    // if (WatchPosition.count > 0){
    //   var distance = google.maps.geometry.spherical.computeDistanceBetween(history[history.length-1], latlng); 
    //   if (distance < 3.0) {
    //     console.log("less than 3m");
    //     return false; 
    //   }
    // }
    /********************/
    draw(lat, lng);
    history.push(latlng);
    console.log(history.length);
  } 
  // Google Mapsに書き出し
  if( WatchPosition.map == null )
  {
    // 地図の新規出力
    WatchPosition.map = new google.maps.Map( document.getElementById( 'map-canvas' ) , {
      zoom: 15 ,        // ズーム値
      center: latlng ,    // 中心座標 [latlng]
      streetViewControl: false,
      scrollwheel: false,
    } );

    review();

    // マーカーの新規出力
    WatchPosition.marker = new google.maps.Marker( {
      map: WatchPosition.map ,
      position: latlng ,
    } ) ;
  }
  else
  {
    // 地図の中心を変更
    WatchPosition.map.setCenter( latlng ) ;
    WatchPosition.svp.setPosition( latlng );

    // マーカーの場所を変更
    WatchPosition.marker.setPosition( latlng ) ;
  }
}

// 失敗した時の関数
function errorFunc( error )
{
  // エラーコードのメッセージを定義
  var errorMessage = {
    0: "原因不明のエラーが発生しました…。" ,
    1: "位置情報の取得が許可されませんでした…。" ,
    2: "電波状況などで位置情報が取得できませんでした…。" ,
    3: "位置情報の取得に時間がかかり過ぎてタイムアウトしました…。" ,
  } ;

  // エラーコードに合わせたエラー内容を表示
  alert( errorMessage[error.code] ) ;
}

// オプション・オブジェクト
var optionObj = {
  "enableHighAccuracy": true ,
  "timeout": 1000000 ,
  "maximumAge": 0 ,
} ;

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

function startRecord() {
  if (!startId) {
    startId = true;
    document.getElementById("status").innerText = "記録中";
    console.log(startId);
  }
}

function stopRecord() {
  if (startId) {
    postForm('./post.php');
  } else {
    console.log("not started!");
  }
}

// 現在位置を取得する
navigator.geolocation.watchPosition( successFunc , errorFunc , optionObj ) ;
