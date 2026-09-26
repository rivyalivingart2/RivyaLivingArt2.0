/** Match shared grid/container breakpoints; actual transfer budgets are verified in Phase 11. */
export const imageSizes={
 card:'(max-width:390px) calc(100vw - 40px), (max-width:780px) calc(50vw - 24px), (max-width:1200px) 30vw, calc((100vw - 226px) / 3)',
 detail:'(max-width:780px) calc(100vw - 40px), (max-width:1200px) 48vw, 44vw',
 story:'(max-width:780px) calc(100vw - 40px), (max-width:1320px) 92vw, 1320px',
 zoom:'(max-width:1170px) 92vw, 1040px',
 world:'(max-width:780px) calc(100vw - 40px), (max-width:1100px) 45vw, 29vw',
 feature:'(max-width:780px) calc(100vw - 40px), (max-width:1100px) 55vw, 60vw',
 material:'(max-width:780px) 100vw, 50vw',
} as const;
