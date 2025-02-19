document.addEventListener("DOMContentLoaded", function () {
    const dropdown = document.getElementById("dropdown");
    const productList = document.getElementById("productList");
    const addButton = document.querySelector(".add");
    const imageInput = document.getElementById("imageInput");

    // Generate a unique product ID
    function generateID() {
        let counter = parseInt(localStorage.getItem("productCounter") || 0) + 1;
        localStorage.setItem("productCounter", counter);
        return `prod-${counter}`;
    }

    // Retrieve stored products
    function getProducts() {
        return JSON.parse(localStorage.getItem("products") || "[]");
    }

    // Save products to localStorage
    function saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products));
    }

    // Display products in the product list
    function displayProducts(filterId = null) {
        if (!productList) return;
        productList.innerHTML = "";

        let products = getProducts();
        let filteredProducts = filterId ? products.filter(p => p.id === filterId) : products;

        if (filteredProducts.length === 0) {
            productList.innerHTML = "<p>No products available.</p>";
            return;
        }

        filteredProducts.forEach(product => {
            const productDiv = document.createElement("div");
            productDiv.innerHTML = `
                <img src="${product.image}" alt="${product.name}" width="250">
                <h3>${product.name}</h3>
                <h3>${product.price}</h3>
                <h4>${product.description}</h4>
                <button onclick="editProduct('${product.id}')">Edit</button>
                <button onclick="deleteProduct('${product.id}')">Delete</button>
                <hr>
            `;
            productList.appendChild(productDiv);
        });
    }

    // Populate dropdown with product IDs
    function populateDropdown() {
        if (!dropdown) return;
        dropdown.innerHTML = '<option value="">Select a Product</option>';
        getProducts().forEach(product => {
            let option = document.createElement("option");
            option.value = product.id;
            option.textContent = product.id;
            dropdown.appendChild(option);
        });
    }

    // Load product details for editing
    function loadEditProduct() {
        let product = localStorage.getItem("editProduct");
        if (!product) return;

        product = JSON.parse(product);
        document.getElementById("productId").value = product.id;
        document.querySelector(".name").value = product.name;
        document.querySelector(".amount").value = product.price;
        document.querySelector(".description").value = product.description;
        document.getElementById("previewImage").src = product.image;
        localStorage.removeItem("editProduct");
    }

    // Handle file upload for preview image
    if (imageInput) {
        imageInput.addEventListener("change", function (event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = e => document.getElementById("previewImage").src = e.target.result;
                reader.readAsDataURL(file);
            }
        });
    }

    // Add/Edit product functionality
    if (addButton) {
        addButton.addEventListener("click", function (e) {
            e.preventDefault();
            let id = document.getElementById("productId").value || generateID();
            let name = document.querySelector(".name").value.trim();
            let price = document.querySelector(".amount").value.trim();
            let description = document.querySelector(".description").value.trim();
            let image = document.getElementById("previewImage").src;

            if (!name || !price || !description) {
                alert("Please fill all fields before adding/editing a product.");
                return;
            }

            let products = getProducts();
            let existingIndex = products.findIndex(p => p.id === id);

            if (existingIndex !== -1) {
                products[existingIndex] = { id, name, image, price, description };
            } else {
                products.push({ id, name, image, price, description });
            }

            saveProducts(products);
            window.location.href = "index2.html";
        });
    }

    // Edit product
    window.editProduct = function (id) {
        let product = getProducts().find(p => p.id === id);
        if (product) {
            localStorage.setItem("editProduct", JSON.stringify(product));
            window.location.href = "index.html";
        }
    };

    // Delete product
    window.deleteProduct = function (id) {
        let updatedProducts = getProducts().filter(p => p.id !== id);
        saveProducts(updatedProducts);
        displayProducts();
    };

    // Event listener for dropdown filter
    if (dropdown) {
        dropdown.addEventListener("change", function () {
            displayProducts(this.value || null);
        });
    }

    loadEditProduct();
    displayProducts();
    populateDropdown();
});
