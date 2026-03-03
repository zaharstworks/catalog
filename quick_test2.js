const puppeteer=require('puppeteer');
(async()=>{
  const browser=await puppeteer.launch({args:['--no-sandbox'],headless:true});
  const page=await browser.newPage();
  page.on('console',msg=>console.log('PAGE LOG:',msg.text()));
  for(const url of ['http://localhost:8010/defacto.html','http://localhost:8010/loft.html']){
    await page.goto(url,{waitUntil:'networkidle2'});
    await new Promise(r=>setTimeout(r,1000));
    const mains=await page.$$eval('#main-select option',els=>els.map(o=>o.value));
    console.log(url,'mains',mains.slice(0,3));
  }
  await browser.close();
})();