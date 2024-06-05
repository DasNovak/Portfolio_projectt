import requests
from bs4 import BeautifulSoup
from zdata_client import insert

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"}


def get_auto():
    urls = 'https://cars.av.by/filter'
    r = requests.get(urls, headers=headers)
    auto = BeautifulSoup(r.content, "html.parser")
    data = auto.find_all("div", class_="listing__items")
    for el in data:
        elem = el.find_all("div", class_="listing-item__wrap")
        for dat in elem:
            cart_url = 'https://cars.av.by' + dat.find("a").get("href")
            yield cart_url

cars_items = []
for cart_url in get_auto():
    r = requests.get(cart_url, headers=headers)
    auto2 = BeautifulSoup(r.content, "html.parser")
    data2 = auto2.find('div', class_='card')
    name = data2.find_next('h1', class_="card__title").text.replace('Продажа ', '')
    brand = data2.find_next('h1', class_="card__title").text[8:30]
    time_create_update = data2.find_next('ul', class_='card__stat').text.split("№")
    number_post = data2.find('ul', class_='card__stat').text.split('№')[-1].replace(' ', '')
    # car_image_src = data3.find('div', class_='listing-item__photo').img['data-src']
    car_top = True if data2.find_next('div', class_='badge badge--top') else False
    car_vin = "" if data2.find('div', class_='badge badge--vin') else "vin"
    params = data2.find('div', class_='card__params').text
    year = params[:7]
    mileage = params[31:]
    price = data2.find('div', class_='card__price-primary').text.split("р.")[0].replace(" ", "")
    description = data2.find('div', class_='card__description').text
    city = data2.find('div', class_='card__location').text.strip()
    try:
        r2 = requests.get('https://api.av.by/offers/' + number_post, headers=headers)
        formatos = r2.json()['photos']
        if formatos:
            photo = formatos[0]['big']['url']
        else:
            photo = None  # or any default value you prefer
    except Exception as e:
        print(f"Error fetching photo for {name}: {e}")
        photo = None

    try:
        cars_items.append((
            # car_image_src,
            brand,
            car_top,
            car_vin,
            time_create_update,
            description,
            mileage,
            year,
            price,
            description,
            city,
            number_post,
            photo,
            name,
            params
        ))
    except Exception as e:
        print(f'Error: {e}')

    insert(name, number_post, brand, time_create_update, description, mileage, year, price, city, photo, params)


get_auto()
