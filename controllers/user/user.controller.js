const httpStatus = require("http-status");
const { User } = require("../../models/user");

const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ address: req.params.address });

    if (user) {
      let response = {
        status: true,
        message: "Login successful",
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

const get = async (req, res) => {
  try {
    const users = await User.find();

    let response = {
      status: true,
      message: "Users fetched successfully",
      data: users,
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

const put = async (req, res) => {
  try {
    console.log(req.body);
    if (req.body.solanaAddress || req.body.cosmosAddress) {
      const user = await User.findOneAndUpdate(
        { address: req.params.address },
        req.body,
        { new: true }
      );

      let response = {
        status: true,
        message: "User updated successfully",
        data: user,
      };

      return res.status(httpStatus.OK).send(response);
    }

    return res.status(httpStatus.BAD_REQUEST).send({
      status: false,
      message: "Please provide solanaAddress or cosmosAddress",
      data: null,
    });
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

module.exports = { loginUser, createUser, get, put };
