import requests
import json
import time

# Web request
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
"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
}

session = requests.Session()
all_results = []
offset = 0

retry_count = 0
max_retries = 10
while True:
    try:
        params['offset'] = offset

        response = requests.get(url, params=params, headers=header)
        response.raise_for_status()
        
        data = response.json()
        if 'cargoquery' in data:
            results = data['cargoquery']
            all_results.extend(results)

            if len(results) < 50:
                break

            offset += 50
        else:
            break

        retry_count = 0 

    except requests.exceptions.HTTPError as e:
        if response.status_code == 403 and retry_count < max_retries:
            retry_count += 1
            print(f"Erreur 403, tentative {retry_count}/{max_retries}")

        else:
            print(f"Erreur : {e}")
            break
# Export data as Json
with open('src/data/Characters.json', 'w', encoding='utf-8') as f:
    json.dump(all_results, f, ensure_ascii=False, indent=4)
