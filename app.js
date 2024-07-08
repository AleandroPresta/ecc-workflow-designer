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
					width: 300,
					height: 90,
					inputConnectors: [
						{
							name: "",
							direction: "x"
						},
						{
							name: "",
							direction: "y"
						}
					],
					outputConnectors: [
						{
							name: "",
							direction: "x"
						},
						{
							name: "",
							direction: "y"
						}
					]
				},
				{
					name: "Computation",
					id: 1,
					type: "Computation",
					parameters: [
						{
							name: 'executionTime',
							value: 10,
							type: '>'
						},
						{
							name: 'volumeOfData',
							value: 100,
							type: '<='
						}
					],
					description: "This is a computation",
					x: 418,
					y: 138,
					inputConnectors: [
						{
							name: "",
							direction: "x"
						},
						{
							name: "",
							direction: "y"
						}
					],
					outputConnectors: [
						{
							name: "",
							direction: "x"
						},
						{
							name: "",
							direction: "y"
						}
					],
					width: 250,
					height: 90,
				},
				{
					name: "Storage",
					id: 2,
					type: "Storage",
					parameters: [
						{
							name: 'availableMemory',
							value: 1000,
							type: '>'
						}
					],
					description: "This is a storage",
					x: 687,
					y: 296,
					inputConnectors: [
						{
							name: "",
							direction: "x"
						},
						{
							name: "",
							direction: "y"
						}
					],
					outputConnectors: [
						{
							name: "",
							direction: "x"
						},
						{
							name: "",
							direction: "y"
						}
					],
					width: 250,
					height: 90,
					image: "default_storage.png",
				},
				{
					name: "Communication",
					id: 3,
					type: "Communication",
					parameters: {

					},
					description: "This is a communication",
					x: 985,
					y: 423,
					inputConnectors: [
						{
							name: "",
							direction: "x"
						},
						{
							name: "",
							direction: "y"
						}
					],
					outputConnectors: [
						{
							name: "",
							direction: "x"
						},
						{
							name: "",
							direction: "y"
						}
					],
					width: 250,
					height: 90,
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
			container.className = 'container';
			const form = document.createElement('form');

			// Create 4 rows
			const row1 = document.createElement('div');
			row1.className = 'row m-3';
			const row2 = document.createElement('div');
			row2.className = 'row mb-3';
			const row3 = document.createElement('div');
			row3.className = 'row mb-3';
			const row4 = document.createElement('div');
			row4.className = 'row mb-3';

			const h3 = document.createElement('h3');
			const fieldset1 = document.createElement('fieldset');
			const fieldset2 = document.createElement('fieldset');
			const fieldset3 = document.createElement('fieldset');
			const input1 = document.createElement('input');
			input1.className = 'form-control';
			const textarea = document.createElement('textarea');
			textarea.className = 'form-control';
			const submitButton = document.createElement('button');
			submitButton.className = 'btn btn-primary';
			const cancelButton = document.createElement('button');
			cancelButton.className = 'btn btn-secondary';

			// Set attributes and content
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

			fieldset3.className = 'd-flex align-items-center justify-content-around';

			// Append elements
			fieldset1.appendChild(input1);
			fieldset2.appendChild(textarea);
			fieldset3.appendChild(submitButton);
			fieldset3.appendChild(cancelButton);

			row1.appendChild(h3);
			row2.appendChild(fieldset1);
			row3.appendChild(fieldset2);
			row4.appendChild(fieldset3);

			form.appendChild(row1);
			form.appendChild(row2);
			form.appendChild(row3);
			form.appendChild(row4);	

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
				const deviceName = container.querySelector('input[placeholder="Device Name"]').value;
				const description = container.querySelector('textarea').value;

				createNewDevice(deviceName, description);
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
				id: nextNodeID,
				type: "Device",
				description: description,
				x: 0,
				y: 0,
				inputConnectors: [
					{
						name: "",
						direction: "x"
					},
					{
						name: "",
						direction: "y"
					}
				],
				outputConnectors: [
					{
						name: "",
						direction: "x"
					},
					{
						name: "",
						direction: "y"
					}
				],
			};
			nextNodeID = nextNodeID + 1;
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
		
		// Convert the value of the select element to the corresponding operator
		function valueToOperator(value) {
			switch (value) {
				case '1':
					return '>';
				case '2':
					return '>=';
				case '3':
					return '<';
				case '4':
					return '<=';
				default:
					return '==';
			}
		}

		// Create a form to add a new computation
		function createComputationForm() {
			// Create elements
			const container = document.createElement('dialog');
			container.id = 'computation-creation-container';
			container.className = 'container';
			const form = document.createElement('form');

			// Create 6 rows
			const row1 = document.createElement('div');
			row1.className = 'row m-3';
			const row2 = document.createElement('div');
			row2.className = 'row mb-3';
			const row3 = document.createElement('div');
			row3.className = 'row mb-3';
			const row4 = document.createElement('div');
			row4.className = 'row mb-3';
			const row5 = document.createElement('div');
			row5.className = 'row mb-3';
			const row6 = document.createElement('div');
			row6.className = 'row mb-3';

			const h3 = document.createElement('h3');
			const fieldset1 = document.createElement('fieldset');
			const fieldset2 = document.createElement('fieldset');
			const fieldset3 = document.createElement('fieldset');
			const fieldset4 = document.createElement('fieldset');
			const fieldset5 = document.createElement('fieldset');
			
			// Name
			// Create: <input class='form-control' ...> ... </input>
			const input1 = document.createElement('input');
			input1.className = 'form-control';

			// executionTime			
			/*
				Create:
				<div class="input-group mb-3">
					<div class="col-9">
						<input class='form-control' ...> ... </input>
					</div>
					<div class="col-3">
						<select class="form-select" id="inputGroupSelect02">
							<option selected> == </option>
							<option value="1"> > </option>
							<option value="2"> >= </option>
							<option value="3"> < </option>
							<option value="4"> <= </option>
						</select>
					</div>			
				</div>

			*/

			const inputGroup1 = document.createElement('div');
			inputGroup1.className = 'input-group mb-3';

			const col11 = document.createElement('div');
			col11.className = 'col-9';
			inputGroup1.appendChild(col11);

			const input2 = document.createElement('input');
			input2.className = 'form-control';
			col11.appendChild(input2);

			const col12 = document.createElement('div');
			col12.className = 'col-3';
			inputGroup1.appendChild(col12);

			const select1 = document.createElement('select');
			select1.className = 'form-select';
			select1.id = 'computation-execution-time-select';

			const option1 = document.createElement('option');
			option1.selected = true;
			option1.textContent = '==';
			select1.appendChild(option1);

			const option2 = document.createElement('option');
			option2.value = '1';
			option2.textContent = '>';
			select1.appendChild(option2);

			const option3 = document.createElement('option');
			option3.value = '2';
			option3.textContent = '>=';
			select1.appendChild(option3);

			const option4 = document.createElement('option');
			option4.value = '3';
			option4.textContent = '<';
			select1.appendChild(option4);

			const option5 = document.createElement('option');
			option5.value = '4';
			option5.textContent = '<=';
			select1.appendChild(option5);

			col12.appendChild(select1);

			fieldset2.appendChild(inputGroup1);

			// Volume of Data
			/*
				Create:
				<div class="input-group mb-3">
					<div class="col-9">
						<input class='form-control' ...> ... </input>
					</div>
					<div class="col-3">
						<select class="form-select" id="inputGroupSelect02">
							<option selected> == </option>
							<option value="1"> > </option>
							<option value="2"> >= </option>
							<option value="3"> < </option>
							<option value="4"> <= </option>
						</select>
					</div>			
				</div>

			*/
			const inputGroup2 = document.createElement('div');
			inputGroup2.className = 'input-group mb-3';

			const col21 = document.createElement('div');
			col21.className = 'col-9';
			inputGroup2.appendChild(col21);

			const input3 = document.createElement('input');
			input3.className = 'form-control';
			col21.appendChild(input3);

			const col22 = document.createElement('div');
			col22.className = 'col-3';
			inputGroup2.appendChild(col22);

			const select2 = document.createElement('select');
			select2.className = 'form-select';
			select2.id = 'computation-volume-of-data-select';

			const option6 = document.createElement('option');
			option6.selected = true;
			option6.textContent = '==';
			select2.appendChild(option6);

			const option7 = document.createElement('option');
			option7.value = '1';
			option7.textContent = '>';
			select2.appendChild(option7);

			const option8 = document.createElement('option');
			option8.value = '2';
			option8.textContent = '>=';
			select2.appendChild(option8);

			const option9 = document.createElement('option');
			option9.value = '3';
			option9.textContent = '<';
			select2.appendChild(option9);

			const option10 = document.createElement('option');
			option10.value = '4';
			option10.textContent = '<=';
			select2.appendChild(option10);
			
			col22.appendChild(select2);

			fieldset3.appendChild(inputGroup2);

			const textarea = document.createElement('textarea');
			textarea.className = 'form-control';
			const submitButton = document.createElement('button');
			submitButton.className = 'btn btn-primary';
			const cancelButton = document.createElement('button');
			cancelButton.className = 'btn btn-secondary';

			// Set attributes and content	
			form.id = 'create-computation-form';
			form.action = '';
			h3.textContent = 'Create Computation';

			input1.placeholder = 'Computation Name';
			input1.type = 'text';
			input1.tabIndex = '1';
			input1.required = true;
			input1.autofocus = true;
			input1.id = 'computation-name-input';
		
			input2.placeholder = 'Computation execution time';
			input2.type = 'text';
			input2.tabIndex = '2';
			input2.required = true;
			input2.id = 'computation-execution-time-input';

			input3.placeholder = 'Computation volume of data';
			input3.type = 'text';
			input3.tabIndex = '3';
			input3.required = true;
			input3.id = 'computation-volume-of-data-input';

			textarea.placeholder = 'Computation description....';
			textarea.tabIndex = '4';
			textarea.required = true;
			textarea.id = 'computation-description-textarea';

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

			fieldset5.className = 'd-flex align-items-center justify-content-around';

			// Append elements
			fieldset1.appendChild(input1);
			fieldset4.appendChild(textarea);
			fieldset5.appendChild(submitButton);
			fieldset5.appendChild(cancelButton);

			row1.appendChild(h3);
			row2.appendChild(fieldset1);
			row3.appendChild(fieldset2);
			row4.appendChild(fieldset3);
			row5.appendChild(fieldset4);
			row6.appendChild(fieldset5);

			form.appendChild(row1);
			form.appendChild(row2);
			form.appendChild(row3);
			form.appendChild(row4);
			form.appendChild(row5);
			form.appendChild(row6);
			
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
				const computationName = document.getElementById('computation-name-input').value;

				const executionTime = parseInt(document.getElementById('computation-execution-time-input').value);
				const executionTimeOperatorValue = document.getElementById('computation-execution-time-select').value;
				const executionTimeOperator = valueToOperator(executionTimeOperatorValue);

				const volumeOfData = parseInt(document.getElementById('computation-volume-of-data-input').value);
				const volumeOfDataOperatorValue = document.getElementById('computation-volume-of-data-select').value;
				const volumeOfDataOperator = valueToOperator(volumeOfDataOperatorValue);

				// Check if the values are valid integers
				if (isNaN(executionTime) || isNaN(volumeOfData)) {
					alert("Please enter valid integers for execution time and volume of data.");
					return;
				}

				const description = container.querySelector('textarea').value;

				createNewComputation(computationName, executionTime, executionTimeOperator, volumeOfData, volumeOfDataOperator, description);
				// Remove the form
				container.close();
				document.body.removeChild(container);
			} else {
				// Form is not valid, handle the error or show an error message
				alert("Please fill in all fields.");
			}

		}

		function createNewComputation(computationName, executionTime, executionTimeOperator, volumeOfData, volumeOfDataOperator, description) {
			//
			// Template for a new computation.
			//
			let newNodeDataModel = {
				name: computationName,
				id: nextNodeID,
				type: "Computation",
				parameters: [
					{
						name: 'executionTime',
						value: executionTime,
						type: executionTimeOperator
					},
					{
						name: 'volumeOfData',
						value: volumeOfData,
						type: volumeOfDataOperator
					}
				],
				description: description,
				x: 0,
				y: 0,
				inputConnectors: [
					{
						name: "",
						direction: "x"
					},
					{
						name: "",
						direction: "y"
					}
				],
				outputConnectors: [
					{
						name: "",
						direction: "x"
					},
					{
						name: "",
						direction: "y"
					}
				],
			};

			nextNodeID = nextNodeID + 1;
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
			container.className = 'container';
			const form = document.createElement('form');

			// Create 5 rows
			const row1 = document.createElement('div');
			row1.className = 'row m-3';
			const row2 = document.createElement('div');
			row2.className = 'row mb-3';
			const row3 = document.createElement('div');
			row3.className = 'row mb-3';
			const row4 = document.createElement('div');
			row4.className = 'row mb-3';
			const row5 = document.createElement('div');
			row5.className = 'row mb-3';

			const h3 = document.createElement('h3');
			const fieldset1 = document.createElement('fieldset');
			const fieldset2 = document.createElement('fieldset');
			const fieldset3 = document.createElement('fieldset');
			const fieldset4 = document.createElement('fieldset');

			const input1 = document.createElement('input');
			input1.className = 'form-control';

			// Available Memory
			/*
				Create:
				<div class="input-group mb-3">
					<div class="col-9">
						<input class='form-control' ...> ... </input>
					</div>
					<div class="col-3">
						<select class="form-select" id="inputGroupSelect02">
							<option selected> == </option>
							<option value="1"> > </option>
							<option value="2"> >= </option>
							<option value="3"> < </option>
							<option value="4"> <= </option>
						</select>
					</div>			
				</div>
			*/

			const inputGroup1 = document.createElement('div');
			inputGroup1.className = 'input-group mb-3';

			const col11 = document.createElement('div');
			col11.className = 'col-9';
			inputGroup1.appendChild(col11);

			const input2 = document.createElement('input');
			input2.className = 'form-control';
			col11.appendChild(input2);

			const col12 = document.createElement('div');
			col12.className = 'col-3';
			inputGroup1.appendChild(col12);

			const select1 = document.createElement('select');
			select1.className = 'form-select';
			select1.id = 'storage-available-memory-select';

			const option1 = document.createElement('option');
			option1.selected = true;
			option1.textContent = '==';
			select1.appendChild(option1);

			const option2 = document.createElement('option');
			option2.value = '1';
			option2.textContent = '>';
			select1.appendChild(option2);
			
			const option3 = document.createElement('option');
			option3.value = '2';
			option3.textContent = '>=';
			select1.appendChild(option3);

			const option4 = document.createElement('option');
			option4.value = '3';
			option4.textContent = '<';
			select1.appendChild(option4);

			const option5 = document.createElement('option');
			option5.value = '4';
			option5.textContent = '<=';
			select1.appendChild(option5);
	
			col12.appendChild(select1);

			fieldset2.appendChild(inputGroup1);

			const textarea = document.createElement('textarea');
			textarea.className = 'form-control';
			const submitButton = document.createElement('button');
			submitButton.className = 'btn btn-primary';
			const cancelButton = document.createElement('button');
			cancelButton.className = 'btn btn-secondary';

			// Set attributes and content
			
			form.id = 'create-storage-form';
			form.action = '';
			h3.textContent = 'Create Storage';

			input1.placeholder = 'Storage Name';
			input1.type = 'text';
			input1.tabIndex = '1';
			input1.required = true;
			input1.autofocus = true;
			input1.id = 'storage-name-input';

			input2.placeholder = 'Available Memory';
			input2.type = 'text';
			input2.tabIndex = '2';
			input2.required = true;
			input2.autofocus = true;
			input2.id = 'storage-available-memory-input';

			textarea.placeholder = 'Storage description....';
			textarea.tabIndex = '3';
			textarea.required = true;
			textarea.id = 'storage-description-textarea';

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

			fieldset4.className = 'd-flex align-items-center justify-content-around';

			// Append elements
			fieldset1.appendChild(input1);
			fieldset3.appendChild(textarea);
			fieldset4.appendChild(submitButton);
			fieldset4.appendChild(cancelButton);
			
			row1.appendChild(h3);
			row2.appendChild(fieldset1);
			row3.appendChild(fieldset2);
			row4.appendChild(fieldset3);
			row5.appendChild(fieldset4);

			form.appendChild(row1);
			form.appendChild(row2);
			form.appendChild(row3);
			form.appendChild(row4);	
			form.appendChild(row5);

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
				const storageName = document.getElementById('storage-name-input').value;
				
				const availableMemory = parseInt(document.getElementById('storage-available-memory-input').value);
				const availableMemoryOperatorValue = document.getElementById('storage-available-memory-select').value;
				const availableMemoryOperator = valueToOperator(availableMemoryOperatorValue);

				// Check if the values are valid integers
				if (isNaN(availableMemory)) {
					alert("Please enter a valid integer for available memory.");
					return;
				}

				const description = container.querySelector('textarea').value;

				createNewStorage(storageName, availableMemory, availableMemoryOperator, description);
				// Remove the form
				container.close();
				document.body.removeChild(container);
			} else {
				// Form is not valid, handle the error or show an error message
				alert("Please fill in all fields.");
			}
		}

		function createNewStorage(storageName, availableMemory, availableMemoryOperator, description) {
			//
			// Template for a new node.
			//
			var newNodeDataModel = {
				name: storageName,
				id: nextNodeID,
				type: "Storage",
				parameters: [
					{
						name: 'availableMemory',
						value: availableMemory,
						type: availableMemoryOperator
					}
				],
				description: description,
				x: 0,
				y: 0,
				inputConnectors: [
					{
						name: "",
						direction: "x"
					},
					{
						name: "",
						direction: "y"
					}
				],
				outputConnectors: [
					{
						name: "",
						direction: "x"
					},
					{
						name: "",
						direction: "y"
					}
				],
			};

			nextNodeID = nextNodeID + 1;
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
			container.className = 'container';
			const form = document.createElement('form');

			// Create 4 rows
			const row1 = document.createElement('div');
			row1.className = 'row m-3';
			const row2 = document.createElement('div');
			row2.className = 'row mb-3';
			const row3 = document.createElement('div');
			row3.className = 'row mb-3';
			const row4 = document.createElement('div');
			row4.className = 'row mb-3';

			const h3 = document.createElement('h3');
			const fieldset1 = document.createElement('fieldset');
			const fieldset2 = document.createElement('fieldset');
			const fieldset3 = document.createElement('fieldset');
			const input1 = document.createElement('input');
			input1.className = 'form-control';
			const textarea = document.createElement('textarea');
			textarea.className = 'form-control';
			const submitButton = document.createElement('button');
			submitButton.className = 'btn btn-primary';
			const cancelButton = document.createElement('button');
			cancelButton.className = 'btn btn-secondary';

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

			fieldset3.className = 'd-flex align-items-center justify-content-around';

			// Append elements
			fieldset1.appendChild(input1);
			fieldset2.appendChild(textarea);
			fieldset3.appendChild(submitButton);
			fieldset3.appendChild(cancelButton);
			
			row1.appendChild(h3);
			row2.appendChild(fieldset1);
			row3.appendChild(fieldset2);
			row4.appendChild(fieldset3);

			form.appendChild(row1);
			form.appendChild(row2);
			form.appendChild(row3);
			form.appendChild(row4);	

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
				id: nextNodeID,
				type: "Communication",
				parameters: {

				},
				description: description,
				x: 0,
				y: 0,
				inputConnectors: [
					{
						name: "",
						direction: "x"
					},
					{
						name: "",
						direction: "y"
					}
				],
				outputConnectors: [
					{
						name: "",
						direction: "x"
					},
					{
						name: "",
						direction: "y"
					}
				],
			};
			nextNodeID = nextNodeID + 1;
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

		$scope.findMatch = function () {
			sendCatalogAndWorkflowToServer();
		}

		function sendCatalogAndWorkflowToServer() {;
			const catalog = loadDefaultCatalog();

			// Define the URL of the server
			const url = 'http://127.0.0.1:8000/api/compare';
			// Get the data from the chart
			const workflow = $scope.chartViewModel.data
			const data = [workflow, catalog];
			// Send the data to the server
			postToServer(url, data);
		}

		// Loads the default catalog of services
		function loadDefaultCatalog(){
			const defaultCatalog = {
			};

			return defaultCatalog;
		}

		// Sends the data to the server
		function postToServer(url, data) {
			const request = {
				mode: 'no-cors', // No CORS policy
				method: 'POST', // Specify the HTTP method
				headers: {
					'Content-Type': 'application/json', // Specify the content type
				},
				body: JSON.stringify(data) // Convert the JSON object to a string
			};
			console.log(`Request:\n${JSON.stringify(request)}\n`);
			// Send the POST request using fetch
			fetch(url, request)
				.then(response => response.json()) // Parse the response JSON
				.then(data => {
					console.log('Success:', data); // Handle the response data
				})
				.catch((error) => {
					// Show the error modal
					const errorModal = new bootstrap.Modal(document.getElementById('connectionErrorModal'));
					errorModal.show();
				});
		}

		$scope.saveFile = function () {
			data = $scope.chartViewModel.data;
			data.nextNodeID = nextNodeID;
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

		$scope.loadFile = function () {
			const container = document.createElement('dialog');
			container.id = 'file-container';
			// Create the file input element
			const fileInput = document.createElement('input');
			// Use Bootstrap's styling
			fileInput.className = 'form-control';
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
							// Extract only nodes and connections from the jsonData
							const nodes = jsonData.nodes;
							const connections = jsonData.connections;
							// Put this into a new object
							const newJsonData = { nodes, connections };
							// You can now use jsonData in your app
							// Add the data to the chart
							$scope.chartViewModel = newJsonData;
							// Set the loaded nextNodeID
							nextNodeID = jsonData.nextNodeID;
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
				$scope.scale += 0.07;
			}
		};

		$scope.zoomOut = function () {
			if ($scope.scale > minScale) {
				$scope.scale -= 0.07;
			}
		};

	}])
	;