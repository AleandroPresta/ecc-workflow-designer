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
                    // Log for debugging
                    console.log('[flowchart-result] input result:', newVal);
                    if (!newVal || !Array.isArray(newVal) || newVal.length === 0) {
                        $scope.staticChart = null;
                        return;
                    }
                    // Get the current flowchart nodes and connections from the main chartViewModel
                    var chartViewModel = $scope.$parent.chartViewModel;
                    var chartNodes = (chartViewModel && chartViewModel.data && chartViewModel.data.nodes) || [];
                    var chartConnections = (chartViewModel && chartViewModel.data && chartViewModel.data.connections) || [];
                    // Map abstractservice_id or id to result item
                    var idToResult = {};
                    newVal.forEach(function (item) {
                        var id = item.abstractservice_id || item.id || item.name;
                        if (id !== undefined) idToResult[id] = item;
                    });
                    // Merge chart node data with advised result
                    var mergedNodes = chartNodes.filter(function (n) {
                        return idToResult[n.id] !== undefined || idToResult[n.name] !== undefined;
                    }).map(function (n) {
                        var id = n.id;
                        var resultItem = idToResult[id] || idToResult[n.name];
                        // Merge all properties, prefer resultItem for label/name
                        return Object.assign({}, n, resultItem || {}, {
                            name: (resultItem && (resultItem.abstractservice_name || resultItem.name)) || n.name,
                            id: n.id,
                            x: n.x,
                            y: n.y,
                            width: n.width,
                            height: n.height,
                            type: n.type,
                            image: n.image,
                            quantity: n.quantity
                        });
                    });
                    // Only include connections where both nodes are present in mergedNodes
                    var presentIds = new Set(mergedNodes.map(n => n.id));
                    // Merge connections: if the result contains connection info, merge it, otherwise use chartConnections
                    var resultConnections = (newVal.connections && Array.isArray(newVal.connections)) ? newVal.connections : [];
                    var mergedConnections = [];
                    if (resultConnections.length > 0) {
                        // Merge result connections, but only if both nodes are present
                        mergedConnections = resultConnections.filter(function (conn) {
                            return presentIds.has(conn.from) && presentIds.has(conn.to);
                        }).map(function (conn) {
                            return Object.assign({}, conn);
                        });
                    } else {
                        // Fallback: use chartConnections
                        mergedConnections = chartConnections.filter(function (conn) {
                            return presentIds.has(conn.from) && presentIds.has(conn.to);
                        }).map(function (conn) {
                            return Object.assign({}, conn);
                        });
                    }
                    // Log for debugging
                    console.log('[flowchart-result] mergedNodes:', mergedNodes);
                    console.log('[flowchart-result] mergedConnections:', mergedConnections);
                    // Build the static chart viewmodel
                    var chartDataModel = {
                        nodes: mergedNodes,
                        connections: mergedConnections
                    };
                    $scope.staticChart = new flowchart.ChartViewModel(chartDataModel);
                }, true);
            }]
        };
    });
