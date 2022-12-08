# SWAPI middleware

## Simple RESTful API using Star Wars API.

## Table of content

- [Techstack](#techstack)
- [Requirements](#requirements)
- [Usage](#usage)
- [Endpoints](#endpoints)

  - [Authorization endpoints](#authorization-endpoints)
  - [Resources endpoints](#resources-endpoints-1)

- [Cache mechanism](#cache-mechanism)
- [Auth mechanism](#jwt-auth-mechanism)

- [To run tests](#to-run-tests)
  - [Auth tests](#auth-tests)
  - [Resources tests](#get-resources-tests)

## Techstack:

- `JavaScript`

- `Express.js`

- `Docker`

- `Docker-compose`

- `MongoDB`

- `Mongoose`

- `Jest`

- `Supertest`

## Requirements

- install `node`

- install `mongodb`

- install `postman`

- install `docker`

- install `docker-compose`

## Usage

### Navigate to project folder

```sh
cd ./express-swapi-middleware
```

### Clone repository

```
git clone https://github.com/wojciechszmelczerczyk/express-swapi-middleware
```

### Install dependencies

```
npm i
```

### Setup .env file

```dockerfile
# Server port
PORT=

# Mongo db uri
DB_URI=

# For testing purposes
JWT=your_token

# Pass string value
JWT_SECRET=your_secret

# Token expiration time in miliseconds, pass integer
JWT_EXPIRATION=
```

### Run app in containers

```
docker-compose up
```

### Setup Postman

#### Import two files into Postman

- [File with collection setup](./postman/swapi-middleware-express.postman_collection.json)
- [File with global variables](./postman/workspace.postman_globals.json)

## Endpoints

### Auth endpoints

| Method |          Endpoint           |
| :----: | :-------------------------: |
|  POST  | [`/register`](./docs/auth/) |
|  POST  |   [`/auth`](./docs/auth/)   |
|  GET   |  [`/logout`](./docs/auth/)  |

### Resources endpoints

| Method |              Endpoint               |
| :----: | :---------------------------------: |
|  GET   |   [`/resource`](./docs/resource/)   |
|  GET   | [`/resource/:id`](./docs/resource/) |

### Resources

SWAPI use multiple endpoints for resources, including films, planets, characters etc.

Resource means one of following:

|  Resources   |
| :----------: |
|   `/films`   |
|  `/people`   |
|  `/planets`  |
|  `/species`  |
| `/starships` |
| `/vehicles`  |

Get all data and paginate

If page query parameter is provided response with specific page.

Otherwise fetch data across all pages with custom getAll function.

```javascript
const getAllPlanets = async (req, res) => {
  if (req.query.page !== undefined) {
    const paginatedPlanets = await swapi.get(
      `https://swapi.dev/api/planets?page=${req.query.page}`
    );

    res.json(paginatedPlanets);
    return paginatedPlanets;
  } else {
    const allPlanets = await getAll("https://swapi.dev/api/planets");
    res.json(allPlanets);
    return allPlanets;
  }
};
```

Fetch first page and get information about number of items across all pages and items per page.

Calculate number of pages and fetch data across all pages. Store in array.

```javascript
try {
  const getAll = async (url) => {
  try {
    let results = [];
    let response = await swapi.get(url);

    const items = response.count;
    const elementsPerPage = response.results.length;

    const numberOfPages = Math.floor(
      (items + elementsPerPage - 1) / elementsPerPage
    );

    results = await Promise.all(
      Array.from(Array(numberOfPages), (_, i) =>
        swapi.get(`${url}?page=${i + 1}`)
      )
    );
    return results;
  } catch (err) {
    console.log(err);
  }
};

```

Get resource by id

Intercept id from request params. Fetch resource by id.

```javascript
const getPlanet = async (req, res) => {
  const id = req.params.id;
  const planet = await swapi.planets({ id });
  res.json(planet);
  return planet;
};
```

## Authorization endpoints:

### `/register` - save user to database.

Before saving user to db hash password.

```javascript
// call a function before saving doc to db
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
```

Create new user with credentials.

```javascript
const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    const user = await User.create({
      email,
      password,
    });
    res.json(user);
    return user;
  } catch (err) {
    res.json(err);
    return err;
  }
};
```

`/auth` - generate jwt with user credentials.

Check if user exists. If so compare hashed password from db with passed password.

```javascript
// static method to login user
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({
    email,
  });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("incorrect password");
  }
  throw Error("incorrect email");
};
```

#### Create token.

```javascript
const createToken = (id) => {
  return jwt.sign(
    {
      id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: maxAge,
    }
  );
};
```

#### Create token by passing id of user as a param. Save token in cookie.

```javascript
const auth = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      expiresIn: maxAge * 1000,
    });
    res.json({ token });
  } catch (err) {
    res.json({ error: err.message });
    return err;
  }
};
```

### `/logout` - delete cookie.

#### By setting minimum cookie expiration date, we can delete cookie.

```javascript
const logout = async (req, res) => {
  res.cookie("jwt", "", {
    maxAge: 1,
  });
  res.send("jwt deleted");
};
```

## Cache mechanism

### Middleware for caching.

### When first request is made it will be cached for 24 hours.

### Next requests will check if data is in the cache.

```javascript
module.exports = (duration) => (req, res, next) => {
  // check if request method is GET
  if (req.method !== "GET") {
    console.log("Cannot cache non-GET methods");
    return next();
  }
  const key = req.originalUrl;
  const cachedResponse = cache.get(key);
  if (cachedResponse) {
    // if exists
    res.json(cachedResponse);
  } else {
    // otherwise create
    res.originalSend = res.send;
    res.send = (body) => {
      res.originalSend(body);
      cache.set(key, body, duration);
    };
    next();
  }
};
```

### Cache is applied to every GET route.

```javascript
// use cache for all routes
router.use(cache(86400));
```

## JWT auth mechanism

### Middleware to authorize requests.

```javascript
const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // check if jwt exists & verify
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        res.send("jwt is invalid");
      } else {
        next();
      }
    });
  } else {
    res.send("jwt doesnt exists");
  }
};
```

JWT middleware is applied to every GET request.

```javascript
// auth middleware
app.get("*", requireAuth);
```

## To run tests

- `npm run test` - test both suites

- `npm run test-data` - test resources endpoints

- `npm run test-auth` - test authorization endpoints

### Auth tests

Flush user hook

Hook which will launch before authorization tests. Find latest added user to db and delete.

```javascript
module.exports = async () => {
  await User.findOneAndDelete({ sort: { _id: -1 } });
};
```

Example of register route test. Using supertest with correct arbitrary data test if user is added to the database.

```javascript
test("add user to db when credentials are correct", async () => {
  const newUser = await request(app)
    .post("/register")
    .send({ email: "test@gmail.com", password: "test123" });
  const newUserCredentials = newUser.body;
  expect(newUserCredentials.email).toBe(`test@gmail.com`);
});
```

Example of auth route test. Using supertest with correct arbitrary data test if authentication process is correct.

If so, token will be returned in response.

```javascript
test("authenticate user", async () => {
  const user = await request(app)
    .post("/authenticate")
    .send({ email: "test@gmail.com", password: "test123" });
  const token = user.body.token;
  expect(token).not.toBe(null);
});
```

### Get resources tests

Get all resources

Example of resources route test. When correct JWT is provided in request should return all pages of chacters which equal 9.

```javascript
test("Get people across all pages", async () => {
  const allPeople = await request(app)
    .get("/people")
    .set("Cookie", `jwt=${jwt};`);
  const numberOfPages = allPeople.body.length;

  expect(numberOfPages).toBe(9);
});
```

#### Get page of resources

Example of resources route test. When correct JWT is provided in request should return page of specific resource.

(in this case starships) by using query. Then we check if name of first element of page is equal to expected.

```javascript
test("Get page of starships", async () => {
  const page = 1;
  const starshipsFromPage1 = await request(app)
    .get("/starships")
    .query({ page })
    .set("Cookie", `jwt=${jwt};`);

  const nameOfFirstStarshipFromPage1 = starshipsFromPage1.body.results[0].name;

  expect(nameOfFirstStarshipFromPage1).toBe("CR90 corvette");
});
```

Get resource with specific id

Example of resources route test. When correct JWT is provided in request should return resource with specific id.

```javascript
test("Get planet with id 1", async () => {
  const planetId = 1;
  const planetWithId1 = await request(app)
    .get(`/planets/${planetId}`)
    .set("Cookie", `jwt=${jwt};`);
  const planetName = planetWithId1.body.name;
  expect(planetName).toBe("Tatooine");
});
```
