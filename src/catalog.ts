import type { Card, Category } from './types';
export const categories: { id: Category; label: string; short: string }[] = [
  { id:'groceries',label:'Groceries',short:'Groceries' },
  { id:'dining',label:'Restaurants & cafés',short:'Dining' },
  { id:'delivery',label:'Eligible food delivery',short:'Food delivery' },
  { id:'gas',label:'Other gas stations',short:'Gas stations' },
  { id:'costcogas',label:'Costco gas (Canada)',short:'Costco gas' },
  { id:'ev',label:'EV charging',short:'EV charging' },
  { id:'publictransit',label:'Public transit & commuter ferries',short:'Public transit' },
  { id:'transit',label:'Taxis, rideshares & other local transit',short:'Transit & rideshares' },
  { id:'bills',label:'Recurring bills & subscriptions',short:'Bills' },
  { id:'games',label:'Digital games',short:'Games' },
  { id:'media',label:'Eligible non-recurring digital media',short:'Digital media' },
  { id:'drugstores',label:'Drugstores',short:'Drugstores' },
  { id:'costco',label:'Costco warehouse purchases',short:'Costco warehouse' },
  { id:'costcoonline',label:'Costco.ca purchases',short:'Costco.ca' },
  { id:'entertainment',label:'Other entertainment',short:'Entertainment' },
  { id:'home',label:'Home improvement',short:'Home improvement' },
  { id:'furniture',label:'Furniture',short:'Furniture' },
  { id:'hotels',label:'Other hotels & motels',short:'Hotels' },
  { id:'travelportal',label:'Eligible CIBC by Expedia travel',short:'CIBC by Expedia' },
  { id:'fitness',label:'Fitness & sports clubs',short:'Fitness' },
  { id:'other',label:'Everything else',short:'Other' },
];
export const selectableCategories = categories.filter(c => !['other', 'delivery', 'publictransit', 'costcogas', 'costcoonline', 'costco', 'media', 'travelportal', 'ev'].includes(c.id));
const bmoTerms = 'https://www.bmo.com/popups/main/personal/credit-cards/terms-and-conditions-en.html';
const cibcTerms = 'https://www.cibc.com/en/personal-banking/credit-cards/rewards-and-points/cash-back-benefits.html';
const accelerated: Category[] = ['groceries','gas','transit','dining','delivery','bills'];
const verified = '2026-09-26';
const scotiaBonus: Category[] = ['groceries','delivery','gas','transit','bills','drugstores'];
const tdRoot = 'https://www.td.com/ca/en/personal-banking/products/credit-cards/cash-back/';
const costcoGuide = 'https://www.cibc.com/content/dam/cibc-public-assets/personal-banking/credit-cards/all-credit-cards/costco/documents/cibc-costco-benefit-guide-en.pdf';
export const cards: Card[] = [
  { id:'bmo-world',issuer:'BMO',name:'CashBack World Elite Mastercard',fee:139,feePeriod:'annual',base:.01,color:'#18475b',verified,
    groups:[{categories:['groceries'],rate:.05,cap:500,period:'monthly'},{categories:['transit'],rate:.04,cap:300,period:'monthly'},{categories:['gas'],rate:.03,cap:300,period:'monthly'},{categories:['bills'],rate:.02,cap:500,period:'monthly'}],
    sources:[{label:'Card & current fee',url:'https://www.bmo.com/en-ca/main/personal/credit-cards/bmo-cashback-world-elite-mastercard/'},{label:'Reward terms',url:bmoTerms}],note:'Monthly caps: $500 groceries, $300 transit, $300 gas/EV, $500 recurring bills; then 1%. Canadian merchant requirements apply.' },
  { id:'bmo-free',issuer:'BMO',name:'CashBack Mastercard',fee:0,feePeriod:'annual',base:.005,color:'#24728a',verified,
    groups:[{categories:['groceries'],rate:.03,cap:500,period:'monthly'},{categories:['bills'],rate:.01,cap:500,period:'monthly'}],sources:[{label:'Rates & caps',url:bmoTerms},{label:'Card details',url:'https://www.bmo.com/main/personal/credit-cards/bmo-cashback-mastercard/'}],note:'3% on the first $500 of groceries and 1% on the first $500 of recurring bills per billing cycle; then 0.5%.' },
  { id:'tangerine',issuer:'Tangerine',name:'Money-Back Credit Card',fee:0,feePeriod:'annual',base:.005,color:'#a94e22',verified,groups:[],selectable:true,
    sources:[{label:'Card details',url:'https://www.tangerine.ca/en/personal/spend/credit-cards'},{label:'Reward terms',url:'https://www.tangerine.ca/en/legal/credit-card-cardholder-agreement'}],note:'Choose two unlimited 2% categories, or three when rewards are deposited to a Tangerine Savings Account. Everything else earns 0.5%. Foreign-currency spending is excluded from this domestic budget model.' },
  { id:'simplii',issuer:'Simplii',name:'Cash Back Visa',fee:0,feePeriod:'annual',base:.005,color:'#4c395f',verified,
    groups:[{categories:['dining','delivery'],rate:.04,cap:5000,period:'annual'},{categories:['gas','groceries','drugstores','bills'],rate:.015,cap:15000,period:'annual'}],sources:[{label:'Rates, caps & availability',url:'https://www.simplii.com/en/faq.html'}],note:'Dining has a $5,000 annual cap; gas, groceries, drugstores and recurring bills share a $15,000 annual cap. Then 0.5%. Not available in Quebec. Delivery earns dining rates only when coded as a restaurant.' },
  { id:'cibc-free',issuer:'CIBC',name:'Dividend Visa',fee:0,feePeriod:'annual',base:.005,color:'#8f3945',verified,
    groups:[{categories:accelerated,rate:.01,cap:20000,period:'annual',totalSpendCap:30000},{categories:['groceries'],rate:.02}],sources:[{label:'Card details',url:'https://www.cibc.com/en/personal-banking/credit-cards/all-credit-cards/dividend-visa-card.html'},{label:'Reward terms',url:cibcTerms}],note:'Accelerated rates stop at $20,000 in combined eligible spending or $30,000 total annual spending, whichever comes first; then 0.5%. Delivery must be coded as dining.' },
  { id:'cibc-infinite',issuer:'CIBC',name:'Dividend Visa Infinite',fee:120,feePeriod:'annual',base:.01,color:'#512f39',verified,
    groups:[{categories:accelerated,rate:.02,cap:20000,period:'annual',totalSpendCap:50000},{categories:['groceries','gas'],rate:.04}],sources:[{label:'Card details',url:'https://www.cibc.com/en/personal-banking/credit-cards/all-credit-cards/dividend-visa-infinite-card.html'},{label:'Benefits & cap rules',url:'https://www.cibc.com/content/dam/personal_banking/credit_cards/agreements_and_insurance/dividend-infinite-bengd-en.pdf'}],note:'Accelerated rates stop at $20,000 in combined eligible spending or $50,000 total annual spending, whichever comes first; then 1%. Delivery must be coded as dining.' },
  { id:'rbc',issuer:'RBC',name:'Cash Back Preferred World Elite',fee:99,feePeriod:'annual',base:.01,color:'#3a527a',verified,
    groups:[{categories:categories.map(c=>c.id),rate:.015,cap:25000,period:'annual'}],sources:[{label:'Card, rates & fee',url:'https://www.rbcroyalbank.com/credit-cards/cash-back/rbc-preferred-world-elite-mastercard.html'}],note:'1.5% on the first $25,000 of total annual purchases; then 1%.' },
  { id:'scotia',issuer:'Scotiabank',name:'Momentum Visa Infinite +',fee:120,feePeriod:'annual',base:.01,color:'#79332e',verified,
    groups:[{categories:['groceries','bills'],rate:.04,cap:25000,period:'annual'},{categories:['gas','transit','delivery'],rate:.02,cap:25000,period:'annual'}],sources:[{label:'Card details',url:'https://www.scotiabank.com/ca/en/personal/credit-cards/visa/momentum-infinite-card.html'},{label:'Reward terms',url:'https://www.scotiabank.com/terms/momentumvisainfiniteplus'}],note:'Groceries and bills share a $25,000 annual cap. Gas/EV, transit and eligible food delivery share another $25,000 cap; then 1%. Food delivery eligibility depends on the service.' }
];

// Additional personal cashback products found in the Big Five issuer scan.
cards.push(
  { id:'td-infinite',issuer:'TD',name:'Cash Back Visa Infinite',fee:139,feePeriod:'annual',base:.01,color:'#205f3b',verified,
    groups:[{categories:['groceries'],rate:.03,cap:15000,period:'annual'},{categories:['gas'],rate:.03,cap:15000,period:'annual'},{categories:['publictransit'],rate:.03,cap:15000,period:'annual'},{categories:['bills','games','media'],rate:.03,cap:15000,period:'annual'}],
    sources:[{label:'Card, fee & reward terms',url:tdRoot+'cash-back-visa-infinite-card'}],note:'Four separate $15,000 annual caps: groceries; gas/EV including Costco gas; eligible public transit; and recurring bills plus eligible digital games/media combined. Then 1%. Taxis and rideshares earn the base rate. Welcome bonuses and fee rebates excluded.' },
  { id:'td-free',issuer:'TD',name:'Cash Back Visa',fee:0,feePeriod:'annual',base:.005,color:'#337145',verified,
    groups:[{categories:['groceries'],rate:.01,cap:5000,period:'annual'},{categories:['gas'],rate:.01,cap:5000,period:'annual'},{categories:['publictransit'],rate:.01,cap:5000,period:'annual'},{categories:['bills','games','media'],rate:.01,cap:5000,period:'annual'}],
    sources:[{label:'Card, fee & reward terms',url:tdRoot+'cash-back-visa-card'}],note:'Four separate $5,000 annual caps: groceries; gas/EV including Costco gas; eligible public transit; and recurring bills plus eligible digital games/media combined. Then 0.5%. Taxis and rideshares earn the base rate.' },
  { id:'rbc-free',issuer:'RBC',name:'Cash Back Mastercard',fee:0,feePeriod:'annual',base:.01,color:'#3a527a',verified,
    groups:[{categories:['groceries'],rate:.02,cap:6000,period:'annual'},{categories:categories.filter(c=>c.id !== 'groceries').map(c=>c.id),rate:.005,cap:6000,period:'annual'}],
    sources:[{label:'Card comparison & fee',url:'https://www.rbcroyalbank.com/credit-cards/cash-back.html'},{label:'Rates & tier rules',url:'https://www.rbcroyalbank.com/credit-cards/cash-back/rbc-cash-back-mastercard/rbc-cash-back-mastercard-benefits-guide.pdf'}],
    note:'Groceries earn 2% on the first $6,000 annually, then 1%. All non-grocery purchases share a separate tier: 0.5% on the first $6,000, then 1%. The non-grocery rate increases after its threshold.' },
  { id:'scotia-visa',issuer:'Scotiabank',name:'Momentum Visa',fee:49,feePeriod:'annual',base:.01,color:'#913e43',verified,
    groups:[{categories:scotiaBonus,rate:.02,cap:25000,period:'annual'}],
    sources:[{label:'Card & fee',url:'https://www.scotiabank.com/ca/en/personal/credit-cards/visa/momentum-cash-back-card.html'},{label:'Reward terms',url:'https://www.scotiabank.com/terms/momentum'}],
    note:'All 2% categories share one $25,000 annual cap; then 1%. Delivery must use an eligible service. From October 22, 2026, rent and tax payments do not qualify for recurring-bill bonus rates; use Everything else for those payments.' },
  { id:'scotia-free',issuer:'Scotiabank',name:'Momentum No-Fee Visa',fee:0,feePeriod:'annual',base:.005,color:'#a3484e',verified,
    groups:[{categories:scotiaBonus,rate:.01,cap:15000,period:'annual'}],
    sources:[{label:'Card & fee',url:'https://www.scotiabank.com/ca/en/personal/credit-cards/visa/momentum-no-fee-card.html'},{label:'Reward terms',url:'https://www.scotiabank.com/terms/momentumnofee'}],
    note:'All 1% categories share one $15,000 annual cap; then 0.5%. Delivery must use an eligible service. From October 22, 2026, rent and tax payments do not qualify for recurring-bill bonus rates; use Everything else for those payments.' },
  { id:'scotia-mastercard',issuer:'Scotiabank',name:'Momentum Mastercard',fee:0,feePeriod:'annual',base:.005,color:'#89343b',verified,
    groups:[{categories:['groceries','gas','drugstores','bills'],rate:.01}],
    sources:[{label:'Card, fee & rates',url:'https://www.scotiabank.com/ca/en/personal/credit-cards/mastercard/momentum-card.html'},{label:'Reward terms effective February 2026',url:'https://www.scotiabank.com/content/dam/scotiabank/canada/en/documents/creditcards/noc/Credit-Card-NOC-and-Scotia-MC-TC_S-EN-WEB.pdf'}],
    note:'Uncapped 1% on eligible groceries, fuel, drugstores and recurring bills; 0.5% elsewhere. EV charging MCC 5552 is not a bonus category on this Mastercard.' },
  { id:'cibc-platinum',issuer:'CIBC',name:'Dividend Platinum Visa',fee:99,feePeriod:'annual',base:.01,color:'#813440',verified,
    groups:[{categories:accelerated,rate:.02,cap:20000,period:'annual',totalSpendCap:30000},{categories:['groceries','gas'],rate:.03},{categories:['travelportal'],rate:.02}],
    sources:[{label:'Card & fee',url:'https://www.cibc.com/en/personal-banking/credit-cards/all-credit-cards/dividend-visa-platinum-card.html'},{label:'Reward rules & caps',url:'https://www.cibc.com/content/dam/personal_banking/credit_cards/agreements_and_insurance/dividend-platinum-bengd-en.pdf'}],
    note:'Accelerated everyday rates stop at $20,000 combined eligible spending or $30,000 total annual purchases, whichever comes first; then 1%. Eligible CIBC by Expedia travel earns uncapped 2% (excluding taxes, insurance and service charges). Delivery must be restaurant-coded.' },
  { id:'cibc-costco',issuer:'CIBC',name:'Costco Mastercard / World Mastercard',fee:0,feePeriod:'annual',base:.01,color:'#345078',verified,
    groups:[{categories:['dining','delivery'],rate:.03},{categories:['gas','costcogas'],rate:.02,cap:5000,period:'annual'},{categories:['costcogas'],rate:.03},{categories:['costcoonline'],rate:.02,cap:8000,period:'annual'}],
    sources:[{label:'Card, fee & membership',url:'https://www.cibc.com/en/personal-banking/credit-cards/all-credit-cards/costco-mastercard.html'},{label:'Reward caps & redemption',url:costcoGuide}],
    note:'Costco gas (3%) and other gas/EV (2%) share a $5,000 annual cap; then 1%. Costco.ca earns 2% on its first $8,000 annually, then 1%. Warehouse purchases earn 1%; restaurant-coded dining/delivery earns uncapped 3%. Both personal tiers share these rewards. Requires paid Costco membership (not included in card fee); cashback is an annual Costco gift certificate.' },
);

const bmoFree = cards.find(card => card.id === 'bmo-free')!;
cards.push({ ...bmoFree, id:'bmo-student',name:'Student CashBack Mastercard',
  sources:[{label:'Student card & fee',url:'https://www.bmo.com/en-ca/main/personal/credit-cards/student-bmo-cashback-mastercard/'},{label:'Reward terms',url:bmoTerms}],
  note:bmoFree.note+' Student application eligibility applies; ongoing rewards match the standard CashBack Mastercard.' });
const cibcFree = cards.find(card => card.id === 'cibc-free')!;
cards.push({ ...cibcFree,id:'cibc-student',name:'Dividend Visa for Students',
  sources:[{label:'Student card & fee',url:'https://www.cibc.com/en/personal-banking/credit-cards/all-credit-cards/dividend-visa-for-students.html'},{label:'Reward terms',url:cibcTerms}],
  note:cibcFree.note+' Student eligibility applies; ongoing cashback matches the standard Dividend Visa.' });
// Portal rewards are exempt from the everyday accelerated-spending caps.
for (const card of cards.filter(card => ['cibc-free','cibc-student','cibc-infinite'].includes(card.id))) {
  card.groups = [...card.groups, { categories:['travelportal'],rate:card.id === 'cibc-infinite' ? .02 : .01 }];
}
const scotiaInfinite = cards.find(card => card.id === 'scotia')!;
scotiaInfinite.note += ' From October 22, 2026, rent and tax payments do not qualify for recurring-bill bonus rates; use Everything else for those payments.';

// These issuer terms explicitly include EV charging in the fuel reward pool.
// Do not infer EV eligibility for the Scotia Mastercard or subsidiary cards.
for (const card of cards.filter(card => ['BMO','TD','RBC','CIBC','Scotiabank'].includes(card.issuer) && card.id !== 'scotia-mastercard')) {
  card.groups = card.groups.map(group => group.categories.includes('gas')
    ? { ...group, categories:[...new Set<Category>([...group.categories,'ev'])] }
    : group);
}
