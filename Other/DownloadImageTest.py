import requests
from bs4 import BeautifulSoup as bs 


# Variables
id = "3030011000"
url = "https://gbf.wiki/File:Npc_zoom_"+id+"_01.png"
header = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",}
features="html.parser"

#Get IMG Link

r = requests.get(url)
soup = bs(r.content, features)
result = soup.find("div", {"class": "fullImageLink"})
CharacterLink = result.find('a')
CharacterLink = CharacterLink.get('href')
CharacterLink = 'https://gbf.wiki'+ CharacterLink

#Download Image
with open(id+'.png', 'wb') as handle:
    response = requests.get(CharacterLink, headers=header, stream=True)

    if not response.ok:
        print(response)

    for block in response.iter_content(1024):
        if not block:
            break

        handle.write(block)