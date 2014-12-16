app.config(['$routeProvider', function($routeProvider){
	$routeProvider
		.when('/', {
			templateUrl: 'home',
			controller: 'home'
		})
		.when('/tweeting-the-discipline', {
			templateUrl: 'about',
			controller: 'about'
		})
		.otherwise({redirectTo: '/'});
}]);

app.run(['$route', angular.noop]);
