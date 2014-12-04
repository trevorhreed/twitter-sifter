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