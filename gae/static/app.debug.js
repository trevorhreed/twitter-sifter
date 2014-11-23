

app.controller('test', ['$scope', function($scope){
	$scope.test = "Hello World!";
}]);
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


app.controller('home', ['$scope', function($scope){
	$scope.title = "Welcome Home";
}]);
angular.module('myapp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('about',
    "<h1>About</h1><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut luctus mi, a cursus augue. Donec sodales cursus consequat. Curabitur vitae arcu congue, fermentum mauris vitae, feugiat justo. Maecenas mollis eu tortor ac venenatis. Aenean eget pellentesque est. Quisque varius et nisl vitae pulvinar. Praesent et pretium diam. Sed vitae ipsum libero. Cras eu sodales neque, sit amet rhoncus velit. Pellentesque quis gravida mi.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut luctus mi, a cursus augue. Donec sodales cursus consequat. Curabitur vitae arcu congue, fermentum mauris vitae, feugiat justo. Maecenas mollis eu tortor ac venenatis. Aenean eget pellentesque est. Quisque varius et nisl vitae pulvinar. Praesent et pretium diam. Sed vitae ipsum libero. Cras eu sodales neque, sit amet rhoncus velit. Pellentesque quis gravida mi.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut luctus mi, a cursus augue. Donec sodales cursus consequat. Curabitur vitae arcu congue, fermentum mauris vitae, feugiat justo. Maecenas mollis eu tortor ac venenatis. Aenean eget pellentesque est. Quisque varius et nisl vitae pulvinar. Praesent et pretium diam. Sed vitae ipsum libero. Cras eu sodales neque, sit amet rhoncus velit. Pellentesque quis gravida mi.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut luctus mi, a cursus augue. Donec sodales cursus consequat. Curabitur vitae arcu congue, fermentum mauris vitae, feugiat justo. Maecenas mollis eu tortor ac venenatis. Aenean eget pellentesque est. Quisque varius et nisl vitae pulvinar. Praesent et pretium diam. Sed vitae ipsum libero. Cras eu sodales neque, sit amet rhoncus velit. Pellentesque quis gravida mi.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut luctus mi, a cursus augue. Donec sodales cursus consequat. Curabitur vitae arcu congue, fermentum mauris vitae, feugiat justo. Maecenas mollis eu tortor ac venenatis. Aenean eget pellentesque est. Quisque varius et nisl vitae pulvinar. Praesent et pretium diam. Sed vitae ipsum libero. Cras eu sodales neque, sit amet rhoncus velit. Pellentesque quis gravida mi.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut luctus mi, a cursus augue. Donec sodales cursus consequat. Curabitur vitae arcu congue, fermentum mauris vitae, feugiat justo. Maecenas mollis eu tortor ac venenatis. Aenean eget pellentesque est. Quisque varius et nisl vitae pulvinar. Praesent et pretium diam. Sed vitae ipsum libero. Cras eu sodales neque, sit amet rhoncus velit. Pellentesque quis gravida mi.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut luctus mi, a cursus augue. Donec sodales cursus consequat. Curabitur vitae arcu congue, fermentum mauris vitae, feugiat justo. Maecenas mollis eu tortor ac venenatis. Aenean eget pellentesque est. Quisque varius et nisl vitae pulvinar. Praesent et pretium diam. Sed vitae ipsum libero. Cras eu sodales neque, sit amet rhoncus velit. Pellentesque quis gravida mi.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut luctus mi, a cursus augue. Donec sodales cursus consequat. Curabitur vitae arcu congue, fermentum mauris vitae, feugiat justo. Maecenas mollis eu tortor ac venenatis. Aenean eget pellentesque est. Quisque varius et nisl vitae pulvinar. Praesent et pretium diam. Sed vitae ipsum libero. Cras eu sodales neque, sit amet rhoncus velit. Pellentesque quis gravida mi.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut luctus mi, a cursus augue. Donec sodales cursus consequat. Curabitur vitae arcu congue, fermentum mauris vitae, feugiat justo. Maecenas mollis eu tortor ac venenatis. Aenean eget pellentesque est. Quisque varius et nisl vitae pulvinar. Praesent et pretium diam. Sed vitae ipsum libero. Cras eu sodales neque, sit amet rhoncus velit. Pellentesque quis gravida mi.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut luctus mi, a cursus augue. Donec sodales cursus consequat. Curabitur vitae arcu congue, fermentum mauris vitae, feugiat justo. Maecenas mollis eu tortor ac venenatis. Aenean eget pellentesque est. Quisque varius et nisl vitae pulvinar. Praesent et pretium diam. Sed vitae ipsum libero. Cras eu sodales neque, sit amet rhoncus velit. Pellentesque quis gravida mi.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut luctus mi, a cursus augue. Donec sodales cursus consequat. Curabitur vitae arcu congue, fermentum mauris vitae, feugiat justo. Maecenas mollis eu tortor ac venenatis. Aenean eget pellentesque est. Quisque varius et nisl vitae pulvinar. Praesent et pretium diam. Sed vitae ipsum libero. Cras eu sodales neque, sit amet rhoncus velit. Pellentesque quis gravida mi.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut luctus mi, a cursus augue. Donec sodales cursus consequat. Curabitur vitae arcu congue, fermentum mauris vitae, feugiat justo. Maecenas mollis eu tortor ac venenatis. Aenean eget pellentesque est. Quisque varius et nisl vitae pulvinar. Praesent et pretium diam. Sed vitae ipsum libero. Cras eu sodales neque, sit amet rhoncus velit. Pellentesque quis gravida mi.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut luctus mi, a cursus augue. Donec sodales cursus consequat. Curabitur vitae arcu congue, fermentum mauris vitae, feugiat justo. Maecenas mollis eu tortor ac venenatis. Aenean eget pellentesque est. Quisque varius et nisl vitae pulvinar. Praesent et pretium diam. Sed vitae ipsum libero. Cras eu sodales neque, sit amet rhoncus velit. Pellentesque quis gravida mi.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut luctus mi, a cursus augue. Donec sodales cursus consequat. Curabitur vitae arcu congue, fermentum mauris vitae, feugiat justo. Maecenas mollis eu tortor ac venenatis. Aenean eget pellentesque est. Quisque varius et nisl vitae pulvinar. Praesent et pretium diam. Sed vitae ipsum libero. Cras eu sodales neque, sit amet rhoncus velit. Pellentesque quis gravida mi.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut luctus mi, a cursus augue. Donec sodales cursus consequat. Curabitur vitae arcu congue, fermentum mauris vitae, feugiat justo. Maecenas mollis eu tortor ac venenatis. Aenean eget pellentesque est. Quisque varius et nisl vitae pulvinar. Praesent et pretium diam. Sed vitae ipsum libero. Cras eu sodales neque, sit amet rhoncus velit. Pellentesque quis gravida mi.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut luctus mi, a cursus augue. Donec sodales cursus consequat. Curabitur vitae arcu congue, fermentum mauris vitae, feugiat justo. Maecenas mollis eu tortor ac venenatis. Aenean eget pellentesque est. Quisque varius et nisl vitae pulvinar. Praesent et pretium diam. Sed vitae ipsum libero. Cras eu sodales neque, sit amet rhoncus velit. Pellentesque quis gravida mi.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut luctus mi, a cursus augue. Donec sodales cursus consequat. Curabitur vitae arcu congue, fermentum mauris vitae, feugiat justo. Maecenas mollis eu tortor ac venenatis. Aenean eget pellentesque est. Quisque varius et nisl vitae pulvinar. Praesent et pretium diam. Sed vitae ipsum libero. Cras eu sodales neque, sit amet rhoncus velit. Pellentesque quis gravida mi.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut luctus mi, a cursus augue. Donec sodales cursus consequat. Curabitur vitae arcu congue, fermentum mauris vitae, feugiat justo. Maecenas mollis eu tortor ac venenatis. Aenean eget pellentesque est. Quisque varius et nisl vitae pulvinar. Praesent et pretium diam. Sed vitae ipsum libero. Cras eu sodales neque, sit amet rhoncus velit. Pellentesque quis gravida mi.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut luctus mi, a cursus augue. Donec sodales cursus consequat. Curabitur vitae arcu congue, fermentum mauris vitae, feugiat justo. Maecenas mollis eu tortor ac venenatis. Aenean eget pellentesque est. Quisque varius et nisl vitae pulvinar. Praesent et pretium diam. Sed vitae ipsum libero. Cras eu sodales neque, sit amet rhoncus velit. Pellentesque quis gravida mi.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut luctus mi, a cursus augue. Donec sodales cursus consequat. Curabitur vitae arcu congue, fermentum mauris vitae, feugiat justo. Maecenas mollis eu tortor ac venenatis. Aenean eget pellentesque est. Quisque varius et nisl vitae pulvinar. Praesent et pretium diam. Sed vitae ipsum libero. Cras eu sodales neque, sit amet rhoncus velit. Pellentesque quis gravida mi.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut luctus mi, a cursus augue. Donec sodales cursus consequat. Curabitur vitae arcu congue, fermentum mauris vitae, feugiat justo. Maecenas mollis eu tortor ac venenatis. Aenean eget pellentesque est. Quisque varius et nisl vitae pulvinar. Praesent et pretium diam. Sed vitae ipsum libero. Cras eu sodales neque, sit amet rhoncus velit. Pellentesque quis gravida mi.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut luctus mi, a cursus augue. Donec sodales cursus consequat. Curabitur vitae arcu congue, fermentum mauris vitae, feugiat justo. Maecenas mollis eu tortor ac venenatis. Aenean eget pellentesque est. Quisque varius et nisl vitae pulvinar. Praesent et pretium diam. Sed vitae ipsum libero. Cras eu sodales neque, sit amet rhoncus velit. Pellentesque quis gravida mi.</p>"
  );


  $templateCache.put('home',
    "<h1>Home</h1><form class=\"form\"><input type=\"file\" class=\"form-control\"></form>"
  );


  $templateCache.put('test',
    "<h1>Test</h1>"
  );


  $templateCache.put('layout',
    "<div class=\"wrapper\"><div class=\"menu\"><a ng-repeat=\"place in places\" class=\"item\" ng-href=\"{{place.url}}\">{{place.title}}</a></div><div class=\"content\"><div ng-view=\"'home'\"></div><div class=\"footer\">legalese.</div></div></div>"
  );

}]);
