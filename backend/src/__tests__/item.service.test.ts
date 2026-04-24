import { ItemService } from "../services/item.service";
import { TaskRepository } from "../repositories/task.repository";
import { Task } from "../models/task.model";

const mockTask: Task = {
  id: "1",
  title: "Test task",
  description: "Test description",
  completed: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockRepo: jest.Mocked<TaskRepository> = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

let service: ItemService;

beforeEach(() => {
  jest.clearAllMocks();
  service = new ItemService(mockRepo);
});

describe("ItemService.getAll", () => {
  it("returns all tasks from the repository", () => {
    mockRepo.findAll.mockReturnValue([mockTask]);

    const result = service.getAll();

    expect(result).toEqual([mockTask]);
    expect(mockRepo.findAll).toHaveBeenCalledTimes(1);
  });

  it("returns an empty array when there are no tasks", () => {
    mockRepo.findAll.mockReturnValue([]);

    expect(service.getAll()).toEqual([]);
  });
});

describe("ItemService.getById", () => {
  it("returns the task by id", () => {
    mockRepo.findById.mockReturnValue(mockTask);

    const result = service.getById("1");

    expect(result).toEqual(mockTask);
    expect(mockRepo.findById).toHaveBeenCalledWith("1");
  });

  it("returns undefined for a non-existent id", () => {
    mockRepo.findById.mockReturnValue(undefined);

    expect(service.getById("non-existent")).toBeUndefined();
  });
});

describe("ItemService.create", () => {
  it("throws an error if the title is empty", () => {
    expect(() => service.create({ title: "", description: "" })).toThrow(
      "Title is required",
    );
    expect(mockRepo.create).not.toHaveBeenCalled();
  });

  it("throws an error if the title contains only whitespace", () => {
    expect(() => service.create({ title: "   ", description: "" })).toThrow(
      "Title is required",
    );
    expect(mockRepo.create).not.toHaveBeenCalled();
  });

  it("creates the task when the title is valid", () => {
    mockRepo.create.mockReturnValue(mockTask);

    const result = service.create({ title: "Test task", description: "desc" });

    expect(result).toEqual(mockTask);
    expect(mockRepo.create).toHaveBeenCalledWith({
      title: "Test task",
      description: "desc",
    });
  });
});

describe("ItemService.update", () => {
  it("returns undefined if the task does not exist", () => {
    mockRepo.findById.mockReturnValue(undefined);

    const result = service.update("non-existent", { title: "New title" });

    expect(result).toBeUndefined();
    expect(mockRepo.update).not.toHaveBeenCalled();
  });

  it("updates the task when it exists", () => {
    const updated = { ...mockTask, title: "Updated" };
    mockRepo.findById.mockReturnValue(mockTask);
    mockRepo.update.mockReturnValue(updated);

    const result = service.update("1", { title: "Updated" });

    expect(result).toEqual(updated);
    expect(mockRepo.update).toHaveBeenCalledWith("1", { title: "Updated" });
  });
});

describe("ItemService.delete", () => {
  it("returns true when deleting an existing task", () => {
    mockRepo.delete.mockReturnValue(true);

    expect(service.delete("1")).toBe(true);
    expect(mockRepo.delete).toHaveBeenCalledWith("1");
  });

  it("returns false for a non-existent id", () => {
    mockRepo.delete.mockReturnValue(false);

    expect(service.delete("non-existent")).toBe(false);
  });
});
