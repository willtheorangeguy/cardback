import { describe, expect, it } from 'vitest';
import { annualFee, breakEven, cashback, rewardGroups } from './engine';
import { cards } from './catalog';
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
  it('has eight sourced cards and distinct identifiers', () => {
    expect(cards).toHaveLength(8);
    expect(new Set(cards.map(c=>c.id)).size).toBe(8);
    expect(cards.every(c=>c.sources.length > 0 && c.sources.every(s=>s.url.startsWith('https://')))).toBe(true);
  });
});
