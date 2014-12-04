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
