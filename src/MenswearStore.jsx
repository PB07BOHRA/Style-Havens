import { useEffect, useRef, useState } from "react";
import { categoryPages } from "./categories/index.js";
import { AboutPage, AccountPage, BagPage, CheckoutPage, ContactPage, LoginPage, ProductPage, RouteLink, SearchPage, SignupPage, WishlistPage } from "./pages/index.js";
import "./Storefront.css";
import "./pages/StorePages.css";

const products = [
  { id: 1, name: "Oxford Shirt in Chalk", type: "Shirts", price: 1890, detail: "Midweight cotton  /  Regular fit", label: "A good place to start", image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=85" },
  { id: 2, name: "Heavyweight Tee in Washed Black", type: "T-shirts", price: 990, detail: "230 GSM cotton  /  Boxy fit", label: "Back in rotation", image: "https://images.unsplash.com/photo-1618354691438-25bc04584c23?auto=format&fit=crop&w=800&q=85" },
  { id: 3, name: "Relaxed Chino in Olive", type: "Trousers", price: 2190, detail: "Cotton twill  /  Relaxed taper", label: "An easy pairing", image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=85" },
  { id: 4, name: "Weekend Overshirt in Sand", type: "Jackets", price: 2790, detail: "Brushed cotton  /  Easy layer", label: "For cooler evenings", image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=800&q=85" },
  { id: 5, name: "Straight Jeans in Mid Blue", type: "Jeans", price: 2490, detail: "12 oz denim  /  Straight fit", label: "A familiar favourite", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=85" },
  { id: 6, name: "Ribbed Crew Tee in Ecru", type: "T-shirts", price: 1190, detail: "Cotton rib  /  Regular fit", label: "Soft by design", image: "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?auto=format&fit=crop&w=800&q=85" },
  { id: 7, name: "Camp Collar Shirt in Stripe", type: "Shirts", price: 1990, detail: "Cotton poplin  /  Relaxed fit", label: "A little different", image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=85" },
  { id: 8, name: "Canvas Work Jacket in Moss", type: "Jackets", price: 3490, detail: "Heavy canvas  /  Roomy fit", label: "Made for layering", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=85" },
  { id: 9, name: "Drawstring Short in Stone", type: "Shorts", price: 1590, detail: "Cotton twill  /  Easy straight fit", label: "For slower days", image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=800&q=85" },
  { id: 10, name: "Everyday Hoodie in Heather Grey", type: "Hoodies", price: 2290, detail: "Cotton fleece  /  Relaxed fit", label: "An easy layer", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=85" },
  { id: 11, name: "Loopback Sweatshirt in Navy", type: "Sweatshirts", price: 1990, detail: "Loopback cotton  /  Regular fit", label: "Made for repeat wear", image: "https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=800&q=85" },
];

const categories = ["Everything", "T-shirts", "Shirts", "Jeans", "Trousers", "Shorts", "Jackets", "Hoodies", "Sweatshirts"];
const STORAGE_KEYS = {
  cart: "stylehavens-cart",
  favorites: "stylehavens-favorites",
  recentlyViewed: "stylehavens-recently-viewed",
};
const money = (amount) => `₹${amount.toLocaleString("en-IN")}`;
const getSizes = (product) => ["Jeans", "Trousers", "Shorts"].includes(product.type)
  ? ["30", "32", "34", "36"]
  : ["S", "M", "L", "XL"];
const readStoredValue = (key, fallback, normalize) => {
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? normalize(JSON.parse(stored)) : fallback;
  } catch (error) {
    console.warn(`Could not load ${key} from local storage.`, error);
    return fallback;
  }
};
const saveStoredValue = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Could not save ${key} to local storage.`, error);
  }
};
const normalizeFavorites = (value) => Array.isArray(value)
  ? [...new Set(value.filter((id) => products.some((product) => product.id === id)))]
  : [];
const normalizeCart = (value) => Array.isArray(value)
  ? value.flatMap((item) => {
    const product = products.find((entry) => entry.id === item?.productId);
    const validSize = product && getSizes(product).includes(item.size);
    const validQuantity = Number.isInteger(item.quantity) && item.quantity > 0;
    return product && validSize && validQuantity
      ? [{ product, size: item.size, quantity: item.quantity }]
      : [];
  })
  : [];
const normalizeRecentlyViewed = (value) => Array.isArray(value)
  ? [...new Set(value.filter((id) => products.some((product) => product.id === id)))].slice(0, 6)
  : [];
const addRecentProduct = (pathname, recentIds) => {
  const match = pathname.match(/^\/products\/(\d+)$/);
  const productId = match ? Number(match[1]) : null;
  return productId && products.some((product) => product.id === productId)
    ? [productId, ...recentIds.filter((id) => id !== productId)].slice(0, 6)
    : recentIds;
};
const getCategoryPath = (value) => value === "Everything"
  ? "/"
  : `/categories/${value.toLowerCase().replace(/\s+/g, "-")}`;
const getCategoryFromPath = (pathname) => categories.find((value) => getCategoryPath(value) === pathname) || "Everything";

export default function MenswearStore() {
  const [pathname, setPathname] = useState(() => window.location.pathname);
  const [category, setCategory] = useState(() => getCategoryFromPath(window.location.pathname));
  const [search, setSearch] = useState(() => new URLSearchParams(window.location.search).get("q") || "");
  const [sort, setSort] = useState("featured");
  const [priceRange, setPriceRange] = useState("all");
  const [favorites, setFavorites] = useState(() => readStoredValue(STORAGE_KEYS.favorites, [], normalizeFavorites));
  const [cart, setCart] = useState(() => readStoredValue(STORAGE_KEYS.cart, [], normalizeCart));
  const [recentlyViewed, setRecentlyViewed] = useState(() => addRecentProduct(
    window.location.pathname,
    readStoredValue(STORAGE_KEYS.recentlyViewed, [], normalizeRecentlyViewed),
  ));
  const [selectedSizes, setSelectedSizes] = useState({});
  const [message, setMessage] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [account, setAccount] = useState(null);
  const storeRef = useRef(null);

  useEffect(() => {
    const root = storeRef.current;
    const sections = root?.querySelectorAll(".reveal-on-scroll");
    if (!root || !sections?.length) return undefined;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      sections.forEach((section) => section.classList.add("is-visible"));
      return undefined;
    }

    let observer;
    const startMotion = () => {
      if (document.visibilityState !== "visible" || root.classList.contains("motion-ready")) return;
      root.classList.add("motion-ready");
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -32px 0px" });
      sections.forEach((section) => observer.observe(section));
    };

    startMotion();
    document.addEventListener("visibilitychange", startMotion);
    return () => {
      document.removeEventListener("visibilitychange", startMotion);
      observer?.disconnect();
    };
  }, []);

  const shownProducts = products
    .filter((product) => category === "Everything" || product.type === category)
    .filter((product) => `${product.name} ${product.type}`.toLowerCase().includes(search.trim().toLowerCase()))
    .filter((product) => priceRange === "all"
      || (priceRange === "under-1500" && product.price < 1500)
      || (priceRange === "1500-2500" && product.price >= 1500 && product.price <= 2500)
      || (priceRange === "over-2500" && product.price > 2500))
    .sort((first, second) => {
      if (sort === "low") return first.price - second.price;
      if (sort === "high") return second.price - first.price;
      return first.id - second.id;
    });
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const CategoryPage = categoryPages[category];
  const favoriteProducts = products.filter((product) => favorites.includes(product.id));
  const productMatch = pathname.match(/^\/products\/(\d+)$/);
  const detailProduct = productMatch ? products.find((product) => product.id === Number(productMatch[1])) : null;
  const recentProducts = recentlyViewed.map((id) => products.find((product) => product.id === id)).filter(Boolean);
  const searchQuery = pathname === "/search" ? new URLSearchParams(window.location.search).get("q") || "" : "";
  const searchResults = products.filter((product) => `${product.name} ${product.type} ${product.detail}`.toLowerCase().includes(searchQuery.trim().toLowerCase()));

  const showMessage = (text) => {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 2400);
  };

  const addToBag = (product, size) => {
    if (!size) return;
    setCart((items) => {
      const existing = items.find((item) => item.product.id === product.id && item.size === size);
      return existing
        ? items.map((item) => item.product.id === product.id && item.size === size ? { ...item, quantity: item.quantity + 1 } : item)
        : [...items, { product, size, quantity: 1 }];
    });
    showMessage(`${product.name}, size ${size}, added to your bag`);
  };

  const changeQuantity = (id, size, amount) => {
    setCart((items) => items
      .map((item) => item.product.id === id && item.size === size ? { ...item, quantity: item.quantity + amount } : item)
      .filter((item) => item.quantity > 0));
  };

  const toggleFavorite = (id) => {
    setFavorites((items) => items.includes(id)
      ? items.filter((item) => item !== id)
      : [...items, id]);
  };

  const navigateToCategory = (value) => {
    const path = getCategoryPath(value);
    if (window.location.pathname !== path) window.history.pushState({ page: "category", category: value }, "", path);
    setPathname(path);
    setCategory(value);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const navigateToPath = (path) => {
    const target = new URL(path, window.location.origin);
    const targetUrl = `${target.pathname}${target.search}${target.hash}`;
    if (`${window.location.pathname}${window.location.search}${window.location.hash}` !== targetUrl) {
      window.history.pushState({ page: target.pathname }, "", targetUrl);
    }
    setPathname(target.pathname);
    setCategory(getCategoryFromPath(target.pathname));
    setRecentlyViewed((items) => addRecentProduct(target.pathname, items));
    if (target.pathname === "/search") setSearch(target.searchParams.get("q") || "");
    window.setTimeout(() => {
      if (target.hash) document.querySelector(target.hash)?.scrollIntoView();
      else window.scrollTo({ top: 0, behavior: "instant" });
    }, 0);
  };

  const handleRouteLink = (event, path) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigateToPath(path);
  };

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname);
      setCategory(getCategoryFromPath(window.location.pathname));
      setRecentlyViewed((items) => addRecentProduct(window.location.pathname, items));
      if (window.location.pathname === "/search") setSearch(new URLSearchParams(window.location.search).get("q") || "");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    saveStoredValue(STORAGE_KEYS.favorites, favorites);
  }, [favorites]);

  useEffect(() => {
    saveStoredValue(STORAGE_KEYS.cart, cart.map(({ product, size, quantity }) => ({ productId: product.id, size, quantity })));
  }, [cart]);

  useEffect(() => {
    saveStoredValue(STORAGE_KEYS.recentlyViewed, recentlyViewed);
  }, [recentlyViewed]);

  const submitAccount = (event, mode) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const name = formData.get("name") || email.split("@")[0];
    setAccount({ name, email });
    navigateToPath("/account");
    showMessage(`${mode === "signup" ? "Welcome" : "Demo sign-in"}, ${name.split(" ")[0]}`);
  };

  const AuthRoutePage = pathname === "/signup"
    ? SignupPage
    : pathname === "/account" && account
      ? AccountPage
      : LoginPage;
  const authPageProps = {
    account,
    onSubmit: submitAccount,
    onSignOut: () => { setAccount(null); navigateToPath("/"); showMessage("You have signed out."); },
    onNavigate: navigateToPath,
    showPassword,
    onTogglePassword: () => setShowPassword((value) => !value),
  };

  return (
    <div className="storefront" ref={storeRef}>
      <div className="promo-bar">
        <span>STYLEHAVENS — CLOTHES TO LIVE IN</span>
        <p>Good cotton. Familiar fits. Nothing to figure out.</p>
        <a href="/#collection" onClick={(event) => handleRouteLink(event, "/#collection")}>Take a look <span aria-hidden="true">↗</span></a>
      </div>

      <header className="site-header">
        <a className="wordmark" href="/" onClick={(event) => handleRouteLink(event, "/")}>stylehavens<span>.</span></a>
        <nav aria-label="Main navigation">
          <a href="/" onClick={(event) => handleRouteLink(event, "/")}>Shop all</a>
          <a href="/#categories" onClick={(event) => handleRouteLink(event, "/#categories")}>Collections</a>
          <a href="/about" onClick={(event) => handleRouteLink(event, "/about")}>Our story</a>
        </nav>
        <form className="search-box" onSubmit={(event) => { event.preventDefault(); navigateToPath(`/search?q=${encodeURIComponent(search.trim())}`); }}>
          <span aria-hidden="true">⌕</span>
          <input aria-label="Search products" placeholder="Find your new favourite" value={search} onChange={(event) => setSearch(event.target.value)} />
          {search && <button type="button" aria-label="Clear search" onClick={() => setSearch("")}>×</button>}
          <button type="submit" aria-label="Submit search">↗</button>
        </form>
        <div className="header-buttons">
          <RouteLink className="wishlist-trigger" aria-label={`Open wishlist, ${favorites.length} saved`} title="Saved pieces" href="/wishlist" onNavigate={navigateToPath}>
            <svg className="wishlist-symbol" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.4 4.7a5.4 5.4 0 0 0-7.6 0L12 5.5l-.8-.8a5.4 5.4 0 0 0-7.6 7.6l.8.8L12 20.7l7.6-7.6.8-.8a5.4 5.4 0 0 0 0-7.6Z" />
            </svg>
            <span className="wishlist-label">Saved</span>
            {favorites.length > 0 && <sup>{favorites.length}</sup>}
          </RouteLink>
          <RouteLink className="account-trigger" href={account ? "/account" : "/signup"} onNavigate={navigateToPath}>
            {account ? account.name.split(" ")[0] : "Sign up"}
          </RouteLink>
          <RouteLink className="bag-trigger" aria-label={`Open bag, ${itemCount} items`} href="/bag" onNavigate={navigateToPath}>
            <svg className="bag-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 8h14l1 13H4L5 8Z" />
              <path d="M9 9V6a3 3 0 0 1 6 0v3" />
            </svg>
            <span className="bag-label">Bag</span><b>{itemCount}</b>
          </RouteLink>
        </div>
      </header>

      {pathname === "/wishlist" ? (
        <WishlistPage products={favoriteProducts} onRemove={toggleFavorite} onAddToBag={addToBag} onNavigate={navigateToPath} money={money} />
      ) : pathname === "/bag" ? (
        <BagPage items={cart} itemCount={itemCount} total={cartTotal} onChangeQuantity={changeQuantity} onRemove={(id, size) => setCart((items) => items.filter((item) => item.product.id !== id || item.size !== size))} money={money} onNavigate={navigateToPath} />
      ) : pathname === "/checkout" ? (
        <CheckoutPage items={cart} total={cartTotal} money={money} onNavigate={navigateToPath} onSubmit={(event) => { event.preventDefault(); showMessage("Demo only — no order was placed and no payment was taken."); }} />
      ) : pathname === "/about" ? (
        <AboutPage onNavigate={navigateToPath} />
      ) : pathname === "/contact" ? (
        <ContactPage onNavigate={navigateToPath} onSubmit={(event) => { event.preventDefault(); showMessage("This contact form is a preview; your message was not sent."); event.currentTarget.reset(); }} />
      ) : pathname === "/search" ? (
        <SearchPage query={searchQuery} products={searchResults} onNavigate={navigateToPath} money={money} />
      ) : detailProduct ? (
        <ProductPage product={detailProduct} recommendations={products.filter((product) => product.type === detailProduct.type && product.id !== detailProduct.id).concat(products.filter((product) => product.type !== detailProduct.type)).slice(0, 4)} selectedSize={selectedSizes[detailProduct.id]} onSelectSize={(size) => setSelectedSizes((sizes) => ({ ...sizes, [detailProduct.id]: size }))} onAddToBag={addToBag} isSaved={favorites.includes(detailProduct.id)} onToggleFavorite={toggleFavorite} onNavigate={navigateToPath} money={money} />
      ) : pathname === "/login" || pathname === "/signup" || pathname === "/account" ? (
        <AuthRoutePage {...authPageProps} />
      ) : <main>
        {category === "Everything" ? <section className="editorial-hero" id="home">
          <div className="hero-copy">
            <p className="kicker"><i /> A small wardrobe, well chosen</p>
            <h1>Get dressed.<br /><em>Get on with it.</em></h1>
            <p className="hero-intro">A shirt that works beyond the office. A tee that holds its shape. Thoughtful menswear for the life you already have.</p>
            <a className="solid-link" href="#collection">See what feels right <span aria-hidden="true">↗</span></a>
            <div className="hero-index"><i /> Spring / Summer — The considered edit</div>
          </div>
          <div className="hero-photo">
            <img src="https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1400&q=90" alt="Men's casual clothing from the latest Style Havens collection" />
            <span className="photo-label">THE DAILY EDIT — NO. 01</span>
          </div>
        </section> : CategoryPage && <CategoryPage onShopAll={() => navigateToCategory("Everything")} />}

        <section className="benefit-row reveal-on-scroll" aria-label="Collection details">
          <p><b>01</b> Easy layers</p>
          <p><b>02</b> Familiar fits</p>
          <p><b>03</b> Colours that work together</p>
        </section>

        <section className="collection section-pad reveal-on-scroll" id="collection">
          <div className="section-title">
            <div><p className="kicker">{category === "Everything" ? "THE CURRENT EDIT" : `A CLOSER LOOK AT ${category.toUpperCase()}`}</p><h2>{category === "Everything" ? "Good pieces, no guesswork" : category}</h2><p className="collection-intro">Comfortable shapes, useful details, and colours that get along.</p></div>
            <span>{String(shownProducts.length).padStart(2, "0")} pieces</span>
          </div>
          <div className="collection-tools" id="categories">
            <div className="category-filter">
              <div className="category-heading"><span>Find your kind of thing</span><span>Browse the collection</span></div>
              <div className="category-tabs" role="group" aria-label="Filter by category">
                {categories.map((item, index) => {
                  const count = item === "Everything" ? products.length : products.filter((product) => product.type === item).length;
                  const image = item === "Everything"
                    ? "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=800&q=85"
                    : products.find((product) => product.type === item)?.image;
                  return (
                    <a key={item} href={getCategoryPath(item)} className={category === item ? "current" : ""} aria-label={`${item}, ${count} pieces`} aria-current={category === item ? "page" : undefined} onClick={(event) => handleRouteLink(event, getCategoryPath(item))}>
                      <img src={image} alt="" loading="lazy" />
                      <span className="category-shade" aria-hidden="true" />
                      <span className="category-meta" aria-hidden="true">
                        <span className="category-index">{String(index + 1).padStart(2, "0")} / COLLECTION</span>
                        <span className="category-count">{count} {count === 1 ? "piece" : "pieces"}</span>
                      </span>
                      <span className="category-card-bottom" aria-hidden="true">
                        <span className="category-name">{item}</span>
                        <span className="category-arrow">↗</span>
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
            <div className="catalog-controls">
              <label className="sort-by">Price <select value={priceRange} aria-label="Filter by price" onChange={(event) => setPriceRange(event.target.value)}><option value="all">All prices</option><option value="under-1500">Under ₹1,500</option><option value="1500-2500">₹1,500 – ₹2,500</option><option value="over-2500">Above ₹2,500</option></select></label>
              <label className="sort-by">Sort by <select value={sort} aria-label="Sort products" onChange={(event) => setSort(event.target.value)}><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></label>
            </div>
          </div>
          {shownProducts.length > 0 ? (
            <div className="product-grid">
              {shownProducts.map((product) => (
                <article className="product" key={product.id}>
                  <div className="product-photo">
                    <img src={product.image} alt={product.name} loading="lazy" />
                    <span className="product-label">{product.label}</span>
                    <button className={`heart-button${favorites.includes(product.id) ? " loved" : ""}`} aria-label={`${favorites.includes(product.id) ? "Remove" : "Add"} ${product.name} ${favorites.includes(product.id) ? "from" : "to"} wishlist`} aria-pressed={favorites.includes(product.id)} onClick={() => toggleFavorite(product.id)}>{favorites.includes(product.id) ? "♥" : "♡"}</button>
                    <button className="quick-add" disabled={!selectedSizes[product.id]} onClick={() => addToBag(product, selectedSizes[product.id])}>{selectedSizes[product.id] ? `Add size ${selectedSizes[product.id]}` : "Choose a size"}<span>+</span></button>
                  </div>
                  <div className="product-description">
                    <div><p>{product.type}</p><h3><RouteLink href={`/products/${product.id}`} onNavigate={navigateToPath}>{product.name}</RouteLink></h3><small>{product.detail}</small></div>
                    <strong>{money(product.price)}</strong>
                  </div>
                  <div className="size-select">
                    <span>Size</span>
                    <div role="group" aria-label={`Choose a size for ${product.name}`}>
                      {getSizes(product).map((size) => <button key={size} type="button" className={selectedSizes[product.id] === size ? "selected" : ""} aria-pressed={selectedSizes[product.id] === size} onClick={() => setSelectedSizes((sizes) => ({ ...sizes, [product.id]: size }))}>{size}</button>)}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-results">
              <span>♡</span>
              <h3>Nothing found just yet</h3>
              <p>Try another search or choose a different category.</p>
              <button onClick={() => { setSearch(""); setPriceRange("all"); navigateToCategory("Everything"); }}>See everything ↗</button>
            </div>
          )}
        </section>

        {recentProducts.length > 0 && (
          <section className="recently-viewed section-pad" aria-labelledby="recently-viewed-title">
            <div className="section-title">
              <div><p className="kicker">PICK UP WHERE YOU LEFT OFF</p><h2 id="recently-viewed-title">Recently viewed</h2></div>
              <span>{String(recentProducts.length).padStart(2, "0")} pieces</span>
            </div>
            <div className="recently-viewed-grid">
              {recentProducts.slice(0, 4).map((product) => (
                <RouteLink className="recently-viewed-card" key={product.id} href={`/products/${product.id}`} onNavigate={navigateToPath}>
                  <img src={product.image} alt={product.name} loading="lazy" />
                  <span>{product.type}</span>
                  <strong>{product.name}</strong>
                  <small>{money(product.price)}</small>
                </RouteLink>
              ))}
            </div>
          </section>
        )}

        <section className="story reveal-on-scroll" id="our-story">
          <div className="story-photo"><img src="https://images.unsplash.com/photo-1618354691551-44de113f0164?auto=format&fit=crop&w=1000&q=85" alt="A close-up of everyday menswear" loading="lazy" /></div>
          <div className="story-copy">
            <p className="kicker">LESS STUFF. BETTER WORN.</p>
            <h2>Good cotton.<br /><em>Proper fit.</em></h2>
            <p>Getting dressed shouldn’t be complicated. We look for comfortable cuts, considered fabrics and colours that already make sense with the things you own.</p>
            <a href="#collection">See the collection <span>↗</span></a>
          </div>
        </section>

        <section className="newsletter reveal-on-scroll">
          <div><p className="kicker">A NOTE, NOW AND THEN</p><h2>Just the useful stuff.</h2><p>New arrivals and restocks. That's it.</p></div>
          {subscribed ? <p className="subscribe-success">Newsletter signup is not connected yet. No email has been sent.</p> : (
            <form onSubmit={(event) => { event.preventDefault(); setSubscribed(true); }}>
              <label className="sr-only" htmlFor="email">Email address</label>
              <input id="email" type="email" placeholder="Your email address" required />
              <button>Sign me up <span>↗</span></button>
            </form>
          )}
        </section>
      </main>}

      <footer>
        <div className="footer-main"><a className="wordmark" href="/" onClick={(event) => handleRouteLink(event, "/")}>stylehavens<span>.</span></a><p>Everyday menswear, without the fuss.</p><nav aria-label="Footer navigation"><a href="/" onClick={(event) => handleRouteLink(event, "/")}>Shop</a><a href="/about" onClick={(event) => handleRouteLink(event, "/about")}>Our story</a><a href="/wishlist" onClick={(event) => handleRouteLink(event, "/wishlist")}>Wishlist</a><a href="/contact" onClick={(event) => handleRouteLink(event, "/contact")}>Get in touch</a></nav></div>
        <div className="footer-legal"><span>© 2026 Style Havens</span><span>Made to be worn on repeat.</span></div>
      </footer>

      {message && <div className="toast" role="status">{message}</div>}
    </div>
  );
}
