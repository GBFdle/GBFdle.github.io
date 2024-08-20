import json
import random
# Open Json
with open("src/data/Characters.json", encoding="utf8") as chara:
    data = json.load(chara)

    CountItems = 0

    # Get each character ID
    for item in data:
        CountItems += 1
    RandomPick = random.randint(0, CountItems)
    print(data[RandomPick])
    data[RandomPick]['title']['release_date'] = data[RandomPick]['title'].pop('release date')
    with open('src/data/DailyPick.json', 'w', encoding='utf-8') as f:
        json.dump(data[RandomPick], f, ensure_ascii=False, indent=4)
