// main.js
const socket = io();

socket.on("getProducts", (data) => {
    const products = document.getElementById("products_list");
    products.innerHTML = "";
    data.forEach(product => {
        const div = document.createElement("div");
        div.innerHTML = `
            <h3>${product.title}</h3>
            <p>${product.price}</p>
            <p>${product.description}</p>
        `;
        products.appendChild(div);
    });
});

socket.on("productAdded", product => {
    const products = document.getElementById("products_list");
    const div = document.createElement("div");
    div.innerHTML = `
        <h3>${product.title}</h3>
        <p>${product.price}</p>
        <p>${product.description}</p>
    `;
    products.appendChild(div);
});

socket.on("productUpdated", updatedProduct => {
    const items = document.querySelectorAll('#products_list div');
    items.forEach(item => {
        if (item.textContent.includes(updatedProduct.title)) {
            item.innerHTML = `
                <h3>${updatedProduct.title}</h3>
                <p>${updatedProduct.price}</p>
                <p>${updatedProduct.description}</p>
            `;
        }
    });
});

socket.on("productDeleted", productId => {
    const items = document.querySelectorAll('#products_list div');
    items.forEach(item => {
        if (item.textContent.includes(productId)) {
            item.remove();
        }
    });
});
