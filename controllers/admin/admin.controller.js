const httpStatus = require("http-status");
const { Admin } = require("../../models/admin");

const get = async (req, res) => {
  try {
    const admin = await Admin.findOne({ address: req.body.address });

    if (!admin) {
      let response = {
        status: false,
        message: "Admin not found",
        data: {},
      };

      return res.status(httpStatus.NOT_FOUND).send(response);
    }

    let response = {
      status: true,
      message: "Admin fetched successfully",
      data: admin,
    };

    return res.status(httpStatus.OK).send(response);
  } catch (err) {
    console.log(err);

    let response = {
      status: false,
      message: "something went wrong",
      data: err.message,
    };

    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(response);
  }
};

module.exports = {
  get,
};
