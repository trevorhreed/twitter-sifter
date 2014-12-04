app.controller('about', ['$scope', function($scope){
	
}]);
app.controller('home', ['$scope', '$timeout', 'Miner', function($scope, $timeout, Miner){
	$scope.error = false;
  $scope.charts = [];
	$scope.capture = function(files){
    $timeout(function(){
      var doc = files[0];
      if(doc.type != 'text/csv'){
          $scope.error = "Invalid file type. Must be a *.csv file!";
      }else{
        $timeout(function(){
          
          function count(row, val){
            if(val === undefined){
              return 1;
            }else{
              return ++val;
            }
          };
          miner = new Miner(doc.data);
          
          if($scope.filetype == 'byuser'){
            
            var data = [["City","User","Tweets"]];
            for(var i in miner.data){
              var row = miner.data[i];
              data.push([
                row['Location'],
                row['Username'] + " (" + row['Location'] + ")",
                row['Number of tweets']
              ]);
            };
            console.log("DATA");
            console.dir(data);
            $scope.charts.push({
              "title": "Tweets By User",
              "type": "GeoChart",
              "displayed": true,
              "options": {
                "region": "US",
                "displayMode": "markers",
                "colorAxis": {
                  "colors": ["yellow", "red"]
                }
              },
              "data": data
            });
            
            
          }else if($scope.filetype == 'bytweet'){
            
            var rows = miner.groupBy('Location', count),
                data = [["City","Tweets"]];
            for(var i=0; i < rows.length; i++){
              var row = rows[i];
              data.push([
                row['label'],
                row['value']
              ]);
            };
            $scope.charts.push({
              "title": "Tweets By Location",
              "type": "GeoChart",
              "displayed": true,
              "options": {
                "region": "US",
                "displayMode": "markers",
                "colorAxis": {
                  "colors": ["yellow", "red"]
                }
              },
              "data": data
            });
            
          }
          
          
          
          
          /*
          var data = miner.groupBy('User Name', count),
              rows = [];
          for(var i=0; i < data.length; i++){
            var row = data[i],
                fields = [];
            fields.push({
              "v": row['label']
            });
            fields.push({
              "v": row['value']
            });
            rows.push({
              "c": fields
            });
          }
          $scope.tweetsByUsers = {
            "type": "Table",
            "displayed": true,
            "options": {
              "sortColumn": 1,
              "sortAscending": false
            },
            "data": {
              "cols": [
                {
                  "id": "user",
                  "label": "Tweeter User Name",
                  "type": "string",
                  "p": {}
                },
                {
                  "id": "count",
                  "label": "# of Tweets",
                  "type": "string",
                  "p": {}
                }
              ],
              "rows": rows
            }
          };
          */
          
        });
        
      }
    });
	};
}]);
app.controller('test', ['$scope', function($scope){
	$scope.test = "Hello World!";
}]);
app.controller('layout', ['$scope', '$location', function($scope, $location){
	$scope.places = [
		{
			title: 'Analyze',
			url: '#/'
		},
		{
			title: 'About',
			url: '#/about'
		},
		{
			title: 'Test',
			url: '#/test'
		}
	];
	
	$scope.$on('$locationChangeStart', function(event) {
		var curPath = "#" + $location.path();
		for(var i=0; i < $scope.places.length; i++){
			var place = $scope.places[i];
			if(place.url == curPath){
				$scope.title = place.title;
				place.selected = true;
			}else{
				place.selected = false;
			}
		}  
	});
	
}]);
app.config(['$routeProvider', function($routeProvider){
	$routeProvider
		.when('/', {
			templateUrl: 'home',
			controller: 'home'
		})
		.when('/about', {
			templateUrl: 'about',
			controller: 'about'
		})
		.when('/test', {
			templateUrl: 'test',
			controller: 'test'
		})
		.otherwise({redirectTo: '/'});
}]);

app.run(['$route', angular.noop]);

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
var up = angular.module('up', [])
  .directive('upDropzone', function () {
    function capture(objs, onDrop){
      var files = [],
          inQueue = files.length;
      for (var i = 0; i < objs.length; i++) {
        (function(o){
          var reader = new FileReader();
          reader.onload = function (e) {
            files.push({
              'lastModified': o.lastModified,
              'lastModifiedDate': o.lastModifiedDate,
              'timeStamp': e.timeStamp,
              'name': o.name,
              'type': o.type || "",
              'data': e.target.result,
              'size': e.total
            });
            if (--inQueue <= 0) {
              onDrop(files);
            }
          };
          reader.readAsText(o);
        })(objs[i]);
      }  
    }
    return {
      scope: {
        onDrop: '=upOndrop',
        onDropClass: '=upOndropClass'
      },
      link: function (scope, $el, attrs) {
        var el = $el[0];
        el.addEventListener('click', function(e){
          var fileInput = document.createElement('input');
          fileInput.type = 'file';
          fileInput.style.display = 'none';
          $('body').append(fileInput);
          fileInput.click();
          $(fileInput).change(function(e){
            capture(e.target.files, scope.onDrop || angular.noop);
          });
        }, false);
        el.addEventListener('drop', function(e){
          e.preventDefault();
          e.stopPropagation();
          if(scope.onDropClass){
            $el.removeClass(scope.onDropClass);
          }
          capture(e.dataTransfer.files, scope.onDrop || angular.noop);
        }, false);
        el.addEventListener('dragover', function(e){
          e.stopPropagation();
          e.preventDefault();
          e.dataTransfer.dropEffect = 'copy';
        }, false);
        if(scope.onDropClass){
          el.addEventListener('dragenter', function(e){
            for (var i = 0; i < e.dataTransfer.types.length; i++) {
              if (e.dataTransfer.types[i] == "Files") {
                $el.addClass(scope.onDropClass);
                break;
              }
            }
          }, false);
          el.addEventListener('dragleave', function(e){
            $el.removeClass(scope.onDropClass);
          }, false);
        }
      }
    };
  });
angular.module('myapp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('about',
    "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut luctus mi, a cursus augue. Donec sodales cursus consequat. Curabitur vitae arcu congue, fermentum mauris vitae, feugiat justo. Maecenas mollis eu tortor ac venenatis. Aenean eget pellentesque est. Quisque varius et nisl vitae pulvinar. Praesent et pretium diam. Sed vitae ipsum libero. Cras eu sodales neque, sit amet rhoncus velit. Pellentesque quis gravida mi.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut luctus mi, a cursus augue. Donec sodales cursus consequat. Curabitur vitae arcu congue, fermentum mauris vitae, feugiat justo. Maecenas mollis eu tortor ac venenatis. Aenean eget pellentesque est. Quisque varius et nisl vitae pulvinar. Praesent et pretium diam. Sed vitae ipsum libero. Cras eu sodales neque, sit amet rhoncus velit. Pellentesque quis gravida mi.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut luctus mi, a cursus augue. Donec sodales cursus consequat. Curabitur vitae arcu congue, fermentum mauris vitae, feugiat justo. Maecenas mollis eu tortor ac venenatis. Aenean eget pellentesque est. Quisque varius et nisl vitae pulvinar. Praesent et pretium diam. Sed vitae ipsum libero. Cras eu sodales neque, sit amet rhoncus velit. Pellentesque quis gravida mi.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut luctus mi, a cursus augue. Donec sodales cursus consequat. Curabitur vitae arcu congue, fermentum mauris vitae, feugiat justo. Maecenas mollis eu tortor ac venenatis. Aenean eget pellentesque est. Quisque varius et nisl vitae pulvinar. Praesent et pretium diam. Sed vitae ipsum libero. Cras eu sodales neque, sit amet rhoncus velit. Pellentesque quis gravida mi.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut luctus mi, a cursus augue. Donec sodales cursus consequat. Curabitur vitae arcu congue, fermentum mauris vitae, feugiat justo. Maecenas mollis eu tortor ac venenatis. Aenean eget pellentesque est. Quisque varius et nisl vitae pulvinar. Praesent et pretium diam. Sed vitae ipsum libero. Cras eu sodales neque, sit amet rhoncus velit. Pellentesque quis gravida mi.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut luctus mi, a cursus augue. Donec sodales cursus consequat. Curabitur vitae arcu congue, fermentum mauris vitae, feugiat justo. Maecenas mollis eu tortor ac venenatis. Aenean eget pellentesque est. Quisque varius et nisl vitae pulvinar. Praesent et pretium diam. Sed vitae ipsum libero. Cras eu sodales neque, sit amet rhoncus velit. Pellentesque quis gravida mi.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut luctus mi, a cursus augue. Donec sodales cursus consequat. Curabitur vitae arcu congue, fermentum mauris vitae, feugiat justo. Maecenas mollis eu tortor ac venenatis. Aenean eget pellentesque est. Quisque varius et nisl vitae pulvinar. Praesent et pretium diam. Sed vitae ipsum libero. Cras eu sodales neque, sit amet rhoncus velit. Pellentesque quis gravida mi.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut luctus mi, a cursus augue. Donec sodales cursus consequat. Curabitur vitae arcu congue, fermentum mauris vitae, feugiat justo. Maecenas mollis eu tortor ac venenatis. Aenean eget pellentesque est. Quisque varius et nisl vitae pulvinar. Praesent et pretium diam. Sed vitae ipsum libero. Cras eu sodales neque, sit amet rhoncus velit. Pellentesque quis gravida mi.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut luctus mi, a cursus augue. Donec sodales cursus consequat. Curabitur vitae arcu congue, fermentum mauris vitae, feugiat justo. Maecenas mollis eu tortor ac venenatis. Aenean eget pellentesque est. Quisque varius et nisl vitae pulvinar. Praesent et pretium diam. Sed vitae ipsum libero. Cras eu sodales neque, sit amet rhoncus velit. Pellentesque quis gravida mi.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut luctus mi, a cursus augue. Donec sodales cursus consequat. Curabitur vitae arcu congue, fermentum mauris vitae, feugiat justo. Maecenas mollis eu tortor ac venenatis. Aenean eget pellentesque est. Quisque varius et nisl vitae pulvinar. Praesent et pretium diam. Sed vitae ipsum libero. Cras eu sodales neque, sit amet rhoncus velit. Pellentesque quis gravida mi.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut luctus mi, a cursus augue. Donec sodales cursus consequat. Curabitur vitae arcu congue, fermentum mauris vitae, feugiat justo. Maecenas mollis eu tortor ac venenatis. Aenean eget pellentesque est. Quisque varius et nisl vitae pulvinar. Praesent et pretium diam. Sed vitae ipsum libero. Cras eu sodales neque, sit amet rhoncus velit. Pellentesque quis gravida mi.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut luctus mi, a cursus augue. Donec sodales cursus consequat. Curabitur vitae arcu congue, fermentum mauris vitae, feugiat justo. Maecenas mollis eu tortor ac venenatis. Aenean eget pellentesque est. Quisque varius et nisl vitae pulvinar. Praesent et pretium diam. Sed vitae ipsum libero. Cras eu sodales neque, sit amet rhoncus velit. Pellentesque quis gravida mi.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut luctus mi, a cursus augue. Donec sodales cursus consequat. Curabitur vitae arcu congue, fermentum mauris vitae, feugiat justo. Maecenas mollis eu tortor ac venenatis. Aenean eget pellentesque est. Quisque varius et nisl vitae pulvinar. Praesent et pretium diam. Sed vitae ipsum libero. Cras eu sodales neque, sit amet rhoncus velit. Pellentesque quis gravida mi.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut luctus mi, a cursus augue. Donec sodales cursus consequat. Curabitur vitae arcu congue, fermentum mauris vitae, feugiat justo. Maecenas mollis eu tortor ac venenatis. Aenean eget pellentesque est. Quisque varius et nisl vitae pulvinar. Praesent et pretium diam. Sed vitae ipsum libero. Cras eu sodales neque, sit amet rhoncus velit. Pellentesque quis gravida mi.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut luctus mi, a cursus augue. Donec sodales cursus consequat. Curabitur vitae arcu congue, fermentum mauris vitae, feugiat justo. Maecenas mollis eu tortor ac venenatis. Aenean eget pellentesque est. Quisque varius et nisl vitae pulvinar. Praesent et pretium diam. Sed vitae ipsum libero. Cras eu sodales neque, sit amet rhoncus velit. Pellentesque quis gravida mi.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut luctus mi, a cursus augue. Donec sodales cursus consequat. Curabitur vitae arcu congue, fermentum mauris vitae, feugiat justo. Maecenas mollis eu tortor ac venenatis. Aenean eget pellentesque est. Quisque varius et nisl vitae pulvinar. Praesent et pretium diam. Sed vitae ipsum libero. Cras eu sodales neque, sit amet rhoncus velit. Pellentesque quis gravida mi.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut luctus mi, a cursus augue. Donec sodales cursus consequat. Curabitur vitae arcu congue, fermentum mauris vitae, feugiat justo. Maecenas mollis eu tortor ac venenatis. Aenean eget pellentesque est. Quisque varius et nisl vitae pulvinar. Praesent et pretium diam. Sed vitae ipsum libero. Cras eu sodales neque, sit amet rhoncus velit. Pellentesque quis gravida mi.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut luctus mi, a cursus augue. Donec sodales cursus consequat. Curabitur vitae arcu congue, fermentum mauris vitae, feugiat justo. Maecenas mollis eu tortor ac venenatis. Aenean eget pellentesque est. Quisque varius et nisl vitae pulvinar. Praesent et pretium diam. Sed vitae ipsum libero. Cras eu sodales neque, sit amet rhoncus velit. Pellentesque quis gravida mi.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut luctus mi, a cursus augue. Donec sodales cursus consequat. Curabitur vitae arcu congue, fermentum mauris vitae, feugiat justo. Maecenas mollis eu tortor ac venenatis. Aenean eget pellentesque est. Quisque varius et nisl vitae pulvinar. Praesent et pretium diam. Sed vitae ipsum libero. Cras eu sodales neque, sit amet rhoncus velit. Pellentesque quis gravida mi.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut luctus mi, a cursus augue. Donec sodales cursus consequat. Curabitur vitae arcu congue, fermentum mauris vitae, feugiat justo. Maecenas mollis eu tortor ac venenatis. Aenean eget pellentesque est. Quisque varius et nisl vitae pulvinar. Praesent et pretium diam. Sed vitae ipsum libero. Cras eu sodales neque, sit amet rhoncus velit. Pellentesque quis gravida mi.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut luctus mi, a cursus augue. Donec sodales cursus consequat. Curabitur vitae arcu congue, fermentum mauris vitae, feugiat justo. Maecenas mollis eu tortor ac venenatis. Aenean eget pellentesque est. Quisque varius et nisl vitae pulvinar. Praesent et pretium diam. Sed vitae ipsum libero. Cras eu sodales neque, sit amet rhoncus velit. Pellentesque quis gravida mi.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut luctus mi, a cursus augue. Donec sodales cursus consequat. Curabitur vitae arcu congue, fermentum mauris vitae, feugiat justo. Maecenas mollis eu tortor ac venenatis. Aenean eget pellentesque est. Quisque varius et nisl vitae pulvinar. Praesent et pretium diam. Sed vitae ipsum libero. Cras eu sodales neque, sit amet rhoncus velit. Pellentesque quis gravida mi.</p>"
  );


  $templateCache.put('home',
    "<div class=\"applets-home\"><div class=\"alert alert-danger alert-dismissible\" ng-show=\"error\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;</span> <span class=\"sr-only\">Close</span></button> {{error}}</div><div class=\"narrow\"><div class=\"form-group\"><select class=\"form-control\" ng-model=\"filetype\" ng-value=\"byuser\"><option value=\"bytweet\">Upload Tweet Excel File</option><option value=\"byuser\">Upload Top Tweeter Excel File</option></select></div><div id=\"dropzone\" up-dropzone up-dropclass=\"dropzone-cover\" up-ondrop=\"capture\" class=\"well drop-zone\">Drag a file here or click to upload.</div></div><div class=\"data\"><div class=\"well\" ng-repeat=\"chart in charts\"><h3>{{chart.title}}</h3><div google-chart chart=\"chart\"></div></div></div></div>"
  );


  $templateCache.put('test',
    "This is a test."
  );


  $templateCache.put('layout',
    "<div class=\"wrapper\"><div class=\"menu\"><a ng-repeat=\"place in places\" class=\"item\" ng-class=\"{selected: place.selected}\" ng-href=\"{{place.url}}\">{{place.title}}</a></div><div class=\"content\"><div class=\"page-header\"><h1>{{title}}</h1></div><div ng-view=\"'home'\"></div><div class=\"footer\"><!-- legalese. --></div></div></div>"
  );

}]);
