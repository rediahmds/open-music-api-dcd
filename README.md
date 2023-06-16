# 🎼 OpenMusic

OpenMusic is a backend service app used for the submission in the "Fundamentals of Back-end Application" class by Dicoding Indonesia.

## 📑 Major Topics Covered in Each Version

### 1️⃣ OpenMusic V1

1. This version introduces a "cleaner" way to create a RESTful API using the Hapi plugin.
2. Validation is done using `Joi`.
3. Using `node-postgres` to interact with PostgreSQL in a Node app.
4. Implements the migration technique to manipulate table structures using `pgm`.

#### Summary

OpenMusic V1 implements hapi plugin, validation and database.

#### ✅ OpenMusic V1: To-do List

- [x] Mandatory criteria
  - [x] CRUD `/albums` endpoint (use plugin)
  - [x] CRUD `/songs` endpoint (use plugin)
  - [x] Data validation on both endpoints using `Joi`
  - [x] Error handling (use `onPreResponse` event extension from Hapi)
  - [x] Use database and `dotenv`
- [x] Optional criteria
  - [x] Display a list of songs in an album
  - [x] Query parameter for song search
- [x] Fulfill all Postman requests (API testing)
- [x] Use `ESLint` and one of the style guides
- [x] Clean code

#### 💡 OpenMusic V1: Tips

- To avoid `binding` errors:
  - Use arrow functions in route files (preferred, lighter, no need to install any packages)
  - Use the `auto-bind` package.

## ℹ️ More Information

- GitHub repo: [rediahmds/open-music-api-dcd: Submission untuk kelas Fundamental Aplikasi Back-end Dicoding Indonesia. (github.com)](https://github.com/rediahmds/open-music-api-dcd)
