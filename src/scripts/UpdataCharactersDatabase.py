import json
import urllib3

# Variables
url = "https://gbf.wiki/api.php"
params = {
    'action': "cargoquery",
    'format': "json",
    'tables': "characters",
    'fields': "element, rarity, name, series, weapon, id, race, gender, release_date",
    'where': "rarity='SSR'",
    'order_by': "name",
    'limit':"50"
}

header = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/44.0.2403.89 Chrome/44.0.2403.89 Safari/537.36",}

all_results = []
offset = 0
while True:
    try:
        # Pagination
        params['offset'] = offset

        response = urllib3.request("GET",url, fields=params)

        # Extract results
        data = response.json()
        if 'cargoquery' in data:
            results = data['cargoquery']
            all_results.extend(results)

            if len(results) < 50:
                break

            offset += 50
        else:
            break

    except urllib3.exceptions.HTTPError as e:
        print(f"Error : {e.reason}")
        break
# Export data as Json
with open('src/data/Characters.json', 'w', encoding='utf-8') as f:
    json.dump(all_results, f, ensure_ascii=False, indent=4)
