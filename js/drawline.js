// ラインを引く座標の配列の入れ物を作成 
var points = new Array(); 

function draw(lat, lng) {
  // ラインオプションを作成 
  var polyLineOptions = { 
    path: null, 
    strokeWeight: 8, 
    strokeColor: "#0000ff", 
    strokeOpacity: "0.5" 
  }; 

  var latlng = new google.maps.LatLng(lat, lng);
  points.push(latlng);

  // 配列の数を２つに調整する 
  if (points.length > 2) { 
    points.shift(); 
  } 

  // ラインを作成 
  if (points.length > 1) { 
    polyLineOptions.path = points; 
    var poly = new google.maps.Polyline(polyLineOptions); 
    poly.setMap(WatchPosition.map); 
  }
}
