import RouteLink from "./RouteLink.jsx";

export default function ContactPage({ onNavigate, onSubmit }) {
  return (
    <main className="standalone-page contact-page">
      <div className="standalone-heading">
        <p className="kicker">WE’RE HERE TO HELP</p>
        <h1>Get in touch</h1>
        <p>Questions about a fit, an order, or just want to say hello?</p>
      </div>
      <div className="contact-layout">
        <section className="contact-details">
          <h2>Drop us a note.</h2>
          <p>Send us an email and we’ll be happy to help.</p>
          <a href="mailto:hello@stylehavens.com">hello@stylehavens.com</a>
          <p className="contact-preview-note">Contact form preview only. Messages are not sent or stored.</p>
          <RouteLink className="continue-shopping" href="/" onNavigate={onNavigate}>← Back to the collection</RouteLink>
        </section>
        <form className="checkout-form" onSubmit={onSubmit}>
          <label>Your name<input name="name" autoComplete="name" required /></label>
          <label>Email address<input name="email" type="email" autoComplete="email" required /></label>
          <label>What can we help with?<select name="topic" defaultValue="general"><option value="general">General question</option><option value="fit">Fit and sizing</option><option value="order">Order question</option><option value="other">Something else</option></select></label>
          <label>Your message<textarea name="message" rows="5" minLength="10" required /></label>
          <button className="auth-submit" type="submit">Preview message <span aria-hidden="true">↗</span></button>
        </form>
      </div>
    </main>
  );
}
