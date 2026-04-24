import { Request, Response, NextFunction } from "express";
import { itemService } from "../services";

export const GetItemsController = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const tasks = itemService.getAll();
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    next(error);
  }
};
