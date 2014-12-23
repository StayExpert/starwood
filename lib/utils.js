exports.parseCategoryNumber = parseCategoryNumber;

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