require.config({
	baseUrl: 'bower_components/',
	paths: {
		'angular': 'angular-unstable/angular',
		'angular-resource': 'angular-resource-unstable/angular-resource',
		'codemirror': 'codemirror/lib/codemirror',
		'codemirror-xml': 'codemirror/mode/xml/xml',
		'codemirror-xml-fold': 'codemirror/addon/fold/xml-fold',
		'codemirror-javascript': 'codemirror/mode/javascript/javascript',
		'ui-codemirror': 'angular-ui-codemirror/ui-codemirror',
		'mustache':'mustache/mustache',
		'jquery':'jquery/jquery',
		'select2':'select2/select2',
		'ui-select2':'angular-ui-select2/src/select2'
	},
	shim: {
		'jquery': { exports: '$' },
		'angular': { deps: ['jquery'], exports: 'angular' },
		'angular-resource': { exports: 'ngResource', deps: ['angular'] },
		'codemirror': { exports: 'CodeMirror' },
		'codemirror-xml': { deps: ['codemirror'] },
		'codemirror-xml-fold': { deps: ['codemirror'] },
		'codemirror-javascript': { deps: ['codemirror'] },
		'ui-codemirror': { deps: ['angular','codemirror','codemirror-xml', 'codemirror-xml-fold', 'codemirror-javascript'] },
		'select2': { deps: ['jquery'], exports: 'select2' },
		'ui-select2': { deps: ['jquery', 'select2'] }
	}
});

require(
	['angular', 'angular-resource', 'ui-codemirror', 'mustache', 'ui-select2', 'jquery'],
	function(angular, angularResource, uiCodemirror, mustache, uiSelect2, $) {
		angular.module('wrathControllers', ['ngResource', 'ui.select2'])
			.controller('wrathController', ['$scope', function($scope) {
				var id = 0;
				$scope.runners = [{ id: id++ }];
				$scope.addRunner = function() {
					$scope.runners.push({ id: id++ });
				};
				$scope.remove = function(id) {
					$scope.runners.splice($scope.runners.indexOf(id), 1);
				};
			}])
			.controller('runnerController', ['$scope', '$http', '$resource', function($scope, $http , $resource) {

				$scope.$parent.runner.scope = $scope;

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

				var serializer = new XMLSerializer();

				$scope.runTransform = function () {
					var preludeFunction, model, result;
					try
					{
						// Bundle up the previous responses:
						var responses = $scope.$parent.$parent.runners.map(function (x) {
							return $.parseXML(x.scope.response.value);
						});
						// Create a function from the prelude
						preludeFunction = new Function('responses', 'serialize', $scope.prelude.value);
						// Run the prelude
						model = preludeFunction(responses, function (x) { return serializer.serializeToString(x); });
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