/** @typedef {import('./types').Card} Card */
/** @typedef {import('./types').Budget} Budget */
/** @typedef {import('./types').Configuration} Configuration */
/** @typedef {import('./types').RewardGroup} RewardGroup */

/** Split budget fields that share the same merchant category on most cards.
 * @param {import('./types').Category[]} ids
 * @returns {import('./types').Category[]}
 */
function expanded(ids) {
  const result = [...ids];
  if (ids.includes('gas')) result.push('costcogas','esso','trianglefuel','trianglepremium');
  if (ids.includes('transit')) result.push('publictransit');
  if (ids.includes('groceries')) result.push('pcgroceries','scenegroceries','walmart');
  if (ids.includes('drugstores')) result.push('shoppers');
  if (ids.includes('entertainment')) result.push('cineplex');
  if (ids.includes('home')) result.push('homehardware');
  if (ids.includes('bills')) result.push('utilities');
  return [...new Set(result)];
}

/** @param {Card} card @param {Configuration} config */
function rewardMultiplier(card, config) {
  if (!config.statementCredit) return 1;
  return card.rewardKind === 'pc' ? .7 : card.rewardKind === 'scene' ? 2/3 : 1;
}

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
  if (card.issuer === 'Rogers Bank') return config.rogersCustomer
    ? [{ categories:/** @type {import('./types').Category[]} */ (card.groups[0].categories),rate:.02,cap:card.groups[0].cap,period:'annual' }]
    : [];
  if (!card.selectable) return card.groups.map(group => {
    const price = Number.isFinite(config.fuelPrice) && (config.fuelPrice ?? 0) >= 1 && (config.fuelPrice ?? 0) <= 10 ? /** @type {number} */ (config.fuelPrice) : 1.6;
    const tax = Number.isFinite(config.retailTaxPercent) && (config.retailTaxPercent ?? -1) >= 0 && (config.retailTaxPercent ?? 21) <= 20 ? /** @type {number} */ (config.retailTaxPercent) : 5;
    return { ...group, categories:expanded(group.categories).filter(id=>card.rewardKind !== 'triangle' || id !== 'walmart'),
      rate:(group.rate + (group.perLitre ?? 0) / price) / (group.preTax ? 1 + tax/100 : 1) };
  });
  /** @type {import('./types').Category[]} */
  const defaults = ['groceries', 'dining'];
  const selected = [...new Set(config.selected ?? defaults)].filter(id => !['other', 'delivery', 'costcogas', 'costcoonline', 'costco', 'publictransit', 'media', 'travelportal', 'ev','pcgroceries','scenegroceries','shoppers','homehardware','cineplex','triangle','esso','trianglefuel','trianglepremium','utilities','walmart'].includes(id)).slice(0, config.savings ? 3 : 2);
  return [{ categories: expanded(selected), rate: .02 }];
}
/** Initial category rate can be below the eventual base (RBC's ascending tier).
 * @param {Card} card @param {import('./types').Category} category @param {Configuration} [config]
 */
export function initialRate(card, category, config = {}) {
  const matches = rewardGroups(card, config).filter(group => group.categories.includes(category));
  return (matches.length ? Math.max(...matches.map(group => group.rate)) : card.base) * rewardMultiplier(card, config);
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
    const rate = matches.length ? Math.max(...matches.map(group => group.rate)) : card.base;
    let fraction = 1;
    for (const group of matches) {
      const eligible = group.categories.reduce((sum, id) => sum + Math.max(0, monthly[id] ?? 0) * 12, 0);
      if (eligible > 0) fraction = Math.min(fraction, annualCap(group) / eligible);
      if (all > 0 && group.totalSpendCap !== undefined) fraction = Math.min(fraction, group.totalSpendCap / all);
    }
    result += amount * card.base + amount * (rate - card.base) * fraction;
  }
  return result * rewardMultiplier(card, config);
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
