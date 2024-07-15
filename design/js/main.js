let nextNodeId = 4;

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
            image: "../assets/images/database.svg",
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

// The list of possible numerical constraints
const numericalConstraints = [
    'Execution Time',
    'Volume of Data'
];

const numericalOperators = [
    '==',
    '<',
    '>',
    '<=',
    '>='
];

// The list of possible categorical constraints and the options for each constraint
const categoricalConstraints = [
    {
        name: 'Type of Database',
        options: [
            'SQL',
            'NoSQL',
            'Graph'
        ]
    },
    {
        name: 'Network Protocol',
        options: [
            'HTTP',
            'FTP',
            'TCP'
        ]
    }
];

function createAddNodeModal() {
    // Create a blank node that will be modelled by the modal
    let node = {
        name: '',
        type: '',
        id: nextNodeId,
        description: '',
        quantity: 0,
        parameters: [

        ],
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
    };
    /*
    <!-- Modal -->
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
                            <!-- Node Name -->
                            <div class="form-floating mb-3">
                                <input type="text" class="form-control" id="floatingInputName" placeholder="Name">
                                <label for="floatingInputName">Node Name</label>
                            </div>

                            <!-- Node Type -->
                            <div class="input-group mb-3">
                                <label class="input-group-text" for="inputGroupNodeType">Type</label>
                                <select class="form-select" id="inputGroupNodeType">
                                    <option selected>Device</option>
                                    <option value="1">Computation</option>
                                    <option value="2">Storage</option>
                                    <option value="3">Communication</option>
                                </select>
                            </div>

                            <!-- Node Description-->
                            <div class="form-floating">
                                <textarea class="form-control" placeholder="Describe yout node" id="floatingTextareaDescription" style="height: 100px"></textarea>
                                <label for="floatingTextareaDescription">Description</label>
                            </div>

                            <div class="form-floating mb-3">
                                <input type="text" class="form-control" id="floatingInputQuantity" placeholder="Quantity">
                                <label for="floatingInputQuantity">Node Quantity</label>
                            </div>
                        </div>
                        <div class="col">
                            <h4 class="modal-title fs-5">Current Costraints</h4>
                            <span class="badge rounded-pill text-bg-primary">
                                <div class="container d-flex justify-content-center align-items-center m-0 p-0">
                                    <span>Execution Time <= 20ms</span>
                                    <button type="button" class="btn-close btn-close-white" aria-label="Close" style="--bs-btn-font-size: .25rem;"></button>
                                </div>
                            </span>
                            
                            <span class="badge rounded-pill text-bg-primary">
                                <div class="container d-flex justify-content-center align-items-center m-0 p-0">
                                    <span>Volume of Data <= 200mb</span>
                                    <button type="button" class="btn-close btn-close-white" aria-label="Close" style="--bs-btn-font-size: .25rem;"></button>
                                </div>
                            </span>
                            <span class="badge rounded-pill text-bg-primary">
                                <div class="container d-flex justify-content-center align-items-center m-0 p-0">
                                    <a>Add Numerical Costraint</a>
                                </div>
                            </span>
                            <span class="badge rounded-pill text-bg-primary">
                                <div class="container d-flex justify-content-center align-items-center m-0 p-0">
                                    <a>Add Categorical Costraint</a>
                                </div>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary">Save changes</button>
                </div>
            </div>
        </div>
    </div>
    */
    let modal = document.createElement('div');
    modal.classList.add('modal', 'fade');
    modal.id = 'addNodeModal';
    modal.tabIndex = -1;
    modal.setAttribute('aria-labelledby', 'addNodeModalLabel');
    modal.setAttribute('aria-hidden', 'true');

    let modalDialog = document.createElement('div');
    modalDialog.classList.add('modal-dialog', 'modal-dialog-centered', 'modal-xl');

    modal.appendChild(modalDialog);

    let modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    modalDialog.appendChild(modalContent);

    let modalHeader = document.createElement('div');
    modalHeader.classList.add('modal-header');

    modalContent.appendChild(modalHeader);

    let modalTitle = document.createElement('h1');
    modalTitle.classList.add('modal-title', 'fs-5');
    modalTitle.id = 'addNodeModalLabel';
    modalTitle.textContent = 'Create new node';

    modalHeader.appendChild(modalTitle);

    let modalButton = document.createElement('button');
    modalButton.type = 'button';
    modalButton.classList.add('btn-close');
    modalButton.setAttribute('data-bs-dismiss', 'modal');
    modalButton.setAttribute('aria-label', 'Close');

    modalHeader.appendChild(modalButton);

    let modalBody = document.createElement('div');
    modalBody.classList.add('modal-body');

    modalContent.appendChild(modalBody);

    let row = document.createElement('div');
    row.classList.add('row');

    modalBody.appendChild(row);

    let col1 = document.createElement('div');
    col1.classList.add('col');

    row.appendChild(col1);

    let h4 = document.createElement('h4');
    h4.textContent = 'Node Informations';

    col1.appendChild(h4);

    let formFloating1 = document.createElement('div');
    formFloating1.classList.add('form-floating', 'mb-3');

    col1.appendChild(formFloating1);

    let input1 = document.createElement('input');
    input1.type = 'text';
    input1.classList.add('form-control');
    input1.id = 'floatingInputName';
    input1.placeholder = 'Name';

    formFloating1.appendChild(input1);

    let label1 = document.createElement('label');
    label1.setAttribute('for', 'floatingInputName');
    label1.textContent = 'Node Name';

    formFloating1.appendChild(label1);

    let inputGroup = document.createElement('div');
    inputGroup.classList.add('input-group', 'mb-3');

    col1.appendChild(inputGroup);

    let label2 = document.createElement('label');
    label2.classList.add('input-group-text');
    label2.setAttribute('for', 'inputGroupNodeType');
    label2.textContent = 'Type';

    inputGroup.appendChild(label2);

    let select = document.createElement('select');
    select.classList.add('form-select');
    select.id = 'inputGroupNodeType';

    inputGroup.appendChild(select);

    let option1 = document.createElement('option');
    option1.selected = true;
    option1.textContent = 'Device';

    select.appendChild(option1);

    let option2 = document.createElement('option');
    option2.value = 'Computation';
    option2.textContent = 'Computation';

    select.appendChild(option2);

    let option3 = document.createElement('option');
    option3.value = 'Storage';
    option3.textContent = 'Storage';

    select.appendChild(option3);

    let option4 = document.createElement('option');
    option4.value = 'Communication';
    option4.textContent = 'Communication';

    select.appendChild(option4);

    let formFloating2 = document.createElement('div');
    formFloating2.classList.add('form-floating');

    col1.appendChild(formFloating2);

    let textarea = document.createElement('textarea');
    textarea.classList.add('form-control', 'mb-3');
    textarea.placeholder = 'Describe yout node';
    textarea.id = 'floatingTextareaDescription';
    textarea.style.height = '100px';

    formFloating2.appendChild(textarea);

    let label3 = document.createElement('label');
    label3.setAttribute('for', 'floatingTextareaDescription');
    label3.textContent = 'Description';

    formFloating2.appendChild(label3);

    let formFloating3 = document.createElement('div');
    formFloating3.classList.add('form-floating', 'mb-3');

    col1.appendChild(formFloating3);

    let input2 = document.createElement('input');
    input2.type = 'text';
    input2.classList.add('form-control');
    input2.id = 'floatingInputQuantity';
    input2.placeholder = 'Quantity';

    formFloating3.appendChild(input2);

    let label4 = document.createElement('label');
    label4.setAttribute('for', 'floatingInputQuantity');
    label4.textContent = 'Node Quantity';

    formFloating3.appendChild(label4);

    let col2 = document.createElement('div');
    col2.classList.add('col');

    row.appendChild(col2);

    let h42 = document.createElement('h4');
    h42.classList.add('modal-title', 'fs-5');
    h42.textContent = 'Current Costraints';

    col2.appendChild(h42);

    const constaintsContainer = document.createElement('div');
    col2.appendChild(constaintsContainer);

    let span3 = document.createElement('span');
    span3.classList.add('badge', 'rounded-pill', 'text-bg-primary');

    col2.appendChild(span3);

    let container3 = document.createElement('div');
    container3.classList.add('container', 'd-flex', 'justify-content-center', 'align-items-center', 'm-0', 'p-0');

    span3.appendChild(container3);

    let a1 = document.createElement('a');
    a1.textContent = 'Add Numerical Costraint';
    a1.onclick = function () {
        createAddNumericalCostraintModal(node, constaintsContainer);
    }

    container3.appendChild(a1);

    let span4 = document.createElement('span');
    span4.classList.add('badge', 'rounded-pill', 'text-bg-primary');

    col2.appendChild(span4);

    let container4 = document.createElement('div');
    container4.classList.add('container', 'd-flex', 'justify-content-center', 'align-items-center', 'm-0', 'p-0');

    span4.appendChild(container4);

    let a2 = document.createElement('a');
    a2.textContent = 'Add Categorical Costraint';
    a2.onclick = function () {
        createAddCategoricalCostraintModal(node, constaintsContainer);
    }

    container4.appendChild(a2);

    let modalFooter = document.createElement('div');
    modalFooter.classList.add('modal-footer');

    modalContent.appendChild(modalFooter);

    let buttonClose = createButtonClose();

    modalFooter.appendChild(buttonClose);

    let buttonSave = createButtonSave('Create Node');

    modalFooter.appendChild(buttonSave);

    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();

    buttonSave.onclick = function () {
        saveNewNode(node, input1, select, textarea, input2);

        // Close the modal
        closeModal(modalInstance, modal);
    }

}

function createNewBadge(node, costraint, appendTo) {
    // Add a badge to the constraints shown in the modal
    let span = document.createElement('span');
    span.classList.add('badge', 'rounded-pill', 'text-bg-primary');

    let container = document.createElement('div');
    container.classList.add('container', 'd-flex', 'justify-content-center', 'align-items-center', 'm-0', 'p-0');

    span.appendChild(container);

    let spanText = document.createElement('span');
    spanText.textContent = costraint.name + ' == ' + costraint.value;

    container.appendChild(spanText);

    let button = document.createElement('button');
    button.type = 'button';
    button.classList.add('btn-close', 'btn-close-white');
    button.setAttribute('aria-label', 'Close');
    button.style = '--bs-btn-font-size: .25rem;';

    container.appendChild(button);

    button.onclick = function () {
        // If the x button is clicked, remove the constraint from the node and from the appendTo element
        const indexOfCostraint = node.parameters.indexOf(costraint);
        node.parameters.splice(indexOfCostraint, 1);
        appendTo.removeChild(span);
    }

    return span;
}

function saveNewNode(node, input1, select, textarea, input2) {
    // Set the node values to the values in the modal
    node.name = input1.value;
    node.type = select.value;
    node.description = textarea.value;
    node.quantity = input2.value;

    // Increment the nextNodeID
    nextNodeID++;

    $scope.chartDataModel.addNode(node);
}

function closeModal(modalInstance, modal) {
    modalInstance.hide();
    document.body.removeChild(modal);
}

function createAddNumericalCostraintModal(node, appendTo) {
    /*
        Create:
        <!-- Modal -->
        <div class="modal fade" id="addNumericalCostraintModal" tabindex="-1" aria-labelledby="addNumericalCostraintModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="addNumericalCostraintModalLabel">Add Numerical Costraint</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <!-- Costraint Name -->
                        <div class="col-6">
                            <div class="input-group mb-3">
                                <select class="form-select" id="inputGroupCostraintName">
                                    <option selected>Execution Time</option>
                                    <option value="1">Volume of Data</option>
                                </select>
                            </div>
                        </div>
                        <!-- Costraint Type -->
                        <div class="col-3">
                            <div class="input-group mb-3">
                                <select class="form-select" id="inputGroupCostraintName">
                                    <option selected>==</option>
                                    <option value="1"><</option>
                                    <option value="1">></option>
                                    <option value="1"><=</option>
                                    <option value="1">>=</option>
                                </select>
                            </div>
                        </div>
                        <!-- Costraint Value -->
                        <div class="col-3">
                            <input type="text" class="form-control" placeholder="Value" aria-label="Value">
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary">Add Costraint</button>
                </div>
                </div>
            </div>
        </div>
        */
    let modal = document.createElement('div');
    modal.classList.add('modal', 'fade');
    modal.id = 'addNumericalCostraintModal';
    modal.tabIndex = -1;
    modal.setAttribute('aria-labelledby', 'addNumericalCostraintModalLabel');
    modal.setAttribute('aria-hidden', 'true');

    let modalDialog = document.createElement('div');
    modalDialog.classList.add('modal-dialog', 'modal-dialog-centered');

    modal.appendChild(modalDialog);

    let modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    modalDialog.appendChild(modalContent);

    let modalHeader = document.createElement('div');
    modalHeader.classList.add('modal-header');

    modalContent.appendChild(modalHeader);

    let modalTitle = document.createElement('h1');
    modalTitle.classList.add('modal-title', 'fs-5');
    modalTitle.id = 'addNumericalCostraintModalLabel';
    modalTitle.textContent = 'Add Numerical Costraint';

    modalHeader.appendChild(modalTitle);

    let modalButton = document.createElement('button');
    modalButton.type = 'button';
    modalButton.classList.add('btn-close');
    modalButton.setAttribute('data-bs-dismiss', 'modal');
    modalButton.setAttribute('aria-label', 'Close');

    modalHeader.appendChild(modalButton);

    let modalBody = document.createElement('div');
    modalBody.classList.add('modal-body');

    modalContent.appendChild(modalBody);

    let row = document.createElement('div');
    row.classList.add('row');

    modalBody.appendChild(row);

    let col1 = document.createElement('div');
    col1.classList.add('col-6');

    row.appendChild(col1);

    let inputGroup1 = document.createElement('div');
    inputGroup1.classList.add('input-group', 'mb-3');

    col1.appendChild(inputGroup1);

    let select1 = document.createElement('select');
    select1.classList.add('form-select');
    select1.id = 'inputGroupCostraintName';

    inputGroup1.appendChild(select1);

    // Read the possible options from the numericalConstraints array
    for (let i = 0; i < numericalConstraints.length; i++) {
        let option = document.createElement('option');
        option.textContent = numericalConstraints[i];
        select1.appendChild(option);
    }

    let col2 = document.createElement('div');
    col2.classList.add('col-3');

    row.appendChild(col2);

    let inputGroup2 = document.createElement('div');
    inputGroup2.classList.add('input-group', 'mb-3');

    col2.appendChild(inputGroup2);

    let select2 = document.createElement('select');
    select2.classList.add('form-select');
    select2.id = 'inputGroupCostraintType';

    inputGroup2.appendChild(select2);

    // Read the operators from the numericalOperators array
    for (let i = 0; i < numericalOperators.length; i++) {
        let option = document.createElement('option');
        option.textContent = numericalOperators[i];
        select2.appendChild(option);
    }

    let col3 = document.createElement('div');
    col3.classList.add('col-3');

    row.appendChild(col3);

    let input3 = document.createElement('input');
    input3.type = 'text';
    input3.classList.add('form-control');
    input3.placeholder = 'Value';
    input3.setAttribute('aria-label', 'Value');

    col3.appendChild(input3);

    let modalFooter = document.createElement('div');
    modalFooter.classList.add('modal-footer');

    modalContent.appendChild(modalFooter);

    let buttonClose = createButtonClose();

    modalFooter.appendChild(buttonClose);

    let buttonSave = createButtonSave('Add Costraint');

    modalFooter.appendChild(buttonSave);

    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();

    buttonSave.onclick = function () {

        const costraint = {
            name: select1.value,
            type: select2.value,
            value: input3.value
        }

        node.parameters.push(costraint);

        const newBadge = createNewBadge(node, costraint, appendTo);

        appendTo.append(newBadge);

        closeModal(modalInstance, modal);
    }

    return modal;
}

function createAddCategoricalCostraintModal(node, appendTo) {
    /*
        Create:
        <!-- Modal -->
        <div class="modal fade" id="addCategoricalCostraintModal" tabindex="-1" aria-labelledby="addCategoricalCostraintModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="addCategoricalCostraintModalLabel">Add Categorical Costraint</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <!-- Costraint Name -->
                        <div class="col-6">
                            <div class="input-group mb-3">
                                <select class="form-select" id="inputGroupCostraintName">
                                    <option selected>Type of Database</option>
                                    <option value="1">Network Protocol</option>
                                </select>
                            </div>
                        </div>
                        <!-- Costraint Value -->
                        <div class="col-6">
                            <div class="input-group mb-3">
                                <select class="form-select" id="inputGroupCostraintName">
                                    <option selected>SQL</option>
                                    <option value="1">NoSQL</option>
                                    <option value="2">Graph</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary">Add Costraint</button>
                </div>
                </div>
            </div>
        </div>
        */
    let modal = document.createElement('div');
    modal.classList.add('modal', 'fade');
    modal.id = 'addCategoricalCostraintModal';
    modal.tabIndex = -1;
    modal.setAttribute('aria-labelledby', 'addCategoricalCostraintModalLabel');
    modal.setAttribute('aria-hidden', 'true');

    let modalDialog = document.createElement('div');
    modalDialog.classList.add('modal-dialog', 'modal-dialog-centered', 'modal-lg');

    modal.appendChild(modalDialog);

    let modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    modalDialog.appendChild(modalContent);

    let modalHeader = document.createElement('div');
    modalHeader.classList.add('modal-header');

    modalContent.appendChild(modalHeader);

    let modalTitle = document.createElement('h1');
    modalTitle.classList.add('modal-title', 'fs-5');
    modalTitle.id = 'addCategoricalCostraintModalLabel';
    modalTitle.textContent = 'Add Categorical Costraint';

    modalHeader.appendChild(modalTitle);

    let modalButton = document.createElement('button');
    modalButton.type = 'button';
    modalButton.classList.add('btn-close');
    modalButton.setAttribute('data-bs-dismiss', 'modal');
    modalButton.setAttribute('aria-label', 'Close');

    modalHeader.appendChild(modalButton);

    let modalBody = document.createElement('div');
    modalBody.classList.add('modal-body');

    modalContent.appendChild(modalBody);

    let row = document.createElement('div');
    row.classList.add('row');

    modalBody.appendChild(row);

    let col1 = document.createElement('div');
    col1.classList.add('col-6');

    row.appendChild(col1);

    let inputGroup1 = document.createElement('div');
    inputGroup1.classList.add('input-group', 'mb-3');

    col1.appendChild(inputGroup1);

    let select1 = document.createElement('select');
    select1.classList.add('form-select');
    select1.id = 'inputGroupCostraintName';

    inputGroup1.appendChild(select1);

    // Read the possible options from the categoricalConstraints array
    for (let i = 0; i < categoricalConstraints.length; i++) {
        let option = document.createElement('option');
        option.textContent = categoricalConstraints[i].name;
        select1.appendChild(option);
    }

    let col2 = document.createElement('div');
    col2.classList.add('col-6');

    row.appendChild(col2);

    let inputGroup2 = document.createElement('div');
    inputGroup2.classList.add('input-group', 'mb-3');

    col2.appendChild(inputGroup2);

    let select2 = document.createElement('select');
    select2.classList.add('form-select');
    select2.id = 'inputGroupCostraintName';

    inputGroup2.appendChild(select2);

    // Read the options for the selected constraint
    for (let i = 0; i < categoricalConstraints[0].options.length; i++) {
        let option = document.createElement('option');
        option.textContent = categoricalConstraints[0].options[i];
        select2.appendChild(option);
    }

    select1.onchange = function () {
        // Remove all the options from the select2
        select2.innerHTML = '';

        // Read the options for the selected constraint
        for (let i = 0; i < categoricalConstraints[select1.selectedIndex].options.length; i++) {
            let option = document.createElement('option');
            option.textContent = categoricalConstraints[select1.selectedIndex].options[i];
            select2.appendChild(option);
        }
    }

    let modalFooter = document.createElement('div');
    modalFooter.classList.add('modal-footer');

    modalContent.appendChild(modalFooter);

    let buttonClose = createButtonClose();

    modalFooter.appendChild(buttonClose);

    let buttonSave = createButtonSave('Add New Costraint');

    modalFooter.appendChild(buttonSave);

    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();

    buttonSave.onclick = function () {

        const costraint = {
            name: select1.value,
            type: '==',
            value: select2.value
        }

        node.parameters.push(costraint);

        // Create a new badge for the constraint
        const newBadge = createNewBadge(node, costraint, appendTo);

        // Add the badge to the modal in first position
        appendTo.append(newBadge);

        closeModal(modalInstance, modal);
    }
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