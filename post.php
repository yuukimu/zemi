<?php
  $filename = '../../latlng.json';
  $handle = fopen($filename, 'r');
  $info = json_decode(fread($handle, filesize($filename)), true);
  fclose($handle);
  
  $url = $info['url'];
  $user = $info['user'];
  $pass = $info['passwd'];
  $db = $info['db'];
    
  // MySQLへ接続する
  $connect = mysql_connect($url, $user, $pass) or die("MySQLへの接続に失敗しました。");

  // 手を加えるデータベースを選択する
  $sdb = mysql_select_db($db, $connect) or die("データベースの選択に失敗しました。");
    
  // POSTされたパラメータを受け取る
  $path = $_POST["path"];
  $dist = $_POST["distance"];
  $time = date("Y-m-d H:i:s");
  // クエリを送信する
  $sql = "INSERT INTO history(path, distance, date) VALUES('$path', '$dist', '$time')";
  $result = mysql_query($sql, $connect) or die("クエリの送信に失敗しました。<br />SQL:".$sql);
    
  // MySQLへの接続を閉じる
  mysql_close($connect) or die("MySQL切断に失敗しました。");    
?>

<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" type="text/css" href="./css/map.css">
  <link rel="stylesheet" type="text/css" href="./css/default.css">
  <title>開発ゼミ</title>
</head>
<body>
  <h1>開発ゼミ</h1>
  <h2>記録終了</h2>
  <p><a href="./map.html">記録開始</a> | 
  <a href="./history_list.php">履歴一覧</a> | 
  <a href="./index.html">メニューに戻る</a></p>
  <label>記録を保存しました。</label>
</body>
</html>