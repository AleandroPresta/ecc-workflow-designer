let node = {
    name: "Node",
    type: "Device",
    description: "Description",
    constraints: [
        {
            name: "Execution Time",
            type: "<=",
            value: "20ms"
        },
        {
            name: "Volume of Data",
            type: "<=",
            value: "400mb"
        }
    ]
}

/* 
Create:
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
                        <form>
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
                        </form>
                    </div>
                    <div class="col">
                        <h4 class="modal-title fs-5">Add a Costraint</h4>
                        <form>
                            <!-- Costraint Categorical/Numerical -->
                            <div class="input-group mb-3">
                                <label class="input-group-text" for="inputGroupCostraintType">Type</label>
                                <select class="form-select" id="inputGroupCostraintType">
                                    <option selected>Numerical</option>
                                    <option value="1">Categorical</option>
                                </select>
                            </div>
                            
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
                                <div class="d-grid gap-2">
                                    <button class="btn btn-primary" type="button">Add Costraint</button>
                                </div>
                            </div>
                        </form>
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
function openCreationModificationModal() {
    console.log('openCreationModificationModal()')

    // <div class="modal fade" id="addNodeModal" tabindex="-1" aria-labelledby="addNodeModalLabel" aria-hidden="true">
    const modal = document.createElement("div");
    modal.className = "modal fade";
    modal.id = "addNodeModal";
    modal.tabIndex = "-1";
    modal.setAttribute("aria-labelledby", "addNodeModalLabel");
    modal.setAttribute("aria-hidden", "true");

    document.body.appendChild(modal);

    // <div class="modal-dialog modal-dialog-centered modal-xl">
    const modalDialog = document.createElement("div");
    modalDialog.className = "modal-dialog modal-dialog-centered modal-xl";

    modal.appendChild(modalDialog);

    // <div class="modal-content">
    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";

    modalDialog.appendChild(modalContent);

    // <div class="modal-header">
    const modalHeader = document.createElement("div");
    modalHeader.className = "modal-header";

    modalContent.appendChild(modalHeader);

    // <h1 class="modal-title fs-5" id="addNodeModalLabel">Create new node</h1>
    const modalTitle = document.createElement("h1");
    modalTitle.className = "modal-title fs-5";
    modalTitle.id = "addNodeModalLabel";
    modalTitle.innerText = "Create new node";

    modalHeader.appendChild(modalTitle);

    // <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "btn-close";
    closeButton.setAttribute("data-bs-dismiss", "modal");
    closeButton.setAttribute("aria-label", "Close");
    
    modalHeader.appendChild(closeButton);

    // <div class="modal-body">
    const modalBody = document.createElement("div");
    modalBody.className = "modal-body";

    modalContent.appendChild(modalBody);

    // <div class="row">
    const row = document.createElement("div");
    row.className = "row";

    modalBody.appendChild(row);

    // <div class="col">
    const col1 = document.createElement("div");
    col1.className = "col";

    row.appendChild(col1);

    // <h4>Node Informations</h4>
    const h4 = document.createElement("h4");
    h4.innerText = "Node Informations";

    col1.appendChild(h4);

    // <form>
    const form1 = document.createElement("form");

    col1.appendChild(form1);

    // <!-- Node Name -->
    const div1 = document.createElement("div");
    div1.className = "form-floating mb-3";

    form1.appendChild(div1);

    // <input type="text" class="form-control" id="floatingInputName" placeholder="Name">
    const input1 = document.createElement("input");
    input1.type = "text";
    input1.className = "form-control";
    input1.id = "floatingInputName";
    input1.placeholder = "Name";

    div1.appendChild(input1);

    // <label for="floatingInputName">Node Name</label>
    const label1 = document.createElement("label");
    label1.setAttribute("for", "floatingInputName");
    label1.innerText = "Node Name";

    div1.appendChild(label1);

    // <!-- Node Type -->
    const div2 = document.createElement("div");
    div2.className = "input-group mb-3";

    form1.appendChild(div2);

    // <label class="input-group-text" for="inputGroupNodeType">Type</label>
    const label2 = document.createElement("label");
    label2.className = "input-group-text";
    label2.setAttribute("for", "inputGroupNodeType");
    label2.innerText = "Type";

    div2.appendChild(label2);

    // <select class="form-select" id="inputGroupNodeType">
    const select1 = document.createElement("select");
    select1.className = "form-select";
    select1.id = "inputGroupNodeType";

    div2.appendChild(select1);

    // <option selected>Device</option>
    const option1 = document.createElement("option");
    option1.selected = true;
    option1.innerText = "Device";

    select1.appendChild(option1);

    // <option value="1">Computation</option>
    const option2 = document.createElement("option");
    option2.value = "Computation";
    option2.innerText = "Computation";

    select1.appendChild(option2);
    
    // <option value="2">Storage</option>
    const option3 = document.createElement("option");
    option3.value = "Storage";
    option3.innerText = "Storage";

    select1.appendChild(option3);

    // <option value="3">Communication</option>
    const option4 = document.createElement("option");
    option4.value = "Communication";
    option4.innerText = "Communication";

    select1.appendChild(option4);

    // <!-- Node Description-->
    const div3 = document.createElement("div");
    div3.className = "form-floating";

    form1.appendChild(div3);

    // <textarea class="form-control" placeholder="Describe yout node" id="floatingTextareaDescription" style="height: 100px"></textarea>
    const textarea = document.createElement("textarea");
    textarea.className = "form-control";
    textarea.placeholder = "Describe yout node";
    textarea.id = "floatingTextareaDescription";
    textarea.style.height = "100px";

    div3.appendChild(textarea);

    // <label for="floatingTextareaDescription">Description</label>
    const label3 = document.createElement("label");
    label3.setAttribute("for", "floatingTextareaDescription");
    label3.innerText = "Description";

    div3.appendChild(label3);

    // <div class="col">
    const col2 = document.createElement("div");
    col2.className = "col";

    row.appendChild(col2);

    // <h4 class="modal-title fs-5">Add a Costraint</h4>
    const h42 = document.createElement("h4");
    h42.className = "modal-title fs-5";
    h42.innerText = "Add a Costraint";

    col2.appendChild(h42);

    // <form>
    const form2 = document.createElement("form");

    col2.appendChild(form2);

    // <!-- Costraint Categorical/Numerical -->
    const div4 = document.createElement("div");
    div4.className = "input-group mb-3";

    form2.appendChild(div4);

    // <label class="input-group-text" for="inputGroupCostraintType">Type</label>
    const label4 = document.createElement("label");
    label4.className = "input-group-text";
    label4.setAttribute("for", "inputGroupCostraintType");
    label4.innerText = "Type";

    div4.appendChild(label4);

    // <select class="form-select" id="inputGroupCostraintType">
    const select2 = document.createElement("select");
    select2.className = "form-select";
    select2.id = "inputGroupCostraintType";

    div4.appendChild(select2);

    // <option selected>Numerical</option>
    const option5 = document.createElement("option");
    option5.selected = true;
    option5.innerText = "Numerical";

    select2.appendChild(option5);

    // <option value="1">Categorical</option>
    const option6 = document.createElement("option");
    option6.value = "Categorical";
    option6.innerText = "Categorical";

    select2.appendChild(option6);

    // Create the HTML part related to the numerical costraint
    // <div class="row">
    const row2 = document.createElement("div");
    row2.className = "row";

    col2.appendChild(row2);

    // <!-- Costraint Name -->
    const col3 = document.createElement("div");
    col3.className = "col-6";

    row2.appendChild(col3);

    // <div class="input-group mb-3">
    const div5 = document.createElement("div");
    div5.className = "input-group mb-3";

    col3.appendChild(div5);

    // <select class="form-select" id="inputGroupCostraintName">
    const select3 = document.createElement("select");
    select3.className = "form-select";
    select3.id = "inputGroupCostraintName";

    div5.appendChild(select3);

    // <option selected>Execution Time</option>
    const option7 = document.createElement("option");
    option7.selected = true;
    option7.innerText = "Execution Time";

    select3.appendChild(option7);

    // <option value="1">Volume of Data</option>
    const option8 = document.createElement("option");
    option8.value = "1";
    option8.innerText = "Volume of Data";

    select3.appendChild(option8);

    // <!-- Costraint Type -->
    const col4 = document.createElement("div");
    col4.className = "col-3";

    row2.appendChild(col4);

    // <div class="input-group mb-3">
    const div6 = document.createElement("div");
    div6.className = "input-group mb-3";

    col4.appendChild(div6);

    // <select class="form-select" id="inputGroupCostraintName">
    const select4 = document.createElement("select");
    select4.className = "form-select";
    select4.id = "inputGroupCostraintName";

    div6.appendChild(select4);

    // <option selected>==</option>
    const option9 = document.createElement("option");
    option9.selected = true;
    option9.innerText = "==";

    select4.appendChild(option9);

    // <option value="1"><</option>
    const option10 = document.createElement("option");
    option10.value = "1";
    option10.innerText = "<";

    select4.appendChild(option10);

    // <option value="1">></option>
    const option11 = document.createElement("option");
    option11.value = "1";
    option11.innerText = ">";

    select4.appendChild(option11);

    // <option value="1"><=</option>
    const option12 = document.createElement("option");
    option12.value = "1";
    option12.innerText = "<=";

    select4.appendChild(option12);

    // <option value="1">>=</option>
    const option13 = document.createElement("option");
    option13.value = "1";
    option13.innerText = ">=";

    select4.appendChild(option13);

    // <!-- Costraint Value -->
    const col5 = document.createElement("div");
    col5.className = "col-3";

    row2.appendChild(col5);

    // <input type="text" class="form-control" placeholder="Value" aria-label="Value">
    const input2 = document.createElement("input");
    input2.type = "text";
    input2.className = "form-control";
    input2.placeholder = "Value";
    input2.setAttribute("aria-label", "Value");

    col5.appendChild(input2);

    // <div class="d-grid gap-2">
    const div7 = document.createElement("div");
    div7.className = "d-grid gap-2";

    row2.appendChild(div7);

    // <button class="btn btn-primary" type="button">Add Costraint</button>
    const button = document.createElement("button");
    button.className = "btn btn-primary";
    button.type = "button";
    button.innerText = "Add Costraint";

    div7.appendChild(button);

    // <h4 class="modal-title fs-5">Current Costraints</h4>
    const h43 = document.createElement("h4");
    h43.className = "modal-title fs-5";
    h43.innerText = "Current Costraints";

    col2.appendChild(h43);

    // <span class="badge rounded-pill text-bg-primary">
    const span1 = document.createElement("span");
    span1.className = "badge rounded-pill text-bg-primary";

    col2.appendChild(span1);

    // <div class="container d-flex justify-content-center align-items-center m-0 p-0">
    const container1 = document.createElement("div");
    container1.className = "container d-flex justify-content-center align-items-center m-0 p-0";

    span1.appendChild(container1);

    // <span>Execution Time <= 20ms</span>
    const span2 = document.createElement("span");
    span2.innerText = "Execution Time <= 20ms";

    container1.appendChild(span2);

    // <button type="button" class="btn-close btn-close-white" aria-label="Close" style="--bs-btn-font-size: .25rem;"></button>
    const button2 = document.createElement("button");
    button2.type = "button";
    button2.className = "btn-close btn-close-white";
    button2.setAttribute("aria-label", "Close");
    button2.style = "--bs-btn-font-size: .25rem;";

    container1.appendChild(button2);

    // <span class="badge rounded-pill text-bg-primary">
    const span3 = document.createElement("span");
    span3.className = "badge rounded-pill text-bg-primary";

    col2.appendChild(span3);

    // <div class="container d-flex justify-content-center align-items-center m-0 p-0">
    const container2 = document.createElement("div");
    container2.className = "container d-flex justify-content-center align-items-center m-0 p-0";

    span3.appendChild(container2);

    // <span>Volume of Data <= 200mb</span>
    const span4 = document.createElement("span");
    span4.innerText = "Volume of Data <= 200mb";

    container2.appendChild(span4);

    // <button type="button" class="btn-close btn-close-white" aria-label="Close" style="--bs-btn-font-size: .25rem;"></button>
    const button3 = document.createElement("button");
    button3.type = "button";
    button3.className = "btn-close btn-close-white";
    button3.setAttribute("aria-label", "Close");
    button3.style = "--bs-btn-font-size: .25rem;";

    container2.appendChild(button3);

    // <div class="modal-footer">
    const modalFooter = document.createElement("div");
    modalFooter.className = "modal-footer";

    modalContent.appendChild(modalFooter);

    // <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    const closeButton2 = document.createElement("button");
    closeButton2.type = "button";
    closeButton2.className = "btn btn-secondary";
    closeButton2.setAttribute("data-bs-dismiss", "modal");
    closeButton2.innerText = "Close";

    modalFooter.appendChild(closeButton2);

    // <button type="button" class="btn btn-primary">Save changes</button>
    const saveButton = document.createElement("button");
    saveButton.type = "button";
    saveButton.className = "btn btn-primary";
    saveButton.innerText = "Save changes";
    saveButton.addEventListener("click", () => {
        const newNode = {
            name: input1.value,
            type: select1.value,
            description: textarea.value,
            constraints: []
        }

        console.log(newNode)
    });

    modalFooter.appendChild(saveButton);

    const modalInstance = new bootstrap.Modal(document.getElementById('addNodeModal'));
    modalInstance.show();
}