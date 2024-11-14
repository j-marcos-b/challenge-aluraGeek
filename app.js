document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("productos-container");
    const formulario = document.querySelector(".form_area form");

    if (!container) {
        console.error("El contenedor de productos no se encuentra en el DOM.");
        return;
    }

    const tituloCategoria = document.getElementById("titulo-categoria");
    const urlParams = new URLSearchParams(window.location.search);
    const categoria = urlParams.get('category');
    const searchTerm = urlParams.get('search');

    if (categoria && tituloCategoria) {
        tituloCategoria.innerHTML = `Products in the ${categoria.charAt(0).toUpperCase() + categoria.slice(1)} category:`;
    }

    let productos = [];

    async function obtenerProductos() {
        try {
            const url = "https://672fbdb366e42ceaf15e9507.mockapi.io/api/v1/products";
            const response = await fetch(url);
            productos = await response.json();

            // Marcar productos precargados
            productos = productos.map(producto => ({
                ...producto,
                isPreloaded: true
            }));

            if (categoria) {
                productos = productos.filter(producto => producto.category.toLowerCase() === categoria.toLowerCase());
            }

            if (searchTerm) {
                productos = productos.filter(producto => {
                    const titleMatch = producto.title.toLowerCase().includes(searchTerm.toLowerCase());
                    const descriptionMatch = producto.description.toLowerCase().includes(searchTerm.toLowerCase());
                    return titleMatch || descriptionMatch;
                });
            }

            mostrarProductos(productos);
        } catch (error) {
            console.error("Error al obtener productos:", error);
        }
    }

    function mostrarProductos(productosParaMostrar) {
        container.innerHTML = "";

        productosParaMostrar.forEach(producto => {
            const card = document.createElement("div");
            card.classList.add("col", "mb-4");
            card.setAttribute("data-id", producto.id);

            card.innerHTML = `
                <div class="card">
                <div class="card__corner"></div>
                <div class="card__img">
                    <img src="${producto.image}" class="card-img-top" alt="${producto.title}">
                    <span class="card__span">${producto.category}</span>
                </div>
                <div class="card-int">
                    <p class="card-int__title">${producto.title}</p>
                    <p class="excerpt">${producto.description}</p>
                    <button class="card-int__button" data-id="${producto.id}" data-preloaded="${producto.isPreloaded}">Delete</button>
                </div>
                </div>
            `;

            container.appendChild(card);
        });

        if (productosParaMostrar.length === 0) {
            container.innerHTML = "<p>No products matching your search were found.</p>";
        }

        document.querySelectorAll(".card-int__button").forEach(button => {
            button.addEventListener("click", async (event) => {
                const id = event.target.getAttribute("data-id");
                const isPreloaded = event.target.getAttribute("data-preloaded") === 'true'; // Comparar como string 'true'

                if (isPreloaded) {
                    productos = productos.filter(producto => producto.id !== id);
                    event.target.closest('.col').remove();
                    console.log(`Producto con ID ${id} eliminado solo de la vista.`);
                } else {
                    await eliminarProducto(id);
                }
            });
        });
    }

    async function eliminarProducto(id) {
        try {
            console.log(`Intentando eliminar producto con ID ${id}`);
            const url = `https://672fbdb366e42ceaf15e9507.mockapi.io/api/v1/products/${id}`;
            console.log(`URL de eliminación: ${url}`);
            
            const response = await fetch(url, {
                method: "DELETE",
            });
            
            if (response.ok) {
                productos = productos.filter(producto => producto.id !== id);
                console.log(`Producto con ID ${id} eliminado del array local.`);
                mostrarProductos(productos);
                console.log(`Producto con ID ${id} eliminado correctamente del servidor.`);
            } else {
                console.error(`Error al eliminar el producto de la API: ${response.statusText}`);
            }
        } catch (error) {
            console.error(`Error al intentar eliminar el producto: ${error}`);
        }
    }

    document.getElementById("clear-form").addEventListener("click", () => {
        document.getElementById("title").value = "";
        document.getElementById("description").value = "";
        document.getElementById("price").value = "";
        document.getElementById("image").value = "";
        document.getElementById("category").value = "";
    });

    formulario.addEventListener("submit", async (event) => {
        event.preventDefault();

        const nuevoProducto = {
            title: document.getElementById("title").value,
            description: document.getElementById("description").value,
            price: parseFloat(document.getElementById("price").value),
            image: document.getElementById("image").value,
            category: document.getElementById("category").value,
            isPreloaded: false // Nuevo producto no está precargado
        };

        try {
            const response = await fetch("https://672fbdb366e42ceaf15e9507.mockapi.io/api/v1/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoProducto),
            });

            if (response.ok) {
                const productoAgregado = await response.json();
                productos.push(productoAgregado);
                mostrarProductos(productos);
                formulario.reset();
            } else {
                console.error("Error al agregar el producto:", response.statusText);
            }
        } catch (error) {
            console.error("Error al enviar los datos:", error);
        }
    });

    obtenerProductos();
});
