import requests
from bs4 import BeautifulSoup as bs 
import json
import os.path

# Variables
url = "https://gbf.wiki"
header = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",}
features="html.parser"
imgPath = 'src/img/characters/'

# Open Json
with open("src/data/Characters.json", encoding="utf8") as chara:
    data = json.load(chara)

    # Get each character ID
    for item in data:
            id = item['title']['id']

            # If character image is not already downloaded
            if os.path.isfile(imgPath+id+'.png')==False:
                
                #Get IMG Link
                UrlCharacterPreview = url+'/File:Npc_zoom_'+id+'_01.png'
                print(UrlCharacterPreview)
                r = requests.get(UrlCharacterPreview)
                soup = bs(r.content, features)
                result = soup.find("div", {"class": "fullImageLink"})
                CharacterLink = result.find('a')
                CharacterLink = CharacterLink.get('href')
                CharacterLink = url + CharacterLink

                #Download Image
                with open('src/img/characters/'+id+'.png', 'wb') as handle:
                    response = requests.get(CharacterLink, headers=header, stream=True)

                    if not response.ok:
                        print(response)

                    for block in response.iter_content(1024):
                        if not block:
                            break

                        handle.write(block)