import RouteLink from "./RouteLink.jsx";

const sizesFor = (product) => ["Jeans", "Trousers", "Shorts"].includes(product.type)
  ? ["30", "32", "34", "36"]
  : ["S", "M", "L", "XL"];

export default function ProductPage({ product, recommendations = [], selectedSize, onSelectSize, onAddToBag, isSaved, onToggleFavorite, onNavigate, money }) {
  const fit = product.detail.split("/").pop().trim();

  return (
    <main className="standalone-page product-detail-page">
      <RouteLink className="continue-shopping" href={`/categories/${product.type.toLowerCase().replace(/\s+/g, "-")}`} onNavigate={onNavigate}>← Back to {product.type}</RouteLink>
      <section className="product-detail">
        <div className="product-detail-photo"><img src={product.image} alt={product.name} /><span>{product.label}</span></div>
        <div className="product-detail-copy">
          <p className="kicker">{product.type.toUpperCase()} / EVERYDAY, CONSIDERED</p>
          <h1>{product.name}</h1>
          <strong className="product-detail-price">{money(product.price)}</strong>
          <p className="product-detail-description">{product.detail}. An easy-to-wear piece, made for the everyday rotation.</p>
          <div className="product-detail-sizes">
            <div className="product-size-heading"><span>Choose your size</span><details className="product-size-guide"><summary>Size guide</summary><p>Sizes vary by style. Check the fit note below and choose your usual size as a starting point. Exact garment measurements are not available in this preview.</p></details></div>
            <div role="group" aria-label={`Choose a size for ${product.name}`}>
              {sizesFor(product).map((size) => <button key={size} type="button" className={selectedSize === size ? "selected" : ""} aria-pressed={selectedSize === size} onClick={() => onSelectSize(size)}>{size}</button>)}
            </div>
          </div>
          <button className="auth-submit product-detail-add" disabled={!selectedSize} onClick={() => onAddToBag(product, selectedSize)}>{selectedSize ? `Add size ${selectedSize} to bag` : "Choose a size to continue"} <span aria-hidden="true">↗</span></button>
          <button className="product-detail-save" aria-pressed={isSaved} onClick={() => onToggleFavorite(product.id)}>{isSaved ? "♥ Saved to wishlist" : "♡ Save to wishlist"}</button>
          <details className="product-detail-info">
            <summary>Fit & fabric</summary>
            <p>{product.detail}. Measurements and care instructions are not available in this preview.</p>
          </details>
          <p className="product-detail-fit">Fit: {fit}</p>
        </div>
      </section>
      {recommendations.length > 0 && (
        <section className="product-recommendations">
          <div className="section-title"><div><p className="kicker">A FEW MORE GOOD THINGS</p><h2>You may also like</h2></div></div>
          <div className="recently-viewed-grid">
            {recommendations.map((item) => (
              <RouteLink className="recently-viewed-card" key={item.id} href={`/products/${item.id}`} onNavigate={onNavigate}>
                <img src={item.image} alt={item.name} loading="lazy" />
                <span>{item.type}</span>
                <strong>{item.name}</strong>
                <small>{money(item.price)}</small>
              </RouteLink>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
