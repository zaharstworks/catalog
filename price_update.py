import json, re

def parse_price(p):
    if not isinstance(p, str):
        return None
    m = re.search(r"([0-9]+[.,]?[0-9]*)", p)
    if not m:
        return None
    return float(m.group(1).replace(',', '.'))

with open('DeFacto.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

count=0
for item in data:
    num=parse_price(item.get('price'))
    if num is not None:
        new=num*1.05
        item['price']=f"{new:.2f}".replace('.',',') + ' $'
        count+=1

with open('DeFacto.json','w',encoding='utf-8') as f:
    json.dump(data,f,ensure_ascii=False,indent=2)

print('updated',count,'entries')
