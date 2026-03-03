const xlsx=require('xlsx');
const files=['DeFacto.xlsx','Loft.xlsx'];
files.forEach(f=>{
  if(!require('fs').existsSync(f)) return;
  const wb=xlsx.readFile(f);
  console.log('===',f,'Sheets',wb.SheetNames);
  const rows=xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]],{defval:''});
  console.log('columns',Object.keys(rows[0]||{}));
  console.log('first row',rows[0]);
  if(f==='Loft.xlsx'){
    console.log('sample loft rows', rows.slice(1,6));
  }
});
