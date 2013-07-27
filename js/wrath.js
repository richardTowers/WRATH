require.config({
	baseUrl: 'bower_components/',
	paths: {
		'angular': 'angular-unstable/angular',
		'angular-resource': 'angular-resource-unstable/angular-resource',
		'codemirror': 'codemirror/lib/codemirror',
		'codemirror-xml': 'codemirror/mode/xml/xml',
		'codemirror-javascript': 'codemirror/mode/javascript/javascript',
		'ui-codemirror': 'angular-ui-codemirror/ui-codemirror',
		'mustache':'mustache/mustache'
	},
	shim: {
		'angular': { exports: 'angular'	},
		'angular-resource': { exports: 'ngResource', deps: ['angular'] },
		'codemirror': { exports: 'CodeMirror' },
		'codemirror-xml': { deps: ['codemirror'] },
		'codemirror-javascript': { deps: ['codemirror'] },
		'ui-codemirror': { deps: ['angular','codemirror','codemirror-xml','codemirror-javascript'] }
	}
});
require(['angular', 'angular-resource', 'ui-codemirror', 'mustache'], function(angular, angularResource, uiCodemirror, mustache) {

	angular.module('wrathControllers', ['ngResource'])
		.controller('runnerController', ['$scope', '$http', '$resource', function($scope, $http , $resource) {

			$http.defaults.useXDomain = true;
			var run = $resource('http://richardtowers.apiary.io/WSPipeline/Run');

			$scope.runRequest = function () {
				run.save({
					'request' : '<InitAddContact />',
					'environment' : 'http://devbintproc3/www/service.svc',
					'user' : 'AHTEST01',
					'password' : 'GSAHJDGJAHS'
				},
				function (x) {
					$scope.response.value = x.response;
					$scope.response.show = true;
				});
			};

			$scope.runTransform = function () {
				var preludeFunction, model, result;
				try
				{
					// Create a function from the prelude
					preludeFunction = new Function($scope.prelude.value);
					// Run the prelude
					model = preludeFunction();
					// Transform the template
					result = mustache.render($scope.template.value, model);
				}
				catch(exception)
				{
					result = exception.message;
				}
				// Set the request to be the result of the template
				$scope.request.value = result;
				$scope.request.show = true;
			};

			$scope.prelude = {
				show: true,
				value: '// JavaScript\nreturn {\n  key: "value"\n};' };
			$scope.template = { show: true, value: '<SomeXml>\n  <Element Value="{{key}}" />\n</SomeXml>' };
			$scope.request = { show: true, value: '' };
			$scope.response = { show: true, value: '' };

			$scope.getWidthClass = function (visible) {
				var count = [
						$scope.prelude.show,
						$scope.template.show,
						$scope.request.show,
						$scope.response.show].filter(function(x){return x;}).length;
				return count === 0 ? 'zeroWidth' : 'span' + (12 / count);
			};

			$scope.jsMirrorOptions = { mode: 'javascript', theme: 'monokai', lineNumbers: true };
			$scope.xmlMirrorOptions = { mode: 'xml', theme: 'monokai', lineNumbers: true };
		}]);

	var wrath = angular.module('wrath', ['ui.codemirror', 'wrathControllers']);
	angular.bootstrap(document.body, ['wrath']);
});