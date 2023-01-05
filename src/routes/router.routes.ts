import Router from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send({
    message: "Api is working for status app",
  });
});

export { router };
