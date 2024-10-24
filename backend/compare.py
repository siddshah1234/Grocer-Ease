import requests
from bs4 import BeautifulSoup
#Shoprite
#Stop and Shop
#ACME

def compareFood (food):
    shoprite = []
    stopshop = []
    acme = []

    shopriteURL = "https://www.shoprite.com/sm/pickup/rsid/3000/results?q=" + food + "&page=1&skip=0"
    shopritePage = requests.get(shopriteURL)
    shopriteSoup = BeautifulSoup(shopritePage.content, 'html.parser')
    div = shopriteSoup.find('div', class_=lambda x: x and any('ProductCardNameWrapper' in cls for cls in x.split()))
    next_element = div.find_next(text=True)
    shoprite[0] = next_element.strip()
    div = shopriteSoup.find('div', class_=lambda x: x and any('ProductPrice' in cls for cls in x.split()))
    next_element = div.find_next(text=True)
    shoprite[1] = next_element.strip()
    img_tag = shopriteSoup.find('img', class_=lambda x: x and any('ProductImage' in cls for cls in x.split()))
    shoprite[2] = img_tag.get('src')
    a_tag = shopriteSoup.find('a', class_=lambda x: x and any('ProductCardHiddenLink' in cls for cls in x.split()))
    shoprite[3] = a_tag.get('href')
    



    return(shoprite, stopshop, acme)
print(compareFood("eggs"))
    