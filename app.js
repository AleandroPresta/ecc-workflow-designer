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
					description: "This is a device",
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
					description: "This is a computation",
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
					availableMemory: '20TB',
					description: "This is a storage",
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
					description: "This is a communication",
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
					name: "Connection 2",
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
					name: "Connection 3",
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

			var nodeName = prompt("Enter a device name:", "New Device");
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
						name: `in_${nextNodeID - 1}_0`
					},
				],
				outputConnectors: [
					{
						name: `out_${nextNodeID - 1}_0`
					},
				],
			};

			$scope.chartViewModel.addNode(newNodeDataModel);
		};
		//
		// Add a new Computation to the chart.
		//
		$scope.addComputation = function () {

			const form = createComputationForm();
			document.body.appendChild(form);
		};

		/* UTILITY FUNCTIONS FOR CREATION OF HTML ELEMENTS */
		function createComputationForm() {
			// Create elements
			const container = document.createElement('div');
			container.id = 'computation-creation-container';
			const form = document.createElement('form');

			const h3 = document.createElement('h3');
			const fieldset1 = document.createElement('fieldset');
			const fieldset2 = document.createElement('fieldset');
			const fieldset3 = document.createElement('fieldset');
			const fieldset4 = document.createElement('fieldset');
			const fieldset5 = document.createElement('fieldset');
			const input1 = document.createElement('input');
			const input2 = document.createElement('input');
			const input3 = document.createElement('input');
			const textarea = document.createElement('textarea');
			const submitButton = document.createElement('button');
			const cancelButton = document.createElement('button');

			// Set attributes and content
			container.className = 'container';
			form.id = 'create-computation-form';
			form.action = '';
			h3.textContent = 'Create Computation';
			input1.placeholder = 'Computation Name';
			input1.type = 'text';
			input1.tabIndex = '1';
			input1.required = true;
			input1.autofocus = true;
			input2.placeholder = 'Computation execution time';
			input2.type = 'text';
			input2.tabIndex = '2';
			input2.required = true;
			input3.placeholder = 'Computation volume of data';
			input3.type = 'text';
			input3.tabIndex = '3';
			input3.required = true;
			textarea.placeholder = 'Computation description....';
			textarea.tabIndex = '4';
			textarea.required = true;
			submitButton.name = 'submit';
			submitButton.type = 'submit';
			submitButton.id = 'submit-button';
			submitButton.textContent = 'Submit';
			submitButton.onclick = submitComputationCreation;

			cancelButton.type = 'submit';
			cancelButton.formNoValidate = true;
			cancelButton.textContent = 'Cancel';
			cancelButton.onclick = function () {
				document.body.removeChild(container);
			}

			// Append elements
			fieldset1.appendChild(input1);
			fieldset2.appendChild(input2);
			fieldset3.appendChild(input3);
			fieldset4.appendChild(textarea);
			fieldset5.appendChild(submitButton);
			fieldset5.appendChild(cancelButton);
			form.appendChild(h3);
			form.appendChild(fieldset1);
			form.appendChild(fieldset2);
			form.appendChild(fieldset3);
			form.appendChild(fieldset4);
			form.appendChild(fieldset5);
			container.appendChild(form);

			return container;
		}


		function submitComputationCreation(event) {

			// Avoids the reloading of the page
			event.preventDefault();
			const container = document.getElementById('computation-creation-container');

			// Check if the form is valid before removing it from the document
			// TODO add custom validation for the values
			if (container.querySelector('form').checkValidity()) {
				// Form is valid, continue with the next line of code
				// Get the values from the form
				const computationName = container.querySelector('input[placeholder="Computation Name"]').value;
				const executionTime = container.querySelector('input[placeholder="Computation execution time"]').value;
				const volumeOfData = container.querySelector('input[placeholder="Computation volume of data"]').value;
				const description = container.querySelector('textarea').value;
				
				createNewComputation(computationName, executionTime, volumeOfData, description);
				// Remove the form
				document.body.removeChild(container);
			} else {
				// Form is not valid, handle the error or show an error message
				alert("Please fill in all fields.");
			}

		}

		function createNewComputation(computationName, executionTime, volumeOfData, description) {
			//
			// Template for a new computation.
			//
			let newNodeDataModel = {
				name: computationName,
				id: nextNodeID++,
				type: "Computation",
				executionTime: executionTime,
				volumeOfData: volumeOfData,
				description: description,
				x: 0,
				y: 0,
				inputConnectors: [
					{
						name: `in_${nextNodeID - 1}_0`
					},
				],
				outputConnectors: [
					{
						name: `out_${nextNodeID - 1}_0`
					},
				],
			};

			$scope.chartViewModel.addNode(newNodeDataModel);
		}


		$scope.addStorage = function () {

			var nodeName = prompt("Enter a storage name:", "New Storage");
			if (!nodeName) {
				return;
			}
			var availableMemory = prompt("Enter the quantity of available memory:", "");

			//
			// Template for a new node.
			//
			var newNodeDataModel = {
				name: nodeName,
				id: nextNodeID++,
				type: "Storage",
				availableMemory: availableMemory,
				x: 0,
				y: 0,
				inputConnectors: [
					{
						name: `in_${nextNodeID - 1}_0`
					},
				],
				outputConnectors: [
					{
						name: `out_${nextNodeID - 1}_0`
					},
				],
			};

			$scope.chartViewModel.addNode(newNodeDataModel);
		};

		$scope.addCommunication = function () {

			var nodeName = prompt("Enter a communication name:", "New Communication");
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
						name: `in_${nextNodeID - 1}_0`
					},
				],
				outputConnectors: [
					{
						name: `out_${nextNodeID - 1}_0`
					},
				],
			};

			$scope.chartViewModel.addNode(newNodeDataModel);
		};

		//
		// Add an input connector to selected nodes.
		//
		$scope.addNewInputConnector = function () {

			var selectedNodes = $scope.chartViewModel.getSelectedNodes();

			let suggestedConnectorName = "New connector";

			// If only one node is selected then the suggested name will be
			// in_<id>_<id_port>
			if (selectedNodes.length === 1) {
				const nodeId = selectedNodes[0].data.id
				const connectorId = selectedNodes[0].data.inputConnectors.length;
				suggestedConnectorName = `in_${nodeId}_${connectorId}`;
			}

			var connectorName = prompt("Enter a connector name:", suggestedConnectorName);
			if (!connectorName) {
				return;
			}

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
			var selectedNodes = $scope.chartViewModel.getSelectedNodes();

			let suggestedConnectorName = "New connector";

			// If only one node is selected then the suggested name will be
			// in_<id>_<id_port>
			if (selectedNodes.length === 1) {
				const nodeId = selectedNodes[0].data.id
				const connectorId = selectedNodes[0].data.outputConnectors.length;
				suggestedConnectorName = `out_${nodeId}_${connectorId}`;
			}

			var connectorName = prompt("Enter a connector name:", suggestedConnectorName);
			if (!connectorName) {
				return;
			}

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
		$scope.modifyName = function () {
			$scope.chartViewModel.modifyName();
		};
		//
		// Create the view-model for the chart and attach to the scope.
		//
		$scope.chartViewModel = new flowchart.ChartViewModel(chartDataModel);

		//
		// Pressing anywhere on the body hides the context menu
		//
		$scope.hideContextMenu = function () {
			const element = document.getElementById("context-menu");
			if (element) {
				element.style.display = 'none';
			}
		}

		$scope.toggleJsonButton = function () {
			const element = document.querySelector(".json-container");
			const jsonButton = document.querySelector(".json-button");
			const flowchartContainer = document.querySelector(".flowchart-container");

			if (element.style.display === 'none') {
				element.style.display = 'block';
				jsonButton.textContent = "Hide JSON";
				flowchartContainer.style.flexBasis = "70%";
			} else {
				element.style.display = 'none';
				jsonButton.textContent = "Show JSON";
				flowchartContainer.style.flexBasis = "100%";
			}
		}
	}])
	;