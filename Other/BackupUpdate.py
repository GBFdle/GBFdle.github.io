import requests
import wget

def faire_requete_cargoquery():
    url = "https://gbf.wiki/api.php"  # Remplacez par l'URL de l'API de votre wiki
    params = {
        'action': "cargoquery",
        'format': "json",  # Le format JSON pour récupérer facilement les données
        'tables': "characters",
        'fields': "element, rarity, name, series, weapon, id",
        'prop': 'imageinfo',
        'limit':"50"
    }
    header = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
  }
    
    all_results = []
    offset = 0
    while True:
        try:
            # Ajouter l'offset pour la pagination
            params['offset'] = offset

            # Envoyer la requête GET
            response = requests.get(url, params=params, headers=header)
            response.raise_for_status()

            # Extraire les résultats
            data = response.json()
            if 'cargoquery' in data:
                results = data['cargoquery']
                all_results.extend(results)  # Ajouter les résultats à la liste globale

                # Si moins de 50 résultats sont retournés, c'est la dernière page
                if len(results) < 50:
                    break

                # Mettre à jour l'offset pour la prochaine requête
                offset += 50
            else:
                break  # Si aucun résultat n'est trouvé, sortir de la boucle

        except requests.exceptions.RequestException as e:
            print(f"Erreur lors de la requête : {e}")
            break

    # Afficher tous les résultats
    for item in all_results:
        fields = item['title']
        
        url = f"https://gbf.wiki/File:Npc_zoom_{fields['id']}_01.png"
        file_name = wget.download(url)
        print('Image Successfully Downloaded: ', file_name)


if __name__ == "__main__":
    faire_requete_cargoquery()

        