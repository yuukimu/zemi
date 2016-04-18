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

  $result = mysql_query('select date from history order by date');
  mysql_close($connect) or die("MySQL切断に失敗しました。");
?>

<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="content-type" content="text/html; charset=utf-8"/>
  <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" type="text/css" href="./css/default.css">
  <link rel="stylesheet" type="text/css" href="./css/map.css">
  <title>開発ゼミ</title>
</head>
<body>
  <h1>開発ゼミ</h1>
  <h2>履歴一覧</h2>
  <p>閲覧したい履歴を選択してください | 
  <a href="./map.html">記録開始</a> | 
  <a href="./index.html">メニューに戻る</a></p>
  <hr>
  <form action="show_history.php" method="POST">
    <table>
      <tr><th>select</th><th>date</th></tr>
      <?php 
        while ($row = mysql_fetch_assoc($result)) {
          print "<tr>";
          print '<td><input type="radio" name="select" value="' . htmlspecialchars($row['date']). '"/></td>';
          print "<td>".$row['date']."</td>";
          print "</tr>";
        }
      ?>
    </table>
    <p><input type="submit" value="決定"  class="submit_button" /></p>
  </form>
  <hr>
</body>
</html>
