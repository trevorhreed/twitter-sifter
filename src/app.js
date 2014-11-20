app.config(['$routeProvider', function($routeProvider){
	$routeProvider
		.when('/test', {
			templateUrl: 'test.html',
			controller: ['$scope', function($scope){
				$scope.test = 'This is a test.';
			}]
		})
		.otherwise({redirectTo: '/test'});
}]);

app.controller('main', ['$scope', 'version', function($scope, version){
	$scope.test = 'Hello World! ' + version;
}]);
