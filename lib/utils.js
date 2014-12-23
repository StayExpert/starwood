exports.today = today;
exports.tomorrow = tomorrow;
exports.parseCategoryNumber = parseCategoryNumber;

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

function parseCategoryNumber(text) {
  if (text.indexOf('SPG 俱乐部类别') === -1)
    return text;

  return trim(text.replace('SPG 俱乐部类别',''));
}

function trim(text) {
  var c = [];
  text.split('').forEach(function(word){
    if (word.indexOf('') !== 0)
      c.push(word);
  });
  return c;
}