import { app, uuid } from "mu";

app.get("/clock", function (req, res) {
  res.send(JSON.stringify({ time: 0 }));
});
