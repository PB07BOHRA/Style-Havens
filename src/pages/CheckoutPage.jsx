import RouteLink from "./RouteLink.jsx";

export default function CheckoutPage({ items, total, money, onNavigate, onSubmit }) {
  return (
    <main className="standalone-page checkout-page">
      <div className="standalone-heading">
        <p className="kicker">ALMOST YOURS</p>
        <h1>Checkout</h1>
        <p>This storefront preview does not process payments or place real orders.</p>
      </div>
      {items.length ? (
        <div className="checkout-layout">
          <form className="checkout-form" onSubmit={onSubmit}>
            <h2>Delivery details</h2>
            <label>Email address<input type="email" name="email" autoComplete="email" required /></label>
            <label>Full name<input type="text" name="name" autoComplete="name" required /></label>
            <label>Address<input type="text" name="address" autoComplete="street-address" required /></label>
            <div className="checkout-fields">
              <label>City<input type="text" name="city" autoComplete="address-level2" required /></label>
              <label>PIN code<input type="text" name="postalCode" inputMode="numeric" autoComplete="postal-code" pattern="[0-9]{6}" title="Enter a 6-digit PIN code" required /></label>
            </div>
            <p className="checkout-note">Demo only — your details are not saved and no payment will be taken.</p>
            <button className="auth-submit" type="submit">Review demo order <span aria-hidden="true">↗</span></button>
          </form>
          <aside className="bag-page-summary">
            <p className="kicker">YOUR ORDER</p>
            {items.map(({ product, size, quantity }) => <p className="checkout-order-item" key={`${product.id}-${size}`}><span>{product.name} · {size} × {quantity}</span><strong>{money(product.price * quantity)}</strong></p>)}
            <p className="bag-page-total"><span>Total</span><strong>{money(total)}</strong></p>
            <RouteLink className="continue-shopping" href="/bag" onNavigate={onNavigate}>← Back to bag</RouteLink>
          </aside>
        </div>
      ) : (
        <div className="standalone-empty">
          <h2>Nothing to check out yet</h2>
          <p>Add a piece to your bag before checking out.</p>
          <RouteLink className="solid-link" href="/" onNavigate={onNavigate}>Shop the collection <span aria-hidden="true">↗</span></RouteLink>
        </div>
      )}
    </main>
  );
}
