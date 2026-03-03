import pandas as pd

def excel_to_json(excel_path, json_path):
    # Read first sheet
    df = pd.read_excel(excel_path)
    # Ensure columns: id, name, price, category, image
    # Lowercase column names
    df.columns = [c.strip().lower() for c in df.columns]
    # Rename common variations
    mapping = {}
    for col in df.columns:
        if col in ['название','name','product','товар']:
            mapping[col] = 'name'
        if col in ['цена','price','cost']:
            mapping[col] = 'price'
        if col in ['категория','category','type']:
            mapping[col] = 'category'
        if col in ['ссылка','link','image','photo','url']:
            mapping[col] = 'image'
        if col in ['id']:
            mapping[col] = 'id'
    df = df.rename(columns=mapping)
    # Fill missing ids
    if 'id' not in df.columns:
        df.insert(0, 'id', range(1, len(df) + 1))
    # Convert to dicts
    products = df.to_dict(orient='records')
    # Drop NaNs and convert to basic types
    for p in products:
        for k,v in list(p.items()):
            if pd.isna(v):
                p[k] = ''
    with open(json_path, 'w', encoding='utf-8') as f:
        import json
        json.dump(products, f, ensure_ascii=False, indent=2)
    print(f"Converted {len(products)} rows to {json_path}")

if __name__ == '__main__':
    import sys
    if len(sys.argv) < 3:
        print('Usage: python convert_excel.py input.xlsx output.json')
        sys.exit(1)
    excel_to_json(sys.argv[1], sys.argv[2])
