require.config({
	baseUrl: 'bower_components/',
	paths: {
		'angular': 'angular-unstable/angular',
		'angular-resource': 'angular-resource-unstable/angular-resource',
		'codemirror': 'codemirror/lib/codemirror',
		'codemirror-xml': 'codemirror/mode/xml/xml',
		'codemirror-clike': 'codemirror/mode/clike/clike',
		'ui-codemirror': 'angular-ui-codemirror/ui-codemirror'
	},
	shim: {
		'angular': { exports: 'angular'	},
		'angular-resource': { exports: 'ngResource', deps: ['angular'] },
		'codemirror': { exports: 'CodeMirror' },
		'codemirror-xml': { deps: ['codemirror'] },
		'codemirror-clike': { deps: ['codemirror'] },
		'ui-codemirror': { deps: ['angular','codemirror','codemirror-xml','codemirror-clike'] }
	}
});
require(['angular', 'angular-resource', 'ui-codemirror'], function(angular, uiCodemirror) {

	angular.module('wrathControllers', ['ngResource'])
		.controller('runnerController', ['$scope', '$http', '$resource', function($scope, $http , $resource) {

			$http.defaults.useXDomain = true;
			var transform = $resource(
				'http://richardtowers.apiary.io/WSPipeline/Transform',
				{},
				{run: {method:'PUT'}});

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
				transform.run({
					'previousResponses' : [],
					'prelude' : '// Some C#',
					'template' : '<InitAddContact />',
					'environment' : 'http://devbintproc3/www/service.svc',
					'user' : 'AHTEST01',
					'password' : 'GSAHJDGJAHS'
				},
				function (x) {
					$scope.request.value = x.response;
					$scope.request.show = true;
				});
			};

			$scope.prelude = { show: true, value: '// Some C#' };
			$scope.template = { show: true, value: '<InitAddContact />' };
			$scope.request = { show: true, value: '' };
			$scope.response = { show: true, value: '' };

			$scope.getWidthClass = function () {
				var count = [
						$scope.prelude.show,
						$scope.template.show,
						$scope.request.show,
						$scope.response.show].filter(function(x){return x;}).length;
				return count === 0 ? 'span1' : 'span' + (12 / count);
			};

			$scope.cSharpMirrorOptions = { mode: 'text/x-csharp', theme: 'monokai', lineNumbers: true };
			$scope.xmlMirrorOptions = { mode: 'xml', theme: 'monokai', lineNumbers: true };
		}]);

	var wrath = angular.module('wrath', ['ui.codemirror', 'wrathControllers']);
	angular.bootstrap(document.body, ['wrath']);
});