// One validated location for reports and their read-only public fixture manifest.
export const reportRoot = process.env.RIVYA_E2E_REPORT_ROOT || 'test-results/rivya-master-audit';
if (!/^test-results\/[a-z0-9-]+$/.test(reportRoot)) throw new Error('Use one dedicated test-results folder for browser reports.');
export const fixturePath = `${reportRoot}/e2e-final/public-fixtures.json`;
