'use client';
import s from './workspace.module.css';

export function SiteCopyEditor({admin}: {admin: boolean}) {
  return (
    <>
      <div className={s.heading}>
        <div>
          <h1>Site Copy</h1>
          <p>Singleton text components across the site.</p>
        </div>
      </div>
      <section className={s.empty}>
        <h2>Migration in progress.</h2>
        <p>The site-copy singleton editor is being restored and connected to the new persistence layer.</p>
      </section>
    </>
  );
}
