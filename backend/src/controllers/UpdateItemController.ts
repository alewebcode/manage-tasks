import { Request, Response, NextFunction } from "express";
import { itemService } from "../services";

export const UpdateItemController = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const task = itemService.update(req.params["id"] as string, req.body);

    if (!task) {
      res.status(404).json({ success: false, message: "Task not found" });
      return;
    }

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};
