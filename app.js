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

			const form = createDeviceForm();
			document.body.appendChild(form);
			form.showModal();

		};

		function createDeviceForm() {
			// Create elements
			const container = document.createElement('dialog');
			container.id = 'device-creation-container';
			const form = document.createElement('form');

			const h3 = document.createElement('h3');
			const fieldset1 = document.createElement('fieldset');
			const fieldset2 = document.createElement('fieldset');
			const fieldset3 = document.createElement('fieldset');
			const input1 = document.createElement('input');
			const textarea = document.createElement('textarea');
			const submitButton = document.createElement('button');
			const cancelButton = document.createElement('button');

			// Set attributes and content
			container.className = 'container';
			form.id = 'create-device-form';
			form.action = '';
			h3.textContent = 'Create Device';
			input1.placeholder = 'Device Name';
			input1.type = 'text';
			input1.tabIndex = '1';
			input1.required = true;
			input1.autofocus = true;
			textarea.placeholder = 'Computation description....';
			textarea.tabIndex = '2';
			textarea.required = true;
			submitButton.name = 'submit';
			submitButton.type = 'submit';
			submitButton.id = 'submit-button';
			submitButton.textContent = 'Submit';
			submitButton.onclick = submitDeviceCreation;

			cancelButton.type = 'submit';
			cancelButton.formNoValidate = true;
			cancelButton.textContent = 'Cancel';
			cancelButton.onclick = function () {
				container.close();
				document.body.removeChild(container);
			}

			// Append elements
			fieldset1.appendChild(input1);
			fieldset2.appendChild(textarea);
			fieldset3.appendChild(submitButton);
			fieldset3.appendChild(cancelButton);
			form.appendChild(h3);
			form.appendChild(fieldset1);
			form.appendChild(fieldset2);
			form.appendChild(fieldset3);
			container.appendChild(form);

			return container;
		}

		function submitDeviceCreation(event) {
			// Avoids the reloading of the page
			event.preventDefault();
			const container = document.getElementById('device-creation-container');

			// Check if the form is valid before removing it from the document
			// TODO add custom validation for the values
			if (container.querySelector('form').checkValidity()) {
				// Form is valid, continue with the next line of code
				// Get the values from the form
				const computationName = container.querySelector('input[placeholder="Device Name"]').value;
				const description = container.querySelector('textarea').value;

				createNewDevice(computationName, description);
				// Remove the form
				container.close();
				document.body.removeChild(container);
			} else {
				// Form is not valid, handle the error or show an error message
				alert("Please fill in all fields.");
			}
		}

		function createNewDevice(deviceName, description) {
			//
			// Template for a new device.
			//
			let newNodeDataModel = {
				name: deviceName,
				id: nextNodeID++,
				type: "Device",
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

		//
		// Add a new Computation to the chart.
		//
		$scope.addComputation = function () {

			const form = createComputationForm();
			document.body.appendChild(form);
			form.showModal();
		};

		// Create a form to add a new computation
		function createComputationForm() {
			// Create elements
			const container = document.createElement('dialog');
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
				container.close();
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
				container.close();
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

			const form = createStorageForm();
			document.body.appendChild(form);
			form.showModal();

		};

		function createStorageForm() {
			// Create elements
			const container = document.createElement('dialog');
			container.id = 'storage-creation-container';
			const form = document.createElement('form');

			const h3 = document.createElement('h3');
			const fieldset1 = document.createElement('fieldset');
			const fieldset2 = document.createElement('fieldset');
			const fieldset3 = document.createElement('fieldset');
			const fieldset4 = document.createElement('fieldset');
			const input1 = document.createElement('input');
			const input2 = document.createElement('input');
			const textarea = document.createElement('textarea');
			const submitButton = document.createElement('button');
			const cancelButton = document.createElement('button');

			// Set attributes and content
			container.className = 'container';
			form.id = 'create-storage-form';
			form.action = '';
			h3.textContent = 'Create Storage';
			input1.placeholder = 'Storage Name';
			input1.type = 'text';
			input1.tabIndex = '1';
			input1.required = true;
			input1.autofocus = true;
			input2.placeholder = 'Available Memory';
			input2.type = 'text';
			input2.tabIndex = '2';
			input2.required = true;
			input2.autofocus = true;
			textarea.placeholder = 'Storage description....';
			textarea.tabIndex = '3';
			textarea.required = true;
			submitButton.name = 'submit';
			submitButton.type = 'submit';
			submitButton.id = 'submit-button';
			submitButton.textContent = 'Submit';
			submitButton.onclick = submitStorageCreation;

			cancelButton.type = 'submit';
			cancelButton.formNoValidate = true;
			cancelButton.textContent = 'Cancel';
			cancelButton.onclick = function () {
				container.close();
				document.body.removeChild(container);
			}

			// Append elements
			fieldset1.appendChild(input1);
			fieldset2.appendChild(input2);
			fieldset3.appendChild(textarea);
			fieldset4.appendChild(submitButton);
			fieldset4.appendChild(cancelButton);
			form.appendChild(h3);
			form.appendChild(fieldset1);
			form.appendChild(fieldset2);
			form.appendChild(fieldset3);
			form.appendChild(fieldset4);
			container.appendChild(form);

			return container;
		}

		function submitStorageCreation(event) {
			// Avoids the reloading of the page
			event.preventDefault();
			const container = document.getElementById('storage-creation-container');

			// Check if the form is valid before removing it from the document
			// TODO add custom validation for the values
			if (container.querySelector('form').checkValidity()) {
				// Form is valid, continue with the next line of code
				// Get the values from the form
				const storageName = container.querySelector('input[placeholder="Storage Name"]').value;
				const availableMemory = container.querySelector('input[placeholder="Available Memory"]').value;
				const description = container.querySelector('textarea').value;

				createNewStorage(storageName, availableMemory, description);
				// Remove the form
				container.close();
				document.body.removeChild(container);
			} else {
				// Form is not valid, handle the error or show an error message
				alert("Please fill in all fields.");
			}
		}

		function createNewStorage(storageName, availableMemory, description) {
			//
			// Template for a new node.
			//
			var newNodeDataModel = {
				name: storageName,
				id: nextNodeID++,
				type: "Storage",
				availableMemory: availableMemory,
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

		$scope.addCommunication = function () {

			const form = createCommunicationForm();
			document.body.appendChild(form);
			form.showModal();
		};

		function createCommunicationForm() {
			// Create elements
			const container = document.createElement('dialog');
			container.id = 'communication-creation-container';
			const form = document.createElement('form');

			const h3 = document.createElement('h3');
			const fieldset1 = document.createElement('fieldset');
			const fieldset2 = document.createElement('fieldset');
			const fieldset3 = document.createElement('fieldset');
			const input1 = document.createElement('input');
			const textarea = document.createElement('textarea');
			const submitButton = document.createElement('button');
			const cancelButton = document.createElement('button');

			// Set attributes and content
			container.className = 'container';
			form.id = 'create-communication-form';
			form.action = '';
			h3.textContent = 'Create Communication';
			input1.placeholder = 'Communication Name';
			input1.type = 'text';
			input1.tabIndex = '1';
			input1.required = true;
			input1.autofocus = true;
			textarea.placeholder = 'Communication description....';
			textarea.tabIndex = '2';
			textarea.required = true;
			submitButton.name = 'submit';
			submitButton.type = 'submit';
			submitButton.id = 'submit-button';
			submitButton.textContent = 'Submit';
			submitButton.onclick = submitCommunicationCreation;

			cancelButton.type = 'submit';
			cancelButton.formNoValidate = true;
			cancelButton.textContent = 'Cancel';
			cancelButton.onclick = function () {
				container.close();
				document.body.removeChild(container);
			}

			// Append elements
			fieldset1.appendChild(input1);
			fieldset2.appendChild(textarea);
			fieldset3.appendChild(submitButton);
			fieldset3.appendChild(cancelButton);
			form.appendChild(h3);
			form.appendChild(fieldset1);
			form.appendChild(fieldset2);
			form.appendChild(fieldset3);
			container.appendChild(form);

			return container;
		}

		function submitCommunicationCreation(event) {
			// Avoids the reloading of the page
			event.preventDefault();
			const container = document.getElementById('communication-creation-container');

			// Check if the form is valid before removing it from the document
			// TODO add custom validation for the values
			if (container.querySelector('form').checkValidity()) {
				// Form is valid, continue with the next line of code
				// Get the values from the form
				const communicationName = container.querySelector('input[placeholder="Communication Name"]').value;
				const description = container.querySelector('textarea').value;

				createNewCommunication(communicationName, description);
				// Remove the form
				container.close();
				document.body.removeChild(container);
			} else {
				// Form is not valid, handle the error or show an error message
				alert("Please fill in all fields.");
			}
		}

		function createNewCommunication(communicationName, description) {
			//
			// Template for a new node.
			//
			var newNodeDataModel = {
				name: communicationName,
				id: nextNodeID++,
				type: "Communication",
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

		// Shows the json data on the left side of the screen
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

		$scope.uploadCatalog = function() {

			const catalogForm = createCatalogForm();
			document.body.appendChild(catalogForm);
			catalogForm.showModal();
		}

		function createCatalogForm() {
			// Create elements
			const container = document.createElement('dialog');
			container.id = 'catalog-container';
			const form = document.createElement('form');

			const h3 = document.createElement('h3');
			const fieldset1 = document.createElement('fieldset');
			const fieldset2 = document.createElement('fieldset');
			const textarea = document.createElement('textarea');
			const submitButton = document.createElement('button');
			const cancelButton = document.createElement('button');

			// Set attributes and content
			container.className = 'container';
			form.id = 'catalog-form';
			form.action = '';
			fieldset1.className = 'catalog-fieldset-textarea';
			h3.textContent = 'Insert Catalog';
			textarea.placeholder = 'AWS Catalog...';
			textarea.tabIndex = '1';
			textarea.required = true;
			submitButton.name = 'submit';
			submitButton.type = 'submit';
			submitButton.id = 'submit-button';
			submitButton.textContent = 'Submit';
			submitButton.onclick = submitCatalog;

			cancelButton.type = 'submit';
			cancelButton.formNoValidate = true;
			cancelButton.textContent = 'Cancel';
			cancelButton.onclick = function () {
				container.close();
				document.body.removeChild(container);
			}

			// Append elements
			fieldset1.appendChild(textarea);
			fieldset2.appendChild(submitButton);
			fieldset2.appendChild(cancelButton);
			form.appendChild(h3);
			form.appendChild(fieldset1);
			form.appendChild(fieldset2);
			container.appendChild(form);

			return container;
		}

		function submitCatalog(event) {
			// Avoids the reloading of the page
			event.preventDefault();
			const container = document.getElementById('catalog-container');

			// Check if the form is valid before removing it from the document
			// TODO add custom validation for the values
			if (container.querySelector('form').checkValidity()) {
				// Form is valid, continue with the next line of code
				// Get the values from the form
				const catalog = container.querySelector('textarea').value;

				// Define the URL of the server
				const url = 'http://127.0.0.1:8000/api/compare';
				// Get the data from the chart
				const data = [$scope.chartViewModel.data, formatText(catalog)];
				postToServer(url, data);


				// Remove the form
				container.close();
				document.body.removeChild(container);
			} else {
				// Form is not valid, handle the error or show an error message
				alert("Please fill in all fields.");
			}
		}

		// Sends the data to the server
		function postToServer(url, data) {
			// Send the POST request using fetch
			fetch(url, {
				method: 'POST', // Specify the HTTP method
				headers: {
					'Content-Type': 'application/json', // Specify the content type
				},
				body: JSON.stringify(data) // Convert the JSON object to a string
			})
				.then(response => response.json()) // Parse the response JSON
				.then(data => {
					console.log('Success:', data); // Handle the response data
				})
				.catch((error) => {
					console.error('Error:', error); // Handle any errors
				});
		}

		// Formats a string into a json object
		function formatText(text) {
			// Remove newline characters (\n)
			text = text.replace(/\\n/g, '');
			// Remove extra spaces and tabs
			text = text.replace(/\s{2,}/g, '');
			// Parse the string into a JSON object
			try {
				var jsonObject = JSON.parse(text);
				return jsonObject;
			} catch (error) {
				console.error("Error parsing JSON:", error);
				return null;
			}
		}

		$scope.saveFile = function() {
			data = $scope.chartViewModel.data;
			// Convert JSON object to string
			const jsonString = JSON.stringify(data);

			// Create a Blob from the JSON string
			const blob = new Blob([jsonString], { type: "application/json" });

			// Create a link element
			const link = document.createElement("a");

			// Create a URL for the Blob and set it as the href attribute
			link.href = URL.createObjectURL(blob);

			// Set the download attribute to specify the filename
			link.download = "data.json";

			// Append the link to the document body (required for Firefox)
			document.body.appendChild(link);

			// Programmatically click the link to trigger the download
			link.click();

			// Remove the link from the document
			document.body.removeChild(link);
		}

		$scope.loadFile = function() {
			const container = document.createElement('dialog');
			container.id = 'file-container';
			// Create the file input element
			const fileInput = document.createElement('input');
			fileInput.type = 'file';
			fileInput.accept = '.json'; // Restrict file selection to JSON files
			fileInput.style.display = 'block'; // Hide the input element
			container.appendChild(fileInput);

			// Append the file input to the body
			document.body.appendChild(container);
			// Open the menu
			container.showModal();

			// Add an event listener for the esc key of the keyboard that closes the modal
			document.addEventListener('keydown', function (event) {
				if (event.keyCode === escKeyCode) {
					container.close();
					document.body.removeChild(container);
				}
			});

			// Add an event listener for the change event
			fileInput.addEventListener('change', function (event) {
				const file = event.target.files[0];
				if (file) {
					const reader = new FileReader();

					reader.onload = function (e) {
						try {
							const jsonData = JSON.parse(e.target.result);
							// You can now use jsonData in your app
							// Add the data to the chart
							$scope.chartViewModel = jsonData;
							// Update the view model
							$scope.chartViewModel = new flowchart.ChartViewModel($scope.chartViewModel);

						} catch (error) {
							console.error('Error parsing JSON:', error);
						}
					};

					reader.onerror = function (e) {
						console.error('Error reading file:', e);
					};

					reader.readAsText(file);
					// Close the dialog
					container.close();
				}
			});
		}

		$scope.scale = 1;
		const minScale = 0.5; // Minimum scale limit
		const maxScale = 1; // Maximum scale limit (can't zoom more then the default scale)

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
				console.log('Zooming in')
				$scope.scale += 0.07;
			}
		};

		$scope.zoomOut = function () {
			if ($scope.scale > minScale) {
				console.log('Zooming out')
				$scope.scale -= 0.07;
			}
		};

	}])
	;