angular.module('myapp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('test.html',
    "<div class=\"app-container\"><h1>{{test}}</h1></div>"
  );

}]);
