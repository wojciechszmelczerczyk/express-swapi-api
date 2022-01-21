const NodeCache = require("node-cache");

const cache = new NodeCache();

module.exports = (duration) => (req, res, next) => {
  // check if request method is GET
  if (req.method !== "GET") {
    console.log("Cannpt cache non-GET methods");
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
