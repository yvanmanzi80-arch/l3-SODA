document.addEventListener("DOMContentLoaded", () => {

    const registerSection = document.getElementById("register-section");
    const loginSection = document.getElementById("login-section");
    const dashboardSection = document.getElementById("dashboard-section");

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const products = JSON.parse(localStorage.getItem("products")) || [];

    // Navigation
    document.getElementById("showLogin").onclick = () => {
        registerSection.classList.add("hidden");
        loginSection.classList.remove("hidden");
    };

    document.getElementById("showRegister").onclick = () => {
        loginSection.classList.add("hidden");
        registerSection.classList.remove("hidden");
    };

    // REGISTER
    document.getElementById("registerForm").onsubmit = (e) => {
        e.preventDefault();

        const name = regName.value.trim();
        const email = regEmail.value.trim();
        const password = regPassword.value;
        const confirmPassword = regConfirmPassword.value;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

        if (!name || !email || !password || !confirmPassword)
            return registerMessage.textContent = "All fields required.";

        if (!emailRegex.test(email))
            return registerMessage.textContent = "Invalid email.";

        if (users.find(u => u.email === email))
            return registerMessage.textContent = "Email already exists.";

        if (!passwordRegex.test(password))
            return registerMessage.textContent = "Weak password.";

        if (password !== confirmPassword)
            return registerMessage.textContent = "Passwords do not match.";

        users.push({ name, email, password });
        localStorage.setItem("users", JSON.stringify(users));

        alert("Registration successful!");
        registerSection.classList.add("hidden");
        loginSection.classList.remove("hidden");
    };

    // LOGIN
    document.getElementById("loginForm").onsubmit = (e) => {
        e.preventDefault();

        const email = loginEmail.value;
        const password = loginPassword.value;

        const user = users.find(u => u.email === email && u.password === password);

        if (!user)
            return loginMessage.textContent = "Invalid credentials.";

        localStorage.setItem("loggedInUser", JSON.stringify(user));
        showDashboard();
    };

    // LOGOUT
    logoutBtn.onclick = () => {
        localStorage.removeItem("loggedInUser");
        location.reload();
    };

    function showDashboard() {
        const user = JSON.parse(localStorage.getItem("loggedInUser"));
        if (!user) return;

        registerSection.classList.add("hidden");
        loginSection.classList.add("hidden");
        dashboardSection.classList.remove("hidden");
        loggedUser.textContent = user.name;

        renderProducts();
    }

    // PRODUCTS
    addProductBtn.onclick = () => {
        productFormSection.classList.toggle("hidden");
    };

    document.getElementById("productForm").onsubmit = (e) => {
        e.preventDefault();

        const name = productName.value.trim();
        const category = productCategory.value.trim();
        const quantity = Number(productQuantity.value);
        const price = Number(productPrice.value);

        if (!name || !category || quantity < 0 || isNaN(price))
            return alert("Invalid product data.");

        const newProduct = {
            id: Date.now(),
            name,
            category,
            quantity,
            price
        };

        products.push(newProduct);
        localStorage.setItem("products", JSON.stringify(products));

        renderProducts();
        productForm.reset();
        productFormSection.classList.add("hidden");
    };

    function renderProducts() {
        productTableBody.innerHTML = "";

        if (products.length === 0) {
            emptyState.classList.remove("hidden");
        } else {
            emptyState.classList.add("hidden");

            products.forEach(p => {
                const row = `
                <tr>
                    <td>${p.id}</td>
                    <td>${p.name}</td>
                    <td>${p.category}</td>
                    <td>${p.quantity}</td>
                    <td>$${p.price}</td>
                    <td>${p.quantity > 0 ? "In Stock" : "Out of Stock"}</td>
                </tr>`;
                productTableBody.innerHTML += row;
            });
        }

        totalProducts.textContent = products.length;
        inStock.textContent = products.filter(p => p.quantity > 0).length;
        outStock.textContent = products.filter(p => p.quantity === 0).length;
    }

    // Authorization Check
    if (localStorage.getItem("loggedInUser")) {
        showDashboard();
    }
});
