"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main id="main-content" className="holding-page"><p className="eyebrow">A moment of pause</p><h1>The page couldn’t load.</h1><p>Please try again. No request has been submitted by this preview.</p><button className="button button-primary" onClick={reset}>Try again</button></main>;
}
