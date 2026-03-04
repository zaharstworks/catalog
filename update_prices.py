import json
import pandas as pd

# ----------------------------
# 1. Словарь перевода категорий
# ----------------------------
category_translate = {
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
}

# ----------------------------
# 2. Загружаем Excel с ценами
# ----------------------------
excel_file = "prices.xlsx"  # твой Excel
df = pd.read_excel(excel_file)

# df должен содержать колонки: id, price

# ----------------------------
# 3. Загружаем JSON
# ----------------------------
with open("DeFacto.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# ----------------------------
# 4. Обновляем цены и категории
# ----------------------------
id_to_price = dict(zip(df["id"], df["price"]))

for product in data:
    prod_id = product["id"]
    
    # Обновляем цену, если есть в Excel
    if prod_id in id_to_price:
        product["price"] = id_to_price[prod_id]
    
    # Делаем перевод категории
    cat_en = product.get("category", "")
    product["category_en"] = cat_en
    product["category_ru"] = category_translate.get(cat_en, cat_en)

# ----------------------------
# 5. Сохраняем новый JSON
# ----------------------------
with open("DeFacto_updated.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("✅ DeFacto_updated.json создан!")