const xlsx = require('xlsx');
const fs = require('fs');

function inferMainFromRow(r) {
  const sub = String(r.SubDivision || r.Division || '').toLowerCase();
  if (sub.includes('boy')) return 'детское мужское';
  if (sub.includes('girl')) return 'детское женское';
  if (sub.includes('woman')) return 'женское';
  if (sub.includes('man')) return 'мужское';
  if (sub.includes('teen') || sub.includes('youth')) return 'подростковое';
  return sub || '';
}

function inferMainLoft(r) {
  const g = String(r.Gender || r.__EMPTY_6 || '').toUpperCase();
  if (g.startsWith('M')) return 'мужское';
  if (g.startsWith('F')) return 'женское';
  return '';
}

// Generic builder for each excel file
function buildJsonFromExcel(file) {
  const wb = xlsx.readFile(file);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  let rows = xlsx.utils.sheet_to_json(sheet, { defval: '' });
  // if the first row contains header strings instead of data, remove it
  if (rows.length) {
    const first = rows[0];
    const vals = Object.values(first).map(v => String(v));
    // simple heuristic: many of the values are non-numeric and contain spaces/letters
    const headerWords = ['Model Code','Link','Category','Unit Price','StyleCode','Price'];
    if (vals.some(v => headerWords.some(h=>v.toLowerCase().includes(h.toLowerCase())))) {
      rows.shift();
    }
  }
  // drop any header-like row where every value equals its column name or is empty
  rows = rows.filter(r => {
    return !Object.keys(r).every(k => {
      const v = String(r[k]).trim();
      return v === '' || v.toLowerCase() === k.toLowerCase();
    });
  });
  const output = [];
  rows.forEach((r, idx) => {
    const obj = { id: idx + 1 };
    if (/defacto/i.test(file)) {
      obj.price = r.Price || '';
      obj.image = r.WebImage || '';
      obj.name = ((r.StyleCode || '') + (r.ColorName ? ' ' + r.ColorName : '')).trim();
      obj.category = r.ClassName || r.BuyerGroup || r.ColorName || '';
      obj.main = inferMainFromRow(r);
      obj.Composition = r.Composition || '';
      obj.SizeInLot = r.SizeInLot || '';
      obj.LotInQuantity = r.LotInQuantity || '';
    } else if (/loft/i.test(file)) {
      obj.price = r['Unit Price'] || r.__EMPTY_15 || '';
      // original page link; we will later transform to direct jpeg if possible
      let link = r.Link || r.__EMPTY_1 || '';
      // try to convert pattern /ViewImage/Index/LF12345 -> /jpg/12345.jpg
      const m = link.match(/^(https?:\/\/[^\/]+)\/ViewImage\/Index\/[A-Za-z]*?(\d+)$/);
      if (m) {
        link = m[1] + '/jpg/' + m[2] + '.jpg';
      }
      obj.image = link;
      obj.name = ((r['Model Code'] || r.__EMPTY) + ' ' + (r.Colour || r.__EMPTY_8)).trim();
      obj.category = r.Category || r.__EMPTY_3 || '';
      obj.main = inferMainLoft(r);
      obj.Composition = '';
      obj.SizeInLot = r.Size || r.__EMPTY_11 || '';
      obj.LotInQuantity = r['Assortment Qty'] || r.__EMPTY_14 || '';
    }
    output.push(obj);
  });
  return output;
}

// helper: given a Loft page URL, fetch and extract first <img> src
async function fetchLoftPicture(pageUrl) {
  try {
    const fetch = require('node-fetch');
    const resp = await fetch(pageUrl);
    const text = await resp.text();
    const match = text.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (match) {
      let src = match[1];
      if (!src.startsWith('http')) {
        src = new URL(pageUrl).origin + src;
      }
      return src;
    }
  } catch (e) {
    // ignore
  }
  return null;
}

// process both suppliers if spreadsheets exist
(async () => {
  for (const xlsxFile of ['DeFacto.xlsx', 'Loft.xlsx']) {
    if (!fs.existsSync(xlsxFile)) continue;
    let arr = buildJsonFromExcel(xlsxFile);
    if (/loft/i.test(xlsxFile)) {
      console.log('resolving loft image URLs...');
      for (const obj of arr) {
        if (obj.image && obj.image.toLowerCase().includes('productimage.loft.com.tr')) {
          const real = await fetchLoftPicture(obj.image);
          if (real) obj.image = real;
        }
      }
    }
    const jsonName = xlsxFile.replace(/\.xlsx$/i, '.json');
    fs.writeFileSync(jsonName, JSON.stringify(arr, null, 2), 'utf8');
    console.log('created', jsonName, 'with', arr.length, 'items');
  }
})();

