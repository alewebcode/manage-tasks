import app from "./app";

const server = app.listen(3001, () => {
  console.log("Server is running");
});

export { server };
