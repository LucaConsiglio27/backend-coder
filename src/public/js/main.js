// Conectar al servidor de socket.io
const socket = io();

// Escuchar el evento 'getProducts' para obtener la lista completa de productos
socket.on("getProducts", (data) => {
    const productsList = document.getElementById("products_list");
    productsList.innerHTML = ""; // Limpiar la lista actual de productos
    data.forEach(product => {
        const productDiv = document.createElement("div");
        productDiv.innerHTML = `
            <h3>${product.title}</h3>
            <p>${product.price}</p>
            <p>${product.description}</p>
        `;
        productsList.appendChild(productDiv);
    });
});

// Escuchar el evento 'productAdded' para agregar un nuevo producto a la lista
socket.on("productAdded", (product) => {
    const productsList = document.getElementById("products_list");
    const productDiv = document.createElement("div");
    productDiv.innerHTML = `
        <h3>${product.title}</h3>
        <p>${product.price}</p>
        <p>${product.description}</p>
    `;
    productsList.appendChild(productDiv);
});

// Escuchar el evento 'productUpdated' para actualizar un producto existente en la lista
socket.on("productUpdated", (updatedProduct) => {
    const items = document.querySelectorAll('#products_list div');
    items.forEach(item => {
        const titleElement = item.querySelector('h3');
        if (titleElement && titleElement.textContent === updatedProduct.title) {
            item.innerHTML = `
                <h3>${updatedProduct.title}</h3>
                <p>${updatedProduct.price}</p>
                <p>${updatedProduct.description}</p>
            `;
        }
    });
});

// Escuchar el evento 'productDeleted' para eliminar un producto de la lista
socket.on("productDeleted", (productId) => {
    const items = document.querySelectorAll('#products_list div');
    items.forEach(item => {
        const titleElement = item.querySelector('h3');
        if (titleElement && titleElement.textContent === productId) {
            item.remove();
        }
    });
});
