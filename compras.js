// JavaScript
const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const totalElement = document.getElementById("total");

// Inicializar el total en 0
let total = 0;

// Cargar la lista de compras almacenada si existe
const savedShoppingList = localStorage.getItem("shoppingList");
if (savedShoppingList) {
    taskList.innerHTML = savedShoppingList;
    attachEventListenersToItems();
    calculateTotal();
}

addTaskButton.addEventListener("click", () => {
    const taskText = taskInput.value.trim();
    if (taskText !== "") {
        addListItem(taskText); // No establecer el precio inicialmente
        taskInput.value = "";

        // Guardar la lista de compras actual en el almacenamiento local
        localStorage.setItem("shoppingList", taskList.innerHTML);
    }
});

function addListItem(taskText) {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
        <span class="quantity">0</span>
        <span class="product">${taskText}</span>
        - $
        <input type="number" value="" step="0.01" class="price" placeholder="Ingrese el valor">
        <button class="subtract">-</button>
        <button class="add">+</button>
        <button class="delete">Eliminar</button>
    `;
    taskList.appendChild(listItem);
    attachEventListenersToItem(listItem);

    // Guardar la lista de compras actual en el almacenamiento local
    localStorage.setItem("shoppingList", taskList.innerHTML);
}

function attachEventListenersToItem(listItem) {
    const quantitySpan = listItem.querySelector(".quantity");
    const subtractButton = listItem.querySelector(".subtract");
    const addButton = listItem.querySelector(".add");
    const priceInput = listItem.querySelector(".price");

    let priceHasBeenSet = false; // Bandera para verificar si el precio se ha establecido

    subtractButton.addEventListener("click", () => {
        if (priceHasBeenSet) {
            updateQuantity(quantitySpan, -1);
            updatePrice(listItem);
        }
    });

    addButton.addEventListener("click", () => {
        if (priceHasBeenSet) {
            updateQuantity(quantitySpan, 1);
            updatePrice(listItem);
        }
    });

    priceInput.addEventListener("input", () => {
        if (!priceHasBeenSet) {
            priceHasBeenSet = true;
        }
        updatePrice(listItem);
    });

    const deleteButton = listItem.querySelector(".delete");
    deleteButton.addEventListener("click", () => {
        listItem.remove();
        updatePrice(listItem, true);
    });
}

function attachEventListenersToItems() {
    const items = taskList.querySelectorAll("li");
    items.forEach((item) => {
        attachEventListenersToItem(item);
    });
}

function updateQuantity(quantitySpan, delta) {
    let currentQuantity = parseInt(quantitySpan.textContent);
    currentQuantity += delta;

    if (currentQuantity < 0) {
        currentQuantity = 0;
    }

    quantitySpan.textContent = currentQuantity;
}

function updatePrice(listItem, isDeleted = false) {
    const price = parseFloat(listItem.querySelector(".price").value) || 0;
    const quantity = parseInt(listItem.querySelector(".quantity").textContent) || 0;

    if (isDeleted) {
        total -= price * quantity;
    } else {
        total += price * deltaQuantity(listItem);
    }

    totalElement.textContent = `Total: $${total.toFixed(2)}`;
}

function deltaQuantity(listItem) {
    const currentQuantity = parseInt(listItem.querySelector(".quantity").textContent) || 0;
    const previousQuantity = parseInt(listItem.dataset.previousQuantity) || 0;
    listItem.dataset.previousQuantity = currentQuantity;
    return currentQuantity - previousQuantity;
}

function calculateTotal() {
    const items = document.querySelectorAll("#taskList li");
    let newTotal = 0;

    items.forEach((item) => {
        const price = parseFloat(item.querySelector(".price").value) || 0;
        const quantity = parseInt(item.querySelector(".quantity").textContent) || 0;
        newTotal += price * quantity;
    });

    total = newTotal;
    totalElement.textContent = `Total: $${total.toFixed(2)}`;
}

// Verifica si la página se está cargando por primera vez
if (!localStorage.getItem("pageLoaded")) {
    // Si es la primera vez, borra cualquier lista de compras almacenada
    localStorage.removeItem("shoppingList");

    // Establece un indicador para saber que la página ya se cargó al menos una vez
    localStorage.setItem("pageLoaded", true);
}


// Escucha el evento antes de que la página se descargue (beforeunload)
window.addEventListener("beforeunload", () => {
    // Limpia la lista de compras del almacenamiento local
    localStorage.removeItem("shoppingList");
});

