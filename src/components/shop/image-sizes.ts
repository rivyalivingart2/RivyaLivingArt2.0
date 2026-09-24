/** Match shared grid/container breakpoints; actual transfer budgets are verified in Phase 11. */
export const imageSizes={
 card:'(max-width:390px) calc(100vw - 40px), (max-width:780px) 44vw, (max-width:1760px) 30vw, calc((100vw - 226px) / 3)',
 detail:'(max-width:780px) 90vw, 44vw',
 story:'(max-width:780px) calc(100vw - 40px), (max-width:1320px) 100vw, 1320px',
 zoom:'(max-width:1170px) 90vw, 1040px',
} as const;
