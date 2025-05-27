console.log('[result] component script loaded');
console.log('[result] directive definition loaded');

angular.module('app')
    .directive('result', function () {
        return {
            restrict: 'E',
            scope: {
                result: '=' // Receives the pre-merged { nodes, connections }
            },
            templateUrl: 'result/result.template.html?v=' + Date.now(),
            controller: ['$scope', function ($scope) {
                $scope.$watch('result', function (newVal) {
                    // Log for debugging
                    console.log('[result] input result:', newVal);

                    // Validate input
                    if (!newVal || !Array.isArray(newVal.nodes) || !Array.isArray(newVal.connections)) {
                        $scope.staticChart = null;
                        console.log('[result] Invalid or incomplete data (missing nodes or connections array), setting staticChart to null.');
                        return;
                    }

                    // Use the pre-merged data directly
                    $scope.staticChart = new flowchart.ChartViewModel(newVal);
                }, true);
            }]
        };
    });
