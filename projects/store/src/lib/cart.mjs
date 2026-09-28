export const CART_KEY='utkal-store-selection-v1';
export function normaliseCart(value,products){
 if(!Array.isArray(value))return [];
 const result=[];
 for(const item of value){
  if(!item||typeof item!=='object')continue;
  const p=products.find(p=>p.id===item.id);
  if(!p||!p.variants.includes(item.variant)||!Number.isInteger(item.quantity)||item.quantity<1||item.quantity>10)continue;
  const existing=result.find(i=>i.id===item.id&&i.variant===item.variant);
  if(existing)existing.quantity=Math.min(10,existing.quantity+item.quantity);
  else result.push({id:item.id,variant:item.variant,quantity:item.quantity});
 }
 return result;
}
export function addItem(cart,item,products){
 if(normaliseCart([item],products).length!==1)throw new Error('Choose a valid edition and a quantity from 1 to 10.');
 const result=normaliseCart(cart,products);const existing=result.find(i=>i.id===item.id&&i.variant===item.variant);
 if(existing){if(existing.quantity+item.quantity>10)throw new Error('You can save up to 10 of each edition. Adjust your selection first.');existing.quantity+=item.quantity;}
 else result.push({id:item.id,variant:item.variant,quantity:item.quantity});
 return result;
}
export function loadCart(storage,products){
 try{return normaliseCart(JSON.parse(storage.getItem(CART_KEY)||'[]'),products);}catch{return [];}
}
export function saveCart(storage,cart){
 try{storage.setItem(CART_KEY,JSON.stringify(cart));}catch{throw new Error('This browser could not save your selection. Allow local site storage and try again.');}
}
