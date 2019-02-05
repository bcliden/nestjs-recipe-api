## Description

This is an api server for a recipe database.
Currently supports REST-style http requests.

## API Structure

| Method | URL                      | Description                      |     Auth Req'd     |
| ------ | ------------------------ | -------------------------------- | :----------------: |
| GET    | /api/recipes             | `get all recipes`                |        :x:         |
| POST   | /api/recipes             | `create new recipe`              | :heavy_check_mark: |
| GET    | /api/recipes/:id         | `get one recipe`                 |        :x:         |
| PUT    | /api/recipes/:id         | `update one recipe`              | :heavy_check_mark: |
| DELETE | /api/recipes/:id         | `delete one recipe`              | :heavy_check_mark: |
|        |                          |                                  |        :x:         |
| GET    | /api/users               | `show all users (debug only)`    |        :x:         |
| POST   | /api/users               | `log in as a user`               |        :x:         |
| POST   | /api/users/register      | `register a user`                |        :x:         |
|        |                          |                                  |        :x:         |
| GET    | /api/comments/:id        | `get one comment`                |        :x:         |
| POST   | /api/comments/recipe/:id | `create a comment for one post`  | :heavy_check_mark: |
| DELETE | /api/comments/:id        | `delete a comment`               | :heavy_check_mark: |
| GET    | /api/comments/user/:id   | `get all comments by one user`   |        :x:         |
| GET    | /api/comments/recipe/:id | `get all comments on one recipe` |        :x:         |
