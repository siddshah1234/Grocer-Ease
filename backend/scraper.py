#Api made by dyl :D
import requests
from bs4 import BeautifulSoup
import os
import re

def findFood(zip, distance):
    names = []
    urls = []
    addresses = []
    URL = "https://networks.whyhunger.org/?s=1&s_f=id&s_o=desc&center_zip=" + zip + "&distance=" + distance + "&radius_quantity=3959&program_type_id=&title=&country_id=1&state_id=&city_id=&address=&zip="

    page = requests.get(URL)
    #print(page.text)
    soup = BeautifulSoup(page.content, 'html.parser')
    links = soup.find_all('a', href=lambda href: href and href.startswith("https://networks.whyhunger.org/organisation/"))

    
    for link in links:
        if link['href'] == "https://networks.whyhunger.org/organisation/add" or link['href'] == "https://networks.whyhunger.org/organisation/search":
            continue

        names.append(link.text.strip())
        urls.append(link['href'])

    address_tags = soup.find_all('b', string=re.compile(r"Address\s*:\s*"))
    for b_tag in address_tags:
        address_element = b_tag.find_next_sibling(text=True)
        if not address_element:
            address_element = b_tag.find_next_sibling().get_text(strip=True)
        addresses.append(address_element.strip())

    return(names, urls, addresses)

#print(findFood("07035", "15"))
