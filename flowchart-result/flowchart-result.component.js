console.log('[flowchart-result] component script loaded');
console.log('[flowchart-result] directive definition loaded');

angular.module('app')
    .directive('flowchartResult', function () {
        return {
            restrict: 'E',
            scope: {
                result: '=' // Receives the pre-merged { nodes, connections }
            },
            templateUrl: 'flowchart-result/flowchart-result.template.html',
            controller: ['$scope', function ($scope) {
                $scope.$watch('result', function (newVal) {
                    // Log for debugging
                    console.log('[flowchart-result] input result:', newVal);

                    // Validate input
                    if (!newVal || !Array.isArray(newVal.nodes) || !Array.isArray(newVal.connections)) {
                        $scope.staticChart = null;
                        console.log('[flowchart-result] Invalid or incomplete data (missing nodes or connections array), setting staticChart to null.');
                        return;
                    }

                    // Use the pre-merged data directly
                    $scope.staticChart = new flowchart.ChartViewModel(newVal);
                }, true);
            }]
        };
    });
