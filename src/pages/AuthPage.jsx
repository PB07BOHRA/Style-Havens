import RouteLink from "./RouteLink.jsx";

export default function AuthPage({ mode, account, onSubmit, onSignOut, onNavigate, showPassword, onTogglePassword }) {
  const isSignup = mode === "signup";

  return (
    <main className="account-page">
      <section className="account-layout" aria-labelledby="auth-title">
        <div className="auth-visual">
          <img src="https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=900&q=85" alt="" />
          <div><span>STYLEHAVENS / CLUB</span><p>Good clothes.<br />Good company.</p></div>
        </div>
        <div className="auth-panel">
          {mode === "account" && account ? (
            <div className="account-view">
              <p className="kicker">YOUR ACCOUNT</p>
              <div className="account-avatar">{account.name.charAt(0).toUpperCase()}</div>
              <h2 id="auth-title">Good to see you, {account.name.split(" ")[0]}.</h2>
              <p>{account.email}</p>
              <span className="demo-note">Demo account only. Your details are not saved to a server.</span>
              <button className="auth-submit" onClick={onSignOut}>Sign out</button>
            </div>
          ) : (
            <>
              <p className="kicker">WELCOME TO THE CLUB</p>
              <h2 id="auth-title">{isSignup ? "Make yourself at home." : "Good to have you back."}</h2>
              <p className="auth-subtitle">{isSignup ? "A few details and you're in." : "Sign in for a quicker way back to the good stuff."}</p>
              <div className="auth-tabs" role="tablist" aria-label="Account access">
                <RouteLink role="tab" aria-selected={!isSignup} className={!isSignup ? "active" : ""} href="/login" onNavigate={onNavigate}>Sign in</RouteLink>
                <RouteLink role="tab" aria-selected={isSignup} className={isSignup ? "active" : ""} href="/signup" onNavigate={onNavigate}>Create account</RouteLink>
              </div>
              <form className="auth-form" onSubmit={(event) => onSubmit(event, mode)}>
                {isSignup && <label>Your name<input name="name" type="text" placeholder="e.g. Arjun Mehta" autoComplete="name" minLength="2" required /></label>}
                <label>Email address<input name="email" type="email" placeholder="you@example.com" autoComplete="email" required /></label>
                <label>Password<span className="password-field"><input name="password" type={showPassword ? "text" : "password"} placeholder="At least 8 characters" autoComplete={isSignup ? "new-password" : "current-password"} minLength="8" required /><button type="button" onClick={onTogglePassword}>{showPassword ? "Hide" : "Show"}</button></span></label>
                {isSignup && <label className="terms-check"><input type="checkbox" required /><span>I agree to the terms and privacy policy.</span></label>}
                <button className="auth-submit" type="submit">{isSignup ? "Create my account" : "Sign in"}<span aria-hidden="true">↗</span></button>
              </form>
              <p className="demo-note">Preview only: account access is not connected to a server. Passwords are never stored.</p>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
