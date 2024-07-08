
//
// Global accessor.
//
var flowchart = {

};

// Module.
(function () {

	//
	// Width of a node.
	//
	flowchart.defaultNodeWidth = 250;
	flowchart.defaultNodeHeight = 90;

	//
	// Height of a connector in a node.
	//
	flowchart.connectorHeight = 35;
	flowchart.connectorWidth = 35;

	//
	// Compute the Y coordinate of a connector, given its index. 
	// Direction: x
	//
	flowchart.computeConnectorY = function (nodeHeight) {
		const result = nodeHeight / 2;
		return result
	}

	//
	// Compute the Y coordinate of a connector, given its index. 
	// Direction: y
	// Because we plan to use only one connector in the y direction, we will use 0 as the connectorIndex
	//
	flowchart.computeConnectorX = function (nodeWidth) {
		const result = nodeWidth / 2;
		return result
	}

	//
	// Compute the position of a connector in the graph when pressing the
	// connector to add a new connection.
	//
	flowchart.computeConnectorPos = function (node, connectorIndex, inputConnector) {

		result = {
			x: node.x() + (inputConnector ? 0 : node.width ? node.width() : flowchart.defaultNodeWidth),
			y: node.y() + flowchart.computeConnectorY(node.height()),
		};

		
		return result;
	};

	flowchart.computeConnectorPosReverse = function (node, connectorIndex, inputConnector) {

		result = {
			x: node.x() + flowchart.computeConnectorX(node.width()),
			y: node.y() + (inputConnector ? 0 : node.height ? node.height() : flowchart.defaultNodeHeight),
		};

		return result;
	};

	//
	// View model for a connector.
	//
	flowchart.ConnectorViewModel = function (connectorDataModel, x, y, parentNode) {

		this.data = connectorDataModel;
		this._parentNode = parentNode;
		this._x = x;
		this._y = y;

		//
		// The name of the connector.
		//
		this.name = function () {
			return this.data.name;
		}

		//
		// X coordinate of the connector.
		//
		this.x = function () {
			return this._x;
		};

		//
		// Y coordinate of the connector.
		//
		this.y = function () {
			return this._y;
		};

		//
		// The parent node that the connector is attached to.
		//
		this.parentNode = function () {
			return this._parentNode;
		};
	};

	//
	// Create view model for a list of data models.
	//
	var createConnectorsViewModel = function (connectorDataModels, x, y, parentNode) {
		const nodeWidth = parentNode['data']['width'];
		const nodeHeight = parentNode['data']['height'];
		var viewModels = [];

		if (connectorDataModels) {
			for (var i = 0; i < connectorDataModels.length; ++i) {
				const direction = connectorDataModels[i]['direction']
				if(direction === 'y') {
					var connectorViewModel =
						new flowchart.ConnectorViewModel(connectorDataModels[i], flowchart.computeConnectorX(nodeWidth), y, parentNode);
				} else {
					var connectorViewModel =
						new flowchart.ConnectorViewModel(connectorDataModels[i], x, flowchart.computeConnectorY(nodeHeight), parentNode);					
				}
				viewModels.push(connectorViewModel);
			}
		}

		return viewModels;
	};

	//
	// View model for a node.
	//
	flowchart.NodeViewModel = function (nodeDataModel) {

		this.data = nodeDataModel;

		// set the default width value of the node
		if (!this.data.width || this.data.width < 0) {
			this.data.width = flowchart.defaultNodeWidth;
		}

		if (!this.data.height || this.data.height < 0) {
			this.data.height = flowchart.defaultNodeHeight;
		}

		// Define coordinates of the input and output connectors
		const inputConnectorsX = 0;
		const inputConnectorsY = 0;

		const outputConnectorsX = this.data.width;
		const outputConnectorsY = this.data.height;

		this.inputConnectors = createConnectorsViewModel(this.data.inputConnectors, inputConnectorsX, inputConnectorsY, this);
		this.outputConnectors = createConnectorsViewModel(this.data.outputConnectors, outputConnectorsX, outputConnectorsY, this);

		// Set to true when the node is selected.
		this._selected = false;

		//
		// Name of the node.
		//
		this.name = function () {
			return this.data.name || "";
		};

		//
		// X coordinate of the node.
		//
		this.x = function () {
			return this.data.x;
		};

		//
		// Y coordinate of the node.
		//
		this.y = function () {
			return this.data.y;
		};

		//
		// Width of the node.
		//
		this.width = function () {
			return this.data.width;
		}

		// The type of then node (Device, Computation, Storage, ommunication)
		this.type = function () {
			return this.data.type;
		}
		//
		// Height of the node.
		//
		this.height = function () {
			return this.data.height;
		}

		// Gives the node a default image if none was provided
		this.image = function () {
			if (!this.data.image) {
				return '../assets/images/blank.svg';
			}
			return this.data.image;
		}

		// Changes the image of the node
		this.changeImage = function(newImageUrl) {
			console.log(`Changing image to: ${newImageUrl}`)
			this.data.image = newImageUrl;
		}

		this.id = function() {
			return this.data.id;
		}

		//
		// Select the node.
		//
		this.select = function () {
			this._selected = true;
		};

		//
		// Deselect the node.
		//
		this.deselect = function () {
			this._selected = false;
		};

		//
		// Toggle the selection state of the node.
		//
		this.toggleSelected = function () {
			this._selected = !this._selected;
		};

		//
		// Returns true if the node is selected.
		//
		this.selected = function () {
			return this._selected;
		};

		//
		// Internal function to add a connector.
		this._addConnector = function (connectorDataModel, x, connectorsDataModel, connectorsViewModel) {
			var connectorViewModel =
				new flowchart.ConnectorViewModel(connectorDataModel, x,
					flowchart.computeConnectorY(connectorsViewModel.length), this);

			connectorsDataModel.push(connectorDataModel);

			// Add to node's view model.
			connectorsViewModel.push(connectorViewModel);
		}

		//
		// Add an input connector to the node.
		//
		this.addInputConnector = function (connectorDataModel) {

			if (!this.data.inputConnectors) {
				this.data.inputConnectors = [];
			}
			this._addConnector(connectorDataModel, 0, this.data.inputConnectors, this.inputConnectors);
		};

		//
		// Add an ouput connector to the node.
		//
		this.addOutputConnector = function (connectorDataModel) {

			if (!this.data.outputConnectors) {
				this.data.outputConnectors = [];
			}
			this._addConnector(connectorDataModel, this.data.width, this.data.outputConnectors, this.outputConnectors);
		};
	};

	// 
	// Wrap the nodes data-model in a view-model.
	//
	var createNodesViewModel = function (nodesDataModel) {
		var nodesViewModel = [];

		if (nodesDataModel) {
			for (var i = 0; i < nodesDataModel.length; ++i) {
				nodesViewModel.push(new flowchart.NodeViewModel(nodesDataModel[i]));
			}
		}

		return nodesViewModel;
	};

	//
	// View model for a connection.
	//
	flowchart.ConnectionViewModel = function (connectionDataModel, sourceConnector, destConnector) {

		this.data = connectionDataModel;
		this.source = sourceConnector;
		this.dest = destConnector;

		// Set to true when the connection is selected.
		this._selected = false;

		this.name = function () {
			return this.data.name || "";
		}

		this.sourceCoordX = function () {
			return this.source.parentNode().x() + this.source.x();
		};

		this.sourceCoordY = function () {
			return this.source.parentNode().y() + this.source.y();
		};

		this.sourceCoord = function () {
			return {
				x: this.sourceCoordX(),
				y: this.sourceCoordY()
			};
		}

		this.sourceTangentX = function () {
			return flowchart.computeConnectionSourceTangentX(this.sourceCoord(), this.destCoord());
		};

		this.sourceTangentY = function () {
			return flowchart.computeConnectionSourceTangentY(this.sourceCoord(), this.destCoord());
		};

		this.destCoordX = function () {
			return this.dest.parentNode().x() + this.dest.x();
		};

		this.destCoordY = function () {
			return this.dest.parentNode().y() + this.dest.y();
		};

		this.destCoord = function () {
			return {
				x: this.destCoordX(),
				y: this.destCoordY()
			};
		}

		this.destTangentX = function () {
			return flowchart.computeConnectionDestTangentX(this.sourceCoord(), this.destCoord());
		};

		this.destTangentY = function () {
			return flowchart.computeConnectionDestTangentY(this.sourceCoord(), this.destCoord());
		};

		this.middleX = function (scale) {
			if (typeof (scale) == "undefined")
				scale = 0.5;
			return this.sourceCoordX() * (1 - scale) + this.destCoordX() * scale;
		};

		this.middleY = function (scale) {
			if (typeof (scale) == "undefined")
				scale = 0.5;
			return this.sourceCoordY() * (1 - scale) + this.destCoordY() * scale;
		};


		//
		// Select the connection.
		//
		this.select = function () {
			this._selected = true;
		};

		//
		// Deselect the connection.
		//
		this.deselect = function () {
			this._selected = false;
		};

		//
		// Toggle the selection state of the connection.
		//
		this.toggleSelected = function () {
			this._selected = !this._selected;
		};

		//
		// Returns true if the connection is selected.
		//
		this.selected = function () {
			return this._selected;
		};
	};

	//
	// Helper function.
	//
	var computeConnectionTangentOffset = function (pt1, pt2) {

		return (pt2.x - pt1.x) / 2;
	}

	//
	// Compute the tangent for the bezier curve.
	//
	flowchart.computeConnectionSourceTangentX = function (pt1, pt2) {

		return pt1.x + computeConnectionTangentOffset(pt1, pt2);
	};

	//
	// Compute the tangent for the bezier curve.
	//
	flowchart.computeConnectionSourceTangentY = function (pt1, pt2) {

		return pt1.y;
	};

	//
	// Compute the tangent for the bezier curve.
	//
	flowchart.computeConnectionSourceTangent = function (pt1, pt2) {
		return {
			x: flowchart.computeConnectionSourceTangentX(pt1, pt2),
			y: flowchart.computeConnectionSourceTangentY(pt1, pt2),
		};
	};

	//
	// Compute the tangent for the bezier curve.
	//
	flowchart.computeConnectionDestTangentX = function (pt1, pt2) {

		return pt2.x - computeConnectionTangentOffset(pt1, pt2);
	};

	//
	// Compute the tangent for the bezier curve.
	//
	flowchart.computeConnectionDestTangentY = function (pt1, pt2) {

		return pt2.y;
	};

	//
	// Compute the tangent for the bezier curve.
	//
	flowchart.computeConnectionDestTangent = function (pt1, pt2) {
		return {
			x: flowchart.computeConnectionDestTangentX(pt1, pt2),
			y: flowchart.computeConnectionDestTangentY(pt1, pt2),
		};
	};

	//
	// View model for the chart.
	//
	flowchart.ChartViewModel = function (chartDataModel) {

		//
		// Find a specific node within the chart.
		//
		this.findNode = function (nodeID) {

			for (var i = 0; i < this.nodes.length; ++i) {
				var node = this.nodes[i];
				if (node.data.id == nodeID) {
					return node;
				}
			}

			throw new Error("Failed to find node " + nodeID);
		};

		//
		// Find a specific input connector within the chart.
		//
		this.findInputConnector = function (nodeID, connectorIndex) {

			var node = this.findNode(nodeID);

			if (!node.inputConnectors || node.inputConnectors.length <= connectorIndex) {
				throw new Error("Node " + nodeID + " has invalid input connectors.");
			}

			return node.inputConnectors[connectorIndex];
		};

		//
		// Find a specific output connector within the chart.
		//
		this.findOutputConnector = function (nodeID, connectorIndex) {

			var node = this.findNode(nodeID);

			if (!node.outputConnectors || node.outputConnectors.length <= connectorIndex) {
				throw new Error("Node " + nodeID + " has invalid output connectors.");
			}

			return node.outputConnectors[connectorIndex];
		};

		//
		// Create a view model for connection from the data model.
		//
		this._createConnectionViewModel = function (connectionDataModel) {

			var sourceConnector = this.findOutputConnector(connectionDataModel.source.nodeID, connectionDataModel.source.connectorIndex);
			var destConnector = this.findInputConnector(connectionDataModel.dest.nodeID, connectionDataModel.dest.connectorIndex);
			return new flowchart.ConnectionViewModel(connectionDataModel, sourceConnector, destConnector);
		}

		// 
		// Wrap the connections data-model in a view-model.
		//
		this._createConnectionsViewModel = function (connectionsDataModel) {

			var connectionsViewModel = [];

			if (connectionsDataModel) {
				for (var i = 0; i < connectionsDataModel.length; ++i) {
					connectionsViewModel.push(this._createConnectionViewModel(connectionsDataModel[i]));
				}
			}

			return connectionsViewModel;
		};

		// Reference to the underlying data.
		this.data = chartDataModel;

		// Create a view-model for nodes.
		this.nodes = createNodesViewModel(this.data.nodes);

		// Create a view-model for connections.
		this.connections = this._createConnectionsViewModel(this.data.connections);

		//
		// Create a view model for a new connection.
		//
		this.createNewConnection = function (startConnector, endConnector) {

			var connectionsDataModel = this.data.connections;
			if (!connectionsDataModel) {
				connectionsDataModel = this.data.connections = [];
			}

			var connectionsViewModel = this.connections;
			if (!connectionsViewModel) {
				connectionsViewModel = this.connections = [];
			}

			var startNode = startConnector.parentNode();
			var startConnectorIndex = startNode.outputConnectors.indexOf(startConnector);
			var startConnectorType = 'output';
			if (startConnectorIndex == -1) {
				startConnectorIndex = startNode.inputConnectors.indexOf(startConnector);
				startConnectorType = 'input';
				if (startConnectorIndex == -1) {
					throw new Error("Failed to find source connector within either inputConnectors or outputConnectors of source node.");
				}
			}

			var endNode = endConnector.parentNode();
			var endConnectorIndex = endNode.inputConnectors.indexOf(endConnector);
			var endConnectorType = 'input';
			if (endConnectorIndex == -1) {
				endConnectorIndex = endNode.outputConnectors.indexOf(endConnector);
				endConnectorType = 'output';
				if (endConnectorIndex == -1) {
					throw new Error("Failed to find dest connector within inputConnectors or outputConnectors of dest node.");
				}
			}

			if (startConnectorType == endConnectorType) {
				throw new Error("Failed to create connection. Only output to input connections are allowed.")
			}

			if (startNode == endNode) {
				throw new Error("Failed to create connection. Cannot link a node with itself.")
			}

			var startNode = {
				nodeID: startNode.data.id,
				connectorIndex: startConnectorIndex,
			}

			var endNode = {
				nodeID: endNode.data.id,
				connectorIndex: endConnectorIndex,
			}

			var connectionDataModel = {
				source: startConnectorType == 'output' ? startNode : endNode,
				dest: startConnectorType == 'output' ? endNode : startNode,
			};
			connectionsDataModel.push(connectionDataModel);

			var outputConnector = startConnectorType == 'output' ? startConnector : endConnector;
			var inputConnector = startConnectorType == 'output' ? endConnector : startConnector;

			var connectionViewModel = new flowchart.ConnectionViewModel(connectionDataModel, outputConnector, inputConnector);
			connectionsViewModel.push(connectionViewModel);
		};

		//
		// Add a node to the view model.
		//
		this.addNode = function (nodeDataModel) {
			if (!this.data.nodes) {
				this.data.nodes = [];
			}

			// 
			// Update the data model.
			//
			this.data.nodes.push(nodeDataModel);

			// 
			// Update the view model.
			//
			this.nodes.push(new flowchart.NodeViewModel(nodeDataModel));
		}

		this.selectAll = function () {

			var nodes = this.nodes;
			for (var i = 0; i < nodes.length; ++i) {
				var node = nodes[i];
				node.select();
			}

			var connections = this.connections;
			for (var i = 0; i < connections.length; ++i) {
				var connection = connections[i];
				connection.select();
			}
		}

		//
		// Deselect all nodes and connections in the chart.
		//
		this.deselectAll = function () {

			var nodes = this.nodes;
			for (var i = 0; i < nodes.length; ++i) {
				var node = nodes[i];
				node.deselect();
			}

			var connections = this.connections;
			for (var i = 0; i < connections.length; ++i) {
				var connection = connections[i];
				connection.deselect();
			}
		};

		//
		// Update the location of the node and its connectors.
		//
		this.updateSelectedNodesLocation = function (deltaX, deltaY) {

			var selectedNodes = this.getSelectedNodes();

			for (var i = 0; i < selectedNodes.length; ++i) {
				var node = selectedNodes[i];
				node.data.x += deltaX;
				node.data.y += deltaY;
			}
		};

		//
		// Handle mouse click on a particular node.
		//
		this.handleNodeClicked = function (node, ctrlKey) {

			if (ctrlKey) {
				node.toggleSelected();
			}
			else {
				this.deselectAll();
				node.select();
			}

			// Move node to the end of the list so it is rendered after all the other.
			// This is the way Z-order is done in SVG.

			var nodeIndex = this.nodes.indexOf(node);
			if (nodeIndex == -1) {
				throw new Error("Failed to find node in view model!");
			}
			this.nodes.splice(nodeIndex, 1);
			this.nodes.push(node);
		};

		//
		// Handle mouse down on a connection.
		//
		this.handleConnectionMouseDown = function (connection, ctrlKey) {

			if (ctrlKey) {
				connection.toggleSelected();
			}
			else {
				this.deselectAll();
				connection.select();
			}
		};

		//
		// Delete all nodes and connections that are selected.
		//
		this.deleteSelected = function () {

			var newNodeViewModels = [];
			var newNodeDataModels = [];

			var deletedNodeIds = [];

			//
			// Sort nodes into:
			//		nodes to keep and 
			//		nodes to delete.
			//

			for (var nodeIndex = 0; nodeIndex < this.nodes.length; ++nodeIndex) {

				var node = this.nodes[nodeIndex];
				if (!node.selected()) {
					// Only retain non-selected nodes.
					newNodeViewModels.push(node);
					newNodeDataModels.push(node.data);
				}
				else {
					// Keep track of nodes that were deleted, so their connections can also
					// be deleted.
					deletedNodeIds.push(node.data.id);
				}
			}

			var newConnectionViewModels = [];
			var newConnectionDataModels = [];

			//
			// Remove connections that are selected.
			// Also remove connections for nodes that have been deleted.
			//
			for (var connectionIndex = 0; connectionIndex < this.connections.length; ++connectionIndex) {

				var connection = this.connections[connectionIndex];
				if (!connection.selected() &&
					deletedNodeIds.indexOf(connection.data.source.nodeID) === -1 &&
					deletedNodeIds.indexOf(connection.data.dest.nodeID) === -1) {
					//
					// The nodes this connection is attached to, where not deleted,
					// so keep the connection.
					//
					newConnectionViewModels.push(connection);
					newConnectionDataModels.push(connection.data);
				}
			}

			//
			// Update nodes and connections.
			//
			this.nodes = newNodeViewModels;
			this.data.nodes = newNodeDataModels;
			this.connections = newConnectionViewModels;
			this.data.connections = newConnectionDataModels;
		};

		this.changeIcon = function(node) {

			/*
				Create:
				<!-- Modal for changing the icon of a node -->
				<div class="modal fade" id="changeIconModal" tabindex="-1" aria-labelledby="changeIconModalLabel" aria-hidden="true">
					<div class="modal-dialog">
						<div class="modal-content">
							<div class="modal-header">
								<h1 class="modal-title fs-5" id="changeIconModalLabel">Change Icon</h1>
								<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
							</div>
							<div class="modal-body">
								<div class="modal-body">
									<div class="container d-flex flex-wrap overflow-y-scroll icons-container justify-content-center align-items-start">
										<div class="card">
											<div class="card-body d-flex flex-column">
												<img src="../assets/images/blank.svg" alt="">
												<input type="radio" class="btn-check" name="options-base" id="option1" autocomplete="off" checked>
												<label class="btn my-1" for="option1">Choose</label>
											</div>
										</div>
										<div class="card">
											<div class="card-body d-flex flex-column">
												<img src=.. alt="">
												<input type="radio" class="btn-check" name="options-base" id="option2" autocomplete="off">
												<label class="btn my-1" for="option2">Choose</label>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			*/

			// <div class="modal fade" id="changeIconModal" tabindex="-1" aria-labelledby="changeIconModalLabel" aria-hidden="true">
			const modal = document.createElement('div');
			modal.className = 'modal fade';
			modal.id = 'changeIconModal';
			modal.tabIndex = '-1';
			modal.setAttribute('aria-labelledby', 'changeIconModalLabel');
			modal.setAttribute('aria-hidden', 'true');

			// <div class="modal-dialog">
			const modalDialog = document.createElement('div');
			modalDialog.className = 'modal-dialog';
			modal.appendChild(modalDialog);

			// <div class="modal-content">
			const modalContent = document.createElement('div');
			modalContent.className = 'modal-content';

			// <div class="modal-header">
			const modalHeader = document.createElement('div');
			modalHeader.className = 'modal-header';

			// <h1 class="modal-title fs-5" id="changeIconModalLabel">Change Icon</h1>
			const h1 = document.createElement('h1');
			h1.className = 'modal-title fs-5';
			h1.id = 'changeIconModalLabel';
			h1.textContent = 'Change Icon';
			modalHeader.appendChild(h1);

			// <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
			const closeButton = document.createElement('button');
			closeButton.type = 'button';
			closeButton.className = 'btn-close';
			closeButton.setAttribute('data-bs-dismiss', 'modal');
			closeButton.setAttribute('aria-label', 'Close');
			modalHeader.appendChild(closeButton);

			// <div class="modal-body">
			const modalBody = document.createElement('div');
			modalBody.className = 'modal-body';

			// <div class="container d-flex flex-wrap overflow-y-scroll icons-container justify-content-center align-items-start">
			const container = document.createElement('div');
			container.className = 'container d-flex flex-wrap overflow-y-scroll icons-container justify-content-center align-items-start';
			modalBody.appendChild(container);

			// <div class="card">
			const card = document.createElement('div');
			card.className = 'card';
			container.appendChild(card);

			// <div class="card-body d-flex flex-column">
			const cardBody = document.createElement('div');
			cardBody.className = 'card-body d-flex flex-column';
			card.appendChild(cardBody);

			// <img src="../assets/images/blank.svg" alt="">
			const img = document.createElement('img');
			img.src = '../assets/images/blank.svg';
			img.alt = '';
			cardBody.appendChild(img);

			// <input type="radio" class="btn-check" name="options-base" id="option1" autocomplete="off" checked>
			const input = document.createElement('input');
			input.type = 'radio';
			input.className = 'btn-check';
			input.name = 'options-base';
			input.id = 'option1';
			input.setAttribute('autocomplete', 'off');
			input.checked = true;
			cardBody.appendChild(input);

			// <label class="btn my-1" for="option1">Choose</label>
			const label = document.createElement('label');
			label.className = 'btn my-1';
			label.setAttribute('for', 'option1');
			label.textContent = 'Choose';
			cardBody.appendChild(label);

			/*
			<div class="card">
				<div class="card-body d-flex flex-column">
					<img src="../assets/images/camera.svg" alt="">
					<input type="radio" class="btn-check btn-primary" name="options-base" id="option2" autocomplete="off">
					<label class="btn my-1" for="option2">Choose</label>
				</div>
			</div>
			*/
			const card2 = document.createElement('div');
			card2.className = 'card';
			container.appendChild(card2);

			const cardBody2 = document.createElement('div');
			cardBody2.className = 'card-body d-flex flex-column';
			card2.appendChild(cardBody2);

			const img2 = document.createElement('img');
			img2.src = '../assets/images/camera.svg';
			img2.alt = '';
			cardBody2.appendChild(img2);

			const input2 = document.createElement('input');
			input2.type = 'radio';
			input2.className = 'btn-check';
			input2.name = 'options-base';
			input2.id = 'option2';
			input2.setAttribute('autocomplete', 'off');
			cardBody2.appendChild(input2);

			const label2 = document.createElement('label');
			label2.className = 'btn my-1';
			label2.setAttribute('for', 'option2');
			label2.textContent = 'Choose';
			cardBody2.appendChild(label2);

			// Card3 img.src=../assets/images/database.svg
			const card3 = document.createElement('div');
			card3.className = 'card';
			container.appendChild(card3);

			const cardBody3 = document.createElement('div');
			cardBody3.className = 'card-body d-flex flex-column';
			card3.appendChild(cardBody3);

			const img3 = document.createElement('img');
			img3.src = '../assets/images/database.svg';
			img3.alt = '';
			cardBody3.appendChild(img3);

			const input3 = document.createElement('input');
			input3.type = 'radio';
			input3.className = 'btn-check';
			input3.name = 'options-base';
			input3.id = 'option3';
			input3.setAttribute('autocomplete', 'off');
			cardBody3.appendChild(input3);

			const label3 = document.createElement('label');
			label3.className = 'btn my-1';
			label3.setAttribute('for', 'option3');
			label3.textContent = 'Choose';
			cardBody3.appendChild(label3);

			// Card4 src = ../assets/images/engineer.svg
			const card4 = document.createElement('div');
			card4.className = 'card';
			container.appendChild(card4);

			const cardBody4 = document.createElement('div');
			cardBody4.className = 'card-body d-flex flex-column';
			card4.appendChild(cardBody4);

			const img4 = document.createElement('img');
			img4.src = '../assets/images/engineer.svg';
			img4.alt = '';
			cardBody4.appendChild(img4);

			const input4 = document.createElement('input');
			input4.type = 'radio';
			input4.className = 'btn-check';
			input4.name = 'options-base';
			input4.id = 'option4';
			input4.setAttribute('autocomplete', 'off');
			cardBody4.appendChild(input4);

			const label4 = document.createElement('label');
			label4.className = 'btn my-1';
			label4.setAttribute('for', 'option4');
			label4.textContent = 'Choose';
			cardBody4.appendChild(label4);

			// Card5 src = ../assets/images/machine_learning.svg
			const card5 = document.createElement('div');
			card5.className = 'card';	
			container.appendChild(card5);

			const cardBody5 = document.createElement('div');
			cardBody5.className = 'card-body d-flex flex-column';
			card5.appendChild(cardBody5);
			
			const img5 = document.createElement('img');
			img5.src = '../assets/images/machine_learning.svg';
			img5.alt = '';
			cardBody5.appendChild(img5);

			const input5 = document.createElement('input');
			input5.type = 'radio';
			input5.className = 'btn-check';
			input5.name = 'options-base';
			input5.id = 'option5';
			input5.setAttribute('autocomplete', 'off');
			cardBody5.appendChild(input5);

			const label5 = document.createElement('label');
			label5.className = 'btn my-1';
			label5.setAttribute('for', 'option5');
			label5.textContent = 'Choose';
			cardBody5.appendChild(label5);

			// Card6 src = ../assets/images/modular_belt.svg
			const card6 = document.createElement('div');
			card6.className = 'card';
			container.appendChild(card6);
			
			const cardBody6 = document.createElement('div');
			cardBody6.className = 'card-body d-flex flex-column';
			card6.appendChild(cardBody6);

			const img6 = document.createElement('img');
			img6.src = '../assets/images/modular_belt.svg';
			img6.alt = '';
			cardBody6.appendChild(img6);

			const input6 = document.createElement('input');
			input6.type = 'radio';
			input6.className = 'btn-check';
			input6.name = 'options-base';
			input6.id = 'option6';
			input6.setAttribute('autocomplete', 'off');
			cardBody6.appendChild(input6);

			const label6 = document.createElement('label');
			label6.className = 'btn my-1';
			label6.setAttribute('for', 'option6');
			label6.textContent = 'Choose';
			cardBody6.appendChild(label6);

			// Card7 src = ../assets/images/router.svg
			const card7 = document.createElement('div');
			card7.className = 'card';
			container.appendChild(card7);

			const cardBody7 = document.createElement('div');
			cardBody7.className = 'card-body d-flex flex-column';
			card7.appendChild(cardBody7);

			const img7 = document.createElement('img');
			img7.src = '../assets/images/router.svg';
			img7.alt = '';
			cardBody7.appendChild(img7);

			const input7 = document.createElement('input');
			input7.type = 'radio';
			input7.className = 'btn-check';
			input7.name = 'options-base';
			input7.id = 'option7';
			input7.setAttribute('autocomplete', 'off');
			cardBody7.appendChild(input7);

			const label7 = document.createElement('label');
			label7.className = 'btn my-1';
			label7.setAttribute('for', 'option7');
			label7.textContent = 'Choose';
			cardBody7.appendChild(label7);

			// Append elements
			modalContent.appendChild(modalHeader);
			modalContent.appendChild(modalBody);
			modalDialog.appendChild(modalContent);
			modal.appendChild(modalDialog);

			document.body.appendChild(modal);
			const modalInstance = new bootstrap.Modal(modal);
			modalInstance.show();

			// onclick events for all the cards
			input.onclick = function() {
				node.changeImage(img.src);
				modalInstance.hide();
				document.body.removeChild(modal);
			}

			input2.onclick = function() {
				node.changeImage(img2.src);
				modalInstance.hide();
				document.body.removeChild(modal);
			}

			
		}

		this.modifyName = function() {
			for (var connectionIndex = 0; connectionIndex < this.connections.length; ++connectionIndex) {

				let connection = this.connections[connectionIndex];

				if (connection.selected()) {
					const newName = prompt('Insert the new connection name', connection.data.name);
					connection.data.name = newName;
				}
			}
		}

		//
		// Select nodes and connections that fall within the selection rect.
		//
		this.applySelectionRect = function (selectionRect) {

			this.deselectAll();

			for (var i = 0; i < this.nodes.length; ++i) {
				var node = this.nodes[i];
				if (node.x() >= selectionRect.x &&
					node.y() >= selectionRect.y &&
					node.x() + node.width() <= selectionRect.x + selectionRect.width &&
					node.y() + node.height() <= selectionRect.y + selectionRect.height) {
					// Select nodes that are within the selection rect.
					node.select();
				}
			}

			for (var i = 0; i < this.connections.length; ++i) {
				var connection = this.connections[i];
				if (connection.source.parentNode().selected() &&
					connection.dest.parentNode().selected()) {
					// Select the connection if both its parent nodes are selected.
					connection.select();
				}
			}

		};

		//
		// Get the array of nodes that are currently selected.
		//
		this.getSelectedNodes = function () {
			var selectedNodes = [];

			for (var i = 0; i < this.nodes.length; ++i) {
				var node = this.nodes[i];
				if (node.selected()) {
					selectedNodes.push(node);
				}
			}

			return selectedNodes;
		};

		//
		// Get the array of connections that are currently selected.
		//
		this.getSelectedConnections = function () {
			var selectedConnections = [];

			for (var i = 0; i < this.connections.length; ++i) {
				var connection = this.connections[i];
				if (connection.selected()) {
					selectedConnections.push(connection);
				}
			}

			return selectedConnections;
		};


	};

})();
