console.log('[flowchart-result] component script loaded');
console.log('[flowchart-result] directive definition loaded');

angular.module('app')
    .directive('flowchartResult', function () {
        console.log('[flowchart-result] directive factory called');
        return {
            restrict: 'E',
            scope: {
                result: '=' // Bind the result data
            },
            templateUrl: 'flowchart-result/flowchart-result.template.html',
            controller: ['$scope', function ($scope) {
                console.log('[flowchart-result] controller instantiated', $scope.result);
                $scope.$watch('result', function (newVal, oldVal) {
                    console.log('[flowchart-result] $scope.result changed', newVal);
                });
            }],
            link: function (scope, element, attrs) {
                console.log('[flowchart-result] link function', scope.result, element, attrs);
            }
        };
    });
