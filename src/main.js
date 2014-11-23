app.controller('main', ['$scope', function($scope){
	$scope.test = 'Hello World!';
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
}]);