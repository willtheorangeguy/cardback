import { describe, expect, it } from 'vitest';
import { annualFee, breakEven, cashback, initialRate, rewardGroups } from './engine';
import { cards, categories, selectableCategories } from './catalog';
import artwork from './card-artwork.json';
import imageSources from '../scripts/card-image-sources.json';
import type { Card } from './types';
const fixture: Card = { id:'test', issuer:'Test', name:'Test', fee:120, feePeriod:'annual', base:.01, groups:[], sources:[], verified:'2026-09-26', color:'#000', note:'' };
const find = (id: string) => cards.find(c=>c.id === id)!;
describe('cashback and break-even', () => {
  it('normalizes monthly fees and optional fee waivers', () => {
    expect(annualFee({...fixture,fee:10,feePeriod:'monthly'})).toBe(120);
    expect(annualFee(fixture,{feeWaived:true})).toBe(0);
  });
  it('solves uncapped fee coverage and zero-rate cases', () => {
    expect(breakEven(fixture,{other:1}).first).toBeCloseTo(1000);
    expect(breakEven({...fixture,base:0},{other:1}).first).toBeNull();
    expect(breakEven({...fixture,fee:0},{other:1}).first).toBe(0);
    expect(breakEven(fixture,{}).empty).toBe(true);
  });
  it('applies BMO monthly caps and fallback rates at their boundaries', () => {
    expect(cashback(find('bmo-world'),{groceries:500})).toBeCloseTo(300);
    expect(cashback(find('bmo-world'),{groceries:501})).toBeCloseTo(300.12);
    expect(cashback(find('bmo-free'),{groceries:600,bills:600})).toBeCloseTo(252);
    expect(breakEven(find('bmo-world'),{groceries:1}).first).toBeCloseTo(139/.05/12);
  });
  it('allocates shared annual limits proportionally', () => {
    expect(cashback(find('simplii'),{groceries:1000,gas:1000})).toBeCloseTo(270);
    expect(cashback(find('scotia'),{groceries:2000,bills:2000})).toBeCloseTo(1230);
  });
  it('uses the earliest CIBC cap including all-category spending', () => {
    expect(cashback(find('cibc-infinite'),{groceries:1000,other:4000})).toBeCloseTo(900);
    expect(cashback(find('cibc-infinite'),{groceries:2000})).toBeCloseTo(840);
    expect(cashback(find('cibc-free'),{groceries:1000,other:4000})).toBeCloseTo(390);
  });
  it('applies the RBC all-spend tier', () => {
    expect(cashback(find('rbc'),{other:2500})).toBeCloseTo(425);
  });
  it('respects Tangerine selections and savings condition', () => {
    const config = {selected:['groceries','dining','gas'] as const};
    expect(rewardGroups(find('tangerine'),{selected:[...config.selected]})[0].categories).toHaveLength(2);
    expect(cashback(find('tangerine'),{gas:100},{selected:[...config.selected]})).toBeCloseTo(6);
    expect(cashback(find('tangerine'),{gas:100},{selected:[...config.selected],savings:true})).toBeCloseTo(24);
  });
  it('finds an advantage and a later reversal rather than assuming monotonic returns', () => {
    const paid = {...fixture,fee:12,groups:[{categories:['groceries'] as const,rate:.05,cap:100,period:'monthly' as const}]};
    const paidCard: Card = {...paid, groups:paid.groups.map(g=>({...g,categories:[...g.categories]}))};
    const free = {...fixture,fee:0,base:.02};
    const result = breakEven(paidCard,{groceries:1},{},free);
    expect(result.first).toBeCloseTo(100/3);
    expect(result.reversals[0]).toBeCloseTo(300);
    expect(breakEven({...paidCard,fee:120},{groceries:1},{},free).first).toBeNull();
  });
  it('keeps budget proportions, and ignores invalid spending', () => {
    expect(breakEven(fixture,{groceries:500,other:500}).first).toBeCloseTo(1000);
    expect(cashback(fixture,{other:NaN,gas:-20})).toBe(0);
  });
  it('has eighteen sourced cards and distinct identifiers', () => {
    expect(cards).toHaveLength(18);
    expect(new Set(cards.map(c=>c.id)).size).toBe(cards.length);
    expect(cards.every(c=>c.sources.length > 0 && c.sources.every(s=>s.url.startsWith('https://')))).toBe(true);
  });
});

describe('Big Five catalog scan', () => {
  it('covers every scanned personal cashback product and all artwork mappings', () => {
    const expected: Record<string, number> = {BMO:3,TD:2,RBC:2,Scotiabank:4,CIBC:5};
    for (const [issuer, count] of Object.entries(expected)) {
      expect(cards.filter(card=>card.issuer === issuer)).toHaveLength(count);
    }
    expect(Object.keys(artwork).sort()).toEqual(cards.map(card=>card.id).sort());
    expect(Object.keys(imageSources).sort()).toEqual(Object.keys(artwork).sort());
    const ids = new Set(categories.map(category=>category.id));
    expect(ids.size).toBe(categories.length);
    for (const card of cards) {
      expect(card.fee).toBeGreaterThanOrEqual(0);
      for (const group of rewardGroups(card)) {
        expect(group.categories.every(id=>ids.has(id))).toBe(true);
        expect(new Set(group.categories).size).toBe(group.categories.length);
      }
    }
  });
  it.each(['td-infinite','td-free'])('keeps independent TD caps and the shared bills/media cap for %s', id => {
    const card = find(id);
    const cap = id === 'td-infinite' ? 15000 : 5000;
    const rate = id === 'td-infinite' ? .03 : .01;
    expect(cashback(card,{groceries:cap/12,gas:cap/12,publictransit:cap/12})).toBeCloseTo(cap*rate*3);
    expect(cashback(card,{bills:cap/12,games:cap/12,media:cap/12})).toBeCloseTo(cap*rate+cap*2*card.base);
    expect(cashback(card,{transit:100})).toBeCloseTo(1200*card.base);
    expect(cashback(card,{groceries:(cap+12)/12})).toBeCloseTo(cap*rate+12*card.base);
  });
  it('solves TD and Scotia Visa fee recovery below caps', () => {
    expect(breakEven(find('td-infinite'),{groceries:1}).first).toBeCloseTo(139/.03/12);
    expect(breakEven(find('scotia-visa'),{drugstores:1}).first).toBeCloseTo(49/.02/12);
  });
  it('applies both RBC ascending and descending tiers independently', () => {
    const card = find('rbc-free');
    expect(initialRate(card,'other')).toBe(.005);
    expect(initialRate(card,'groceries')).toBe(.02);
    expect(cashback(card,{groceries:500,other:500})).toBeCloseTo(150);
    expect(cashback(card,{groceries:501,other:501})).toBeCloseTo(150.24);
    expect(cashback(card,{gas:500,bills:500})).toBeCloseTo(90);
    // A paid 1% card first overtakes RBC inside the low-rate tier.
    expect(breakEven({...fixture,fee:12},{other:1},{},card).first).toBeCloseTo(200);
    // Once the tier rises to 1%, a fee above its $30 advantage cannot be recovered.
    expect(breakEven({...fixture,fee:31},{other:1},{},card).first).toBeNull();
  });
  it('keeps Scotia Visa shared caps distinct from uncapped Mastercard rewards', () => {
    expect(cashback(find('scotia-visa'),{groceries:2000,bills:2000})).toBeCloseTo(730);
    expect(cashback(find('scotia-free'),{groceries:1000,drugstores:1000})).toBeCloseTo(195);
    expect(cashback(find('scotia-mastercard'),{groceries:4000})).toBeCloseTo(480);
    expect(cashback(find('scotia-mastercard'),{publictransit:100,delivery:100})).toBeCloseTo(12);
    expect(cashback(find('scotia-mastercard'),{ev:100})).toBeCloseTo(6);
    expect(cashback(find('td-infinite'),{ev:100})).toBeCloseTo(36);
  });
  it('models CIBC Platinum dual caps and uncapped travel portal rewards', () => {
    expect(cashback(find('cibc-platinum'),{groceries:2000})).toBeCloseTo(640);
    expect(cashback(find('cibc-platinum'),{groceries:1000,other:4000})).toBeCloseTo(720);
    expect(cashback(find('cibc-platinum'),{travelportal:5000})).toBeCloseTo(1200);
    expect(cashback(find('cibc-infinite'),{travelportal:5000})).toBeCloseTo(1200);
    expect(cashback(find('cibc-free'),{travelportal:5000})).toBeCloseTo(600);
  });
  it('shares the Costco fuel cap and preserves the independent online cap', () => {
    const card = find('cibc-costco');
    expect(cashback(card,{costcogas:5000/12})).toBeCloseTo(150);
    expect(cashback(card,{costcogas:5012/12})).toBeCloseTo(150.12);
    expect(cashback(card,{gas:5000/12})).toBeCloseTo(100);
    expect(cashback(card,{gas:5000/12,costcogas:5000/12})).toBeCloseTo(175);
    expect(cashback(card,{ev:5000/12,costcogas:5000/12})).toBeCloseTo(175);
    expect(cashback(card,{costcoonline:8012/12})).toBeCloseTo(160.12);
    expect(cashback(card,{dining:1000,delivery:1000,costco:1000})).toBeCloseTo(840);
  });
  it('shares existing gas and transit caps across the new split fields', () => {
    expect(cashback(find('bmo-world'),{gas:300,costcogas:300})).toBeCloseTo(144);
    expect(cashback(find('bmo-world'),{transit:300,publictransit:300})).toBeCloseTo(180);
    expect(cashback(find('tangerine'),{costcogas:100,publictransit:100},{selected:['gas','transit']})).toBeCloseTo(48);
    expect(selectableCategories).toHaveLength(12);
  });
  it('keeps student variants equivalent to their standard ongoing rewards', () => {
    const budget = {groceries:1000,gas:500,other:2000,travelportal:200};
    expect(cashback(find('bmo-student'),budget)).toBeCloseTo(cashback(find('bmo-free'),budget));
    expect(cashback(find('cibc-student'),budget)).toBeCloseTo(cashback(find('cibc-free'),budget));
  });
});
