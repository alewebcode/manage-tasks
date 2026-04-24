import { Request, Response, NextFunction } from "express";
import { itemService } from "../services";

export const DeleteItemController = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const deleted = itemService.delete(req.params["id"] as string);

    if (!deleted) {
      res.status(404).json({ success: false, message: "Task not found" });
      return;
    }

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};
