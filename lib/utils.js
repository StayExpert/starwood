var trim = require('trim');

exports.today = today;
exports.tomorrow = tomorrow;
exports.escape = escape;

function today(offset) {
  var n = offset ? new Date(offset) : new Date();
  return [
    n.getFullYear().toString().substr(2) + '年',
    (n.getMonth() + 1) + '月',
    n.getDate() + '日'
  ].join('');
}

function tomorrow() {
  return today(new Date().getTime() + 24 * 60 * 60 * 1000);
}

function escape(text, from) {
  if (text.indexOf(from) === -1)
    return text;

  return trim(text.replace(from,''));
}
