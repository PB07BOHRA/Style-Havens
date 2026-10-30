import RouteLink from "./RouteLink.jsx";

export default function SearchPage({ query, products, onNavigate, money }) {
  return (
    <main className="standalone-page search-page">
      <div className="standalone-heading">
        <p className="kicker">FIND YOUR EVERYDAY</p>
        <h1>Search results</h1>
        <p>{query ? <>Showing pieces for <strong>“{query}”</strong>.</> : "Enter a product or category in the search bar above."}</p>
      </div>
      {products.length ? (
        <div className="product-grid">
          {products.map((product) => (
            <article className="product" key={product.id}>
              <RouteLink className="search-product-photo" href={`/products/${product.id}`} onNavigate={onNavigate} aria-label={`View ${product.name}`}>
                <img src={product.image} alt={product.name} />
                <span>{product.label}</span>
              </RouteLink>
              <div className="product-description">
                <div><p>{product.type}</p><h3><RouteLink href={`/products/${product.id}`} onNavigate={onNavigate}>{product.name}</RouteLink></h3><small>{product.detail}</small></div>
                <strong>{money(product.price)}</strong>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="standalone-empty">
          <span aria-hidden="true">⌕</span>
          <h2>No pieces found</h2>
          <p>Try a different product name or category.</p>
          <RouteLink className="solid-link" href="/" onNavigate={onNavigate}>Explore the collection <span aria-hidden="true">↗</span></RouteLink>
        </div>
      )}
    </main>
  );
}
