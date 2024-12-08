const express = require("express");
const HelloRouter = express.Router();

const myRoutes = [
  {
    name: 'Operation',
    endpoint: '/operation',
    requests: [{
      desc: 'Получить всё',
      method: 'GET',
      uri: '/',
    }]
  },
  {
    name: 'Node',
    endpoint: '/node',
    requests: [
      {
        desc: 'Получить всё',
        method: 'GET',
        uri: '/',
      },
      {
        desc: 'Создать',
        method: 'POST',
        uri: '/',
      }
    ]
  },
  {
    name: 'Formula',
    endpoint: '/formula',
    requests: [
      {
        desc: 'Получить всё',
        method: 'GET',
        uri: '/',
      },
      {
        desc: 'Создать',
        method: 'POST',
        uri: '/',
      }
    ]
  },
]

HelloRouter.get("/", async (req, res) => {
  try {
    const HTML = `
      <h1>Доступные эндпоинты: </h1>
      <ul>
        ${myRoutes.map((route) => `
          <li>
            <h2>${route.name}</h2>
            <ul>
              ${route.requests.map((request) => `
                <li>
                  <p>${request.desc} : <b>${request.method}</b> - <a href="http://localhost:5555/api${route.endpoint}${request.uri}">http://localhost:5555/api${route.endpoint}${request.uri}</a></p>
                </li>`)}
            </ul>
          </li>`)}
      </ul>
    `
    res.send(HTML);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = HelloRouter;