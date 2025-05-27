console.log('[flowchart-result] component script loaded');
console.log('[flowchart-result] directive definition loaded');

angular.module('app')
    .directive('flowchartResult', function () {
        return {
            restrict: 'E',
            scope: {
                result: '=' // Bind the result data
            },
            templateUrl: 'flowchart-result/flowchart-result.template.html',
            controller: ['$scope', function ($scope) {
                $scope.$watch('result', function (newVal) {
                    console.log('[flowchart-result] result changed:', newVal);
                }, true); // Watch for changes in the result data
            }]
        };
    });
