import "./CategoryPage.css";

export default function CategoryPageLayout({ title, description, image, onShopAll }) {
  return (
    <section className="category-page-hero" id="home">
      <div className="category-page-copy">
        <a className="category-back-link" href="/" onClick={(event) => {
          if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
          event.preventDefault();
          onShopAll();
        }}>← Shop all</a>
        <p className="kicker"><i /> STYLEHAVENS / COLLECTION</p>
        <h1>{title}</h1>
        <p>{description}</p>
        <a className="solid-link" href="#collection">Shop {title} <span aria-hidden="true">↓</span></a>
      </div>
      <div className="category-page-photo">
        <img src={image} alt={`${title} from the Style Havens collection`} />
        <span className="photo-label">{title.toUpperCase()} / EVERYDAY, CONSIDERED</span>
      </div>
    </section>
  );
}
