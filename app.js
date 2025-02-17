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
					tags: ["device", "mobile"],
					parameters: {
						"execution_time": "moderate",
						"power_consumption": "moderate",
						"network_bandwidth": "moderate"
					},
					x: 26,
					y: 27,
					width: 300,
					height: 90,
					quantity: 1,
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
					description: "This is a computation",
					tags: ["compute", "server"],
					parameters: {
						"execution_time": "moderate",
						"power_consumption": "moderate",
						"network_bandwidth": "moderate"
					},
					x: 418,
					y: 138,
					quantity: 1,
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
					description: "This is a storage",
					tags: ["storage", "database"],
					parameters: {
						"execution_time": "moderate",
						"power_consumption": "moderate",
						"network_bandwidth": "moderate"
					},
					x: 687,
					y: 296,
					quantity: 1,
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
					image: "../assets/images/database.svg",
				},
				{
					name: "Communication",
					id: 3,
					type: "Communication",
					description: "This is a communication",
					tags: ["communication", "network"],
					parameters: {
						"execution_time": "moderate",
						"power_consumption": "moderate",
						"network_bandwidth": "moderate"
					},
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
					quantity: 1,
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

		// ############################################################################################################

		//
		// Functionality and utilities to add a new node and constraints to said node.
		//
		// The list of possible numerical constraints

		// The list of possible categorical constraints and the options for each constraint
		$scope.categoricalConstraints = [
			{
				name: 'execution_time',
				options: [
					'very low',
					'low',
					'moderate',
					'high',
					'very high'
				]
			},
			{
				name: 'power_consumption',
				options: [
					'very low',
					'low',
					'moderate',
					'high',
					'very high'
				]
			},
			{
				name: 'network_bandwidth',
				options: [
					'very low',
					'low',
					'moderate',
					'high',
					'very high'
				]
			},
		];

		$scope.nodeTypes = [
			'Device',
			'Computation',
			'Storage',
			'Communication'
		]

		$scope.openAddNodeModal = function () {
			// Create a blank node
			let node = {
				name: '',
				type: '',
				id: nextNodeID,
				description: '',
				quantity: 1,
				parameters: {
					"execution_time": "moderate",
					"power_consumption": "moderate",
					"network_bandwidth": "moderate"
				},
				x: 0,
				y: 0,
				inputConnectors: [
					{ name: "", direction: "x" },
					{ name: "", direction: "y" }
				],
				outputConnectors: [
					{ name: "", direction: "x" },
					{ name: "", direction: "y" }
				],
				width: 250,
				height: 90,
			};

			// Use modal HTML defined by the new comment instead of dynamic element creation
			let modalHtml = `
			<div class="modal fade" id="addNodeModal" tabindex="-1" aria-labelledby="addNodeModalLabel" aria-hidden="true">
			  <div class="modal-dialog modal-dialog-centered modal-xl">
			    <div class="modal-content">
			      <div class="modal-header">
			        <h1 class="modal-title fs-5" id="addNodeModalLabel">Create new node</h1>
			        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
			      </div>
			      <div class="modal-body">
			        <div class="row">
			          <div class="col">
			            <h4>Node Informations</h4>
			            <div class="form-floating mb-3">
			              <input type="text" class="form-control" id="floatingInputName" placeholder="Name">
			              <label for="floatingInputName">Node Name</label>
			            </div>
			            <div class="input-group mb-3">
			              <label class="input-group-text" for="inputGroupNodeType">Type</label>
			              <select class="form-select" id="inputGroupNodeType">
			                <!-- Options will be populated dynamically -->
			              </select>
			            </div>
			            <div class="form-floating mb-3">
			              <textarea class="form-control" placeholder="Describe your node" id="floatingTextareaDescription" style="height: 100px"></textarea>
			              <label for="floatingTextareaDescription">Description</label>
			            </div>
			            <div class="form-floating mb-3">
			              <input type="text" class="form-control" id="floatingInputQuantity" placeholder="Quantity">
			              <label for="floatingInputQuantity">Node Quantity</label>
			            </div>
			          </div>
			        </div>
			      </div>
			      <div class="modal-footer">
			        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
			        <button type="button" class="btn btn-primary" id="saveNodeButton">Save Node</button>
			      </div>
			    </div>
			  </div>
			</div>
			`;

			// Insert modal HTML into the body
			let wrapper = document.createElement('div');
			wrapper.innerHTML = modalHtml;
			let modal = wrapper.firstElementChild;
			document.body.appendChild(modal);

			// Populate node type options dynamically
			let select = modal.querySelector("#inputGroupNodeType");
			$scope.nodeTypes.forEach(function (type) {
				let option = document.createElement("option");
				option.textContent = type;
				select.appendChild(option);
			});

			// Show the modal instance
			let modalInstance = new bootstrap.Modal(modal);
			modalInstance.show();

			// Bind the save button click event
			modal.querySelector("#saveNodeButton").onclick = function () {
				let inputName = modal.querySelector("#floatingInputName");
				let textarea = modal.querySelector("#floatingTextareaDescription");
				let inputQuantity = modal.querySelector("#floatingInputQuantity");

				// Update the node with values from the modal
				node.name = inputName.value;
				node.type = select.value;
				node.description = textarea.value;
				node.quantity = inputQuantity.value.trim() === "" ? 1 : parseInt(inputQuantity.value);

				// Increment nextNodeID and add the node to the chart
				nextNodeID++;
				$scope.chartViewModel.addNode(node);

				// Close and remove the modal
				modalInstance.hide();
				modal.remove();
			};
		};

		$scope.openModifyNodeModal = function (originalNode) {
			// Create a deep copy of the node to modify
			let node = JSON.parse(JSON.stringify(originalNode));

			// Define modal template with prefilled values using innerHTML
			let modalHtml = `
				<div class="modal fade" id="modifyNodeModal" tabindex="-1" aria-labelledby="modifyNodeModalLabel" aria-hidden="true">
				  <div class="modal-dialog modal-dialog-centered modal-xl">
				    <div class="modal-content">
				      <div class="modal-header">
				        <h1 class="modal-title fs-5" id="modifyNodeModalLabel">Modify Node</h1>
				        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				      </div>
				      <div class="modal-body">
				        <div class="row">
				          <div class="col">
				            <h4>Node Informations</h4>
				            <div class="form-floating mb-3">
				              <input type="text" class="form-control" id="floatingInputName" placeholder="Name" value="${node.name}">
				              <label for="floatingInputName">Node Name</label>
				            </div>
				            <div class="input-group mb-3">
				              <label class="input-group-text" for="inputGroupNodeType">Type</label>
				              <select class="form-select" id="inputGroupNodeType">
				                ${$scope.nodeTypes.map(type => `<option ${type === node.type ? 'selected' : ''}>${type}</option>`).join('')}
				              </select>
				            </div>
				            <div class="form-floating mb-3">
				              <textarea class="form-control" placeholder="Describe your node" id="floatingTextareaDescription" style="height: 100px">${node.description}</textarea>
				              <label for="floatingTextareaDescription">Description</label>
				            </div>
				            <div class="form-floating mb-3">
				              <input type="text" class="form-control" id="floatingInputQuantity" placeholder="Quantity" value="${node.quantity}">
				              <label for="floatingInputQuantity">Node Quantity</label>
				            </div>
				          </div>
				        </div>
				      </div>
				      <div class="modal-footer">
				        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
				        <button type="button" class="btn btn-primary" id="saveModifyNodeButton">Save Changes</button>
				      </div>
				    </div>
				  </div>
				</div>
			`;

			// Insert modal HTML into the body
			let wrapper = document.createElement('div');
			wrapper.innerHTML = modalHtml;
			let modal = wrapper.firstElementChild;
			document.body.appendChild(modal);

			// Initialize and show the modal
			let modalInstance = new bootstrap.Modal(modal);
			modalInstance.show();

			// Bind the save button
			modal.querySelector("#saveModifyNodeButton").onclick = function () {
				let inputName = modal.querySelector("#floatingInputName");
				let select = modal.querySelector("#inputGroupNodeType");
				let textarea = modal.querySelector("#floatingTextareaDescription");
				let inputQuantity = modal.querySelector("#floatingInputQuantity");

				// Update the original node
				originalNode.name = inputName.value;
				originalNode.type = select.value;
				originalNode.description = textarea.value;
				originalNode.quantity = inputQuantity.value.trim() === "" ? 1 : parseInt(inputQuantity.value);
				// ...handle additional constraints updates if necessary...

				modalInstance.hide();
				modal.remove();
			};
		};

		$scope.openSetConstraints = function () {
			let modalHtml = `
				<div class="modal fade" id="setConstraintsModal" tabindex="-1" aria-labelledby="setConstraintsModalLabel" aria-hidden="true">
				  <div class="modal-dialog modal-dialog-centered">
				    <div class="modal-content">
				      <div class="modal-header">
				        <h1 class="modal-title fs-5" id="setConstraintsModalLabel">Set Constraints</h1>
				        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				      </div>
				      <div class="modal-body">
				        <!-- Add your constraint configuration here -->
				        <p>Configure your constraints below.</p>
				      </div>
				      <div class="modal-footer">
				        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
				        <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Save Constraints</button>
				      </div>
				    </div>
				  </div>
				</div>
			`;
			let wrapper = document.createElement('div');
			wrapper.innerHTML = modalHtml;
			let modal = wrapper.firstElementChild;
			document.body.appendChild(modal);
			let modalInstance = new bootstrap.Modal(modal);
			modalInstance.show();
			// Cleanup modal on hide
			modal.addEventListener('hidden.bs.modal', function () {
				modal.remove();
			});
		};

		$scope.saveNewNode = function (node, input1, select, textarea, input2) {
			// Set the node values to the values in the modal
			node.name = input1.value;
			node.type = select.value;
			node.description = textarea.value;
			if (input2.value.trim() === "") {
				node.quantity = 1;
			} else {
				node.quantity = parseInt(node.quantity);
			}

			// Increment the nextNodeID
			nextNodeID = nextNodeID + 1;

			// Add the node to the chart
			$scope.chartViewModel.addNode(node);
		}

		function closeModal(modalInstance, modal) {
			modalInstance.hide();
			document.body.removeChild(modal);
		}

		function createButtonSave(name) {
			let buttonSave = document.createElement('button');
			buttonSave.type = 'button';
			buttonSave.classList.add('btn', 'btn-primary');
			buttonSave.textContent = name;

			return buttonSave;
		}

		function createButtonClose() {
			let buttonClose = document.createElement('button');
			buttonClose.type = 'button';
			buttonClose.classList.add('btn', 'btn-secondary');
			buttonClose.setAttribute('data-bs-dismiss', 'modal');
			buttonClose.textContent = 'Close';

			return buttonClose
		}

		// ############################################################################################################

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

		function sendCatalogAndWorkflowToServer() {
			;
			const catalog = loadDefaultCatalog();

			// Define the URL of the server
			const url = 'http://127.0.0.1:8000/api/v1/solve/llm';
			// Get the data from the chart
			const workflow = $scope.chartViewModel.data
			const data = [workflow, catalog];
			// Send the data to the server
			postToServer(url, data);
		}

		// Loads the default catalog of services
		function loadDefaultCatalog() {
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
			/*
				Create:
				<div class="modal fade" id="loadWorkflowModal" tabindex="-1" aria-labelledby="loadWorkflowModalLabel" aria-hidden="true">
					<div class="modal-dialog">
						<div class="modal-content">
							<div class="modal-header">
								<h1 class="modal-title fs-5" id="loadWorkflowModalLabel">Load Workflow</h1>
								<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
							</div>
							<div class="modal-body">
								<input class="form-control" type="file" accept=".json">
							</div>
						</div>
					</div>
				</div>
			*/

			const modal = document.createElement('div');
			modal.className = 'modal fade';
			modal.id = 'loadWorkflowModal';
			modal.tabIndex = '-1';
			modal.setAttribute('aria-labelledby', 'loadWorkflowModalLabel');
			modal.setAttribute('aria-hidden', 'true');

			const modalDialog = document.createElement('div');
			modalDialog.className = 'modal-dialog modal-dialog-centered';

			const modalContent = document.createElement('div');
			modalContent.className = 'modal-content';

			const modalHeader = document.createElement('div');
			modalHeader.className = 'modal-header';

			const h1 = document.createElement('h1');
			h1.className = 'modal-title fs-5';
			h1.id = 'loadWorkflowModalLabel';
			h1.textContent = 'Load Workflow';

			const button = document.createElement('button');
			button.type = 'button';
			button.className = 'btn-close';
			button.setAttribute('data-bs-dismiss', 'modal');
			button.setAttribute('aria-label', 'Close');

			const modalBody = document.createElement('div');
			modalBody.className = 'modal-body';

			const fileInput = document.createElement('input');
			fileInput.className = 'form-control';
			fileInput.type = 'file';
			fileInput.accept = '.json';

			modalBody.appendChild(fileInput);
			modalHeader.appendChild(h1);
			modalHeader.appendChild(button);
			modalContent.appendChild(modalHeader);
			modalContent.appendChild(modalBody);
			modalDialog.appendChild(modalContent);
			modal.appendChild(modalDialog);

			document.body.appendChild(modal);
			const modalInstance = new bootstrap.Modal(modal);
			modalInstance.show();

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
					// Close and remove the modal
					modalInstance.hide();
					document.body.removeChild(modal);
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