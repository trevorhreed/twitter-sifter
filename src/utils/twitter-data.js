angular.module('twitterData', [])
.factory('Miner', [function(){
  return function constructor(raw){
    var me = this;
    (function(){
      me.csv = Papa.parse(raw, {
        header: true,
        dynamicTyping: true
      });
      me.data = me.csv.data;
      me.headers = me.csv.meta.fields;
    })();
    
    me.count = function(column, pattern){
      var count = 0;
      for(var i=0; i < me.data.length; i++){
        if(me.data[i][column].match(pattern)){
          count++;
        }
      }
      return count;
    }
    me.groupBy = function(groupColumn, aggregatorFn){
      var hash = {};
      for(var i=0; i < me.data.length; i++){
        var row = me.data[i],
            key = row[groupColumn];
        hash[key] = aggregatorFn(row, hash[key]);
      }
      var arr = [];
      for(var p in hash){
        arr.push({
          'label': p,
          'value': hash[p]
        });
      }
      return arr;
    }
  }
  
  /*
  return {
    'refine': function(raw){
      var rows = [],
          columns = {},
          rawRows = raw.split('\r'),
          headers = rawRows.shift().split(',');
      for(var i in rawRows){
        var rawCells = rawRows[i].split(','),
            row = {};
        for(var k in rawCells){
          row[headers[k]] = rawCells[k];
          if(!columns[headers[k]]){
            columns[headers[k]] = [];
          }
          columns[headers[k]].push(rawCells[k]);
        }
        rows.push(row);
      }
      return {
        'rows': rows,
        'cols': columns
      };
    }
  }
  */
  
}]);