const fs=require('fs');
const data=JSON.parse(fs.readFileSync('DeFacto.json','utf8'));
const struct={};
data.forEach(p=>{
  const main=p.main||'другое';
  const cat=p.category||'Без категории';
  struct[main]=struct[main]||{};
  struct[main][cat]=struct[main][cat]||0;
  struct[main][cat]++;
});
console.log(Object.keys(struct).length,'mains');
for(const m of Object.keys(struct)){
  const cats=Object.entries(struct[m]).sort((a,b)=>b[1]-a[0]);
  console.log(m,cats.slice(0,5));
}
