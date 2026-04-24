import { Router } from "express";
import { GetItemsController } from "../controllers/GetItemsController";
import { CreateItemController } from "../controllers/CreateItemController";
import { UpdateItemController } from "../controllers/UpdateItemController";
import { DeleteItemController } from "../controllers/DeleteItemController";
import { GetItemByIdController } from "../controllers/GetItemByIdController";

const routes = Router();

routes.get("/items", GetItemsController);
routes.post("/items", CreateItemController);
routes.put("/items/:id", UpdateItemController);
routes.delete("/items/:id", DeleteItemController);
routes.get("/items/:id", GetItemByIdController);

export { routes };
