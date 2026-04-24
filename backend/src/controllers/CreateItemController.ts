import { Request, Response, NextFunction } from "express";
import { itemService } from "../services";

export const CreateItemController = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const task = itemService.create(req.body);
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};
