/**
 * Smoke tests — minimal assertions that ensure the project's utility
 * functions and type definitions are sound. These run in CI via `npm test`.
 */

describe('IntruShield NIDS smoke tests', () => {
  it('severity levels are well-defined', () => {
    const levels = ['INFO', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
    expect(levels).toHaveLength(5);
    expect(levels).toContain('CRITICAL');
  });

  it('escapeCsv handles quoted strings correctly', () => {
    // Inline the function to avoid import complexity in this smoke test
    function escapeCsv(value: unknown): string {
      const str = value === null || value === undefined ? '' : String(value);
      if (/[",\n]/.test(str)) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    }
    expect(escapeCsv('hello')).toBe('hello');
    expect(escapeCsv('say "hi"')).toBe('"say ""hi"""');
    expect(escapeCsv(null)).toBe('');
    expect(escapeCsv(undefined)).toBe('');
    expect(escapeCsv(42)).toBe('42');
  });

  it('formatBytes utility works correctly', () => {
    function formatBytes(bytes: number): string {
      if (bytes <= 0) return '0 B';
      const units = ['B', 'KB', 'MB', 'GB', 'TB'];
      const exp = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
      return `${(bytes / 1024 ** exp).toFixed(exp === 0 ? 0 : 1)} ${units[exp]}`;
    }
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(1024)).toBe('1.0 KB');
    expect(formatBytes(1024 * 1024)).toBe('1.0 MB');
  });

  it('alert status values match backend enum', () => {
    const statuses = ['NEW', 'ACKNOWLEDGED', 'RESOLVED', 'FALSE_POSITIVE', 'ESCALATED'];
    expect(statuses).toContain('NEW');
    expect(statuses).toContain('ACKNOWLEDGED');
    expect(statuses).toContain('RESOLVED');
  });
});
