import { describe, expect, it } from 'vitest';
import { cards, categories } from './catalog';
import { annualFee, breakEven, cashback, initialRate, rewardGroups } from './engine';
const find = (id: string)=>cards.find(card=>card.id === id)!;

describe('smaller issuers and retail reward cards',()=>{
  it('labels EQ as prepaid and models EQ and Home Trust domestic cashback',()=>{
    expect(find('eq').prepaid).toBe(true);
    expect(cashback(find('eq'),{other:1000})).toBeCloseTo(60);
    expect(cashback(find('hometrust'),{other:1000})).toBeCloseTo(120);
    for (const id of ['eq','hometrust']) {
      expect(annualFee(find(id))).toBe(0);
      expect(breakEven(find(id),{other:1}).first).toBe(0);
    }
  });
  it.each([['pc-free',.01,.01],['pc-world',.02,.02],['pc-elite',.03,.03],['pc-insiders',.04,.035]] as const)('uses store-specific, card-only points for %s',(id,grocery,pharmacy)=>{
    const card=find(id);
    expect(cashback(card,{pcgroceries:100,shoppers:100,groceries:100,drugstores:100})).toBeCloseTo(1200*(grocery+pharmacy+.02));
    expect(initialRate(card,'shoppers')).toBe(pharmacy);
    expect(initialRate(card,'groceries')).toBe(.01);
    expect(cashback(card,{other:1000},{statementCredit:true})).toBeCloseTo(84);
  });
  it('calculates card-specific Esso fuel points with a disclosed price assumption',()=>{
    expect(cashback(find('pc-elite'),{esso:160},{fuelPrice:1.6})).toBeCloseTo(31.2);
    expect(cashback(find('pc-insiders'),{esso:160},{fuelPrice:1.6})).toBeCloseTo(55.2);
    expect(cashback(find('pc-elite'),{esso:200},{fuelPrice:2})).toBeCloseTo(36);
    expect(initialRate(find('pc-insiders'),'gas')).toBe(.01);
    expect(breakEven(find('pc-insiders'),{pcgroceries:1}).first).toBeCloseTo(250);
    expect(breakEven(find('pc-insiders'),{pcgroceries:1},{statementCredit:true}).first).toBeCloseTo(120/.028/12);
  });
  it.each([['triangle',.015,.005],['triangle-elite',.03,.01]] as const)('shares the grocery cap for %s and excludes Walmart / Costco',(id,rate,base)=>{
    const card=find(id);
    expect(cashback(card,{groceries:500,pcgroceries:500})).toBeCloseTo(12000*rate);
    expect(cashback(card,{groceries:1000,scenegroceries:1000})).toBeCloseTo(12000*(rate+base));
    expect(cashback(card,{walmart:100,costco:100})).toBeCloseTo(2400*base);
    expect(initialRate(card,'walmart')).toBe(base);
    expect(cashback(card,{triangle:105},{retailTaxPercent:5})).toBeCloseTo(48);
    expect(cashback(card,{triangle:113},{retailTaxPercent:13})).toBeCloseTo(48);
  });
  it('converts Triangle cents-per-litre rewards without stacking the base rate',()=>{
    expect(cashback(find('triangle'),{trianglefuel:160,trianglepremium:160},{fuelPrice:1.6})).toBeCloseTo(120);
    expect(cashback(find('triangle-elite'),{trianglefuel:160,trianglepremium:160},{fuelPrice:1.6})).toBeCloseTo(144);
    expect(cashback(find('triangle-elite'),{gas:160,esso:160},{fuelPrice:1.6})).toBeCloseTo(38.4);
  });
  it('values Scene points by redemption and limits bonuses to participating stores',()=>{
    const card=find('scene');
    const budget={scenegroceries:100,cineplex:100,homehardware:100,groceries:100,pcgroceries:100};
    expect(cashback(card,budget)).toBeCloseTo(96);
    expect(cashback(card,budget,{statementCredit:true})).toBeCloseTo(64);
    expect(initialRate(card,'home')).toBe(.01);
    expect(initialRate(card,'homehardware')).toBe(.02);
  });
  it('uses Meridian utility merchant codes rather than all recurring payments',()=>{
    expect(cashback(find('meridian-free'),{utilities:100,bills:100,ev:100})).toBeCloseTo(24);
    expect(cashback(find('meridian-platinum'),{groceries:2000,utilities:2000})).toBeCloseTo(730);
    expect(breakEven(find('meridian-platinum'),{groceries:1}).first).toBeCloseTo(49/.02/12);
  });
  it.each([['rogers-red',16000,.01],['rogers-elite',61000,.015]] as const)('applies current customer-dependent annual caps for %s',(id,cap,base)=>{
    const card=find(id);
    expect(cashback(card,{other:1000})).toBeCloseTo(12000*base);
    expect(cashback(card,{other:cap/12},{rogersCustomer:true})).toBeCloseTo(cap*.02);
    expect(cashback(card,{other:(cap+12)/12},{rogersCustomer:true})).toBeCloseTo(cap*.02+12*base);
    expect(cashback(card,{groceries:cap/12,other:cap/12},{rogersCustomer:true})).toBeCloseTo(cap*(.02+base));
  });
  it('preserves existing shared caps and separates RBC grocery/non-grocery tiers',()=>{
    expect(cashback(find('bmo-world'),{groceries:250,pcgroceries:250,scenegroceries:250})).toBeCloseTo(330);
    expect(cashback(find('rbc-free'),{groceries:250,pcgroceries:250,other:500})).toBeCloseTo(150);
    expect(cashback(find('rbc-free'),{scenegroceries:500})).toBeCloseTo(120);
    expect(cashback(find('tangerine'),{shoppers:100,homehardware:100},{selected:['drugstores','home']})).toBeCloseTo(48);
    for(const card of cards) for(const group of rewardGroups(card)) expect(new Set(group.categories).size).toBe(group.categories.length);
    expect(categories).toHaveLength(32);
  });
  it('falls back safely on invalid fuel-price and tax assumptions',()=>{
    for (const fuelPrice of [NaN,Infinity,0,-1,11]) expect(cashback(find('triangle'),{trianglefuel:160},{fuelPrice})).toBeCloseTo(60);
    for (const retailTaxPercent of [NaN,Infinity,-1,21]) expect(cashback(find('triangle'),{triangle:105},{retailTaxPercent})).toBeCloseTo(48);
  });
});
