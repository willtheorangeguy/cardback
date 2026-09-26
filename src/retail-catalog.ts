import type { Card, Category } from './types';

const verified = '2026-09-26';
const pcUrl = 'https://www.pcfinancial.ca/en/credit-cards/';
const triangleUrl = 'https://triangle.canadiantire.ca/en/credit-cards.html';
const sceneUrl = 'https://www.scotiabank.com/ca/en/personal/credit-cards/visa/scene-card.html';
const meridianTerms = 'https://www.meridiancu.ca/getmedia/4cdead51-fec8-4ec3-8c4c-d7c464b5c369/Rewards-TCs_Meridian-TC707_Final.pdf';
const pcNote = 'PC Optimum points, not cash: valued at 10,000 points = $10 in eligible store rewards, or $7 statement credit. Shoppers rates here include only credit-card points; the separate 15 points/$1 earned by all loyalty members are excluded. Esso/Mobil includes 10 card points/$1 plus the guaranteed card-specific points per litre at your fuel-price assumption; independent loyalty points, station-specific extras and Insiders 150-litre bonus are excluded. Store minimum redemptions and rounding are not modeled. Welcome offers excluded.';

export function additionalCards(categoryIds: Category[]): Card[] {
  const pcCards: Card[] = [
    {id:'pc-free',name:'Mastercard',fee:0,grocery:.01,shoppers:.01,fuel:.01},
    {id:'pc-world',name:'World Mastercard',fee:0,grocery:.02,shoppers:.02,fuel:.01},
    {id:'pc-elite',name:'World Elite Mastercard',fee:0,grocery:.03,shoppers:.03,fuel:.01},
    {id:'pc-insiders',name:'Insiders World Elite Mastercard',fee:120,grocery:.04,shoppers:.035,fuel:.03},
  ].map(c=>({id:c.id,name:c.name,fee:c.fee,issuer:'PC Financial',feePeriod:'annual',base:.01,color:'#7b2735',verified,rewardKind:'pc',
    groups:[{categories:['pcgroceries'],rate:c.grocery},{categories:['shoppers'],rate:c.shoppers},{categories:['esso'],rate:.01,perLitre:c.fuel}],
    sources:[{label:'Cards, fees & ongoing reward terms',url:pcUrl},{label:'Points & redemption guide',url:'https://dis-prod.assetful.loblaw.ca/content/dam/loblaw-companies-limited/creative-assets/pc-financial/documents/insiders_benefitsguide.pdf'},{label:'Statement-credit redemption',url:'https://www.pcfinancial.ca/en/credit-cards/insiders/'}],note:pcNote}));
  return [
    {id:'eq',issuer:'EQ Bank',name:'Card (prepaid Mastercard)',fee:0,feePeriod:'annual',base:.005,color:'#ae8c33',verified,prepaid:true,groups:[],
      sources:[{label:'Card & no-fee pricing',url:'https://www.eqbank.ca/personal-banking/payments/card'},{label:'Fees, cashback & features',url:'https://www.eqbank.ca/personal-banking/payments/card/fees-features'},{label:'Card agreement',url:'https://www.eqbank.ca/legal/card-agreement'}],
      note:'Reloadable prepaid Mastercard, not a credit card: spend funds you load from your EQ Bank account. No monthly or annual card fee; 0.5% cashback on eligible purchases, paid monthly. Interest on the loaded balance, ATM reimbursements and foreign-exchange savings are not included.'},
    {id:'hometrust',issuer:'Home Trust',name:'Preferred Visa',fee:0,feePeriod:'annual',base:.01,color:'#354b76',verified,groups:[],
      sources:[{label:'Card, fee, rates & exclusions',url:'https://www.hometrust.ca/credit-cards/preferred-visa-card/'}],
      note:'Uncapped 1% on eligible Canadian-dollar purchases; no annual fee. Foreign-currency purchases, cash advances, balance transfers, interest and fees earn no cashback. Rewards are credited in January. Not available in Quebec. Inactivity and other transaction fees are excluded.'},
    ...pcCards,
    ...([false,true].map(elite=>({id:elite?'triangle-elite':'triangle',issuer:'Canadian Tire Bank',name:elite?'Triangle World Elite Mastercard':'Triangle Mastercard',fee:0,feePeriod:'annual',base:elite?.01:.005,color:'#497b43',verified,rewardKind:'triangle',
      groups:[{categories:['triangle'],rate:.04,preTax:true},{categories:['groceries'],rate:elite?.03:.015,cap:12000,period:'annual'},
        {categories:['trianglefuel'],rate:0,perLitre:.05},{categories:['trianglepremium'],rate:0,perLitre:elite?.07:.05}],
      sources:[{label:'Cards, fees, rates & reward terms',url:triangleUrl},{label:'Card-specific terms',url:`https://triangle.canadiantire.ca/en/credit-cards/${elite?'triangle-world-elite-mastercard':'triangle-mastercard'}.html`}],
      note:'Canadian Tire Money, not cash: $1 CT Money redeems for $1 at participating stores. 4% on eligible partner-store purchases before tax (adjusted using your tax assumption). Grocery bonus applies to the first $12,000 annually, excluding Costco and Walmart; then the base rate. Gas+/Petro-Canada rewards are per litre, not a fixed percentage. Partner-store exclusions, loyalty offers, Triangle Select subscriptions and perks are not modeled.'})) as Card[]),
    {id:'scene',issuer:'Scotiabank',name:'Scene+ Visa',fee:0,feePeriod:'annual',base:.01,color:'#644c93',verified,rewardKind:'scene',
      groups:[{categories:['scenegroceries','cineplex','homehardware'],rate:.02}],
      sources:[{label:'Card, fees, points & redemption',url:sceneUrl},{label:'Scene+ redemption options',url:'https://www.scotiabank.com/ca/en/personal/programs-services/sceneplus-rewards/earn-redeem.html'}],
      note:'Scene+ points, not cash: 1 point/$1 generally, 2 points/$1 at eligible Sobeys-family grocers, Cineplex and Home Hardware locations. Default value is 1 cent/point for eligible grocery, movie or travel redemptions. Statement-credit option uses 3,000 points = $20. The extra 3 Scene+ Travel points available regardless of payment card, Shell discounts, independent loyalty offers and welcome bonuses are excluded. Redemption minimums are not modeled.'},
    {id:'meridian-free',issuer:'Meridian',name:'Visa Cash Back',fee:0,feePeriod:'annual',base:.005,color:'#385468',verified,
      groups:[{categories:['groceries','gas','drugstores','utilities'],rate:.01}],
      sources:[{label:'Card, fees & rates',url:'https://www.meridiancu.ca/personal/credit-cards/meridian-visa-cash-back-card'},{label:'Reward rules',url:meridianTerms}],
      note:'Uncapped 1% on eligible grocery, gas, pharmacy and utility/telecom merchant codes; 0.5% elsewhere. Utility eligibility is merchant-code based, not every recurring bill. EV charging is not listed as an accelerated merchant code. Meridian membership is required. Rewards are modeled at the advertised account-credit value.'},
    {id:'meridian-platinum',issuer:'Meridian',name:'Visa Platinum Cash Back',fee:49,feePeriod:'annual',base:.01,color:'#767067',verified,
      groups:[{categories:['groceries','gas','drugstores','utilities'],rate:.02,cap:25000,period:'annual'}],
      sources:[{label:'Card, ongoing fee & rates',url:'https://www.meridiancu.ca/personal/credit-cards/meridian-visa-platinum-cash-back-card'},{label:'Shared cap & reward rules',url:meridianTerms}],
      note:'2% on the first $25,000 combined annual eligible grocery, gas, pharmacy and utility/telecom purchases; 1% thereafter and elsewhere. Utility eligibility uses merchant codes; not all recurring bills qualify. EV charging is not listed as accelerated. Meridian membership is required. First-year fee waiver excluded.'},
    ...([false,true].map(elite=>({id:elite?'rogers-elite':'rogers-red',issuer:'Rogers Bank',name:elite?'Red World Elite Mastercard':'Red Mastercard',fee:0,feePeriod:'annual',base:elite?.015:.01,color:'#9c3535',verified,
      groups:[{categories:categoryIds,rate:.02,cap:elite?61000:16000,period:'annual'}],
      sources:[{label:'Card, fee & eligibility',url:`https://www.rogersbank.com/en/rogers_red_${elite?'worldelite_':''}mastercard_details/`},{label:'August 4, 2026 annual-cap rules',url:'https://www.rogersbank.com/legaldocs/en/notification.pdf'},{label:'Current and announced reward terms',url:'https://www.rogersbank.com/en/legal/'}],
      note:`Domestic CAD model: ${elite?'1.5%':'1%'} without eligible Rogers/Fido/Shaw/Comwave service. Eligible customers earn 2% up to $${elite?'61,000':'16,000'} total annual purchases, then ${elite?'1.5%':'1%'}. August 4, 2026 caps apply. USD rates and the conditional 1.5x Rogers redemption bonus are excluded. Announced November 18, 2026 Rogers-purchase changes are not yet modeled. Income and other eligibility requirements apply.`})) as Card[]),
  ];
}
