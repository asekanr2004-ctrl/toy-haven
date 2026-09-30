const PRODUCTS = [
    {
        id: 1,
        name: "Dragon Knight Figure",
        category: "Figurines",
        price: 5500,
        image: "img/dragon-knight.jpg",
        desc: "Hand-painted 15cm collectible."
    },
    {
        id: 2,
        name: "Space Ranger Statue",
        category: "Figurines",
        price: 6000,
        image: "img/space-ranger.jpg",
        desc: "Limited edition display statue."
    },
    {
        id: 3,
        name: "Wizard Collectible",
        category: "Figurines",
        price: 8000,
        image: "img/wizard.jpg",
        desc: "Glow-in-the-dark staff."
    },
    {
        id: 4,
        name: "Robo Buddy",
        category: "Toys",
        price: 2500,
        image: "img/robo-buddy.jpg",
        desc: "Walking, talking robot. Ages 5+."
    },
    {
        id: 5,
        name: "Plush Panda",
        category: "Toys",
        price: 1400,
        image: "img/plush-panda.jpg",
        desc: "Super-soft 30cm plush."
    },
    {
        id: 6,
        name: "Building Blocks Set",
        category: "Toys",
        price: 2700,
        image: "img/building-blocks.jpg",
        desc: "200 colourful pieces."
    },
    {
        id: 7,
        name: "Castle Quest",
        category: "Board Games",
        price: 5000,
        image: "img/castle-quest.jpg",
        desc: "2-4 players. Ages 8+."
    },
    {
        id: 8,
        name: "Word Wizards",
        category: "Board Games",
        price: 5500,
        image: "img/word-wizards.jpg",
        desc: "Fast family word game."
    },
    {
        id: 9,
        name: "Treasure Trek",
        category: "Board Games",
        price: 2000,
        image: "img/treasure-trek.jpg",
        desc: "Co-operative adventure."
    },
    {
        id: 10,
        name: "Red Racer 1:32",
        category: "Diecast Cars",
        price: 1000,
        image: "img/red-racer.jpg",
        desc: "Opening doors, rubber tyres."
    },
    {
        id: 11,
        name: "Classic Roadster",
        category: "Diecast Cars",
        price: 2100,
        image: "img/classic-roadster.jpg",
        desc: "Retro 1:32 collector car."
    },
    {
        id: 12,
        name: "Rescue Truck",
        category: "Diecast Cars",
        price: 1650,
        image: "img/rescue-truck.jpg",
        desc: "Working ladder and lights."
    }
];

const CATEGORIES = [
    "All",
    "Figurines",
    "Toys",
    "Board Games",
    "Diecast Cars"
];

/* ---------- Helper Functions ---------- */

const $ = (selector, parent = document) =>
    parent.querySelector(selector);

function load(key, defaultValue) {
    try {
        return JSON.parse(localStorage.getItem(key)) ?? defaultValue;
    } catch {
        return defaultValue;
    }
}

function save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function money(value) {
    return "LKR " + value.toFixed(2);
}

function getProduct(id) {
    return PRODUCTS.find(product => product.id === id);
}

function getCart() {
    return load("cart", []);
}

function showToast(message) {
    const toast = $("#toast");

    if (!toast) {
        return;
    }

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(showToast.timer);

    showToast.timer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}

function updateCartCount() {
    const count = $("#count");

    if (!count) {
        return;
    }

    const totalItems = getCart().reduce(
        (total, item) => total + item.qty,
        0
    );

    count.textContent = totalItems;
}

function addToCart(id) {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.qty++;
    } else {
        cart.push({
            id: id,
            qty: 1
        });
    }

    save("cart", cart);
    updateCartCount();
    showToast("Added to cart 🛒");
}

function addToWishlist(id) {
    const wishlist = load("wishlist", {});

    if (!wishlist[id]) {
        wishlist[id] = "Interested";
    }

    save("wishlist", wishlist);
    showToast("Saved to wishlist ♥");
}

/* ---------- Form Validation ---------- */

const required = label => value =>
    value ? "" : label + " is required.";

const emailRule = value =>
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)
        ? ""
        : "Enter a valid email address.";

function validate(form, rules) {
    let valid = true;

    for (const fieldName in rules) {
        const field = form.elements[fieldName];

        if (!field) {
            continue;
        }

        const error = rules[fieldName](field.value.trim());
        const errorBox = form.querySelector("#e-" + fieldName);

        if (errorBox) {
            errorBox.textContent = error;
        }

        field.setAttribute("aria-invalid", error ? "true" : "false");

        if (error) {
            valid = false;
        }
    }

    return valid;
}

/* ---------- Product Cards ---------- */

function productCard(product) {
    return `
        <article class="card">
            <div class="thumb-container">
                <img
                    src="${product.image}"
                    alt="${product.name}"
                    class="product-image-asset"
                >
            </div>

            <h3>${product.name}</h3>
            <p class="cat">${product.category}</p>
            <p class="price">${money(product.price)}</p>

            <div class="actions">
                <button type="button" class="btn small" data-cart="${product.id}">
                    Add to Cart
                </button>

                <button type="button" class="btn small accent" data-wish="${product.id}">
                    Add to Wishlist
                </button>

                <button type="button" class="btn small" data-info="${product.id}">
                    Details
                </button>
            </div>
        </article>
    `;
}

/* ---------- Product Buttons ---------- */

document.addEventListener("click", event => {
    const button = event.target.closest("button");

    if (!button) {
        return;
    }

    if (button.dataset.cart) {
        addToCart(Number(button.dataset.cart));
    }

    if (button.dataset.wish) {
        addToWishlist(Number(button.dataset.wish));
    }

    if (button.dataset.info) {
        showProductModal(Number(button.dataset.info));
    }
});

function showProductModal(id) {
    const product = getProduct(id);
    const modal = $("#modal");
    const body = $("#m-body");

    if (!product || !modal || !body) {
        return;
    }

    body.innerHTML = `
        <img
            src="${product.image}"
            alt="${product.name}"
            class="modal-image"
        >

        <h2 id="m-title">${product.name}</h2>

        <p>${product.desc}</p>

        <p class="cat">${product.category}</p>

        <p class="price">${money(product.price)}</p>
    `;

    modal.showModal();
}

/* ---------- Mobile Menu ---------- */

const burger = $(".burger");

if (burger) {
    burger.addEventListener("click", () => {
        const isOpen = burger.classList.toggle("open");
        const menu = $("#menu");

        if (menu) {
            menu.classList.toggle("show", isOpen);
        }

        burger.setAttribute("aria-expanded", isOpen);
    });
}

/* ---------- Newsletter ---------- */

const newsletter = $("#newsletter");

if (newsletter) {
    newsletter.addEventListener("submit", event => {
        event.preventDefault();

        if (!validate(event.target, { email: emailRule })) {
            return;
        }

        const emails = load("newsletter", []);
        emails.push(event.target.email.value.trim());

        save("newsletter", emails);

        event.target.reset();

        showToast("Subscribed! 🎉");
    });
}

/* ---------- Scroll Animation ---------- */

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("seen");
            }
        });
    }, {
        threshold: 0.15
    });

    document.querySelectorAll(".reveal").forEach(element => {
        observer.observe(element);
    });
} else {
    document.querySelectorAll(".reveal").forEach(element => {
        element.classList.add("seen");
    });
}

/* ---------- Service Worker ---------- */

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
}

updateCartCount();

/* ---------- Page Functions ---------- */

const pages = {

    /* HOME */

    index() {
        const slides = document.querySelectorAll(".slide");

        if (slides.length > 1) {
            let currentSlide = 0;

            setInterval(() => {
                slides[currentSlide].classList.remove("active");

                currentSlide =
                    (currentSlide + 1) % slides.length;

                slides[currentSlide].classList.add("active");
            }, 4000);
        }

        const dayNumber =
            Math.floor(Date.now() / 86400000);

        const productOfTheDay =
            PRODUCTS[dayNumber % PRODUCTS.length];

        const potd = $("#potd");

        if (potd) {
            potd.innerHTML =
                productCard(productOfTheDay);
        }

        const featured = $("#featured");

        if (featured) {
            const featuredIds = [1, 4, 7, 10];

            featured.innerHTML = featuredIds
                .map(id => productCard(getProduct(id)))
                .join("");
        }
    },

    /* PRODUCTS */

    products() {
        let activeCategory = "All";

        const filterContainer = $("#filters");
        const search = $("#search");
        const grid = $("#grid");
        const results = $("#results");
        const modalClose = $("#m-close");

        if (filterContainer) {
            filterContainer.innerHTML =
                CATEGORIES.map(category => `
                    <button
                        type="button"
                        class="chip ${category === "All" ? "on" : ""}"
                        data-cat="${category}"
                    >
                        ${category}
                    </button>
                `).join("");
        }

        function displayProducts() {
            const searchText =
                search ? search.value.toLowerCase() : "";

            const filteredProducts = PRODUCTS.filter(product => {
                const categoryMatch =
                    activeCategory === "All" ||
                    product.category === activeCategory;

                const searchMatch =
                    product.name
                        .toLowerCase()
                        .includes(searchText);

                return categoryMatch && searchMatch;
            });

            if (grid) {
                grid.innerHTML =
                    filteredProducts.map(productCard).join("");
            }

            if (results) {
                results.textContent =
                    filteredProducts.length +
                    " product" +
                    (filteredProducts.length === 1 ? "" : "s") +
                    " found.";
            }
        }

        if (filterContainer) {
            filterContainer.addEventListener("click", event => {
                const category = event.target.dataset.cat;

                if (!category) {
                    return;
                }

                activeCategory = category;

                document.querySelectorAll(".chip").forEach(chip => {
                    chip.classList.toggle(
                        "on",
                        chip.dataset.cat === activeCategory
                    );
                });

                displayProducts();
            });
        }

        if (search) {
            search.addEventListener("input", displayProducts);
        }

        if (modalClose) {
            modalClose.addEventListener("click", () => {
                $("#modal").close();
            });
        }

        displayProducts();
    },

    /* CART */

    cart() {
        const cartBox = $("#cart");

        if (!cartBox) {
            return;
        }

        function displayCart() {
            const cart = getCart();

            if (!cart.length) {
                cartBox.innerHTML = `
                    <p>Your cart is empty.</p>
                    <br>
                    <a class="btn" href="products.html">
                        Shop Now
                    </a>
                `;

                return;
            }

            let total = 0;

            const rows = cart.map(item => {
                const product = getProduct(item.id);

                if (!product) {
                    return "";
                }

                const subtotal =
                    product.price * item.qty;

                total += subtotal;

                return `
                    <tr>
                        <td>
                            ${product.name}
                        </td>

                        <td class="qty">
                            <button
                                type="button"
                                data-q="-1"
                                data-id="${product.id}"
                                aria-label="Decrease quantity"
                            >
                                -
                            </button>

                            <span>${item.qty}</span>

                            <button
                                type="button"
                                data-q="1"
                                data-id="${product.id}"
                                aria-label="Increase quantity"
                            >
                                +
                            </button>
                        </td>

                        <td>
                            ${money(product.price)}
                        </td>

                        <td>
                            ${money(subtotal)}
                        </td>
                    </tr>
                `;
            }).join("");

            cartBox.innerHTML = `
                <div class="table-wrap">
                    <table>
                        <caption class="sr">
                            Shopping cart items
                        </caption>

                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Quantity</th>
                                <th>Unit Price</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>

                        <tbody>
                            ${rows}
                        </tbody>
                    </table>
                </div>

                <h2>Total: ${money(total)}</h2>

                <button
                    type="button"
                    class="btn"
                    id="clear"
                >
                    Clear Cart
                </button>

                <a
                    class="btn accent"
                    href="checkout.html"
                >
                    Proceed to Checkout
                </a>
            `;
        }

        cartBox.addEventListener("click", event => {
            const button =
                event.target.closest("button");

            if (!button) {
                return;
            }

            let cart = getCart();

            if (button.id === "clear") {
                if (!confirm("Are you sure you want to clear your cart?")) {
                    return;
                }

                cart = [];
            }

            if (button.dataset.q) {
                const item = cart.find(
                    product =>
                        product.id ===
                        Number(button.dataset.id)
                );

                if (item) {
                    item.qty += Number(button.dataset.q);
                }

                cart = cart.filter(item => item.qty > 0);
            }

            save("cart", cart);
            updateCartCount();
            displayCart();
        });

        displayCart();
    },

    /* CHECKOUT */

    checkout() {
        const form = $("#checkout");
        const summary = $("#summary");
        const payment = $("#pay");
        const cardBox = $("#cardbox");

        if (!form) {
            return;
        }

        function displaySummary() {
            const cart = getCart();

            let total = 0;

            if (!cart.length) {
                summary.innerHTML = `
                    <p>
                        Your cart is empty.
                        <a href="products.html">Shop Now</a>
                    </p>
                `;

                return;
            }

            const items = cart.map(item => {
                const product = getProduct(item.id);
                const subtotal =
                    product.price * item.qty;

                total += subtotal;

                return `
                    <li>
                        ${product.name} × ${item.qty}
                        - ${money(subtotal)}
                    </li>
                `;
            }).join("");

            summary.innerHTML = `
                <ul>
                    ${items}
                </ul>

                <h3>
                    Total: ${money(total)}
                </h3>
            `;
        }

        if (payment && cardBox) {
            payment.addEventListener("change", () => {
                cardBox.hidden =
                    payment.value !== "card";
            });
        }

        form.addEventListener("submit", event => {
            event.preventDefault();

            const cart = getCart();

            if (!cart.length) {
                showToast("Your cart is empty.");
                return;
            }

            const rules = {
                name: required("Name"),

                email: emailRule,

                address: value =>
                    value.length >= 10
                        ? ""
                        : "Enter your full delivery address."
            };

            if (form.pay.value === "card") {
                rules.card = value =>
                    /^\d{16}$/.test(
                        value.replace(/\s/g, "")
                    )
                        ? ""
                        : "Card number must be 16 digits.";
            } else {
                const cardError = $("#e-card");

                if (cardError) {
                    cardError.textContent = "";
                }
            }

            if (!validate(form, rules)) {
                return;
            }

            const total = cart.reduce(
                (sum, item) =>
                    sum +
                    getProduct(item.id).price *
                    item.qty,
                0
            );

            const orders = load("orders", []);

            orders.push({
                date: new Date().toISOString(),
                name: form.name.value.trim(),
                email: form.email.value.trim(),
                address: form.address.value.trim(),
                items: cart,
                total: total,
                payment: form.pay.value
            });

            save("orders", orders);

            localStorage.removeItem("cart");

            updateCartCount();

            const success = $("#success");

            if (success) {
                success.hidden = false;
            }

            form.reset();

            if (cardBox) {
                cardBox.hidden = true;
            }

            displaySummary();
        });

        displaySummary();
    },

    /* WISHLIST */

    wishlist() {
        const wishlistBox = $("#wishlist");

        if (!wishlistBox) {
            return;
        }

        function displayWishlist() {
            const wishlist = load("wishlist", {});
            const ids = Object.keys(wishlist);

            if (!ids.length) {
                wishlistBox.innerHTML = `
                    <p>
                        Nothing saved yet.
                        <a href="products.html">
                            Browse products
                        </a>
                    </p>
                `;

                return;
            }

            wishlistBox.innerHTML = ids.map(id => {
                const product = getProduct(Number(id));

                if (!product) {
                    return "";
                }

                return `
                    <article class="card">
                        <div class="thumb">
                            <img
                                src="${product.image}"
                                alt="${product.name}"
                            >
                        </div>

                        <h3>${product.name}</h3>

                        <p class="cat">
                            ${product.category}
                        </p>

                        <p class="price">
                            ${money(product.price)}
                        </p>

                        <label for="s${id}">
                            Wishlist Status
                        </label>

                        <select
                            id="s${id}"
                            data-id="${id}"
                        >
                            ${[
                                "Interested",
                                "Owned",
                                "Not Interested"
                            ].map(status => `
                                <option
                                    ${wishlist[id] === status ? "selected" : ""}
                                >
                                    ${status}
                                </option>
                            `).join("")}
                        </select>

                        <br>

                        <button
                            type="button"
                            class="btn small"
                            data-rm="${id}"
                        >
                            Remove
                        </button>
                    </article>
                `;
            }).join("");
        }

        wishlistBox.addEventListener("change", event => {
            if (!event.target.dataset.id) {
                return;
            }

            const wishlist = load("wishlist", {});

            wishlist[event.target.dataset.id] =
                event.target.value;

            save("wishlist", wishlist);

            showToast("Wishlist status updated.");
        });

        wishlistBox.addEventListener("click", event => {
            const button =
                event.target.closest("[data-rm]");

            if (!button) {
                return;
            }

            const wishlist = load("wishlist", {});

            delete wishlist[button.dataset.rm];

            save("wishlist", wishlist);

            displayWishlist();

            showToast("Removed from wishlist.");
        });

        displayWishlist();
    },

    /* FEEDBACK */

    feedback() {
        const form = $("#feedback");

        if (!form) {
            return;
        }

        form.addEventListener("submit", event => {
            event.preventDefault();

            const rules = {
                name: required("Name"),

                email: emailRule,

                message: value =>
                    value.length >= 10
                        ? ""
                        : "Message must be at least 10 characters."
            };

            if (!validate(form, rules)) {
                return;
            }

            const feedbackList = load("feedback", []);

            feedbackList.push({
                name: form.name.value.trim(),
                email: form.email.value.trim(),
                message: form.message.value.trim(),
                date: new Date().toISOString()
            });

            save("feedback", feedbackList);

            form.reset();

            const success = $("#ok");

            if (success) {
                success.textContent =
                    "Thanks! Your feedback has been submitted. 🎉";
            }
        });

        document.querySelectorAll(".faq button").forEach(button => {
            button.addEventListener("click", () => {
                const panel =
                    button.parentElement.nextElementSibling;

                if (!panel) {
                    return;
                }

                const opening = panel.hidden;

                panel.hidden = !opening;

                button.setAttribute(
                    "aria-expanded",
                    opening
                );
            });
        });
    }
};

/* ---------- Start Correct Page ---------- */

const page = document.body.dataset.page;

if (page && pages[page]) {
    pages[page]();
}