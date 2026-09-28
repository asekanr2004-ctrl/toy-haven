/**
 * ============================================================================
 * TOY HAVEN PLATFORM CENTRAL APP CORE ORCHESTRATOR
 * ============================================================================
*/
// Centralized Immutable E-Commerce Product Catalog Dataset
const PRODUCTS = [
  // 1. FIGURINES REGISTRY SECTOR (Items 1-3)
  { id: 1, name: "Dragon Knight Figure", category: "Figurines", price: 5500, image: "img/dragon-knight.jpg", desc: "Hand-painted 15cm collectible." },
  { id: 2, name: "Space Ranger Statue", category: "Figurines", price: 6000, image: "img/space-ranger.jpg", desc: "Limited edition display statue." },
  { id: 3, name: "Wizard Collectible", category: "Figurines", price: 8000, image: "img/wizard.jpg", desc: "Glow-in-the-dark staff." },
  
  // 2. TOYS REGISTRY SECTOR (Items 4-6)
  { id: 4, name: "Robo Buddy", category: "Toys", price: 2500, image: "img/robo-buddy.jpg", desc: "Walking, talking robot. Ages 5+." },
  { id: 5, name: "Plush Panda", category: "Toys", price: 1400, image: "img/plush-panda.jpg", desc: "Super-soft 30cm plush." },
  { id: 6, name: "Building Blocks Set", category: "Toys", price: 2700, image: "img/building-blocks.jpg", desc: "200 colourful pieces." },
  
  // 3. BOARD GAMES REGISTRY SECTOR (Items 7-9)
  { id: 7, name: "Castle Quest", category: "Board Games", price: 5000, image: "img/castle-quest.jpg", desc: "2-4 players. Ages 8+." },
  { id: 8, name: "Word Wizards", category: "Board Games", price: 5500, image: "img/word-wizards.jpg", desc: "Fast family word game." },
  { id: 9, name: "Treasure Trek", category: "Board Games", price: 2000, image: "img/treasure-trek.jpg", desc: "Co-operative adventure." },
  
  // 4. DIECAST CARS REGISTRY SECTOR (Items 10-12)
  { id: 10, name: "Red Racer 1:32", category: "Diecast Cars", price: 1000, image: "img/red-racer.jpg", desc: "Opening doors, rubber tyres." },
  { id: 11, name: "Classic Roadster", category: "Diecast Cars", price: 2100, image: "img/classic-roadster.jpg", desc: "Retro 1:32 collector car." },
  { id: 12, name: "Rescue Truck", category: "Diecast Cars", price: 1650, image: "img/rescue-truck.jpg", desc: "Working ladder and lights." }
];

const CATS = ["All", "Figurines", "Toys", "Board Games", "Diecast Cars"];

/* ----------------------------------------------------------------------------
   2. REUSABLE HELPERS (Used globally across all features)
   ---------------------------------------------------------------------------- */

// Reusable DOM selector fragment shorthand helper (replaces document.querySelector)
const $ = (s, r = document) => r.querySelector(s);

// Reusable LocalStorage reader wrapper (safely handles missing keys or parsing errors)
const load = (k, d) => { 
  try { 
    return JSON.parse(localStorage.getItem(k)) ?? d; 
  } catch (e) { 
    return d; 
  } 
};

const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));

const money = n => "LKR " + n.toFixed(2);

const byId = id => PRODUCTS.find(p => p.id === id);

const cartItems = () => load("cart", []);


function toast(msg) {
  const t = $("#toast"); 
  t.textContent = msg; 
  t.classList.add("show");
  clearTimeout(toast.t); 
  toast.t = setTimeout(() => t.classList.remove("show"), 2000);
}

// Calculates total item weights
function updateCount() {
  const countBadge = $("#count");
  if (countBadge) {
    countBadge.textContent = cartItems().reduce((s, i) => s + i.qty, 0);
  }
}

// Add to Cart functionality with LocalStorage 
function addToCart(id) {
  const cart = cartItems();
  const it = cart.find(i => i.id === id);
  
  it ? it.qty++ : cart.push({ id, qty: 1 });
  
  save("cart", cart); 
  updateCount(); 
  toast("Added to cart 🛒");
}

function addToWishlist(id) {
  const w = load("wishlist", {});
  if (!w[id]) w[id] = "Interested"; 
  
  save("wishlist", w); 
  toast("Saved to wishlist ♥");
}


function validate(form, rules) {
  let ok = true;
  for (const n in rules) {
    const el = form.elements[n];
    if (!el) continue;
    const msg = rules[n](el.value.trim());
    
    // Dynamically inject error strings into warning slots
    const errorDisplaySlot = form.querySelector("#e-" + n);
    if (errorDisplaySlot) errorDisplaySlot.textContent = msg;
    
    el.setAttribute("aria-invalid", !!msg);
    if (msg) ok = false;
  }
  return ok;
}

// Form constraint variables
const req = label => v => v ? "" : label + " is required.";
const emailRule = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}\$/.test(v) ? "" : "Enter a valid email address.";


function productCard(p) {
  return `<article class="card">
    <!-- Updated to read the local .jpg asset path instead of emojis -->
    <div class="thumb-container" style="width: 100%; height: 200px; overflow: hidden; border-radius: 12px; margin-bottom: 12px;">
      <img src="${p.image}" alt="${p.name}" class="product-image-asset" style="width: 100%; height: 100%; object-fit: cover; transition: transform .3s;">
    </div>
    <h3>${p.name}</h3>
    <p class="cat">${p.category}</p>
    <p class="price">${money(p.price)}</p>
    <div class="actions">
      <button class="btn small" data-cart="${p.id}">Add to Cart</button>
      <button class="btn small accent" data-wish="${p.id}">Add to Wishlist</button>
      <button class="btn small" data-info="${p.id}">Details</button>
    </div>
  </article>`;
}

document.addEventListener("click", e => {
  const b = e.target.closest("button"); 
  if (!b) return;
  if (b.dataset.cart) addToCart(+b.dataset.cart);
  if (b.dataset.wish) addToWishlist(+b.dataset.wish);
  if (b.dataset.info) showModal(+b.dataset.info);
});

function showModal(id) {
  const p = byId(id);
  $("#m-body").innerHTML = `
    <h2 id="m-title">${p.emoji} ${p.name}</h2>
    <p>${p.desc}</p>
    <p class="cat">${p.category}</p>
    <p class="price">${money(p.price)}</p>
  `;
  $("#modal").showModal();
}

/* ----------------------------------------------------------------------------
   3. SHARED GLOBAL SETUP 
   ---------------------------------------------------------------------------- */

// Responsive Hamburger Menu Activation
const burger = $(".burger");
if (burger) {
  burger.addEventListener("click", () => {
    const open = burger.classList.toggle("open");
    $("#menu").classList.toggle("show", open);
    burger.setAttribute("aria-expanded", open);
  });
}

// Global Footer Newsletter Form 
const newsletterForm = $("#newsletter");
if (newsletterForm) {
  newsletterForm.addEventListener("submit", e => {
    e.preventDefault();
    if (validate(e.target, { email: emailRule })) {
      const list = load("newsletter", []); 
      list.push(e.target.email.value.trim());
      save("newsletter", list); 
      e.target.reset(); 
      toast("Subscribed! 🎉");
    }
  });
}

// Smooth Scroll Animation 
const io = new IntersectionObserver(es => {
  es.forEach(x => x.isIntersecting && x.target.classList.add("seen"));
}, { threshold: .15 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

// Registering PWA service worker configurations
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}

updateCount();


const pages = {
  
  // HOME VIEW 
  index() {
    const slides = document.querySelectorAll(".slide"); 
    let idx = 0;
    
    // Auto-Rotating Hero Banner System Carousel (4 seconds)
    setInterval(() => { 
      slides[idx].classList.remove("active"); 
      idx = (idx + 1) % slides.length; 
      slides[idx].classList.add("active"); 
    }, 4000);
    
    /* Product of the Day Rule: Locks a single product choice all day, changes automatically at midnight */
    const dayTimestamp = Math.floor(Date.now() / 86400000);
    const productOfTheDay = PRODUCTS[dayTimestamp % PRODUCTS.length];
    
    const potdContainer = $("#potd");
    if (potdContainer) potdContainer.innerHTML = productCard(productOfTheDay);

    const featuredContainer = $("#featured");
    if (featuredContainer) {
      featuredContainer.innerHTML = [1, 4, 7, 10].map(id => productCard(byId(id))).join("");
    }
  },

  // PRODUCTS CATALOG 
  products() {
    let activeFilterCategory = "All";
    const filterContainer = $("#filters");

    if (filterContainer) {
      filterContainer.innerHTML = CATS.map(c => 
        `<button class="chip${c === "All" ? " on" : ""}" data-cat="${c}">${c}</button>`
      ).join("");
    }

    const drawCatalogGrid = () => {
      const searchQuery = $("#search").value.toLowerCase();
      const filteredResultsList = PRODUCTS.filter(p => 
        (activeFilterCategory === "All" || p.category === activeFilterCategory) && p.name.toLowerCase().includes(searchQuery)
      );
      
      $("#grid").innerHTML = filteredResultsList.map(productCard).join("");

      $("#results").textContent = filteredResultsList.length 
        ? filteredResultsList.length + " products found." 
        : "No products found.";
    };

    if (filterContainer) {
      filterContainer.addEventListener("click", e => {
        if (!e.target.dataset.cat) return;
        activeFilterCategory = e.target.dataset.cat;
        document.querySelectorAll(".chip").forEach(c => c.classList.toggle("on", c.dataset.cat === activeFilterCategory));
        drawCatalogGrid();
      });
    }

    const searchBarElement = $("#search");
    if (searchBarElement) searchBarElement.addEventListener("input", drawCatalogGrid);
    
    const modalCloseTrigger = $("#m-close");
    if (modalCloseTrigger) modalCloseTrigger.addEventListener("click", () => $("#modal").close());
    
    drawCatalogGrid();
  },

  // SHOPPING CART 
  cart() {
    const drawCartRowsTable = () => {
      const activeCartList = cartItems();
      const cartDisplayWrapperBox = $("#cart");
      
      if (!activeCartList.length) {
        cartDisplayWrapperBox.innerHTML = `
          <p>Your cart is empty.</p>
          <br>
          <a class="btn" href="products.html">Shop Now</a>
        `; 
        return; 
      }
      
      let invoiceRunningSumTotal = 0;
      const htmlTableRowsList = activeCartList.map(item => {
        const productData = byId(item.id);
        const itemLineSubtotal = productData.price * item.qty; 
        invoiceRunningSumTotal += itemLineSubtotal;
        
        return `<tr>
          <td>${productData.emoji} ${productData.name}</td>
          <td class="qty">
            <button data-q="-1" data-id="${productData.id}" aria-label="Decrease quantity">-</button> 
            <span style="margin: 0 6px; font-weight: bold;">${item.qty}</span> 
            <button data-q="1" data-id="${productData.id}" aria-label="Increase quantity">+</button>
          </td>
          <td>${money(productData.price)}</td>
          <td>${money(itemLineSubtotal)}</td>
        </tr>`;
      }).join("");

      cartDisplayWrapperBox.innerHTML = `
        <table>
          <caption class="sr">Cart items list ledger</caption>
          <thead>
            <tr>
              <th>Item Variant</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>${htmlTableRowsList}</tbody>
        </table>
        <h2 style="margin: 20px 0;">Total Summary Cost: ${money(invoiceRunningSumTotal)}</h2>
        <button class="btn" id="clear">Clear Cart</button> 
        <a class="btn accent" href="checkout.html">Proceed to Checkout</a>
      `;
    };

    $("#cart").addEventListener("click", e => {
      const targetActionButton = e.target.closest("button"); 
      if (!targetActionButton) return;
      let currentCartMemoryState = cartItems();
      
      if (targetActionButton.id === "clear") {
        if (confirm("Are you sure you want to completely empty your cart?")) {
          currentCartMemoryState = [];
        } else {
          return;
        }
      } else if (targetActionButton.dataset.q) {
        const matchedRecordItem = currentCartMemoryState.find(i => i.id === +targetActionButton.dataset.id); 
        matchedRecordItem.qty += +targetActionButton.dataset.q;

        currentCartMemoryState = currentCartMemoryState.filter(i => i.qty > 0);
      } else {
        return;
      }
      
      save("cart", currentCartMemoryState); 
      updateCount(); 
      drawCartRowsTable();
    });

    drawCartRowsTable();
  },

  // CHECKOUT DATA INGESTION & INTERACTION 
  checkout() {
    const currentActiveCartList = cartItems();
    const computedGrandSummaryTotal = currentActiveCartList.reduce((s, i) => s + byId(i.id).price * i.qty, 0);
    
    const summaryInvoiceDisplaySlot = $("#summary");
    if (summaryInvoiceDisplaySlot) {
      summaryInvoiceDisplaySlot.innerHTML = currentActiveCartList.length
        ? `<ul>
             ${currentActiveCartList.map(i => `<li>${byId(i.id).name} x ${i.qty} - ${money(byId(i.id).price * i.qty)}</li>`).join("")}
           </ul>
           <h3>Total Invoice Balance: ${money(computedGrandSummaryTotal)}</h3>`
        : `<p>Your cart is empty. <a href="products.html">Shop Now</a></p>`;
    }

    const checkoutFormContainer = $("#checkout");
    const paymentSelectorDropBox = $("#pay");
    const simulatedCardBoxWrapper = $("#cardbox");

    // Toggling custom card entry field display on option changes
    if (paymentSelectorDropBox && simulatedCardBoxWrapper) {
      paymentSelectorDropBox.addEventListener("change", e => { 
        simulatedCardBoxWrapper.hidden = e.target.value !== "card"; 
      });
    }

    if (checkoutFormContainer) {
      checkoutFormContainer.addEventListener("submit", e => {
        e.preventDefault();
        
        if (!currentActiveCartList.length) {
          return toast("Your cart is empty.");
        }

        const validationConstraintsSchema = {
          name: req("Name"), 
          email: emailRule, 
          address: v => v.length >= 10 ? "" : "Enter your full delivery address."
        };

        if (checkoutFormContainer.pay.value === "card") {
          validationConstraintsSchema.card = v => /^\d{16}\$/.test(v.replace(/\s/g, "")) ? "" : "Card number must be 16 digits.";
        } else {
          const errorCardField = $("#e-card");
          if (errorCardField) errorCardField.textContent = "";
        }

        if (!validate(checkoutFormContainer, validationConstraintsSchema)) return;

        const globalOrderLogsLedger = load("orders", []);
        globalOrderLogsLedger.push({
          date: new Date().toISOString(), 
          name: checkoutFormContainer.name.value.trim(), 
          email: checkoutFormContainer.email.value.trim(), 
          items: currentActiveCartList, 
          total: computedGrandSummaryTotal, 
          payment: checkoutFormContainer.pay.value
        });

        save("orders", globalOrderLogsLedger); 
        localStorage.removeItem("cart"); 
        
        // Reset state metrics
        updateCount(); 

        const successOverlayScreen = $("#success");
        if (successOverlayScreen) successOverlayScreen.hidden = false;
      });
    }
  },

  //  WISHLIST STATUS ADJUSTER & DELETIONS 
  wishlist() {
    const drawWishlistCollectionCards = () => {
      const storedWishlistObjectMap = load("wishlist", {});
      const wishlistKeysArrayIdsList = Object.keys(storedWishlistObjectMap);
      const gridTargetBoxElement = $("#wishlist");

      if (gridTargetBoxElement) {
        gridTargetBoxElement.innerHTML = wishlistKeysArrayIdsList.length 
          ? wishlistKeysArrayIdsList.map(idStringKey => {
              const itemProductMeta = byId(+idStringKey);
              return `<article class="card">
                <div class="thumb ${itemProductMeta.category.replace(" ", "-")}" aria-hidden="true">${itemProductMeta.emoji}</div>
                <h3>${itemProductMeta.name}</h3>
                
                <label for="s${idStringKey}">Status Collection Tag</label>
                <select id="s${idStringKey}" data-id="${idStringKey}">
                  ${["Interested", "Owned", "Not Interested"].map(statusOptionString => 
                    `<option${storedWishlistObjectMap[idStringKey] === statusOptionString ? " selected" : ""}>${statusOptionString}</option>`
                  ).join("")}
                </select>
                
                <p style="margin-top:12px;">
                  <button class="btn small" style="background: var(--bad); width:100%;" data-rm="${idStringKey}">Remove From List</button>
                </p>
              </article>`;
            }).join("") 
          : `<p>Nothing saved yet. <a href="products.html">Browse products</a></p>`;
      }
    };

    const interactiveGridContainer = $("#wishlist");
    if (interactiveGridContainer) {
      interactiveGridContainer.addEventListener("change", e => {
        const currentWishlistRegistry = load("wishlist", {}); 
        currentWishlistRegistry[e.target.dataset.id] = e.target.value; 
        
        save("wishlist", currentWishlistRegistry); 
        toast("Status tag updated! ✏️");
      });

      interactiveGridContainer.addEventListener("click", e => {
        if (!e.target.dataset.rm) return;
        
        const currentWishlistRegistry = load("wishlist", {}); 
        delete currentWishlistRegistry[e.target.dataset.rm]; 
        
        save("wishlist", currentWishlistRegistry); 
        drawWishlistCollectionCards();
        toast("Removed from collection wishlist");
      });
    }

    drawWishlistCollectionCards();
  },

  // SUPPORT FEEDBACK PIPELINES & FAQ 
  feedback() {
    const primaryFeedbackForm = $("#feedback");
    
    if (primaryFeedbackForm) {
      primaryFeedbackForm.addEventListener("submit", e => {
        e.preventDefault();
        
        const feedbackValidationRules = {
          name: req("Name"), 
          email: emailRule, 
          message: v => v.length >= 10 ? "" : "Message must be at least 10 characters."
        };

        if (!validate(primaryFeedbackForm, feedbackValidationRules)) return;
        
        const storedFeedbackSubmissionsArray = load("feedback", []);
        storedFeedbackSubmissionsArray.push({
          name: primaryFeedbackForm.name.value.trim(), 
          email: primaryFeedbackForm.email.value.trim(), 
          message: primaryFeedbackForm.message.value.trim(), 
          date: new Date().toISOString()
        });
        
        save("feedback", storedFeedbackSubmissionsArray); 
        primaryFeedbackForm.reset(); 
        
        const feedbackSuccessSlot = $("#ok");
        if (feedbackSuccessSlot) {
            feedbackSuccessSlot.textContent = "Thanks! Your feedback has been logged successfully. 🎉";
        }
      });
    }

    document.querySelectorAll(".faq button").forEach(b => {
      b.addEventListener("click", () => {
        const panelSectionSibling = b.parentElement.nextElementSibling;
        if (!panelSectionSibling) return;
        
        const targetOpenStateVisibilityToggle = panelSectionSibling.hidden;
        panelSectionSibling.hidden = !targetOpenStateVisibilityToggle; 
        
        b.setAttribute("aria-expanded", targetOpenStateVisibilityToggle);
      });
    });
  }
};

/* ----------------------------------------------------------------------------
   5. ROUTER INITIALIZATION GATEWAY
   ---------------------------------------------------------------------------- */
const targetPageMetadataIdAttribute = document.body.dataset.page;
if (targetPageMetadataIdAttribute && pages[targetPageMetadataIdAttribute]) {
  pages[targetPageMetadataIdAttribute]();
}