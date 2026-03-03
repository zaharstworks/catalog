const puppeteer = require('puppeteer');
(async ()=>{
  const browser = await puppeteer.launch({args:['--no-sandbox'],headless:true});
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  await page.goto('http://localhost:8000', {waitUntil:'networkidle2'});
  // simple delay to allow scripts to run
  await new Promise(r => setTimeout(r, 1000));
  const prodHTML = await page.$eval('#product-list', el=>el.innerHTML);
  const mainVal = await page.$eval('#main-select', el=>el.value);
  const subVal = await page.$eval('#sub-select', el=>el.value);
  console.log('main select', mainVal);
  console.log('sub select', subVal);
  console.log('products html length', prodHTML.length);
  console.log('first 500 chars', prodHTML.slice(0,500));
  await browser.close();
})();