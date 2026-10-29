import { useEffect, useRef, useState } from "react";
import "./Storefront.css";

const products = [
  { id: 1, name: "Oxford Shirt / Chalk", type: "Shirts", price: 1890, detail: "Midweight cotton  /  Regular fit", label: "Core", image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=85" },
  { id: 2, name: "Heavyweight Tee / Washed Black", type: "T-shirts", price: 990, detail: "230 GSM cotton  /  Boxy fit", label: "Essential", image: "https://images.unsplash.com/photo-1618354691438-25bc04584c23?auto=format&fit=crop&w=800&q=85" },
  { id: 3, name: "Relaxed Chino / Olive", type: "Trousers", price: 2190, detail: "Cotton twill  /  Relaxed taper", label: "New shade", image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=85" },
  { id: 4, name: "Weekend Overshirt / Sand", type: "Jackets", price: 2790, detail: "Brushed cotton  /  Easy layer", label: "New", image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=800&q=85" },
  { id: 5, name: "Straight Jeans / Mid Blue", type: "Jeans", price: 2490, detail: "12 oz denim  /  Straight fit", label: "Core", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=85" },
  { id: 6, name: "Ribbed Crew Tee / Ecru", type: "T-shirts", price: 1190, detail: "Cotton rib  /  Regular fit", label: "Essential", image: "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?auto=format&fit=crop&w=800&q=85" },
  { id: 7, name: "Camp Collar Shirt / Stripe", type: "Shirts", price: 1990, detail: "Cotton poplin  /  Relaxed fit", label: "New shade", image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=85" },
  { id: 8, name: "Canvas Work Jacket / Moss", type: "Jackets", price: 3490, detail: "Heavy canvas  /  Roomy fit", label: "Layering piece", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=85" },
  { id: 9, name: "Drawstring Short / Stone", type: "Shorts", price: 1590, detail: "Cotton twill  /  Easy straight fit", label: "New", image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=800&q=85" },
  { id: 10, name: "Everyday Hoodie / Heather Grey", type: "Hoodies", price: 2290, detail: "Cotton fleece  /  Relaxed fit", label: "Essential", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=85" },
  { id: 11, name: "Loopback Sweatshirt / Navy", type: "Sweatshirts", price: 1990, detail: "Loopback cotton  /  Regular fit", label: "New", image: "https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=800&q=85" },
];

const categories = ["Everything", "T-shirts", "Shirts", "Jeans", "Trousers", "Shorts", "Jackets", "Hoodies", "Sweatshirts"];
const money = (amount) => `₹${amount.toLocaleString("en-IN")}`;
const getSizes = (product) => ["Jeans", "Trousers", "Shorts"].includes(product.type)
  ? ["30", "32", "34", "36"]
  : ["S", "M", "L", "XL"];

export default function MenswearStore() {
  const [category, setCategory] = useState("Everything");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const [favorites, setFavorites] = useState([]);
  const [wishlistOnly, setWishlistOnly] = useState(false);
  const [cart, setCart] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [authOpen, setAuthOpen] = useState(() => window.location.pathname === "/account");
  const [authMode, setAuthMode] = useState("login");
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
    .filter((product) => !wishlistOnly || favorites.includes(product.id))
    .sort((first, second) => {
      if (sort === "low") return first.price - second.price;
      if (sort === "high") return second.price - first.price;
      return first.id - second.id;
    });
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

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

  const openAccountPage = () => {
    setAuthMode(account ? "account" : "login");
    setAuthOpen(true);
    if (window.location.pathname !== "/account") window.history.pushState({ page: "account" }, "", "/account");
  };

  const closeAccountPage = () => {
    if (window.location.pathname === "/account") window.history.pushState({ page: "store" }, "", "/");
    setAuthOpen(false);
  };

  useEffect(() => {
    const handlePopState = () => {
      const onAccountPage = window.location.pathname === "/account";
      setAuthOpen(onAccountPage);
      if (onAccountPage) setAuthMode(account ? "account" : "login");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [account]);

  const submitAccount = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const name = formData.get("name") || email.split("@")[0];
    setAccount({ name, email });
    closeAccountPage();
    showMessage(`Welcome, ${name.split(" ")[0]}`);
  };

  return (
    <div className="storefront" ref={storeRef}>
      <div className="promo-bar">
        <span>STYLEHAVENS / MENSWEAR</span>
        <p>The everyday pieces you'll reach for again.</p>
        <a href="#collection">Shop the edit <span aria-hidden="true">↗</span></a>
      </div>

      <header className="site-header">
        <a className="wordmark" href="#home">stylehavens<span>.</span></a>
        <nav aria-label="Main navigation">
          <a href="#collection">Shop all</a>
          <a href="#categories">Collections</a>
          <a href="#our-story">Our story</a>
        </nav>
        <label className="search-box">
          <span aria-hidden="true">⌕</span>
          <input aria-label="Search products" placeholder="Find your new favourite" value={search} onChange={(event) => setSearch(event.target.value)} />
          {search && <button aria-label="Clear search" onClick={() => setSearch("")}>×</button>}
        </label>
        <div className="header-buttons">
          <button className={`wishlist-trigger${wishlistOnly ? " selected" : ""}`} aria-label={wishlistOnly ? "Show all products" : `Show saved pieces, ${favorites.length} saved`} aria-pressed={wishlistOnly} title={wishlistOnly ? "Show all products" : "Saved pieces"} onClick={() => { setWishlistOnly((value) => !value); document.querySelector("#collection")?.scrollIntoView({ behavior: "smooth" }); }}>
            <svg className="wishlist-symbol" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.4 4.7a5.4 5.4 0 0 0-7.6 0L12 5.5l-.8-.8a5.4 5.4 0 0 0-7.6 7.6l.8.8L12 20.7l7.6-7.6.8-.8a5.4 5.4 0 0 0 0-7.6Z" />
            </svg>
            <span className="wishlist-label">Saved</span>
            {favorites.length > 0 && <sup>{favorites.length}</sup>}
          </button>
          <button className="account-trigger" onClick={openAccountPage}>
            {account ? account.name.split(" ")[0] : "Sign up"}
          </button>
          <button className="bag-trigger" aria-label={`Open bag, ${itemCount} items`} onClick={() => setCartOpen(true)}>
            <svg className="bag-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 8h14l1 13H4L5 8Z" />
              <path d="M9 9V6a3 3 0 0 1 6 0v3" />
            </svg>
            <span className="bag-label">Bag</span><b>{itemCount}</b>
          </button>
        </div>
      </header>

      <main>
        <section className="editorial-hero" id="home">
          <div className="hero-copy">
            <p className="kicker"><i /> Made for every day</p>
            <h1>Good clothes.<br /><em>Real life.</em></h1>
            <p className="hero-intro">The shirt you wear on Monday. The tee you reach for again on Friday. Easy pieces for the days in between.</p>
            <a className="solid-link" href="#collection">Find your everyday <span aria-hidden="true">↗</span></a>
            <div className="hero-index"><i /> A considered collection for daily wear</div>
          </div>
          <div className="hero-photo">
            <img src="https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1400&q=90" alt="Men's casual clothing from the latest Style Havens collection" />
            <span className="photo-label">SHIRTS, DENIM, EVERYDAY LAYERS</span>
          </div>
        </section>

        <section className="benefit-row reveal-on-scroll" aria-label="Collection details">
          <p><b>—</b> Natural-feel fabrics</p>
          <p><b>—</b> Fit notes that help</p>
          <p><b>—</b> Made to be worn often</p>
        </section>

        <section className="collection section-pad reveal-on-scroll" id="collection">
          <div className="section-title">
            <div><p className="kicker">A FEW GOOD THINGS</p><h2>{wishlistOnly ? "Your saved pieces" : "The everyday lineup"}</h2></div>
            <span>{String(shownProducts.length).padStart(2, "0")} pieces</span>
          </div>
          <div className="collection-tools" id="categories">
            <div className="category-filter">
              <div className="category-heading"><span>Shop by category</span><span>Pick your everyday</span></div>
              <div className="category-tabs" role="group" aria-label="Filter by category">
                {categories.map((item, index) => {
                  const count = item === "Everything" ? products.length : products.filter((product) => product.type === item).length;
                  const image = item === "Everything"
                    ? "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=800&q=85"
                    : products.find((product) => product.type === item)?.image;
                  return (
                    <button key={item} className={category === item && !wishlistOnly ? "current" : ""} aria-label={`${item}, ${count} pieces`} aria-pressed={category === item && !wishlistOnly} onClick={() => { setCategory(item); setWishlistOnly(false); }}>
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
                    </button>
                  );
                })}
              </div>
            </div>
            <label className="sort-by">Sort by <select value={sort} aria-label="Sort products" onChange={(event) => setSort(event.target.value)}><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></label>
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
                    <div><p>{product.type}</p><h3>{product.name}</h3><small>{product.detail}</small></div>
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
              <h3>{wishlistOnly ? "Your wishlist is waiting" : "Nothing found just yet"}</h3>
              <p>{wishlistOnly ? "Tap the heart on a piece you like and it'll wait here." : "Try another search or choose a different category."}</p>
              <button onClick={() => { setSearch(""); setWishlistOnly(false); setCategory("Everything"); }}>See everything ↗</button>
            </div>
          )}
        </section>

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
      </main>

      <footer>
        <div className="footer-main"><a className="wordmark" href="#home">stylehavens<span>.</span></a><p>Everyday menswear, without the fuss.</p><nav aria-label="Footer navigation"><a href="#collection">Shop</a><a href="#our-story">Our story</a><a href="mailto:hello@stylehavens.com">Get in touch</a></nav></div>
        <div className="footer-legal"><span>© 2026 Style Havens</span><span>Made to be worn on repeat.</span></div>
      </footer>

      {cartOpen && (
        <div className="drawer-shade" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false); }}>
          <aside className="bag-drawer" role="dialog" aria-modal="true" aria-labelledby="bag-title">
            <div className="drawer-head"><div><p className="kicker">YOUR BAG</p><h2 id="bag-title">Your bag <small>({itemCount})</small></h2></div><button aria-label="Close bag" onClick={() => setCartOpen(false)}>×</button></div>
            {cart.length > 0 ? (
              <>
                <div className="bag-items">
                  {cart.map(({ product, size, quantity }) => (
                    <article className="bag-item" key={`${product.id}-${size}`}>
                      <img src={product.image} alt="" />
                      <div><p>{product.type}</p><h3>{product.name}</h3><small className="cart-size">Size: {size}</small><strong>{money(product.price)}</strong><div className="quantity"><button aria-label={`Decrease ${product.name}, size ${size}, quantity`} onClick={() => changeQuantity(product.id, size, -1)}>−</button><span>{quantity}</span><button aria-label={`Increase ${product.name}, size ${size}, quantity`} onClick={() => changeQuantity(product.id, size, 1)}>+</button></div></div>
                      <button className="remove-item" aria-label={`Remove ${product.name}, size ${size}`} onClick={() => setCart((items) => items.filter((item) => item.product.id !== product.id || item.size !== size))}>×</button>
                    </article>
                  ))}
                </div>
                <div className="bag-summary"><p><span>Subtotal</span><strong>{money(cartTotal)}</strong></p><small>Checkout is not connected in this preview.</small><button className="checkout" onClick={() => showMessage("Checkout is not connected in this preview")}>Continue to checkout <span>↗</span></button><button className="keep-shopping" onClick={() => setCartOpen(false)}>Keep looking</button></div>
              </>
            ) : (
              <div className="bag-empty"><span>♡</span><h3>Your bag is empty.</h3><p>Find something that works for your everyday.</p><button className="solid-link" onClick={() => { setCartOpen(false); document.querySelector("#collection")?.scrollIntoView({ behavior: "smooth" }); }}>Explore the collection ↗</button></div>
            )}
          </aside>
        </div>
      )}

      {authOpen && (
        <main className="account-page">
          <button className="account-back" onClick={closeAccountPage}><span aria-hidden="true">←</span> Back to shop</button>
          <section className="account-layout" aria-labelledby="auth-title">
            <div className="auth-visual"><img src="https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=900&q=85" alt="" /><div><span>STYLEHAVENS / CLUB</span><p>Good clothes.<br />Good company.</p></div></div>
            <div className="auth-panel">
              <button className="auth-close" aria-label="Back to shop" onClick={closeAccountPage}>×</button>
              {authMode === "account" && account ? (
                <div className="account-view"><p className="kicker">YOUR ACCOUNT</p><div className="account-avatar">{account.name.charAt(0).toUpperCase()}</div><h2 id="auth-title">Good to see you, {account.name.split(" ")[0]}.</h2><p>{account.email}</p><span className="demo-note">Demo account only. Your details are not saved to a server.</span><button className="auth-submit" onClick={() => { setAccount(null); setAuthOpen(false); }}>Sign out</button></div>
              ) : (
                <>
                  <p className="kicker">WELCOME TO THE CLUB</p>
                  <h2 id="auth-title">{authMode === "signup" ? "Make yourself at home." : "Good to have you back."}</h2>
                  <p className="auth-subtitle">{authMode === "signup" ? "A few details and you're in." : "Sign in for a quicker way back to the good stuff."}</p>
                  <div className="auth-tabs" role="tablist" aria-label="Account access">
                    <button type="button" role="tab" aria-selected={authMode === "login"} className={authMode === "login" ? "active" : ""} onClick={() => setAuthMode("login")}>Sign in</button>
                    <button type="button" role="tab" aria-selected={authMode === "signup"} className={authMode === "signup" ? "active" : ""} onClick={() => setAuthMode("signup")}>Create account</button>
                  </div>
                  <form className="auth-form" onSubmit={submitAccount}>
                    {authMode === "signup" && <label>Your name<input name="name" type="text" placeholder="e.g. Arjun Mehta" autoComplete="name" minLength="2" required /></label>}
                    <label>Email address<input name="email" type="email" placeholder="you@example.com" autoComplete="email" required /></label>
                    <label>Password<span className="password-field"><input name="password" type={showPassword ? "text" : "password"} placeholder="At least 8 characters" autoComplete={authMode === "signup" ? "new-password" : "current-password"} minLength="8" required /><button type="button" onClick={() => setShowPassword((value) => !value)}>{showPassword ? "Hide" : "Show"}</button></span></label>
                    {authMode === "signup" && <label className="terms-check"><input type="checkbox" required /><span>I agree to the terms and privacy policy.</span></label>}
                    <button className="auth-submit" type="submit">{authMode === "signup" ? "Create my account" : "Sign in"}<span aria-hidden="true">↗</span></button>
                  </form>
                  <p className="demo-note">Preview only: accounts are not saved, and passwords are never stored.</p>
                </>
              )}
            </div>
          </section>
        </main>
      )}

      {message && <div className="toast" role="status">{message}</div>}
    </div>
  );
}
