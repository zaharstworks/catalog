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
    }
    output.push(obj);
  });
  return output;
}


// process supplier spreadsheet if it exists
(async () => {
  const xlsxFile = 'DeFacto.xlsx';
  if (fs.existsSync(xlsxFile)) {
    const arr = buildJsonFromExcel(xlsxFile);
    const jsonName = xlsxFile.replace(/\.xlsx$/i, '.json');
    fs.writeFileSync(jsonName, JSON.stringify(arr, null, 2), 'utf8');
    console.log('created', jsonName, 'with', arr.length, 'items');
  }
})();

