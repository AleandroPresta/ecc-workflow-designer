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

		// Default catalogs for each cloud provider (with appropriate link)
		$scope.defaultCatalogs = [
			{
				provider_name: "Amazon Web Services",
				catalog_link: "./catalogs/aws_catalog.json"
			},
			{
				provider_name: "Microsoft Azure",
				catalog_link: ""
			},
			{
				provider_name: "Google Cloud Platform",
				catalog_link: ""
			}
		]

		$scope.solvingMethods = [
			"LLM (GPT 3.5-turbo)",
			"LLM (GPT 4o)",
			"LLM (o1-mini)",
			"Linear Programming",
			"Petri Net"
		]

		$scope.serviceTags = [
			"A2A",
			"A2P",
			"AI",
			"API Management",
			"Access Management",
			"Analytics",
			"Android",
			"App Testing",
			"Applications",
			"Authentication",
			"Authorization",
			"Automation",
			"Availability",
			"Big Data",
			"Block Storage",
			"Bluetooth",
			"Build",
			"Business",
			"Calendar",
			"Central Hub",
			"Cloud",
			"Compute",
			"Configuration",
			"Container Registry",
			"Containerized Applications",
			"Continuous Delivery",
			"Continuous Integration",
			"Control",
			"Corporate Websites",
			"Cost Reduction",
			"Cost-Effective",
			"DaaS",
			"DNS",
			"Data Collection",
			"Data Exchange",
			"Data Preparation",
			"Data Transfer",
			"Dedicated Connection",
			"Deployment",
			"Desktop",
			"Developer Tools",
			"Development",
			"Device Management",
			"Document Database",
			"Document Storage",
			"EC2",
			"EFS",
			"ETL",
			"Email",
			"Evaluation",
			"Feedback",
			"File Transfer",
			"Forecasting",
			"Framework",
			"Full-Stack",
			"Gateway",
			"Geocoding",
			"Geofencing",
			"Governance",
			"Greengrass",
			"Hadoop",
			"High Performance",
			"Highly Available",
			"Identity",
			"Industrial Equipment",
			"InfluxDB",
			"In-Memory Cache",
			"In-Memory Database",
			"Inference",
			"Integration",
			"IoT",
			"Isolation",
			"Key-Value",
			"Location",
			"Logs",
			"ML",
			"Machine Learning",
			"Management",
			"Managed",
			"Maps",
			"Memcached",
			"Messaging",
			"Metrics",
			"Mobile",
			"MongoDB",
			"Monitoring",
			"Networking",
			"NoSQL",
			"Object Storage",
			"Observability",
			"Operational Applications",
			"Optimization",
			"Performance",
			"Persistent Storage",
			"PostgreSQL",
			"Private Network",
			"Push Notifications",
			"RESTful",
			"Real-Time",
			"Redis",
			"Relational Database",
			"Repository",
			"S3",
			"SMS",
			"Scalability",
			"Scalable",
			"Secure",
			"Security",
			"Server",
			"Serverless",
			"Sharing",
			"Spark",
			"Storage",
			"Streaming",
			"Streaming Data",
			"Third-Party Data",
			"Time Series Database",
			"User Management",
			"VPC",
			"VPS",
			"Video Streaming",
			"Virtual Applications",
			"Visibility",
			"Web",
			"5G"
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
			// Retrieve nodes from the workflow; default to an empty array if not defined
			var nodes = ($scope.chartViewModel.data && $scope.chartViewModel.data.nodes) || [];

			// Build the HTML table with editable selects for each categorical constraint
			var tableHtml = `<table class="table table-bordered table-striped table-hover">
				<thead>
					<tr>
						<th>Name</th>
						<th>Tags</th>
						<th>Parameters</th>
					</tr>
				</thead>
				<tbody>
					${nodes.map(node => {
				// Build tags column with removable badges and add-tag interface.
				let tagsHtml = `<div class="tags-container mb-2" id="tags-container-${node.id}">
						${(node.tags && node.tags.length)
						? node.tags.map(tag => `<span class="custom-badge me-1">
									${tag}
									<button type="button" class="btn btn-sm btn-outline-light ms-1 remove-tag" data-node-id="${node.id}" data-tag="${tag}">&times;</button>
									</span>`).join('')
						: '<span class="text-muted">—</span>'}
					</div>
						<div class="input-group">
							<select class="form-select form-select-sm add-tag-select" id="add-tag-select-${node.id}">
								<option value="">Add tag...</option>
								${$scope.serviceTags.map(tag => `<option value="${tag}">${tag}</option>`).join('')}
							</select>
							<button type="button" class="btn btn-sm btn-primary add-tag-button" data-node-id="${node.id}">Add</button>
						</div>`;

				// Build parameters as before.
				var selectsHtml = $scope.categoricalConstraints.map(cc => {
					var currentVal = (node.parameters && node.parameters[cc.name]) || cc.options[0];
					var optionsHtml = cc.options.map(option => {
						return `<option value="${option}" ${option === currentVal ? 'selected' : ''}>${option}</option>`;
					}).join('');
					return `<div class="mb-2">
									<label class="form-label me-1">${cc.name}:</label>
									<select id="cc-${node.id}-${cc.name}" class="form-select form-select-sm d-inline-block" style="width:auto;">
										${optionsHtml}
									</select>
								</div>`;
				}).join('');

				return `<tr>
								<td>${node.name}</td>
								<td>${tagsHtml}</td>
								<td>${selectsHtml}</td>
							</tr>`;
			}).join('')}
				</tbody>
			</table>`;

			// Use a larger modal by adding "modal-xl" to the modal-dialog classes
			let modalHtml = `
				<div class="modal fade" id="setConstraintsModal" tabindex="-1" aria-labelledby="setConstraintsModalLabel" aria-hidden="true">
				  <div class="modal-dialog modal-xl modal-dialog-centered">
				    <div class="modal-content">
				      <div class="modal-header bg-primary text-white">
				        <h1 class="modal-title fs-5" id="setConstraintsModalLabel">Set Constraints</h1>
				        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
				      </div>
				      <div class="modal-body">
				        ${tableHtml}
				      </div>
				      <div class="modal-footer">
				        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
				        <button type="button" class="btn btn-primary" id="saveConstraintsButton">Save Constraints</button>
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

			// Bind the Save Constraints button
			modal.querySelector("#saveConstraintsButton").onclick = function () {
				// Loop over each node and update its parameters from the select elements
				nodes.forEach(node => {
					$scope.categoricalConstraints.forEach(cc => {
						let selectEl = document.getElementById(`cc-${node.id}-${cc.name}`);
						if (selectEl) {
							node.parameters[cc.name] = selectEl.value;
						}
					});
				});
				// Optionally trigger any update required on the chartViewModel here.
				modalInstance.hide();
				modal.remove();
			};

			// After inserting the modal into the DOM (before binding Save Constraints), add the following event bindings:
			setTimeout(function () {
				// Bind remove button click events.
				document.querySelectorAll('.remove-tag').forEach(function (btn) {
					btn.addEventListener('click', function (e) {
						const nodeId = this.getAttribute('data-node-id');
						const tag = this.getAttribute('data-tag');
						const container = document.getElementById(`tags-container-${nodeId}`);
						// Remove badge from DOM.
						this.parentElement.remove();
					});
				});
				// Bind add button click events.
				document.querySelectorAll('.add-tag-button').forEach(function (btn) {
					btn.addEventListener('click', function () {
						const nodeId = this.getAttribute('data-node-id');
						const select = document.getElementById(`add-tag-select-${nodeId}`);
						const tag = select.value;
						if (tag) {
							const container = document.getElementById(`tags-container-${nodeId}`);
							// If placeholder exists, remove it.
							if (container.innerHTML.indexOf('text-muted') !== -1) {
								container.innerHTML = "";
							}
							// Append new badge if not already present.
							if (!container.innerHTML.includes(`data-tag="${tag}"`)) {
								const span = document.createElement('span');
								span.className = "custom-badge me-1";
								span.innerHTML = `${tag} <button type="button" class="btn btn-sm btn-outline-light ms-1 remove-tag" data-node-id="${nodeId}" data-tag="${tag}">&times;</button>`;
								container.appendChild(span);
								// Bind remove event on the new button.
								span.querySelector('.remove-tag').addEventListener('click', function () {
									this.parentElement.remove();
								});
							}
							// Reset select.
							select.value = "";
						}
					});
				});
			}, 100); // slight delay to ensure modal is in the DOM

			// In modal Save Constraints button binding, before closing modal, update node.tags from DOM:
			modal.querySelector("#saveConstraintsButton").onclick = function () {
				nodes.forEach(node => {
					// Update tags from corresponding container.
					const container = document.getElementById(`tags-container-${node.id}`);
					if (container) {
						// Find all span elements that are badges.
						const badgeSpans = container.querySelectorAll('.custom-badge');
						let tagsArray = [];
						badgeSpans.forEach(badge => {
							const tagText = badge.textContent.replace('×', '').trim();
							tagsArray.push(tagText);
						});
						node.tags = tagsArray;
					}
					$scope.categoricalConstraints.forEach(cc => {
						let selectEl = document.getElementById(`cc-${node.id}-${cc.name}`);
						if (selectEl) {
							node.parameters[cc.name] = selectEl.value;
						}
					});
				});
				// Optionally trigger any update required on the chartViewModel here.
				modalInstance.hide();
				modal.remove();
			};
			// Cleanup modal on hide (if closed via the Close button)
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

		// Updated function to display the result as a table with one row per abstract service
		function showResults(result) {
			// If result is a string, try to parse it.
			if (typeof result === "string") {
				try {
					result = JSON.parse(result);
				} catch (e) {
					console.error("Failed to parse result string", e);
					alert("Could not parse server result.");
					return;
				}
			}
			// Ensure result.result is an array.
			let services = result.result;
			if (!services || !Array.isArray(services)) {
				console.error("No valid 'result' array found in response", result);
				alert("No valid data received.");
				return;
			}
			// Build the table HTML using specific fields.
			let tableHtml = `
				  <table class="table table-bordered">
					<thead>
					  <tr>
						<th>ID</th>
						<th>Name</th>
						<th>Type</th>
						<th>Layer</th>
						<th>Tags</th>
						<th>AWS Services</th>
					  </tr>
					</thead>
					<tbody>
					  ${services.map(service => {
				let tagsStr = Array.isArray(service.abstractservice_tags)
					? service.abstractservice_tags.join(", ")
					: service.abstractservice_tags || "";
				let awsStr = "";
				if (service.aws_services && Array.isArray(service.aws_services)) {
					awsStr = service.aws_services.map(s =>
						`Name: ${s.service_name}, Type: ${s.service_type}`
					).join("<br>");
				}
				return `<tr>
									<td>${service.abstractservice_id}</td>
									<td>${service.abstractservice_name}</td>
									<td>${service.abstractservice_type}</td>
									<td>${service.abstractservice_layer}</td>
									<td>${tagsStr}</td>
									<td>${awsStr}</td>
								  </tr>`;
			}).join('')}
					</tbody>
				  </table>
				`;

			let resultModalHtml = `
				  <div class="modal fade" id="resultModal" tabindex="-1" aria-labelledby="resultModalLabel" aria-hidden="true">
					<div class="modal-dialog modal-xl modal-dialog-centered">
					  <div class="modal-content">
						<div class="modal-header">
						  <h5 class="modal-title" id="resultModalLabel">Results</h5>
						  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div class="modal-body" style="max-height:80vh; overflow-y:auto;">
						  ${tableHtml}
						</div>
					  </div>
					</div>
				  </div>
				`;

			let wrapper = document.createElement('div');
			wrapper.innerHTML = resultModalHtml;
			let resultModal = wrapper.firstElementChild;
			document.body.appendChild(resultModal);
			let resultModalInstance = new bootstrap.Modal(resultModal);
			resultModalInstance.show();
		}

		$scope.openFindMatchModal = function () {
			let modalHtml = `
					<div class="modal fade" id="findMatchModal" tabindex="-1" aria-labelledby="findMatchModalLabel" aria-hidden="true">
					  <div class="modal-dialog modal-dialog-centered">
						<div class="modal-content">
						  <div class="modal-header">
							<h5 class="modal-title" id="findMatchModalLabel">Find Match</h5>
							<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						  </div>
						  <div class="modal-body">
							<div class="container">
							  <div class="row">
								<div class="col-12 mb-3">
								  <p>Select Catalog Option</p>
								  <select id="defaultCatalogSelector" class="form-select">
									${$scope.defaultCatalogs.map(cat => `<option value="${cat.catalog_link}">${cat.provider_name}</option>`).join('')}
								  </select>
								</div>
								<div class="col-12">
								  <p>Select Solving Method</p>
								  <select id="solvingMethodSelector" class="form-select">
									${$scope.solvingMethods.map(method => `<option value="${method}">${method}</option>`).join('')}
								  </select>
								</div>
							  </div>
							</div>
						  </div>
						  <div class="modal-footer">
							<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
							<button type="button" class="btn btn-primary" id="runButton">Run</button>
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
			// Attach async click event to the Run button
			modal.querySelector("#runButton").addEventListener('click', async function () {
				let catalogSelector = document.getElementById("defaultCatalogSelector");
				let solvingSelector = document.getElementById("solvingMethodSelector");
				let catalogLink = catalogSelector ? catalogSelector.value : "";
				let solvingMethod = solvingSelector ? solvingSelector.value : "";
				if (catalogLink && catalogLink.trim() !== "") {
					try {
						// Fetch catalog content.
						const catalogData = await fetch(catalogLink).then(response => response.text());
						let model_id = 0;
						let response = "";
						if (solvingMethod === "LLM (GPT 3.5-turbo)") {
							model_id = 1;
							console.log("Running LLM (GPT 3.5-turbo)...");
							response = await $scope.solveWithLLM($scope.chartViewModel.data, catalogData, model_id);
						}
						if (solvingMethod === "LLM (GPT 4o)") {
							model_id = 2;
							console.log("Running LLM (GPT 4o)...");
							response = await $scope.solveWithLLM($scope.chartViewModel.data, catalogData, model_id);
						}
						if (solvingMethod === "LLM (o1-mini)") {
							model_id = 3;
							console.log("Running LLM (GPT o1-mini)...");
							response = await $scope.solveWithLLM($scope.chartViewModel.data, catalogData, model_id);
						}
						// Extract only the result inside the request_body
						const result = response.request_body.result;
						console.log("Result:", result);
						// Close the find-match modal and show the results modal formatted as JSON
						modalInstance.hide();
						showResults(result);
					} catch (error) {
						console.error("Error in openFindMatchModal:", error);
					}
				} else {
					console.log("No catalog link provided.");
				}
			});
			// Cleanup modal when hidden
			modal.addEventListener('hidden.bs.modal', function () {
				modal.remove();
			});
		};

		// Filters the workflow keeping only the relevant information
		$scope.filterWorkflow = function (workflow) {
			// Create a deep copy of the workflow to avoid modifying the original
			let filteredWorkflow = JSON.parse(JSON.stringify(workflow));

			// Remove connections
			delete filteredWorkflow.connections;

			// Filter each node to keep only the specified fields
			filteredWorkflow.nodes = filteredWorkflow.nodes.map(node => {
				return {
					name: node.name,
					id: node.id,
					type: node.type,
					description: node.description,
					tags: node.tags,
					parameters: node.parameters
				};
			});

			return filteredWorkflow;
		}

		$scope.solveWithLLM = async function (workflow, catalog, model_id) {
			const url = `http://127.0.0.1:8000/api/v1/solve/llm/${model_id}`;
			const data = [
				$scope.filterWorkflow(workflow),
				catalog
			];
			// Post to server and return response.
			try {
				const response = await postToServer(url, data);
				return response;
			} catch (error) {
				console.error("Error in solveWithLLM:", error);
				throw error;
			}
		}

		// Add helper function for fetch with timeout
		function fetchWithTimeout(url, options, timeout = 60000) { // 60 seconds timeout
			const controller = new AbortController();
			const timer = setTimeout(() => {
				controller.abort();
			}, timeout);
			options.signal = controller.signal;
			return fetch(url, options)
				.finally(() => clearTimeout(timer));
		}

		async function postToServer(url, data) {
			// Create and show loading indicator
			let loadingIndicator = document.createElement('div');
			loadingIndicator.id = 'loadingIndicator';
			loadingIndicator.style = "position: fixed; top: 20px; right: 20px; background: #fff; border: 1px solid #000; padding: 10px; z-index: 9999;";
			loadingIndicator.textContent = "Loading...";
			document.body.appendChild(loadingIndicator);

			const request = {
				// mode: 'no-cors', // No CORS policy
				method: 'POST', // Specify the HTTP method
				headers: {
					'Content-Type': 'application/json', // Specify the content type
				},
				body: JSON.stringify(data) // Convert the JSON object to a string
			};

			// console.log(`Request:\n${JSON.stringify(request)}\n`);

			// Use fetchWithTimeout instead of fetch
			try {
				const response = await fetchWithTimeout(url, request, 60000);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const respData = await response.json();
				return respData;
			} catch (error) {
				console.error('Fetch error:', error);
				alert(`An error occurred: ${error.message}`);
				throw error;
			} finally {
				if (loadingIndicator.parentNode) {
					loadingIndicator.parentNode.removeChild(loadingIndicator);
				}
			}
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