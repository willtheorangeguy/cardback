/** @typedef {import('./types').Card} Card */
/** @typedef {import('./types').Budget} Budget */
/** @typedef {import('./types').Configuration} Configuration */
/** @typedef {import('./types').RewardGroup} RewardGroup */

/** @param {Card} card @param {Configuration} [config] */
export function annualFee(card, config = {}) {
  return config.feeWaived ? 0 : card.fee * (card.feePeriod === 'monthly' ? 12 : 1);
}
/** @param {Budget} budget */
export function total(budget) {
  return Object.values(budget).reduce((sum, value) => sum + (Number.isFinite(value) && value > 0 ? value : 0), 0);
}
/** @param {Card} card @param {Configuration} [config] @returns {RewardGroup[]} */
export function rewardGroups(card, config = {}) {
  if (!card.selectable) return card.groups;
  /** @type {import('./types').Category[]} */
  const defaults = ['groceries', 'dining'];
  const selected = [...new Set(config.selected ?? defaults)].filter(id => id !== 'other' && id !== 'delivery').slice(0, config.savings ? 3 : 2);
  return [{ categories: selected, rate: .02 }];
}
/** @param {RewardGroup} group */
function annualCap(group) {
  return group.cap === undefined ? Infinity : group.cap * (group.period === 'monthly' ? 12 : 1);
}
/** @param {Card} card @param {Budget} monthly @param {Configuration} [config] */
export function cashback(card, monthly, config = {}) {
  const groups = rewardGroups(card, config);
  const all = total(monthly) * 12;
  let result = 0;
  for (const [key, raw] of Object.entries(monthly)) {
    const amount = Number.isFinite(raw) && raw > 0 ? raw * 12 : 0;
    const matches = groups.filter(group => group.categories.includes(/** @type {import('./types').Category} */ (key)));
    const rate = Math.max(card.base, ...matches.map(group => group.rate));
    let fraction = 1;
    for (const group of matches) {
      const eligible = group.categories.reduce((sum, id) => sum + Math.max(0, monthly[id] ?? 0) * 12, 0);
      if (eligible > 0) fraction = Math.min(fraction, annualCap(group) / eligible);
      if (all > 0 && group.totalSpendCap !== undefined) fraction = Math.min(fraction, group.totalSpendCap / all);
    }
    result += amount * card.base + amount * (rate - card.base) * fraction;
  }
  return result;
}
/** @param {Budget} budget @returns {Budget} */
export function proportions(budget) {
  const sum = total(budget);
  return Object.fromEntries(Object.entries(budget).map(([id, value]) => [id, sum ? Math.max(0, value) / sum : 0]));
}
/** @param {Budget} mix @param {number} monthlyTotal @returns {Budget} */
function scaled(mix, monthlyTotal) {
  return Object.fromEntries(Object.entries(mix).map(([id, weight]) => [id, weight * monthlyTotal]));
}
/** @param {Card} card @param {Budget} mix @param {Configuration} config */
function boundaries(card, mix, config) {
  /** @type {number[]} */
  const points = [];
  for (const group of rewardGroups(card, config)) {
    const weight = group.categories.reduce((sum, id) => sum + (mix[id] ?? 0), 0);
    if (weight > 0 && Number.isFinite(annualCap(group))) points.push(annualCap(group) / weight / 12);
    if (group.totalSpendCap !== undefined) points.push(group.totalSpendCap / 12);
  }
  return points;
}
/**
 * Find every zero and classify crossings on exact piecewise-linear segments.
 * Monthly total spending is the independent variable.
 * @param {Card} card @param {Budget} budget @param {Configuration} [config]
 * @param {Card} [baseline] @param {Configuration} [baselineConfig]
 * @returns {{first: number | null, reversals: number[], empty: boolean}}
 */
export function breakEven(card, budget, config = {}, baseline, baselineConfig = {}) {
  if (total(budget) === 0) return { first: null, reversals: [], empty: true };
  const mix = proportions(budget);
  const points = [...new Set([0, ...boundaries(card, mix, config), ...(baseline ? boundaries(baseline, mix, baselineConfig) : [])])].sort((a, b) => a - b);
  /** @param {number} x */
  const value = x => cashback(card, scaled(mix, x), config) - annualFee(card, config) - (baseline ? cashback(baseline, scaled(mix, x), baselineConfig) - annualFee(baseline, baselineConfig) : 0);
  let first = value(0) >= -1e-8 ? 0 : null;
  /** @type {number[]} */
  const reversals = [];
  for (let i = 0; i < points.length; i++) {
    const left = points[i];
    const right = points[i + 1] ?? left + Math.max(1, left);
    const y = value(left);
    const slope = (value(right) - y) / (right - left);
    const root = Math.abs(slope) > 1e-12 ? left - y / slope : null;
    const inside = root !== null && root >= left - 1e-7 && (i === points.length - 1 || root <= right + 1e-7);
    if (first === null && y >= -1e-8) first = left;
    if (inside && slope > 0 && first === null) first = Math.max(0, root);
    if (inside && slope < 0 && first !== null && root >= first - 1e-7 && !reversals.some(x => Math.abs(x - root) < 1e-6)) reversals.push(Math.max(0, root));
  }
  return { first, reversals, empty: false };
}
