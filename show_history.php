<?php
  $filename = '../../latlng.json';
  $handle = fopen($filename, 'r');
  $info = json_decode(fread($handle, filesize($filename)), true);
  fclose($handle);

  $url = $info['url'];
  $user = $info['user'];
  $pass = $info['passwd'];
  $db = $info['db'];
    
  $connect = mysql_connect($url, $user, $pass) or die("MySQLへの接続に失敗しました。");
  $sdb = mysql_select_db($db, $connect) or die("データベースの選択に失敗しました。");
  $result = mysql_query('select path, distance from history where date = "'.$_POST['select'].'"');
  mysql_close($connect) or die("MySQL切断に失敗しました。");

  $row = mysql_fetch_assoc($result);
  $path = $row['path'];
  $distance = $row['distance'];
?>

<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="content-type" content="text/html; charset=utf-8"/>
  <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" type="text/css" href="./css/map.css">
  <link rel="stylesheet" type="text/css" href="./css/default.css">
  <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
  <script src="http://maps.google.com/maps/api/js?sensor=false&libraries=geometry" charset="UTF-8"></script>
  <script  src="./js/history.js"></script>
  <title>開発ゼミ</title>
</head>
<body>
  <input type="hidden" id="path" value="<?php echo $path ?>"></input>
  <h1>開発ゼミ</h1>
  <h2>移動履歴</h2>
  <p><a href="./map.html">記録開始</a> | 
  <a href="./history_list.php">履歴一覧</a> | 
  <a href="./index.html">メニューに戻る</a></p>
  <HR style="margin-top: 3em 0 ;">
  <label style="font-size: 1.4em"><?php echo '移動距離 '.($distance / 1000).'km' ?></label>

  <div class="map-wrapper">
    <div id="map-canvas" class="map"></div>
    <div id="gsv-canvas" class="gsv"></div>
  </div>
  <div class="ctrl">
    <button type="button" class="ctrl_button" onClick="reset()">Reset</button>
    <button type="button" class="ctrl_button" onClick="preview()">Prev</button>
    <button type="button" class="ctrl_button" onClick="next()">Next</button>
    <button type="button" class="ctrl_button" onClick="auto()">Auto</button>
    <button type="button" class="stop_button" onClick="stop_timer()">Stop</button>
  </div>
  <HR style="margin: 3em 0 ;">
</body>
</html>