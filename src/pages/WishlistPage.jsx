import RouteLink from "./RouteLink.jsx";

const sizesFor = (product) => ["Jeans", "Trousers", "Shorts"].includes(product.type)
  ? ["30", "32", "34", "36"]
  : ["S", "M", "L", "XL"];

export default function WishlistPage({ products, onRemove, onAddToBag, onNavigate, money }) {
  return (
    <main className="standalone-page wishlist-page">
      <div className="standalone-heading">
        <p className="kicker">YOUR EDIT, YOUR WAY</p>
        <h1>Saved pieces</h1>
        <p>Keep the pieces you love close by.</p>
      </div>
      {products.length ? (
        <div className="product-grid">
          {products.map((product) => (
            <article className="product" key={product.id}>
              <div className="product-photo">
                <img src={product.image} alt={product.name} />
                <span className="product-label">{product.label}</span>
                <button className="heart-button loved" aria-label={`Remove ${product.name} from wishlist`} onClick={() => onRemove(product.id)}>♥</button>
              </div>
              <div className="product-description">
                <div><p>{product.type}</p><h3>{product.name}</h3><small>{product.detail}</small></div>
                <strong>{money(product.price)}</strong>
              </div>
              <div className="size-select">
                <span>Size</span>
                <div role="group" aria-label={`Choose a size for ${product.name}`}>
                  {sizesFor(product).map((size) => <button key={size} type="button" onClick={() => onAddToBag(product, size)}>{size}</button>)}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="standalone-empty">
          <span aria-hidden="true">♡</span>
          <h2>Your wishlist is waiting</h2>
          <p>Tap the heart on a piece you like and it will be saved here.</p>
          <RouteLink className="solid-link" href="/" onNavigate={onNavigate}>Explore the collection <span aria-hidden="true">↗</span></RouteLink>
        </div>
      )}
    </main>
  );
}
