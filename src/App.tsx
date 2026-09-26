import { useState } from 'react';
import { ArrowDown, Check, ChevronDown, CreditCard, ExternalLink, Info, Leaf, RotateCcw, ShieldCheck, Sparkles, Wallet } from 'lucide-react';
import { cards, categories, selectableCategories } from './catalog';
import { annualFee, breakEven, cashback, initialRate, rewardGroups, total } from './engine';
import artwork from './card-artwork.json';
import type { Budget, Card, Category, Configuration } from './types';

const money = (value: number, cents = false) => new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: cents ? 2 : 0 }).format(value);
const thresholdMoney = (value: number) => money(Math.ceil((value - 1e-8) * 100) / 100, true);
const percent = (value: number) => `${Number((value * 100).toFixed(2))}%`;
const initialConfig: Configuration = { selected: ['groceries', 'dining'], savings: false };
const example: Budget = { groceries: 650, dining: 200, delivery: 50, gas: 150, transit: 100, bills: 250, drugstores: 50, entertainment: 75, home: 50, other: 300 };
function CardArtwork({ card }: { card: Card }) {
  const [failed, setFailed] = useState(false);
  const filename = (artwork as Record<string, string>)[card.id];
  return <div className="card-artwork">
    {failed || !filename ? <p className="card-artwork-fallback">{card.issuer} {card.name}<span>Card image unavailable</span></p> : <img src={`${import.meta.env.BASE_URL}cards/${filename}`} alt={`${card.issuer} ${card.name}`} width="320" height="202" decoding="async" onError={() => setFailed(true)} />}
  </div>;
}
function Icon({ category }: { category: Category }) {
  const symbols: Record<Category, string> = {groceries:'◒',dining:'♧',delivery:'↗',gas:'◈',transit:'⇄',bills:'▤',drugstores:'✚',entertainment:'♫',home:'⌂',furniture:'▱',hotels:'▦',games:'⊞',fitness:'◇',other:'•••',costcogas:'◈',costcoonline:'▱',costco:'▱',publictransit:'⇄',media:'♫',travelportal:'▦',ev:'◈'};
  return <span className={`category-icon icon-${category}`} aria-hidden="true">{symbols[category]}</span>;
}
function ConfigurationPanel({ card, config, onChange, id }: { card: Card; config: Configuration; onChange: (config: Configuration) => void; id: string }) {
  if (card.id === 'wealthsimple') return <fieldset className="configuration"><legend>Your fee waiver</legend>
    <label className="check-label"><input aria-label={`${id}: qualifying Wealthsimple fee waiver`} type="checkbox" checked={!!config.feeWaived} onChange={e => onChange({ ...config, feeWaived:e.target.checked })} /> I meet Wealthsimple’s ongoing fee-waiver requirements</label>
    <p className="muted">$100,000+ in individual eligible assets/net deposits, or qualifying $4,000 direct deposits per billing cycle. Assumes eligibility throughout the modeled year.</p>
  </fieldset>;
  if (!card.selectable) return null;
  const selected = config.selected ?? [];
  const limit = config.savings ? 3 : 2;
  return <fieldset className="configuration"><legend>Your 2% categories <span>{selected.length}/{limit} selected</span></legend>
    <label className="check-label"><input type="checkbox" checked={!!config.savings} onChange={e => onChange({ ...config, savings: e.target.checked, selected: selected.slice(0, e.target.checked ? 3 : 2) })} /> Deposit rewards to a Tangerine Savings Account</label>
    <div className="chips">{selectableCategories.map(c => <label key={c.id} className={selected.includes(c.id) ? 'chip active' : 'chip'}><input aria-label={`${id}: ${c.label} bonus category`} type="checkbox" checked={selected.includes(c.id)} disabled={!selected.includes(c.id) && selected.length >= limit} onChange={e => onChange({ ...config, selected: e.target.checked ? [...selected, c.id] : selected.filter(x => x !== c.id) })} />{c.short}</label>)}</div>
  </fieldset>;
}
function Threshold({ result }: { result: ReturnType<typeof breakEven> }) {
  if (result.empty) return <><strong>—</strong><span>Enter your monthly spending</span></>;
  if (result.first === null) return <><strong className="small-result">No break-even</strong><span>Under this spending mix and these rules</span></>;
  if (result.first === 0) return <><strong className="small-result">Already covered</strong><span>No spending required to cover the fee</span></>;
  return <><strong>{thresholdMoney(result.first)}<small> / month</small></strong><span>{thresholdMoney(result.first * 12)} per year, at your current spending mix</span></>;
}
export default function App() {
  const [cardId, setCardId] = useState('bmo-world');
  const [baselineId, setBaselineId] = useState('bmo-free');
  const [config, setConfig] = useState<Configuration>(initialConfig);
  const [baselineConfig, setBaselineConfig] = useState<Configuration>(initialConfig);
  const [inputs, setInputs] = useState<Partial<Record<Category, string>>>({});
  const [mode, setMode] = useState<'fee' | 'compare'>('fee');
  const [period, setPeriod] = useState<'monthly' | 'annual'>('monthly');
  const card = cards.find(c => c.id === cardId)!;
  const baseline = cards.find(c => c.id === baselineId)!;
  const invalid = categories.filter(c => inputs[c.id] !== undefined && inputs[c.id] !== '' && (!Number.isFinite(Number(inputs[c.id])) || Number(inputs[c.id]) < 0 || Number(inputs[c.id]) > 1000000));
  const budget: Budget = Object.fromEntries(categories.map(c => [c.id, invalid.some(x => x.id === c.id) ? 0 : Number(inputs[c.id] || 0)]));
  const fee = annualFee(card, config);
  const earned = cashback(card, budget, config);
  const freeEarned = cashback(baseline, budget, baselineConfig);
  const net = earned - fee;
  const difference = net - freeEarned;
  const result = breakEven(card, budget, config, mode === 'compare' ? baseline : undefined, baselineConfig);
  const groupRates = rewardGroups(card, config);
  const displayCategories = categories.filter(c => c.id === 'other' || groupRates.some(g => g.categories.includes(c.id)));
  function loadExample() { setInputs(Object.fromEntries(Object.entries(example).map(([id, amount]) => [id, String(amount)]))); }
  return <>
    <a className="skip" href="#calculator">Skip to calculator</a>
    <header className="site-header"><a href="#" className="brand" aria-label="Cardback home"><span className="brand-icon"><CreditCard size={22} /></span>cardback<span className="brand-dot">.</span></a><nav aria-label="Main navigation"><a href="#calculator">Calculator</a><a href="#how-it-works">How it works</a><span className="country"><span aria-hidden="true">✦</span> Made for Canada</span></nav></header>
    <main>
      <section className="hero"><div className="eyebrow"><span className="live-dot" /> A LITTLE MATH. A BETTER CARD.</div><h1>Does your credit card<br />pay for <span>itself?</span></h1><p>Find the spending that earns your fee back.<br className="desktop-break" /> Real Canadian cards. Your everyday budget. Clear answers.</p><a className="hero-link" href="#calculator">Let’s do the math <ArrowDown size={16} /></a><div className="hero-decoration" aria-hidden="true"><div className="orbit"/><span className="floating-plus">+</span><span className="floating-dot"/><CreditCard size={52} strokeWidth={1.2}/></div></section>
      <div className="workspace" id="calculator">
        <section className="card-panel panel"><div className="section-label"><span className="step">01</span> PICK YOUR CARD</div><label htmlFor="card-select" className="field-label">Which card are you considering?</label><div className="select-wrap"><select id="card-select" value={cardId} onChange={e => { setCardId(e.target.value); setConfig(initialConfig); }}>{cards.map(c => <option key={c.id} value={c.id}>{c.issuer} {c.name}</option>)}</select><ChevronDown size={17} /></div>
          <CardArtwork key={card.id} card={card} />
          <div className="fee-line"><span>Annual card fee</span><strong>{money(fee)}<small> / year</small></strong></div>
          <ConfigurationPanel card={card} config={config} onChange={setConfig} id="Selected card" />
          <div className="card-rates"><span className="field-label">Your initial cashback rates</span>{displayCategories.map(c => { const rate = initialRate(card, c.id, config); return <div className="rate-line" key={c.id}><span><Icon category={c.id}/>{c.short}</span><strong>{percent(rate)}</strong></div>; })}</div>
          <div className="note"><Info size={16}/><p>{card.note}</p></div><p className="verified"><ShieldCheck size={14}/> Verified Sep 26, 2026 · ongoing rates</p><div className="source-links">{card.sources.map(s => <a key={s.url} href={s.url} target="_blank" rel="noreferrer">{s.label}<ExternalLink size={12}/></a>)}</div>
        </section>
        <div className="right-column"><section className="threshold-panel panel"><div className="section-heading"><div className="section-label"><span className="step">02</span> FIND YOUR BREAK-EVEN</div><span className="tag"><Check size={13}/> Caps included</span></div><h2>A fee that earns its keep.</h2><p className="muted">How much would you need to spend in just one category?</p><div className="segmented" aria-label="Calculation type"><button className={mode === 'fee' ? 'active' : ''} aria-pressed={mode === 'fee'} onClick={() => setMode('fee')}>Cover the fee</button><button className={mode === 'compare' ? 'active' : ''} aria-pressed={mode === 'compare'} onClick={() => setMode('compare')}>Beat a no-fee card</button></div>
          {mode === 'compare' && <div className="baseline"><label htmlFor="baseline-select" className="field-label">Compare against</label><div className="select-wrap"><select id="baseline-select" value={baselineId} onChange={e => { setBaselineId(e.target.value); setBaselineConfig(initialConfig); }}>{cards.filter(c => c.fee === 0).map(c => <option key={c.id} value={c.id}>{c.issuer} {c.name}</option>)}</select><ChevronDown size={16}/></div><ConfigurationPanel card={baseline} config={baselineConfig} onChange={setBaselineConfig} id="Comparison card"/><p className="baseline-note">{baseline.note} {baseline.sources.map(s => <a key={s.url} href={s.url} target="_blank" rel="noreferrer">{s.label} ↗ </a>)}</p></div>}
          <div className="table-heading"><span>SPENDING CATEGORY</span><div className="period-toggle"><button onClick={() => setPeriod('monthly')} aria-pressed={period === 'monthly'} className={period === 'monthly' ? 'active' : ''}>Monthly</button><button onClick={() => setPeriod('annual')} aria-pressed={period === 'annual'} className={period === 'annual' ? 'active' : ''}>Annual</button></div></div>
          <div className="threshold-rows">{displayCategories.map(c => { const r = breakEven(card, { [c.id]: 1 }, config, mode === 'compare' ? baseline : undefined, baselineConfig); return <div className="threshold-row" key={c.id}><span><Icon category={c.id}/>{c.label}</span><div><strong>{r.first === null ? 'No break-even' : r.first === 0 ? (mode === 'fee' ? 'No fee to cover' : 'Equal at $0') : thresholdMoney(r.first * (period === 'annual' ? 12 : 1))}</strong>{r.first !== null && r.first > 0 && <small> / {period === 'monthly' ? 'mo' : 'yr'}</small>}{r.reversals.length > 0 && <em>Falls behind above {thresholdMoney(r.reversals[0] * (period === 'annual' ? 12 : 1))}</em>}</div></div>; })}</div>
          <p className="table-footnote"><Info size={14}/>Each row assumes spending only in that category, evenly across 12 months.</p>
        </section>
        <section className="budget-panel panel"><div className="section-heading"><div className="section-label"><span className="step">03</span> MAKE IT PERSONAL</div><Wallet size={19} className="muted"/></div><h2>What does your month look like?</h2><p className="muted">Mix your categories to see what you’d actually earn.</p><div className="budget-actions"><button onClick={loadExample}><Sparkles size={14}/>Try an example budget</button><button onClick={() => setInputs({})}><RotateCcw size={13}/>Reset</button></div><div className="budget-grid">{categories.map(c => <div className="budget-field" key={c.id}><label htmlFor={`budget-${c.id}`}><Icon category={c.id}/>{c.label}</label><div className={`money-input ${invalid.some(x => x.id === c.id) ? 'invalid' : ''}`}><span>$</span><input id={`budget-${c.id}`} type="number" min="0" max="1000000" step="0.01" inputMode="decimal" placeholder="0" value={inputs[c.id] ?? ''} aria-invalid={invalid.some(x => x.id === c.id)} aria-describedby={invalid.some(x => x.id === c.id) ? `error-${c.id}` : undefined} onChange={e => setInputs({ ...inputs, [c.id]: e.target.value })}/><small>/ mo</small></div>{invalid.some(x => x.id === c.id) && <p className="input-error" id={`error-${c.id}`}>Enter an amount from $0 to $1,000,000.</p>}</div>)}</div><div className="budget-total"><span>Total monthly spending</span><strong>{money(total(budget), true)}</strong></div>
          <div className="results" aria-live="polite" aria-atomic="true">{invalid.length > 0 ? <p className="input-error">Correct the highlighted amounts to calculate your results.</p> : <><div className="result-primary"><span className="section-label">{mode === 'fee' ? 'YOUR FEE BREAK-EVEN' : 'YOUR COMPARISON BREAK-EVEN'}</span><Threshold result={result}/>{result.reversals.length > 0 && <p className="reversal">The paid card falls behind again above {thresholdMoney(result.reversals[0])}/month.</p>}</div><div className="result-stats"><div><span>Annual cashback</span><strong>{money(earned, true)}</strong></div><div><span>Annual fee</span><strong>−{money(fee, true)}</strong></div><div className={net >= 0 ? 'positive' : 'negative'}><span>Cashback after fee</span><strong>{money(net, true)}</strong></div></div>{mode === 'compare' && <div className="comparison-result"><span>{baseline.issuer} {baseline.name}: {money(freeEarned, true)}/year</span><strong className={difference >= 0 ? 'positive' : 'negative'}>{money(Math.abs(difference), true)} {difference >= 0 ? 'ahead' : 'behind'} per year</strong></div>}<p className="results-note">{total(budget) === 0 ? 'Enter your spending above to see your annual return.' : net >= 0 ? 'Your cashback covers the card’s fee at this budget.' : `You’re ${money(-net, true)} short of covering the annual fee.`}</p></>}</div>
        </section></div>
      </div>
      <section id="how-it-works" className="how"><div><span className="eyebrow">NO GUESSWORK</span><h2>The math behind<br/>a better decision.</h2></div><div className="how-item"><span>01 /</span><h3>Start with the ongoing fee</h3><p>We use the regular fee and cashback rates, without welcome bonuses or first-year offers.</p></div><div className="how-item"><span>02 /</span><h3>Let the caps count</h3><p>Bonus rates apply up to the issuer’s spending limits. Spending above a cap earns the fallback rate.</p></div><div className="how-item"><span>03 /</span><h3>Compare your real return</h3><p>Cashback minus the fee shows what’s left. A free-card comparison shows whether paying extra makes sense.</p></div></section>
      <details className="methodology"><summary>Assumptions & calculation details <ChevronDown size={16}/></summary><p>Amounts are in Canadian dollars. Spending repeats evenly each month, over a complete reward year with fresh caps. One modeled month equals one billing cycle. Shared annual caps are allocated proportionally across categories; actual purchase timing can change rewards. Category totals must not overlap: put a recurring purchase or food delivery purchase in only one field.</p><p>Delivery classification varies: BMO and RBC use their base rates here; CIBC and Simplii assume restaurant-coded delivery; Scotia assumes an eligible delivery service. Gas/EV spending on Tangerine assumes gas-coded purchases. Merchant coding determines eligibility, and premium cards have income requirements.</p><p>Interest, foreign exchange costs, supplementary cards, fee rebates, insurance, perks and redemption timing are excluded. Balances are assumed paid in full. Tangerine’s foreign-currency category is not modeled. Issuer sources are linked beside each card; terms may change.</p><p>For flat rates, break-even is fee ÷ rate. For capped rates, we solve each rate segment. Comparison subtracts the no-fee card’s rewards and checks every segment for a crossing or later reversal. Thresholds are rounded upward to the nearest cent; estimates may differ from statement rounding.</p></details>
    </main><footer><a className="brand" href="#"><span className="brand-icon"><CreditCard size={18}/></span>cardback<span className="brand-dot">.</span></a><span>A little clarity for your everyday spending.</span><span className="privacy"><Leaf size={14}/>Your budget stays in your browser.</span></footer>
  </>;
}
