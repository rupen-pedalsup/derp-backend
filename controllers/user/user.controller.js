const httpStatus = require("http-status");
const { User } = require("../../models/user");

const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ address: req.params.address });

    if (user) {
      let response = {
        status: true,
        message: "Login successfull",
        data: user,
      };

      return res.status(httpStatus.OK).send(response);
    } else {
      let response = {
        status: false,
        message: "User not found",
        data: null,
      };

      return res.status(httpStatus.NOT_FOUND).send(response);
    }
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

const createUser = async (req, res) => {
  try {
    const isExist = await User.findOne({ address: req.body.address });

    if (isExist) {
      let response = {
        status: false,
        message: "User already exist",
        data: isExist,
      };

      return res.status(httpStatus.BAD_REQUEST).send(response);
    }

    const user = await User.create(req.body);

    let response = {
      status: true,
      message: "User created successfully",
      data: user,
    };

    return res.status(httpStatus.CREATED).send(response);
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

module.exports = { loginUser, createUser };
