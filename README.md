# 🎼 OpenMusic

OpenMusic is a backend service app used for the submission in the "Fundamentals of Back-end Application" class by Dicoding Indonesia.

## 📑 Major Topics Covered in Each Version

### 1️⃣ OpenMusic V1

1. This version introduces a "cleaner" way to create a RESTful API using the Hapi plugin.
2. Validation is done using `Joi`.
3. Using `node-postgres` to interact with PostgreSQL in a Node app.
4. Implements the migration technique to manipulate table structures using `pgm`.

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

#### OpenMusic V1: Summary

OpenMusic V1 implements hapi plugin, validation and database.

### 2️⃣ OpenMusic V2

1. Implements authentication and authorization using token based schema, JWT specifically.
2. Learn how to normalize a database.
3. Implements foreign key
4. Introduces a way to implement collaboration feature.

#### ✅ OpenMusic V2: To-do List

- [x] Mandatory Criteria
  - [x] Implements user registration and authentication
  - [x] Playlist management feature
  - [x] Implements foreign key in tables
  - [x] Data validation
  - [x] Error Handling
  - [x] Maintain the OpenMusic V1 features
- [x] Optional Criteria
  - [x] Playlist collaboration feature
  - [x] Playlist activities history
  - [x] Maintain the OpenMusic V1 features

#### 💡 OpenMusic V2: Tips

For references, follow the ERD provided by dicoding. This is optional tho.

#### OpenMusic V2: Summary

OpenMusic V2 implements authentication & authorization using `jwt`, normalize and use foreign key in a database, also learn how to create simple collaboration feature.

To create a new account (sign up), clients should use the `POST /users` endpoint. To log in to an existing account, they should use the `POST /authentications` endpoint.

### 3️⃣ OpenMusic V3

1. Implements message broker using rabbitmq to decouple services and reduce server workload.
2. Use FS or Amazon S3 Bucket to store object.
3. Implements server-side caching with Redis or Memurai.

#### ✅ OpenMusic V3: To-do List

This time, there's no optional criteria, everything are mandatory.

- [x] Export songs in playlists
- [x] Upload album cover
- [x] Ability to like/favorites a specific album
- [ ] Implements server-side caching.
- [ ] Maintain OpenMusic V1 & V2

#### 💡 OpenMusic V3: Tips

- [x] For reference, they provides ERD to follow. It is students choice to use the ERD they've provided.
- [x] Run postman tests sequentially and exclude `Upload` tests before running a collection. For `Upload` tests tho, it has to run without collections, it will always be failed otherwise.
- [x] Create an object to only store sensitive information. So, it will replace the `process.env.XXX` syntax.

#### OpenMusic V3: Summary

OpenMusic V3 implements a message broker using RabbitMQ to decouple services and reduce server workload. It allows the use of either FS or Amazon S3 Bucket to store objects and introduces server-side caching with Redis or Memurai.

## ℹ️ More Information

- GitHub repo: [rediahmds/open-music-api-dcd: Submission untuk kelas Fundamental Aplikasi Back-end Dicoding Indonesia. (github.com)](https://github.com/rediahmds/open-music-api-dcd)
