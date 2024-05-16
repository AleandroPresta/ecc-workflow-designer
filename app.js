//
// Define the 'app' module.
//
angular.module('app', ['flowChart',])

	//
	// Simple service to create a prompt.
	//
	.factory('prompt', function () {

		/* Uncomment the following to test that the prompt service is working as expected.
		return function () {
			return "Test!";
		}
		*/

		// Return the browsers prompt function.
		return prompt;
	})

	//
	// Application controller.
	//
	.controller('AppCtrl', ['$scope', 'prompt', function AppCtrl($scope, prompt) {

		//
		// Code for the delete key.
		//
		var deleteKeyCode = 46;

		//
		// Code for control key.
		//
		var ctrlKeyCode = 17;

		//
		// Set to true when the ctrl key is down.
		//
		var ctrlDown = false;

		//
		// Code for A key.
		//
		var aKeyCode = 65;

		//
		// Code for esc key.
		//
		var escKeyCode = 27;

		//
		// Selects the next node id.
		//
		var nextNodeID = 4;

		//
		// Setup the data-model for the chart.
		//
		var chartDataModel = {
			nodes: [
				{
					name: "Device",
					id: 0,
					type: "Device",
					x: 26,
					y: 27,
					width: 350,
					inputConnectors: [
						{
							name: "in_0_0"
						}
					],
					outputConnectors: [
						{
							name: "out_0_0"
						}
					]
				},
				{
					name: "Computation",
					id: 1,
					type: "Computation",
					executionTime: "10ms",
					volumeOfData: "25mb",
					x: 418,
					y: 138,
					inputConnectors: [
						{
							name: "in_1_0"
						}
					],
					outputConnectors: [
						{
							name: "out_1_0"
						}
					],
					width: 250
				},
				{
					name: "Storage",
					id: 2,
					type: "Storage",
					x: 687,
					y: 296,
					inputConnectors: [
						{
							name: "in_2_0"
						}
					],
					outputConnectors: [
						{
							name: "out_2_0"
						}
					],
					width: 250
				},
				{
					name: "Communication",
					id: 3,
					type: "Communication",
					x: 985,
					y: 423,
					inputConnectors: [
						{
							name: "in_3_0"
						}
					],
					outputConnectors: [
						{
							name: "out_3_0"
						}
					],
					width: 250
				}
			],
			connections: [
				{
					name: "Connection 1",
					source: {
						"nodeID": 0,
						"connectorIndex": 0
					},
					dest: {
						"nodeID": 1,
						"connectorIndex": 0
					}
				},
				{
					source: {
						"nodeID": 1,
						"connectorIndex": 0
					},
					dest: {
						"nodeID": 2,
						"connectorIndex": 0
					}
				},
				{
					source: {
						"nodeID": 2,
						"connectorIndex": 0
					},
					dest: {
						"nodeID": 3,
						"connectorIndex": 0
					}
				}
			]
		};

		//
		// Event handler for key-down on the flowchart.
		//
		$scope.keyDown = function (evt) {

			if (evt.keyCode === ctrlKeyCode) {

				ctrlDown = true;
				evt.stopPropagation();
				evt.preventDefault();
			}
		};

		//
		// Event handler for key-up on the flowchart.
		//
		$scope.keyUp = function (evt) {

			if (evt.keyCode === deleteKeyCode) {
				//
				// Delete key.
				//
				$scope.chartViewModel.deleteSelected();
			}

			if (evt.keyCode == aKeyCode && ctrlDown) {
				// 
				// Ctrl + A
				//
				$scope.chartViewModel.selectAll();
			}

			if (evt.keyCode == escKeyCode) {
				// Escape.
				$scope.chartViewModel.deselectAll();
			}

			if (evt.keyCode === ctrlKeyCode) {
				ctrlDown = false;

				evt.stopPropagation();
				evt.preventDefault();
			}
		};

		//
		// Add a new device to the chart.
		//
		$scope.addDevice = function () {

			var nodeName = prompt("Enter a device name:", "New node");
			if (!nodeName) {
				return;
			}

			//
			// Template for a new device.
			//
			var newNodeDataModel = {
				name: nodeName,
				id: nextNodeID++,
				type: "Device",
				x: 0,
				y: 0,
				inputConnectors: [
					{
						name: `in_${nextNodeID-1}_1`
					},
				],
				outputConnectors: [
					{
						name: `out${nextNodeID-1}_1`
					},
				],
			};

			$scope.chartViewModel.addNode(newNodeDataModel);
		};
		//
		// Add a new Computation to the chart.
		//
		$scope.addComputation = function () {

			var nodeName = prompt("Enter a computation name:", "Computation");
			if (!nodeName) {
				return;
			}
			let executionTime = prompt("Enter execution time:", "");
			if (!executionTime) {
				return;
			}
			let volumeOfData = prompt("Enter the volume of data:", "");
			if (!volumeOfData) {
				return;
			}

			//
			// Template for a new node.
			//
			var newNodeDataModel = {
				name: nodeName,
				id: nextNodeID++,
				type: "Computation",
				executionTime: executionTime,
				volumeOfData: volumeOfData,
				x: 0,
				y: 0,
				inputConnectors: [
					{
						name: `in_${nextNodeID-1}_1`
					},
				],
				outputConnectors: [
					{
						name: `out${nextNodeID-1}_1`
					},
				],
			};

			$scope.chartViewModel.addNode(newNodeDataModel);
		};

		$scope.addStorage = function () {

			var nodeName = prompt("Enter a computation name:", "New node");
			if (!nodeName) {
				return;
			}

			//
			// Template for a new node.
			//
			var newNodeDataModel = {
				name: nodeName,
				id: nextNodeID++,
				type: "Storage",
				x: 0,
				y: 0,
				inputConnectors: [
					{
						name: `in_${nextNodeID-1}_1`
					},
				],
				outputConnectors: [
					{
						name: `out${nextNodeID-1}_1`
					},
				],
			};

			$scope.chartViewModel.addNode(newNodeDataModel);
		};

		$scope.addCommunication = function () {

			var nodeName = prompt("Enter a computation name:", "New node");
			if (!nodeName) {
				return;
			}

			//
			// Template for a new node.
			//
			var newNodeDataModel = {
				name: nodeName,
				id: nextNodeID++,
				type: "Communication",
				x: 0,
				y: 0,
				inputConnectors: [
					{
						name: `in_${nextNodeID-1}_1`
					},
				],
				outputConnectors: [
					{
						name: `out_${nextNodeID}_1`
					},
				],
			};

			$scope.chartViewModel.addNode(newNodeDataModel);
		};

		//
		// Add an input connector to selected nodes.
		//
		$scope.addNewInputConnector = function () {
			var connectorName = prompt("Enter a connector name:", "New connector");
			if (!connectorName) {
				return;
			}

			var selectedNodes = $scope.chartViewModel.getSelectedNodes();
			for (var i = 0; i < selectedNodes.length; ++i) {
				var node = selectedNodes[i];
				node.addInputConnector({
					name: connectorName,
				});
			}
		};

		//
		// Add an output connector to selected nodes.
		//
		$scope.addNewOutputConnector = function () {
			var connectorName = prompt("Enter a connector name:", "New connector");
			if (!connectorName) {
				return;
			}

			var selectedNodes = $scope.chartViewModel.getSelectedNodes();
			for (var i = 0; i < selectedNodes.length; ++i) {
				var node = selectedNodes[i];
				node.addOutputConnector({
					name: connectorName,
				});
			}
		};

		//
		// Delete selected nodes and connections.
		//
		$scope.deleteSelected = function () {

			$scope.chartViewModel.deleteSelected();
		};
		//
		//	Change the name of a connection
		//
		$scope.modifyName = function() {
			$scope.chartViewModel.modifyName();
		};
		//
		// Create the view-model for the chart and attach to the scope.
		//
		$scope.chartViewModel = new flowchart.ChartViewModel(chartDataModel);
	}])
	;


