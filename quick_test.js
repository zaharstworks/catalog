const puppeteer=require('puppeteer');
(async()=>{
  const browser=await puppeteer.launch({args:['--no-sandbox'],headless:true});
  const page=await browser.newPage();
  page.on('console',msg=>console.log('PAGE LOG:',msg.text()));
  await page.goto('http://localhost:8001',{waitUntil:'networkidle2'});
  await new Promise(r=>setTimeout(r,1000));
  // list initial mains
  const mains=await page.$$eval('#main-select option',els=>els.map(o=>o.value));
  console.log('initial mains', mains.slice(0,5));
  const logoUrls = await page.$$eval('#manufacturers img', imgs=>imgs.map(i=>i.getAttribute('src')));
  console.log('manufacturer logos', logoUrls);
  // click second manufacturer (Loft)
  const logos = await page.$$('#manufacturers img');
  if (logos.length > 1) {
    await logos[1].click();
    await new Promise(r=>setTimeout(r,1000));
    const mains2 = await page.$$eval('#main-select option',els=>els.map(o=>o.value));
    console.log('after loft mains', mains2.slice(0,5));
    const prodHTML2 = await page.$eval('#product-list',el=>el.innerHTML);
    console.log('after loft prodHTML length', prodHTML2.length);
    // allow time for loft-resolution fetches
    await new Promise(r=>setTimeout(r,1000));
    const imgSrcs = await page.$$eval('#product-list .product img', imgs=>imgs.slice(0,5).map(i=>i.getAttribute('src')));
    console.log('first loft image urls (DOM after resolve)', imgSrcs);
  }
  await browser.close();
})();