# SWAPI middleware

## Simple SWAPI middleware.

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

- install `docker`

- install `docker-compose`

## Usage

`git clone repo` - to clone repository

`npm i` - install dependencies

`docker-compose up` - to run app in containers

## Cache mechanism

Middleware for caching.
When first request is made it will be cached for 24 hours.

Next requests will check if data is in the cache.

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

Cache is applied to every GET route.

```javascript
// use cache for all routes
router.use(cache(86400));
```

## JWT auth mechanism

Middleware to authorize requests.

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

## Authorization endpoints:

- `/register` - Save user to database.

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

- `/auth` - Generate jwt with user credentials.

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

Create token.

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

Create token by passing id of user as a param. Save token in cookie.

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

- `/logout` - Delete cookie.

By setting minimum cookie expiration date, we can delete cookie.

```javascript
const logout = async (req, res) => {
  res.cookie("jwt", "", {
    maxAge: 1,
  });
  res.send("jwt deleted");
};
```

## Resources endpoints:

### People

- `/people` - get all people

- `/people?page=1` - get page of people

- `/people/1` - get person with id 1

### Films

- `/films`- get all people

- `/films/stats` - get films stats

- `/films/1`- get film with id 1

### Planets

- `/planets`- get all people

- `/planets?page=1` - get page of planets

- `/planets/1`- get planet with id 1

### Species

- `/species`- get all people

- `/species?page=1` - get page of species

- `/species/1`- get species with id 1

### Starships

- `/starships`- get all people

- `/starships?page=1` - get page of starships

- `/starships/1`- get starship with id 1

### Vehicles

- `/vehicles`- get all people

- `/vehicles?page=1` - get page of vehicles

- `/vehicles/1`- get vehicle with id 1

## To run tests

- `npm run test` - test both suites

- `npm run test-data` - test resources endpoints

- `npm run test-auth` - test authorization endpoints

### Auth tests

#### Flush user hook

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

#### Get all resources

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

#### Get resource with specific id

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
