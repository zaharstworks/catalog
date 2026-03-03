const puppeteer=require('puppeteer');
(async()=>{
  const b=await puppeteer.launch({args:['--no-sandbox'],headless:true});
  const p=await b.newPage();
  await p.goto('http://localhost:8010/loft.html',{waitUntil:'networkidle2'});
  await new Promise(r=>setTimeout(r,1500));
  const mains=await p.$$eval('#main-select option',els=>els.map(o=>o.value));
  console.log('loft mains',mains.slice(0,5));
  await b.close();
})();