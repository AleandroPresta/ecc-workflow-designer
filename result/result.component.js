angular.module('app')
    .directive('result', function () {
        return {
            restrict: 'E',
            scope: {
                result: '=' // Receives the pre-merged { nodes, connections }
            },
            templateUrl: 'result/result.template.html?v=' + Date.now(),
            controller: ['$scope', function ($scope) {

                // Initialize zoom functionality (matching main flowchart pattern)
                $scope.scale = 1;
                const minScale = 0.3; // Allow more zoom out than main flowchart
                const maxScale = 3;   // Allow more zoom in than main flowchart

                // Deployment icons functionality
                $scope.deploymentIcons = {

                };

                $scope.handleWheel = function (event) {
                    event.preventDefault(); // Prevent the default scroll behavior
                    if (event.originalEvent.deltaY < 0) {
                        $scope.zoomIn();
                    } else {
                        $scope.zoomOut();
                    }
                    // Manually trigger digest cycle to apply changes
                    $scope.$apply();
                };

                $scope.zoomIn = function () {
                    if ($scope.scale < maxScale) {
                        $scope.scale += 0.07; // Same increment as main flowchart
                    }
                };

                $scope.zoomOut = function () {
                    if ($scope.scale > minScale) {
                        $scope.scale -= 0.07; // Same decrement as main flowchart
                    }
                };

                $scope.resetZoom = function () {
                    $scope.scale = 1;
                };

                $scope.$watch('result', function (newVal) {
                    // Validate input
                    if (!newVal || !Array.isArray(newVal.nodes) || !Array.isArray(newVal.connections)) {
                        $scope.staticChart = null;
                        console.err('[result] Invalid or incomplete data (missing nodes or connections array), setting staticChart to null.');
                        return;
                    }

                    // Use the pre-merged data directly
                    $scope.staticChart = new flowchart.ChartViewModel(newVal);

                    // Assign an icon to each node based on the name of the service assigned to it
                    $scope.staticChart.nodes.forEach(function (node) {
                        if (node.best_service) {
                            console.log('[result] Node service:', node.best_service);
                        }
                    });
                }, true);
            }]
        };
    });
