
import { useState } from "react";
import "./App.css";

const products = [
  { id: 1, name: "Floral Summer Dress", category: "Dresses", price: 999, old: 1499, image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80" },
  { id: 2, name: "Classic Everyday Top", category: "Tops", price: 699, old: 999, image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80" },
  { id: 3, name: "Elegant Pink Outfit", category: "Ethnic Wear", price: 1299, old: 1799, image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80" },
  { id: 4, name: "Chic Party Look", category: "Dresses", price: 1599, old: 2199, image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80" },
  { id: 5, name: "Casual Blue Jeans", category: "Jeans", price: 1099, old: 1599, image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80" },
  { id: 6, name: "Modern Fashion Set", category: "Tops", price: 899, old: 1299, image: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=600&q=80" },
];

const categories = ["All", "Dresses", "Tops", "Jeans", "Ethnic Wear"];

export default function App() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      category === "All" || product.category === category;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const addToCart = (product) => {
    setCart((previous) => [...previous, product]);
  };

  const toggleFavorite = (id) => {
    setFavorites((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="store">
      <div className="announcement">
        ✨ Get 10% OFF your first order with code WELCOME10 ✨
      </div>

      <header className="navbar">
        <a className="logo" href="#home">Style<span>Havens.</span></a>

        <nav>
          <a href="#home">Home</a>
          <a href="#shop">Shop</a>
          <a href="#categories">Categories</a>
          <a href="#footer">Contact</a>
        </nav>

        <input
          className="search"
          placeholder="Search outfits..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button className="cart-button" onClick={() =>
          alert(`Cart: ${cart.length} items\nTotal: ₹${cartTotal}`)
        }>
          🛍️ Cart ({cart.length})
        </button>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <p className="eyebrow">THE NEW COLLECTION</p>
            <h1>Style that speaks <span>your soul.</span></h1>
            <p>
              Discover beautiful outfits for every mood,
              every moment and every version of you.
            </p>
            <a className="primary-button" href="#shop">
              Shop Collection →
            </a>
          </div>
          <img
            src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85"
            alt="Women's fashion collection"
          />
        </section>

        <section className="categories section" id="categories">
          <div className="section-heading">
            <div>
              <p className="eyebrow">FIND YOUR LOOK</p>
              <h2>Shop by Category</h2>
            </div>
          </div>

          <div className="category-list">
            {categories.map((item) => (
              <button
                key={item}
                className={category === item ? "category active" : "category"}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        <section className="section" id="shop">
          <div className="section-heading">
            <div>
              <p className="eyebrow">HANDPICKED FOR YOU</p>
              <h2>Our Collection</h2>
            </div>
            <span className="result-count">
              {filteredProducts.length} products
            </span>
          </div>

          <div className="product-grid">
            {filteredProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  <span className="sale-badge">
                    {Math.round((1 - product.price / product.old) * 100)}% OFF
                  </span>
                  <button
                    className="favorite"
                    aria-label="Toggle favorite"
                    onClick={() => toggleFavorite(product.id)}
                  >
                    {favorites.includes(product.id) ? "❤️" : "♡"}
                  </button>
                </div>

                <div className="product-info">
                  <p className="product-category">{product.category}</p>
                  <h3>{product.name}</h3>
                  <div className="price">
                    <strong>₹{product.price.toLocaleString("en-IN")}</strong>
                    <del>₹{product.old.toLocaleString("en-IN")}</del>
                  </div>
                  <button
                    className="add-button"
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart +
                  </button>
                </div>
              </article>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <p className="empty">No products found. Try another search.</p>
          )}
        </section>

        <section className="newsletter">
          <p className="eyebrow">A LITTLE LOVE FROM US</p>
          <h2>Fashion updates, just for you.</h2>
          <p>Discover new arrivals and special offers.</p>
          <form onSubmit={(e) => {
            e.preventDefault();
            alert("Thanks for subscribing!");
          }}>
            <input type="email" placeholder="Your email address" required />
            <button type="submit">Subscribe</button>
          </form>
        </section>
      </main>

      <footer id="footer">
        <a className="logo" href="#home">Style<span>Havens.</span></a>
        <p>Made for every woman, every style, every day.</p>
        <p>© 2026 Style Havens. All rights reserved.</p>
      </footer>
    </div>
  );
}
