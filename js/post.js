var postForm = function(url) {
  var encodedPath = google.maps.geometry.encoding.encodePath(history);
  console.log(encodedPath);
  var $form = $('<form/>', {'action': url, 'method': 'post'});
  $form.append($('<input/>', {'type': 'hidden', 'name': 'path', 'value': encodedPath}));
  $form.appendTo(document.body);
  $form.submit();
};