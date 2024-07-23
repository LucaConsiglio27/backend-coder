// public/js/main.js
document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    // Función para añadir un producto
    document.getElementById('add-product-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                event.target.reset();
                socket.emit('newProduct');
            } else {
                console.error('Error al añadir el producto:', response.statusText);
            }
        } catch (error) {
            console.error('Error al enviar la solicitud:', error);
        }
    });

    // Función para actualizar un producto
    async function updateProduct(productId, updatedData) {
        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });

            if (response.ok) {
                socket.emit('updateProduct', productId);
            } else {
                console.error('Error al actualizar el producto:', response.statusText);
            }
        } catch (error) {
            console.error('Error al enviar la solicitud:', error);
        }
    }

    // Función para eliminar un producto
    async function deleteProduct(productId) {
        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                socket.emit('deleteProduct', productId);
            } else {
                console.error('Error al eliminar el producto:', response.statusText);
            }
        } catch (error) {
            console.error('Error al enviar la solicitud:', error);
        }
    }

    // Escucha eventos de Socket.IO para actualizar la lista de productos en tiempo real
    socket.on('productListUpdated', () => {
        // Lógica para actualizar la lista de productos en la interfaz
        location.reload(); // Recarga la página para actualizar la lista
    });
});
