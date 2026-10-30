import RouteLink from "./RouteLink.jsx";

export default function BagPage({ items, itemCount, total, onChangeQuantity, onRemove, money, onNavigate }) {
  return (
    <main className="standalone-page bag-page">
      <div className="standalone-heading">
        <p className="kicker">YOUR BAG / {String(itemCount).padStart(2, "0")} PIECES</p>
        <h1>Your bag</h1>
        <p>A few good things, all in one place.</p>
      </div>
      {items.length ? (
        <div className="bag-page-layout">
          <div className="bag-items">
            {items.map(({ product, size, quantity }) => (
              <article className="bag-item" key={`${product.id}-${size}`}>
                <img src={product.image} alt={product.name} />
                <div>
                  <p>{product.type}</p><h3>{product.name}</h3>
                  <small className="cart-size">Size: {size}</small>
                  <strong>{money(product.price)}</strong>
                  <div className="quantity">
                    <button aria-label={`Decrease ${product.name} quantity`} onClick={() => onChangeQuantity(product.id, size, -1)}>−</button>
                    <span>{quantity}</span>
                    <button aria-label={`Increase ${product.name} quantity`} onClick={() => onChangeQuantity(product.id, size, 1)}>+</button>
                  </div>
                </div>
                <button className="remove-item" aria-label={`Remove ${product.name}`} onClick={() => onRemove(product.id, size)}>×</button>
              </article>
            ))}
            <RouteLink className="continue-shopping" href="/" onNavigate={onNavigate}>← Keep looking</RouteLink>
          </div>
          <aside className="bag-page-summary">
            <p className="kicker">ORDER SUMMARY</p>
            <p><span>Items ({itemCount})</span><strong>{money(total)}</strong></p>
            <p><span>Delivery</span><strong>Calculated at checkout</strong></p>
            <p className="bag-page-total"><span>Subtotal</span><strong>{money(total)}</strong></p>
            <RouteLink className="checkout" href="/checkout" onNavigate={onNavigate}>Continue to checkout <span aria-hidden="true">↗</span></RouteLink>
            <small>Checkout is a preview and payments are not connected.</small>
          </aside>
        </div>
      ) : (
        <div className="standalone-empty">
          <span aria-hidden="true">♡</span>
          <h2>Your bag is empty</h2>
          <p>Find something that works for your everyday.</p>
          <RouteLink className="solid-link" href="/" onNavigate={onNavigate}>Explore the collection <span aria-hidden="true">↗</span></RouteLink>
        </div>
      )}
    </main>
  );
}
