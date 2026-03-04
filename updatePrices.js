const fs = require('fs');
const XLSX = require('xlsx');

// 1. Словари перевода
const category_translate = {
    "Knitted Dress": "трикотажное платье",
    "Woven Dress": "тканевое платье",
    "Knitted Skirt": "трикотажная юбка",
    "Short Sleeve T-Shirt": "футболка с коротким рукавом",
    "Trousers": "брюки",
    "Long Sleeve Shirt": "рубашка с длинным рукавом",
    "Pullover": "пуловер",
    "Short Sleeve Blouse": "блузка с коротким рукавом",
    "Woven Set": "тканевый комплект",
    "Woven Skirt": "тканевая юбка",
    "Jump Suit": "комбинезон",
    "Long Sleeve T-Shirt": "лонгслив",
    "Long Sleeve Blouse": "блузка с длинным рукавом",
    "Knitted Set": "трикотажный комплект",
    "Sweat Shirt": "свитшот",
    "Cardigan": "кардиган",
    "Short": "шорты",
    "Overalls": "комбинезон",
    "Dress": "платье",
    "Short Sleeve Polo T-Shirt": "поло с коротким рукавом",
    "Short Sleeve Shirt": "рубашка с коротким рукавом",
    "Tricot Set": "трикотажный комплект",
    "Knitted Pyjamas": "трикотажная пижама",
    "Mont": "куртка",
    "Athlete": "майка",
    "Vest": "жилет",
    "PU Mont": "куртка из экокожи",
    "Knitted Bottoms": "трикотажный низ",
    "Woven Bottoms": "тканевый низ",
    "Knitted Tops": "трикотажный верх",
    "Long Sleeve Polo T-Shirt": "поло с длинным рукавом",
    "Jacket": "жакет",
    "Socks": "носки",
    "Low Cut Socks": "короткие носки",
    "Belt": "ремень",
    "Water Bottle": "бутылка для воды",
    "Perfume Bottle Type": "флакон для парфюма",
    "Bag": "сумка",
    "Wallet": "кошелёк",
    "Baggage": "багаж",
    "Card Holder": "картхолдер",
    "BackPack": "рюкзак",
    "Personal Care": "товары личной гигиены",
    "Scarf & Set": "шарф и комплект",
    "Hat": "шапка",
    "Child Suspenders": "детские подтяжки",
    "Shawl": "шаль",
    "Neck Pillow": "подушка для шеи",
    "Mini Bag": "мини-сумка",
    "Sunglasses": "солнцезащитные очки",
    "Skin Care": "уход за кожей",
    "Kimono": "кимоно",
    "Beret": "берет",
    "Gloves": "перчатки",
    "Earmuff": "наушники (утеплённые)",
    "Knitted Boxer": "трикотажные боксеры",
    "Bodysuit": "боди",
    "Package Slip": "комбинация",
    "Bra": "бюстгальтер",
    "Robe": "халат",
    "Slip": "комбинация",
    "Reading Glasses": "очки для чтения",
    "Blazer": "блейзер",
    "Short Sleeve Knitted Dress": "трикотажное платье с коротким рукавом",
    "Short Sleeve Woven Dress": "тканевое платье с коротким рукавом",
    "Sleeveless Blouse": "блузка без рукавов",
    "Skirt": "юбка",
    "Capri": "капри",
    "Loungewear": "домашняя одежда",
    "Roller": "роллер",
    "Necklace": "ожерелье",
    "Hair Clip": "заколка для волос",
    "Long Sleeve Body": "боди с длинным рукавом",
    "Long Sleeve Knitted Dress": "трикотажное платье с длинным рукавом",
    "Leggings": "леггинсы",
    "Hair Acc.": "аксессуары для волос",
    "Keychains": "брелоки",
    "Earring": "серьги",
    "Bracelet": "браслет",
    "Acc-Set": "набор аксессуаров",
    "Skort": "юбка-шорты",
    "Ring": "кольцо",
    "Süveter": "свитер",
    "Long Sleeve Tunic": "туника с длинным рукавом",
    "Tunic": "туника",
    "Long Sleeve Woven Dress": "тканевое платье с длинным рукавом",
    "Short Sleeve Tunic": "туника с коротким рукавом",
    "Sweat Tunic": "туника-свитшот",
    "Ski Wear": "лыжная одежда",
    "Rain Coat": "дождевик",
    "Jogger": "джогеры",
    "Coat/Parka": "пальто/парка",
    "Cachet": "пальто из драпа",
    "Shirt": "рубашка",
    "Trenchcoat": "тренч",
    "Raincoat": "плащ-дождевик",
    "Set": "комплект",
    "Overshirt": "рубашка-овер"
};

const main_translate = {
    "Man": "Мужчины",
    "Woman": "Женщины",
    "Boy": "Мальчики",
    "Girl": "Девочки",
    "BabyBoy": "Малыши-мальчики",
    "BabyGirl": "Малыши-девочки"
};

// 2. Читаем файл DeFacto.xlsx
const workbook = XLSX.readFile('DeFacto.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rawData = XLSX.utils.sheet_to_json(sheet);

// 3. Преобразуем данные под твои требования
const finalJson = rawData.map(item => {
    // Сначала определяем formattedPrice внутри цикла
    // Number(item.Price).toFixed(2) округлит до 4.86
    const formattedPrice = item.Price ? Number(item.Price).toFixed(2) : "0.00";

    return {
        id: String(item.StyleCode), // Приводим к строке для надежности
        name: String(item.StyleCode), 
        price: `${formattedPrice} $`,
        main: main_translate[item.SubDivision] || item.SubDivision,
        category: category_translate[item.ClassName] || item.ClassName,
        image: item.WebImage,
        composition: item.Composition,
        SizeInLot: item.SizeInLot,
        LotInQuantity: item.LotInQuantity
    };
});

// 4. Записываем в DeFacto.json
fs.writeFileSync('DeFacto.json', JSON.stringify(finalJson, null, 2), 'utf-8');

console.log('✅ Файл DeFacto.json успешно создан!');