app.controller('layout', ['$scope', '$location', function($scope, $location){
	$scope.places = [
		{
			title: 'Analyze',
            link: 'Analyze',
			url: '#/'
		},
		{
			title: 'Tweeting the Discipline',
            link: 'About',
			url: '#/tweeting-the-discipline'
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