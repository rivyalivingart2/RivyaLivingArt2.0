'use client';
import s from './workspace.module.css';

export function SiteImagesEditor({admin}: {admin: boolean}) {
  return (
    <>
      <div className={s.heading}>
        <div>
          <h1>Site Images</h1>
          <p>Singleton image placements and hero overrides.</p>
        </div>
      </div>
      <section className={s.empty}>
        <h2>Migration in progress.</h2>
        <p>The site-images singleton editor is being restored and connected to the new Media Hub.</p>
      </section>
    </>
  );
}
