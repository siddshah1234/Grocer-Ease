import requests

URL = "https://networks.whyhunger.org/?s=1&s_f=id&s_o=desc&center_zip=07035&distance=50&radius_quantity=3959&program_type_id=&title=&country_id=1&state_id=&city_id=&address=&zip="

page = requests.get(URL)
print(page.text)