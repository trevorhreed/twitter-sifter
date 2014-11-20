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

app.value('version', 'v0.1');
angular.module('myapp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('test.html',
    "<div class=\"app-container\"><h1>{{test}}</h1></div>"
  );

}]);
