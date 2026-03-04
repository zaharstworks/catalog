const fs=require('fs');
console.log('script started');
const data=JSON.parse(fs.readFileSync('DeFacto.json','utf8'));
let changed=0;
const out=data.map(item=>{
  if(item.price && typeof item.price==='string'){
    const m=item.price.match(/([0-9]+[.,]?[0-9]*)/);
    if(m){
      let num=parseFloat(m[1].replace(',','.'));
      num=num*1.05;
      let s=num.toFixed(2).replace('.',',');
      item.price = s + ' $';
      changed++;
    }
  }
  return item;
});
fs.writeFileSync('DeFacto.json', JSON.stringify(out,null,2),'utf8');
console.log('processed',changed,'items');
