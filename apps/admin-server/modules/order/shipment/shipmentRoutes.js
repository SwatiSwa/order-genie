const express = require("express");

const controller = require("./shipmentController");

module.exports = () => {
  const router = express.Router();

  router.post("/list", controller.listData);

  return router;
};
