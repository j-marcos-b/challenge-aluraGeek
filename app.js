document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("productos-container");

    if (!container) {
        console.error("El contenedor de productos no se encuentra en el DOM.");
        return; // Detiene la ejecución si no se encuentra el contenedor
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
            let url = "https://672fbdb366e42ceaf15e9507.mockapi.io/api/v1/products";

            const response = await fetch(url);
            productos = await response.json();

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
            card.classList.add("col-lg-4", "col-md-6", "col-sm-12", "mb-4");

            card.innerHTML = `
                <div class="card" style="width: 100%;">
                    <img src="${producto.image}" class="card-img-top" alt="${producto.title}">
                    <div class="card-body">
                        <h5 class="card-title">${producto.title}</h5>
                        <p class="card-text">${producto.description}</p>
                        <a href="#" id="btn" class="btn btn-primary">Comprar</a>
                    </div>
                </div>
            `;

            container.appendChild(card);
        });

        if (productosParaMostrar.length === 0) {
            container.innerHTML = "<p>No se encontraron productos que coincidan con tu búsqueda.</p>";
        }
    }

    obtenerProductos();
    
});

