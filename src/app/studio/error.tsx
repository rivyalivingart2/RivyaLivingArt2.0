'use client';
export default function StudioError({reset}: {reset: () => void}) {
  return <main id="main-content" className="studio-login"><section className="studio-login-card">
    <p className="eyebrow">Private Studio</p><h1>Unable to continue.</h1>
    <p>The Studio is temporarily unavailable. Your order changes may not have been saved.</p>
    <button className="studio-button" onClick={reset}>Try again</button>
    <a href="/studio/login">Return to sign in</a>
  </section></main>;
}
