var postForm = function(url) {
  var encodedPath = google.maps.geometry.encoding.encodePath(history);
  var distance = google.maps.geometry.spherical.computeLength(history);
  distance = Math.round(distance) / 1000;
  var $form = $('<form/>', {'action': url, 'method': 'post'});
  $form.append($('<input/>', {'type': 'hidden', 'name': 'path', 'value': encodedPath}));
  $form.append($('<input/>', {'type': 'hidden', 'name': 'distance', 'value': tdistance}));
  $form.appendTo(document.body);
  $form.submit();
};