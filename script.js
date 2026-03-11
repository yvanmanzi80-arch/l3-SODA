document.addEventListener("DOMContentLoaded", () => {

const registerSection = document.getElementById("register-section");
const loginSection = document.getElementById("login-section");
const dashboardSection = document.getElementById("dashboard-section");

const registerMessage = document.getElementById("registerMessage");
const loginMessage = document.getElementById("loginMessage");

const logoutBtn = document.getElementById("logoutBtn");
const loggedUser = document.getElementById("loggedUser");

const productTableBody = document.getElementById("productTableBody");
const totalProducts = document.getElementById("totalProducts");
const inStock = document.getElementById("inStock");
const outStock = document.getElementById("outStock");

const addProductBtn = document.getElementById("addProductBtn");
const productFormSection = document.getElementById("productFormSection");
const productForm = document.getElementById("productForm");

const emptyState = document.getElementById("emptyState");

let users = JSON.parse(localStorage.getItem("users")) || [];
let products = JSON.parse(localStorage.getItem("products")) || [];


// NAVIGATION
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

const nameRegex = /^[A-Za-z\s]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

if (!name || !email || !password || !confirmPassword)
    return registerMessage.textContent = "All fields required.";

if (!nameRegex.test(name))
    return registerMessage.textContent = "Name must contain letters only.";

if (!emailRegex.test(email))
    return registerMessage.textContent = "Invalid email.";

if (users.find(u => u.email === email))
    return registerMessage.textContent = "Email already exists.";

if (!passwordRegex.test(password))
    return registerMessage.textContent = "Weak password.";

if (password !== confirmPassword)
    return registerMessage.textContent = "Passwords do not match.";

users.push({name,email,password});
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


function showDashboard(){

const user = JSON.parse(localStorage.getItem("loggedInUser"));

registerSection.classList.add("hidden");
loginSection.classList.add("hidden");
dashboardSection.classList.remove("hidden");

loggedUser.textContent = user.name;

renderProducts();

}


// ADD PRODUCT BUTTON
addProductBtn.onclick = () => {
productFormSection.classList.toggle("hidden");
};


// ADD PRODUCT
productForm.onsubmit = (e) => {

e.preventDefault();

const name = productName.value.trim();
const category = productCategory.value.trim();
const quantity = Number(productQuantity.value);
const price = Number(productPrice.value);

if(!name || !category || quantity < 0 || isNaN(price))
return alert("Invalid product data");

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


// RENDER PRODUCTS
function renderProducts(){

productTableBody.innerHTML = "";

if(products.length === 0){

emptyState.classList.remove("hidden");

}else{

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
</tr>
`;

productTableBody.innerHTML += row;

});

}

totalProducts.textContent = products.length;
inStock.textContent = products.filter(p => p.quantity > 0).length;
outStock.textContent = products.filter(p => p.quantity === 0).length;

}


// AUTH CHECK
if(localStorage.getItem("loggedInUser")){
showDashboard();
}

});