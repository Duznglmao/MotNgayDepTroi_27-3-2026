let products = JSON.parse(localStorage.getItem("products")) || [];
let editingId = null;

const iName = document.getElementById("iName");
const iPrice = document.getElementById("iPrice");
const iStock = document.getElementById("iStock");
const tbody = document.getElementById("tbody");
const searchInput = document.getElementById("searchInput");

const createId = () => {
    let id = 1;
    while (products.find(product => product.id === id)) {
        id++;
    }
    return id;
};

const resetForm = () => {
    iName.value = "";
    iPrice.value = "";
    iStock.value = "";
    editingId = null;
    document.getElementById("formTitle").textContent = "Thêm sản phẩm mới";
    document.getElementById("btnSubmit").textContent = "Thêm sản phẩm";
};

const submitForm = () => {
    if (editingId === null) {
        addProduct();
    } else {
        updateProduct();
    }
};

const addProduct = () => {
    const nameValue = iName.value.trim();
    const priceValue = iPrice.value;
    const stockValue = iStock.value;

    if (nameValue === "") {
        alert("Vui lòng nhập tên sản phẩm.");
        return;
    }

    if (products.find(product => product.name.toLowerCase() === nameValue.toLowerCase())) {
        alert("Tên sản phẩm đã tồn tại.");
        return;
    }

    if (priceValue === "" || Number(priceValue) <= 0) {
        alert("Giá phải là số dương lớn hơn 0.");
        return;
    }

    if (stockValue === "" || Number(stockValue) < 0) {
        alert("Tồn kho phải >= 0.");
        return;
    }

    const product = {
        id: createId(),
        name: nameValue,
        price: Number(priceValue),
        stock: Number(stockValue),
        status: Number(stockValue) > 0 ? "Còn hàng" : "Hết hàng"
    };

    products.push(product);
    localStorage.setItem("products", JSON.stringify(products));
    alert("Thêm sản phẩm thành công!");
    resetForm();
    renderProduct();
};

const renderProduct = () => {
    const list = filteredProducts();

    document.getElementById("totalBadge").textContent = `${products.length} sản phẩm`;

    if (list.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px; color: grey;">
                    Chưa có sản phẩm nào.
                </td>
            </tr>`;
        return;
    }

    tbody.innerHTML = list.map((product, index) => `
        <tr id="row-${product.id}">
            <td>${index + 1}</td>
            <td class="td-name">${product.name}</td>
            <td class="td-price">${product.price}</td>
            <td style="font-weight: 700">${product.stock}</td>
            <td>${product.status}</td>
            <td>
                <div class="td-actions">
                    <button class="btn btn-sm btn-edit" onclick="editFunction(${product.id})">✏ Sửa</button>
                    <button class="btn btn-sm btn-del" onclick="deleteFunction(${product.id})">✕ Xóa</button>
                </div>
            </td>
        </tr>
    `).join("");
};

const editFunction = (id) => {
    const product = products.find(product => product.id === id);
    if (!product) return;

    iName.value = product.name;
    iPrice.value = product.price;
    iStock.value = product.stock;
    editingId = id;

    document.getElementById("formTitle").textContent = "Chỉnh sửa sản phẩm";
    document.getElementById("btnSubmit").textContent = "Lưu thay đổi";
};

const updateProduct = () => {
    const nameValue = iName.value.trim();
    const priceValue = iPrice.value;
    const stockValue = iStock.value;

    if (nameValue === "") {
        alert("Vui lòng nhập tên sản phẩm.");
        return;
    }

    if (products.find(product =>
        product.name.toLowerCase() === nameValue.toLowerCase() &&
        product.id !== editingId
    )) {
        alert("Tên sản phẩm đã tồn tại.");
        return;
    }

    if (priceValue === "" || Number(priceValue) <= 0) {
        alert("Giá phải > 0.");
        return;
    }

    if (stockValue === "" || Number(stockValue) < 0) {
        alert("Tồn kho phải >= 0.");
        return;
    }

    const index = products.findIndex(product => product.id === editingId);

    if (index === -1) {
        alert("Không tìm thấy sản phẩm!");
        return;
    }

    products[index] = {
        id: editingId,
        name: nameValue,
        price: Number(priceValue),
        stock: Number(stockValue),
        status: Number(stockValue) > 0 ? "Còn hàng" : "Hết hàng"
    };

    localStorage.setItem("products", JSON.stringify(products));
    alert("Cập nhật thành công!");
    resetForm();
    renderProduct();
};

const deleteFunction = (id) => {
    if (confirm("Bạn có chắc muốn xóa không?")) {
        products = products.filter(product => product.id !== id);
        localStorage.setItem("products", JSON.stringify(products));
        alert("Xóa thành công!");
        renderProduct();
    }
};

const filteredProducts = () => {
    const keyword = searchInput.value.trim().toLowerCase();

    return products.filter(product =>
        product.name.toLowerCase().includes(keyword)
    );
};

searchInput.addEventListener("input", () => renderProduct());

renderProduct();