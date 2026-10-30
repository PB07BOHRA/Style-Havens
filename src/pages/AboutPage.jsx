import RouteLink from "./RouteLink.jsx";

export default function AboutPage({ onNavigate }) {
  return (
    <main className="standalone-page about-page">
      <section className="about-hero">
        <div>
          <p className="kicker">LESS STUFF. BETTER WORN.</p>
          <h1>Good cotton.<br /><em>Proper fit.</em></h1>
          <p>Getting dressed shouldn’t be complicated. We look for comfortable cuts, considered fabrics and colours that already make sense with the things you own.</p>
          <RouteLink className="solid-link" href="/" onNavigate={onNavigate}>Shop the collection <span aria-hidden="true">↗</span></RouteLink>
        </div>
        <img src="https://images.unsplash.com/photo-1618354691551-44de113f0164?auto=format&fit=crop&w=1100&q=85" alt="A close-up of everyday menswear" />
      </section>
      <section className="about-values">
        <article><span>01</span><h2>Wear it often</h2><p>Everyday pieces designed to be reached for again and again.</p></article>
        <article><span>02</span><h2>Keep it comfortable</h2><p>Relaxed fits, considered fabrics, and useful details come first.</p></article>
        <article><span>03</span><h2>Make it yours</h2><p>Simple colours and easy layers that work with what you already own.</p></article>
      </section>
    </main>
  );
}
