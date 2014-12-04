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