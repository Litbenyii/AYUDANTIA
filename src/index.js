import "dotenv/config";
import express from "express";
import morgan from "morgan";
import { connectDB } from "./config/configDb.js";
import { routerApi } from "./routes/index.routes.js";

const app = express();
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (_, res) => res.send("API OK"));

connectDB()
  .then(() => {
    routerApi(app);
    const PORT = process.env.PORT ?? 3000;
    app.listen(PORT, () => console.log(`API http://localhost:${PORT}`));
  })
  .catch((e) => {
    console.error("DB ERROR", e);
    process.exit(1);
  });
