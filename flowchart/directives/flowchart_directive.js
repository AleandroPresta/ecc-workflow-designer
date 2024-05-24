//
// Flowchart module.
//
angular.module('flowChart', ['dragging'])

	//
	// Directive that generates the rendered chart from the data model.
	//
	.directive('flowChart', function () {
		return {
			restrict: 'E',
			templateUrl: "flowchart/templates/flowchart_template.html",
			replace: true,
			scope: {
				chart: "=chart",
			},

			//
			// Controller for the flowchart directive.
			// Having a separate controller is better for unit testing, otherwise
			// it is painful to unit test a directive without instantiating the DOM 
			// (which is possible, just not ideal).
			//
			controller: 'FlowChartController',
		};
	})

	//
	// Directive that allows the chart to be edited as json in a textarea.
	//
	.directive('chartJsonEdit', function () {
		return {
			restrict: 'A',
			scope: {
				viewModel: "="
			},
			link: function (scope, elem, attr) {

				//
				// Serialize the data model as json and update the textarea.
				//
				var updateJson = function () {
					if (scope.viewModel) {
						var json = JSON.stringify(scope.viewModel.data, null, 4);
						$(elem).val(json);
					}
				};

				//
				// First up, set the initial value of the textarea.
				//
				updateJson();

				//
				// Watch for changes in the data model and update the textarea whenever necessary.
				//
				scope.$watch("viewModel.data", updateJson, true);

				//
				// Handle the change event from the textarea and update the data model
				// from the modified json.
				//
				$(elem).bind("input propertychange", function () {
					var json = $(elem).val();
					var dataModel = JSON.parse(json);
					scope.viewModel = new flowchart.ChartViewModel(dataModel);

					scope.$digest();
				});
			}
		}

	})

	//
	// Directive that opens a context menù on right click
	//
	.directive('ngRightClick', function ($parse) {
		return function (scope, element, attrs) {
			var fn = $parse(attrs.ngRightClick);
			element.bind('contextmenu', function (event) {
				scope.$apply(function () {
					event.preventDefault();
					fn(scope, { $event: event });
				});
			});
		};
	})


	//
	// Controller for the flowchart directive.
	// Having a separate controller is better for unit testing, otherwise
	// it is painful to unit test a directive without instantiating the DOM 
	// (which is possible, just not ideal).
	//
	.controller('FlowChartController', ['$scope', 'dragging', '$element', function FlowChartController($scope, dragging, $element) {

		var controller = this;

		//
		// Reference to the document and jQuery, can be overridden for testting.
		//
		this.document = document;

		//
		// Wrap jQuery so it can easily be  mocked for testing.
		//
		this.jQuery = function (element) {
			return $(element);
		}

		//
		// Init data-model variables.
		//
		$scope.draggingConnection = false;
		$scope.connectorSize = 10;
		$scope.dragSelecting = false;
		/* Can use this to test the drag selection rect.
		$scope.dragSelectionRect = {
			x: 0,
			y: 0,
			width: 0,
			height: 0,
		};
		*/

		//
		// Reference to the connection, connector or node that the mouse is currently over.
		//
		$scope.mouseOverConnector = null;
		$scope.mouseOverConnection = null;
		$scope.mouseOverNode = null;

		//
		// The class for connections and connectors.
		//
		this.connectionClass = 'connection';
		this.connectorClass = 'connector';
		this.nodeClass = 'node';

		//
		// Search up the HTML element tree for an element the requested class.
		//
		this.searchUp = function (element, parentClass) {

			//
			// Reached the root.
			//
			if (element == null || element.length == 0) {
				return null;
			}

			// 
			// Check if the element has the class that identifies it as a connector.
			//
			if (hasClassSVG(element, parentClass)) {
				//
				// Found the connector element.
				//
				return element;
			}

			//
			// Recursively search parent elements.
			//
			return this.searchUp(element.parent(), parentClass);
		};

		//
		// Hit test and retreive node and connector that was hit at the specified coordinates.
		//
		this.hitTest = function (clientX, clientY) {

			//
			// Retreive the element the mouse is currently over.
			//
			return this.document.elementFromPoint(clientX, clientY);
		};

		//
		// Hit test and retreive node and connector that was hit at the specified coordinates.
		//
		this.checkForHit = function (mouseOverElement, whichClass) {

			//
			// Find the parent element, if any, that is a connector.
			//
			var hoverElement = this.searchUp(this.jQuery(mouseOverElement), whichClass);
			if (!hoverElement) {
				return null;
			}

			return hoverElement.scope();
		};

		//
		// Translate the coordinates so they are relative to the svg element.
		//
		this.translateCoordinates = function (x, y, evt) {
			var svg_elem = $element.get(0);
			var matrix = svg_elem.getScreenCTM();
			var point = svg_elem.createSVGPoint();
			point.x = x - evt.view.pageXOffset;
			point.y = y - evt.view.pageYOffset;
			return point.matrixTransform(matrix.inverse());
		};

		//
		// Called on mouse down in the chart.
		//
		$scope.mouseDown = function (evt) {

			$scope.chart.deselectAll();

			dragging.startDrag(evt, {

				//
				// Commence dragging... setup variables to display the drag selection rect.
				//
				dragStarted: function (x, y) {
					$scope.dragSelecting = true;
					var startPoint = controller.translateCoordinates(x, y, evt);
					$scope.dragSelectionStartPoint = startPoint;
					$scope.dragSelectionRect = {
						x: startPoint.x,
						y: startPoint.y,
						width: 0,
						height: 0,
					};
				},

				//
				// Update the drag selection rect while dragging continues.
				//
				dragging: function (x, y) {
					var startPoint = $scope.dragSelectionStartPoint;
					var curPoint = controller.translateCoordinates(x, y, evt);

					$scope.dragSelectionRect = {
						x: curPoint.x > startPoint.x ? startPoint.x : curPoint.x,
						y: curPoint.y > startPoint.y ? startPoint.y : curPoint.y,
						width: curPoint.x > startPoint.x ? curPoint.x - startPoint.x : startPoint.x - curPoint.x,
						height: curPoint.y > startPoint.y ? curPoint.y - startPoint.y : startPoint.y - curPoint.y,
					};
				},

				//
				// Dragging has ended... select all that are within the drag selection rect.
				//
				dragEnded: function () {
					$scope.dragSelecting = false;
					$scope.chart.applySelectionRect($scope.dragSelectionRect);
					delete $scope.dragSelectionStartPoint;
					delete $scope.dragSelectionRect;
				},
			});
		};

		//
		// Called for each mouse move on the svg element.
		//
		$scope.mouseMove = function (evt) {

			//
			// Clear out all cached mouse over elements.
			//
			$scope.mouseOverConnection = null;
			$scope.mouseOverConnector = null;
			$scope.mouseOverNode = null;

			var mouseOverElement = controller.hitTest(evt.clientX, evt.clientY);
			if (mouseOverElement == null) {
				// Mouse isn't over anything, just clear all.
				return;
			}

			if (!$scope.draggingConnection) { // Only allow 'connection mouse over' when not dragging out a connection.

				// Figure out if the mouse is over a connection.
				var scope = controller.checkForHit(mouseOverElement, controller.connectionClass);
				$scope.mouseOverConnection = (scope && scope.connection) ? scope.connection : null;
				if ($scope.mouseOverConnection) {
					// Don't attempt to mouse over anything else.
					return;
				}
			}

			// Figure out if the mouse is over a connector.
			var scope = controller.checkForHit(mouseOverElement, controller.connectorClass);
			$scope.mouseOverConnector = (scope && scope.connector) ? scope.connector : null;
			if ($scope.mouseOverConnector) {
				// Don't attempt to mouse over anything else.
				return;
			}

			// Figure out if the mouse is over a node.
			var scope = controller.checkForHit(mouseOverElement, controller.nodeClass);
			$scope.mouseOverNode = (scope && scope.node) ? scope.node : null;
		};

		//
		// Handle mousedown on a node.
		//
		$scope.nodeMouseDown = function (evt, node) {

			var chart = $scope.chart;
			var lastMouseCoords;

			dragging.startDrag(evt, {

				//
				// Node dragging has commenced.
				//
				dragStarted: function (x, y) {

					lastMouseCoords = controller.translateCoordinates(x, y, evt);

					//
					// If nothing is selected when dragging starts, 
					// at least select the node we are dragging.
					//
					if (!node.selected()) {
						chart.deselectAll();
						node.select();
					}
				},

				//
				// Dragging selected nodes... update their x,y coordinates.
				//
				dragging: function (x, y) {

					var curCoords = controller.translateCoordinates(x, y, evt);
					var deltaX = curCoords.x - lastMouseCoords.x;
					var deltaY = curCoords.y - lastMouseCoords.y;

					chart.updateSelectedNodesLocation(deltaX, deltaY);

					lastMouseCoords = curCoords;
				},

				//
				// The node wasn't dragged... it was clicked.
				//
				clicked: function () {
					chart.handleNodeClicked(node, evt.ctrlKey);
				},

			});
		};

		//
		// Handle mousedown on a connection.
		//
		$scope.connectionMouseDown = function (evt, connection) {
			var chart = $scope.chart;
			chart.handleConnectionMouseDown(connection, evt.ctrlKey);

			// Don't let the chart handle the mouse down.
			evt.stopPropagation();
			evt.preventDefault();
		};

		//
		// Handle mousedown on an input connector.
		//
		$scope.connectorMouseDown = function (evt, node, connector, connectorIndex, isInputConnector) {

			//
			// Initiate dragging out of a connection.
			//
			dragging.startDrag(evt, {

				//
				// Called when the mouse has moved greater than the threshold distance
				// and dragging has commenced.
				//
				dragStarted: function (x, y) {

					var curCoords = controller.translateCoordinates(x, y, evt);

					$scope.draggingConnection = true;
					$scope.dragPoint1 = flowchart.computeConnectorPos(node, connectorIndex, isInputConnector);
					$scope.dragPoint2 = {
						x: curCoords.x,
						y: curCoords.y
					};
					$scope.dragTangent1 = flowchart.computeConnectionSourceTangent($scope.dragPoint1, $scope.dragPoint2);
					$scope.dragTangent2 = flowchart.computeConnectionDestTangent($scope.dragPoint1, $scope.dragPoint2);
				},

				//
				// Called on mousemove while dragging out a connection.
				//
				dragging: function (x, y, evt) {
					var startCoords = controller.translateCoordinates(x, y, evt);
					$scope.dragPoint1 = flowchart.computeConnectorPos(node, connectorIndex, isInputConnector);
					$scope.dragPoint2 = {
						x: startCoords.x,
						y: startCoords.y
					};
					$scope.dragTangent1 = flowchart.computeConnectionSourceTangent($scope.dragPoint1, $scope.dragPoint2);
					$scope.dragTangent2 = flowchart.computeConnectionDestTangent($scope.dragPoint1, $scope.dragPoint2);
				},

				//
				// Clean up when dragging has finished.
				//
				dragEnded: function () {

					if ($scope.mouseOverConnector &&
						$scope.mouseOverConnector !== connector) {

						//
						// Dragging has ended...
						// The mouse is over a valid connector...
						// Create a new connection.
						//
						$scope.chart.createNewConnection(connector, $scope.mouseOverConnector);
					}

					$scope.draggingConnection = false;
					delete $scope.dragPoint1;
					delete $scope.dragTangent1;
					delete $scope.dragPoint2;
					delete $scope.dragTangent2;
				},

			});
		};

		//
		// Handle rightclick on the node of the flowchart
		//
		$scope.openContextMenuNodes = function (evt, node) {
			// Remove any existing context menu to avoid duplication
			let existingMenu = document.getElementById('context-menu');
			if (existingMenu) {
				existingMenu.remove();
			}

			// Create the context menu container
			let contextMenu = document.createElement('div');
			contextMenu.setAttribute('id', 'context-menu');
			contextMenu.setAttribute('style', `position: fixed; top: ${evt.clientY}px; left: ${evt.clientX}px; display: block; z-index: 1000; background: white; border: 1px solid #ccc; box-shadow: 0 2px 10px rgba(0,0,0,0.2);`);

			// Create the <ul> element
			let ulElement = document.createElement('ul');
			ulElement.setAttribute('class', 'menu-list');
			ulElement.setAttribute('style', 'list-style-type: none; margin: 0;');

			// Definition of context menu options
			// Define context menu options common for all node types
			const addInputConnectorOption = {
				name: 'Add input connector',
				action: function () {
					$scope.$parent.addNewInputConnector();
				}
			};
			const addOutputConnectorOption = {
				name: 'Add output connector',
				action: function () {
					$scope.$parent.addNewOutputConnector();
				}
			};
			const deleteNodeOption = {
				name: 'Delete',
				action: function () {
					$scope.chart.deleteSelected();
				}
			};
			// Define device options
			const modifyDeviceOption = {
				name: 'Modify device',
				action: function () {
					const form = createDeviceForm(node.data.name, node.data.description);
					document.body.appendChild(form);

					form.addEventListener('submit', function (event) {
						event.preventDefault(); // prevent the form from submitting and reloading the page

						const newName = document.getElementById('device-name-input').value;
						const newDescription = document.getElementById('device-description-input').value;

						node.data.name = newName;
						node.data.description = newDescription;

						document.body.removeChild(form); // remove the form from the DOM
					});
				}
			}
			// Define computation options
			const modifyComputationOption = {
				name: 'Modify computation',
				action: function () {
					const form = createComputationForm(node.data.name, node.data.executionTime, node.data.volumeOfData, node.data.description);
					document.body.appendChild(form);

					form.addEventListener('submit', function (event) {
						event.preventDefault(); // prevent the form from submitting and reloading the page

						const newName = document.getElementById('computation-name-input').value;
						const newExecutionTime = document.getElementById('computation-extime-input').value;
						const newVolumeOfData = document.getElementById('computation-voldata-input').value;
						const newDescription = document.getElementById('computation-description-input').value;

						node.data.name = newName;
						node.data.executionTime = newExecutionTime;
						node.data.volumeOfData = newVolumeOfData;
						node.data.description = newDescription;

						document.body.removeChild(form); // remove the form from the DOM
					});
				}
			}
			// Define storage options
			const modifyStorageOption = {
				name: 'Modify storage',
				action: function () {
					const form = createStorageForm(node.data.name, node.data.availableMemory, node.data.description);
					document.body.appendChild(form);

					form.addEventListener('submit', function(event) {
						event.preventDefault();

						const newName = document.getElementById('storage-name-input').value;
						const newAvailableMemory = document.getElementById('storage-avmemory-input').value;
						const newDescription = document.getElementById('storage-description-input').value;

						node.data.name = newName;
						node.data.availableMemory = newAvailableMemory;
						node.data.description = newDescription;

						document.body.removeChild(form);
					});
				}
			}
			// Define communication options
			const modifyCommunicationOption = {
				name: 'Modify communication',
				action: function () {
					const form = createCommunicationForm(node.data.name, node.data.description);
					document.body.appendChild(form);

					form.addEventListener('submit', function (event) {
						event.preventDefault(); // prevent the form from submitting and reloading the page

						const newName = document.getElementById('communication-name-input').value;
						const newDescription = document.getElementById('communication-description-input').value;

						node.data.name = newName;
						node.data.description = newDescription;

						document.body.removeChild(form); // remove the form from the DOM
					});
				}
			}

			let contextMenuOptions = [];

			// Adding contextMenuOptions based on the type of node selected
			if (node.data.type == "Device") {
				contextMenuOptions.push(modifyDeviceOption);
			} else if (node.data.type == "Computation") {
				contextMenuOptions.push(modifyComputationOption);
			} else if (node.data.type == "Storage") {
				contextMenuOptions.push(modifyStorageOption);
			} else if (node.data.type == "Communication") {
				contextMenuOptions.push(modifyCommunicationOption);
			}

			// Adding common functionalities at the end
			contextMenuOptions.push(addInputConnectorOption);
			contextMenuOptions.push(addOutputConnectorOption);
			contextMenuOptions.push(deleteNodeOption);

			// Create and append <li> elements for each context menu option
			contextMenuOptions.forEach(function (option) {
				let liElement = document.createElement('li');
				liElement.setAttribute('class', 'menu-item');

				// Create button element for the option
				let buttonElement = document.createElement('button');
				buttonElement.setAttribute('class', 'menu-button');
				buttonElement.textContent = option.name;

				// Add click event listener to execute the action
				buttonElement.addEventListener('click', function (event) {
					event.preventDefault(); // Prevent default link behavior
					option.action(); // Execute the action associated with the option
					contextMenu.remove(); // Remove context menu after action
				});

				// Append button to li and li to ul
				liElement.appendChild(buttonElement);
				ulElement.appendChild(liElement);
			});

			contextMenu.appendChild(ulElement);

			// Append context menu to the document body
			document.body.appendChild(contextMenu);

			// Remove context menu when clicking outside
			document.addEventListener('click', function removeContextMenu(event) {
				if (!contextMenu.contains(event.target)) {
					contextMenu.remove();
					document.removeEventListener('click', removeContextMenu);
				}
			}, { once: true });
		};

		//
		// Handle rightclick on the connection of the flowchart
		//
		$scope.openContextMenuEdges = function (evt, node) {
			// Remove any existing context menu to avoid duplication
			let existingMenu = document.getElementById('context-menu');
			if (existingMenu) {
				existingMenu.remove();
			}

			// Create the context menu container
			let contextMenu = document.createElement('div');
			contextMenu.setAttribute('id', 'context-menu');
			contextMenu.setAttribute('style', `position: fixed; top: ${evt.clientY}px; left: ${evt.clientX}px; display: block; z-index: 1000; background: white; border: 1px solid #ccc; box-shadow: 0 2px 10px rgba(0,0,0,0.2);`);

			// Create the <ul> element
			let ulElement = document.createElement('ul');
			ulElement.setAttribute('class', 'menu-list');
			ulElement.setAttribute('style', 'list-style-type: none; margin: 0;');

			// Definition of context menu options
			// Define context menu options common for all node types
			const changeNameOption = {
				name: 'Change name',
				action: function () {
					const newNodeName = prompt("Enter the new name:", node.data.name);
					if (newNodeName) {
						node.data.name = newNodeName;
					}
				}
			};
			const deleteEdgeOption = {
				name: 'Delete',
				action: function () {
					$scope.chart.deleteSelected();
				}
			};

			let contextMenuOptions = [changeNameOption, deleteEdgeOption];

			// Create and append <li> elements for each context menu option
			contextMenuOptions.forEach(function (option) {
				let liElement = document.createElement('li');
				liElement.setAttribute('class', 'menu-item');

				// Create button element for the option
				let buttonElement = document.createElement('button');
				buttonElement.setAttribute('class', 'menu-button');
				buttonElement.textContent = option.name;

				// Add click event listener to execute the action
				buttonElement.addEventListener('click', function (event) {
					event.preventDefault(); // Prevent default link behavior
					option.action(); // Execute the action associated with the option
					contextMenu.remove(); // Remove context menu after action
				});

				// Append button to li and li to ul
				liElement.appendChild(buttonElement);
				ulElement.appendChild(liElement);
			});

			contextMenu.appendChild(ulElement);

			// Append context menu to the document body
			document.body.appendChild(contextMenu);

			// Remove context menu when clicking outside
			document.addEventListener('click', function removeContextMenu(event) {
				if (!contextMenu.contains(event.target)) {
					contextMenu.remove();
					document.removeEventListener('click', removeContextMenu);
				}
			}, { once: true });
		};

		//
		// Handle rightclick on the background of the flowchart
		//
		$scope.openContextMenuBackground = function (evt) {
			// Remove any existing context menu to avoid duplication
			let existingMenu = document.getElementById('context-menu');
			if (existingMenu) {
				existingMenu.remove();
			}

			// Create the context menu container
			let contextMenu = document.createElement('div');
			contextMenu.setAttribute('id', 'context-menu');
			contextMenu.setAttribute('style', `position: fixed; top: ${evt.clientY}px; left: ${evt.clientX}px; display: block; z-index: 1000; background: white; border: 1px solid #ccc; box-shadow: 0 2px 10px rgba(0,0,0,0.2);`);

			// Create the <ul> element
			let ulElement = document.createElement('ul');
			ulElement.setAttribute('class', 'menu-list');
			ulElement.setAttribute('style', 'list-style-type: none; margin: 0;');

			// Definition of context menu options
			// Define context menu options common for all node types
			const addNewDevice = {
				name: ' Add Device',
				action: function () {
					$scope.$parent.addDevice();
				}
			};

			const addNewComputation = {
				name: ' Add Computation',
				action: function () {
					$scope.$parent.addComputation();
				}
			};

			const addNewStorage = {
				name: ' Add Storage',
				action: function () {
					$scope.$parent.addStorage();
				}
			};

			const addNewCommunication = {
				name: ' Add Communication',
				action: function () {
					$scope.$parent.addCommunication();
				}
			};

			let contextMenuOptions = [addNewDevice, addNewComputation, addNewStorage, addNewCommunication];


			// Create and append <li> elements for each context menu option
			contextMenuOptions.forEach(function (option) {
				let liElement = document.createElement('li');
				liElement.setAttribute('class', 'menu-item');

				// Create button element for the option
				let buttonElement = document.createElement('button');
				buttonElement.setAttribute('class', 'menu-button');
				buttonElement.textContent = option.name;

				// Add click event listener to execute the action
				buttonElement.addEventListener('click', function (event) {
					event.preventDefault(); // Prevent default link behavior
					option.action(); // Execute the action associated with the option
					contextMenu.remove(); // Remove context menu after action
				});

				// Append button to li and li to ul
				liElement.appendChild(buttonElement);
				ulElement.appendChild(liElement);
			});

			contextMenu.appendChild(ulElement);

			// Append context menu to the document body
			document.body.appendChild(contextMenu);

			// Remove context menu when clicking outside
			document.addEventListener('click', function removeContextMenu(event) {
				if (!contextMenu.contains(event.target)) {
					contextMenu.remove();
					document.removeEventListener('click', removeContextMenu);
				}
			}, { once: true });
		};

		// Creates the HTML form for the modification of a device
		function createDeviceForm(deviceName, deviceDescription) {
			// Create elements
			const container = document.createElement('div');
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
			h3.textContent = 'Modify Device';
			input1.placeholder = deviceName;
			input1.id = 'device-name-input';
			input1.type = 'text';
			input1.tabIndex = '1';
			input1.required = true;
			input1.autofocus = true;
			textarea.placeholder = deviceDescription;
			textarea.id = 'device-description-input';
			textarea.tabIndex = '2';
			textarea.required = true;
			submitButton.name = 'submit';
			submitButton.type = 'submit';
			submitButton.id = 'submit-button';
			submitButton.textContent = 'Submit';

			cancelButton.type = 'submit';
			cancelButton.formNoValidate = true;
			cancelButton.textContent = 'Cancel';
			cancelButton.onclick = function () {
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

		// Create a form to modify a new computation
		function createComputationForm(computationName, computationExecutionTime, computationVolumeOfData, computationDescription) {
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
			h3.textContent = 'Modify Computation';
			input1.placeholder = computationName;
			input1.id = 'computation-name-input';
			input1.type = 'text';
			input1.tabIndex = '1';
			input1.required = true;
			input1.autofocus = true;
			input2.placeholder = computationExecutionTime;
			input2.id = 'computation-extime-input';
			input2.type = 'text';
			input2.tabIndex = '2';
			input2.required = true;
			input3.placeholder = computationVolumeOfData;
			input3.id = 'computation-voldata-input';
			input3.type = 'text';
			input3.tabIndex = '3';
			input3.required = true;
			textarea.placeholder = computationDescription;
			textarea.id = 'computation-description-input';
			textarea.tabIndex = '4';
			textarea.required = true;
			submitButton.name = 'submit';
			submitButton.type = 'submit';
			submitButton.id = 'submit-button';
			submitButton.textContent = 'Submit';

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

		function createStorageForm(storageName, storageAvailableMemory, storageDescription){
			const container = document.createElement('div');
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
			h3.textContent = 'Modify Storage';
			input1.placeholder = storageName;
			input1.id = 'storage-name-input';
			input1.type = 'text';
			input1.tabIndex = '1';
			input1.required = true;
			input1.autofocus = true;
			input2.placeholder = storageAvailableMemory;
			input2.id = 'storage-avmemory-input';
			input2.type = 'text';
			input2.tabIndex = '2';
			input2.required = true;
			textarea.placeholder = storageDescription;
			textarea.id = 'storage-description-input';
			textarea.tabIndex = '4';
			textarea.required = true;
			submitButton.name = 'submit';
			submitButton.type = 'submit';
			submitButton.id = 'submit-button';
			submitButton.textContent = 'Submit';

			cancelButton.type = 'submit';
			cancelButton.formNoValidate = true;
			cancelButton.textContent = 'Cancel';
			cancelButton.onclick = function () {
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

		function createCommunicationForm(communicationName, communicationDescription) {
			// Create elements
			const container = document.createElement('div');
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
			h3.textContent = 'Modify Communication';
			input1.placeholder = communicationName;
			input1.id = 'communication-name-input';
			input1.type = 'text';
			input1.tabIndex = '1';
			input1.required = true;
			input1.autofocus = true;
			textarea.placeholder = communicationDescription;
			textarea.id = 'communication-description-input';
			textarea.tabIndex = '2';
			textarea.required = true;
			submitButton.name = 'submit';
			submitButton.type = 'submit';
			submitButton.id = 'submit-button';
			submitButton.textContent = 'Submit';

			cancelButton.type = 'submit';
			cancelButton.formNoValidate = true;
			cancelButton.textContent = 'Cancel';
			cancelButton.onclick = function () {
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
	}])
	;
