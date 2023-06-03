import express, { Express } from "express";
import dotenv from "dotenv";
import routes from "./routes/Routes";
import { seedData } from "./utils/dummyData";

const app: Express = express();
dotenv.config();
app.use(express.json());
app.use("/", routes);

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
