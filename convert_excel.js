const XLSX = require('xlsx');
const fs = require('fs');

function excelToJson(inputPath, outputPath) {
  const workbook = XLSX.readFile(inputPath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet, {defval: ''});
  if(data.length>0){
    console.log('Sample row keys:', Object.keys(data[0]));
  }

  // map specific columns to our schema
  // helper translation maps
  const mainMap = {
    Man: 'мужское',
    Woman: 'женское',
    Boy: 'подростковое мужское',
    Girl: 'подростковое женское',
    BabyBoy: 'детское мужское',
    BabyGirl: 'детское женское',
    Unisex: 'унисекс'
  };
  const classMap = {
    'Knitted Dress': 'Вязаное платье',
    'Woven Dress': 'Тканое платье',
    'Knitted Skirt': 'Вязаная юбка',
    'Short Sleeve T-Shirt': 'Футболка с коротким рукавом',
    'Trousers': 'Брюки',
    'Long Sleeve Shirt': 'Рубашка с длинным рукавом',
    'Pullover': 'Пуловер',
    'Short Sleeve Blouse': 'Блузка с коротким рукавом',
    'Woven set': 'Тканый костюм',
    'Woven Skirt': 'Тканая юбка',
    'Jump Suit': 'Комбинезон',
    'Long Sleeve T-Shirt': 'Футболка с длинным рукавом',
    'Long Sleeve Blouse': 'Блузка с длинным рукавом',
    'Knitted Set': 'Вязаный костюм',
    'Sweat Shirt': 'Толстовка',
    'Cardigan': 'Кардиган',
    'Short': 'Шорты',
    'Overalls': 'Комбинезон для детей',
    'Dress': 'Платье',
    'Short Sleeve Polo T-Shirt': 'Поло с коротким рукавом'
    // можно дополнять по мере необходимости
  };

  const results = data.map((row, idx) => {
    const prod = {};
    // ID
    prod.id = row['id'] || row['ID'] || idx + 1;
    // price
    prod.price = row['Price'] || row['price'] || '';
    // image link
    prod.image = row['WebImage'] || row['webimage'] || row['WebImage '] || '';
    // style code and color => name
    const style = row['StyleCode'] || row['stylecode'] || '';
    const color = row['ColorName'] || row['colorname'] || '';
    prod.name = (style + ' ' + color).trim();
    // original class name
    const origClass = row['ClassName'] || row['classname'] || '';
    prod.category = classMap[origClass] || origClass;
    // main group from SubDivision
    const subdiv = row['SubDivision'] || '';
    prod.main = mainMap[subdiv] || 'другое';
    return prod;
  });

  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`Wrote ${results.length} items to ${outputPath}`);
}

if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.log('Usage: node convert_excel.js input.xlsx output.json');
    process.exit(1);
  }
  excelToJson(args[0], args[1]);
}
