import psycopg2
from psycopg2 import Error


def get_connection():
    try:
        connection = psycopg2.connect(
            user="postgres",
            password="postgres",
            host="localhost",
            port="5432"
        )
        return connection
    except Error:
        print(Error)


def insert(name, number_of_post, brand_mark, time_create_update, description, mileage, year, price, city, photo, parametres):
    connection = get_connection()
    if connection:
        try:
            cursor = connection.cursor()
            cursor.execute("""INSERT INTO sapp_cars(name, number_of_post, brand_mark, time_create_update, description, mileage, year, price, city, photo, parametres) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""", (name, number_of_post, brand_mark, time_create_update, description, mileage, year, price, city, photo, parametres))
            connection.commit()
            print("Данные успешно сохранены в базу данных")
        except Exception as e:
            print(e)
        finally:
            if connection:
                cursor.close()
                connection.close()
                print("Соединение с базой данных успешно закрыто")


