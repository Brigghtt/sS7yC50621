import json, re
from concurrent.futures import ThreadPoolExecutor, as_completed
from deep_translator import GoogleTranslator

hero_path = 'lib/data/heroDetails.ts'
fandom_path = 'lib/data/fandomStats.json'
out_desc = 'lib/data/heroDesc_cn.json'
out_hc = 'lib/data/hyperchargeDesc_cn.json'

def has_english(text):
    return bool(re.search(r'[a-zA-Z]', text or ''))

def translate_one(en_text):
    t = GoogleTranslator(source='en', target='zh-CN')
    try:
        return t.translate(en_text)
    except Exception as e:
        print('translate error:', e)
        return en_text

# 1. hero descriptions
print('Reading hero descriptions...')
with open(hero_path, 'r', encoding='utf-8') as f:
    ts = f.read()

hero_descs = {}
for m in re.finditer(r'"enName":\s*"([^"]+)".*?"desc":\s*"([^"]*)"', ts, re.S):
    name, desc = m.group(1), m.group(2)
    # only keep first occurrence per hero (the hero desc, not skill desc)
    if name in hero_descs:
        continue
    hero_descs[name] = desc

print(f'Heroes: {len(hero_descs)}, English descs: {sum(1 for d in hero_descs.values() if has_english(d))}')

# 2. hypercharge descriptions
print('Reading hypercharge descriptions...')
with open(fandom_path, 'r', encoding='utf-8') as f:
    fandom = json.load(f)['stats']

hc_descs = {name: data.get('hypercharge', {}).get('desc', '') for name, data in fandom.items()}

# collect texts to translate
texts = []
for d in hero_descs.values():
    if has_english(d):
        texts.append(d)
for d in hc_descs.values():
    if has_english(d):
        texts.append(d)
texts = list(dict.fromkeys(texts))  # dedup
print(f'Translating {len(texts)} unique texts...')

cache = {}
with ThreadPoolExecutor(max_workers=6) as ex:
    futures = {ex.submit(translate_one, text): text for text in texts}
    for i, fut in enumerate(as_completed(futures)):
        text = futures[fut]
        cache[text] = fut.result()
        if (i + 1) % 20 == 0 or (i + 1) == len(texts):
            print(f'  {i + 1}/{len(texts)}')

hero_cn = {name: cache.get(desc, desc) for name, desc in hero_descs.items() if has_english(desc)}
hc_cn = {name: cache.get(desc, desc) for name, desc in hc_descs.items() if has_english(desc)}

with open(out_desc, 'w', encoding='utf-8') as f:
    json.dump(hero_cn, f, ensure_ascii=False, indent=2)
with open(out_hc, 'w', encoding='utf-8') as f:
    json.dump(hc_cn, f, ensure_ascii=False, indent=2)

print(f'Wrote {out_desc} ({len(hero_cn)}) and {out_hc} ({len(hc_cn)})')
