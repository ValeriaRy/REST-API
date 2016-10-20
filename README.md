# REST-API

Необходимо разработать REST API для сайта “Доска объявлений”
На сайте пользователи выкладывают товары, которые хотели бы продать.
Основные возможности:
 авторизация
 регистрация
 получение/редактирование данных текущего пользователя
 смена пароля (при этом необходимо указать текущий пароль)
 загружать/удалять изображение для товара
 поиск пользователей
 создание/редактирование/удаление товара авторизованным
пользователем

Ошибки валидации имеют общий вид:
422, Unprocessable Entity
Body:
[
{"field":"title","message":"Title should contain at least 3 characters"},
...
]
field - название поля к которому относится ошибка
message - сообщение об ошибке
Успешное выполнение действия: 200, ОК, Body {}.
Если было внесение новых данных в таблицу, то должно возвращать объект с этими данными, если редактирование товара, то пустой объект.
При работе с таблицей товаров, если юзер не авторизирован, то должно возвращать 401, Unauthorized, Body:empty.
При работе с таблицей товаров, в Body возвращать информацию о товаре и юзере-хозяине.

Запросы:
1) Авторизация юзера POST /api/login
2) Регистрация юзера POST /api/register
3) Получить данные юзера GET /api/me
4) Изменить данные PUT /api/me 
Можно изменить пароль  
5) Найти юзера по ID GET /api/user/<id>
6) Найти юзера/юзеров по name или email GET /api/user?name=&email=
7) Создать товар POST /api/item
8) Удалить товар DELETE /api/item   
9) Изменить товар PUT /api/item/<id>
10) Поиск товара GET /api/item?title=&user_id=&order_by=&order_type (asc/decs)    

Таблицы:
User (
    id int NOT NULL,
    phone varchar(255),
    name varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    token varchar(255) NOT NULL,
    PRIMARY KEY (id)
);

Item (
    item_id int NOT NULL,
    title varchar(255) NOT NULL,
    price float NOT NULL,
    date DATETIME NOT NULL,
    image varchar(255),
    user_id int NOT NULL, 
    PRIMARY KEY (item_id),
    FOREIGN KEY (user_id) REFERENCES User(id)
); 
