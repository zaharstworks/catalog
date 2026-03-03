const puppeteer=require('puppeteer');
(async()=>{
  const browser=await puppeteer.launch({args:['--no-sandbox'],headless:true});
  const page=await browser.newPage();
  page.on('console',msg=>console.log('PAGE LOG:',msg.text()));
  for(const url of ['http://localhost:8010/defacto.html','http://localhost:8010/loft.html']){
    await page.goto(url,{waitUntil:'networkidle2'});
    await new Promise(r=>setTimeout(r,3000));
    const mains=await page.$$eval('#main-select option',els=>els.map(o=>o.value));
    let selectorHtml = '';
    try { selectorHtml = await page.$eval('#selectors', el=>el.innerHTML); } catch(e) { selectorHtml='none'; }
    console.log(url,'mains',mains.slice(0,3));
    console.log(url,'selectorHTML',selectorHtml);
  }
  await browser.close();
})();