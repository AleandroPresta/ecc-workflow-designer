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
                    if (!newVal || (Array.isArray(newVal) && newVal.length === 0) || (typeof newVal === 'object' && Object.keys(newVal).length === 0)) {
                        $scope.staticChart = null;
                        return;
                    }
                    // Get the current flowchart nodes and connections from the main chartViewModel
                    var chartViewModel = $scope.$parent.chartViewModel;
                    var chartNodes = (chartViewModel && chartViewModel.data && chartViewModel.data.nodes) || [];
                    var chartConnections = (chartViewModel && chartViewModel.data && chartViewModel.data.connections) || [];

                    var mergedNodes = [];
                    var mergedConnections = [];
                    var presentIds = new Set();

                    if (Array.isArray(newVal)) {
                        // Old format: array of nodes (possibly with .connections)
                        var idToResult = {};
                        newVal.forEach(function (item) {
                            var id = item.abstractservice_id || item.id || item.name;
                            if (id !== undefined) idToResult[id] = item;
                        });
                        mergedNodes = chartNodes.filter(function (n) {
                            return idToResult[n.id] !== undefined || idToResult[n.name] !== undefined;
                        }).map(function (n) {
                            var id = n.id;
                            var resultItem = idToResult[id] || idToResult[n.name];
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
                        presentIds = new Set(mergedNodes.map(n => n.id));
                        var resultConnections = (newVal.connections && Array.isArray(newVal.connections)) ? newVal.connections : [];
                        if (Array.isArray(resultConnections) && resultConnections.length > 0) {
                            mergedConnections = resultConnections.filter(function (conn) {
                                return presentIds.has(conn.from) && presentIds.has(conn.to);
                            }).map(function (conn) {
                                return Object.assign({}, conn);
                            });
                        } else {
                            mergedConnections = chartConnections.filter(function (conn) {
                                return presentIds.has(conn.from) && presentIds.has(conn.to);
                            }).map(function (conn) {
                                return Object.assign({}, conn);
                            });
                        }
                    } else if (typeof newVal === 'object' && Array.isArray(newVal.nodes)) {
                        // New format: object with nodes and connections
                        var idToResult = {};
                        newVal.nodes.forEach(function (item) {
                            var id = item.abstractservice_id || item.id || item.name;
                            if (id !== undefined) idToResult[id] = item;
                        });
                        mergedNodes = chartNodes.filter(function (n) {
                            return idToResult[n.id] !== undefined || idToResult[n.name] !== undefined;
                        }).map(function (n) {
                            var id = n.id;
                            var resultItem = idToResult[id] || idToResult[n.name];
                            return Object.assign({}, n, resultItem || {}, {
                                name: (resultItem && (resultItem.abstractservice_name || resultItem.name || resultItem.label)) || n.name,
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
                        presentIds = new Set(mergedNodes.map(n => n.id));
                        var resultConnections = (Array.isArray(newVal.connections)) ? newVal.connections : [];
                        if (Array.isArray(resultConnections) && resultConnections.length > 0) {
                            mergedConnections = resultConnections.filter(function (conn) {
                                return presentIds.has(conn.from) && presentIds.has(conn.to);
                            }).map(function (conn) {
                                return Object.assign({}, conn);
                            });
                        } else {
                            mergedConnections = chartConnections.filter(function (conn) {
                                return presentIds.has(conn.from) && presentIds.has(conn.to);
                            }).map(function (conn) {
                                return Object.assign({}, conn);
                            });
                        }
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
