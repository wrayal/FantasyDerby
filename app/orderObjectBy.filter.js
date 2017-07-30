angular.module('FantasyDerbyApp').filter('orderObjectBy', function() {
  return function(items, field, reverse,field2) {
    var filtered = [];
    angular.forEach(items, function(item,key) {
      item.$filtKey=key;
      if (item[field]) filtered.push(item);
      else {item[field]=0;filtered.push(item)}
    });
    filtered.sort(function (a, b) {
      if (field2) {return (a[field][field2] > b[field][field2] ? 1 : -1);} else {
        return (a[field] > b[field] ? 1 : -1);
      }
    });
    if(reverse) filtered.reverse();
    return filtered;
  };
});
