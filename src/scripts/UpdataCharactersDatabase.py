import requests
import json

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
header = {
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

session = requests.Session()
all_results = []
offset = 0
while True:
    try:
        # Pagination
        params['offset'] = offset

        response = requests.get(url, params=params, headers=header)
        response.raise_for_status()

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

    except requests.exceptions.RequestException as e:
        print(f"Error : {e}")
        break
# Export data as Json
with open('src/data/Characters.json', 'w', encoding='utf-8') as f:
    json.dump(all_results, f, ensure_ascii=False, indent=4)
