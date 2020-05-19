# Проект my-courses.app
## Fullstack developer - Шувалов Александр

## Скрипты package.json:

| Скрипт | Назначение |
| ------ | ------ |
| start  | Запуск сервера **Node.js** на **express.js**. |
| dev  | Запуск сервера **Node.js** для разработки на **express.js**, используя **nodemon**. |

#### Чтобы запустить скрипт:
```sh
$ npm run имя_скрипта
```

#### Чтобы запустить проект:
1) Создаем файл .env в корневой директории проекта
4) Наполняем файл .env следующим содержимым: 
  ```sh
    SERVER_HOST=127.0.0.1
    SERVER_PORT=8000
    MONGO_URI=mongodb://localhost:27017/courses
    KEY_SECRET=faffas65664fs6d1f65asd4fasd43f6sad54
    TOKEN_EXPIRES_IN=600
    SSL_KEY=config/domain.key
    SSL_CERT=config/domain.crt
  ```
  Напротив каждого ключа необходимо указать **СВОИ ЗНАЧЕНИЯ**, выше указан лишь пример заполнения

5) Устанавливаем все зависимости
```sh
$ npm i
```

6) Запускаем сервер
```sh
$ npm start
```

7) Открываем в браузере страницу по адресу http://localhost:8080 или https://localhost:8443
