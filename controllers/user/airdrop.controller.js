const httpStatus = require("http-status");
const { Airdrop } = require("../../models/user");

const post = async (req, res) => {
  try {
    const isExist = await Airdrop.findOne({
      contractAddress: req.body.contractAddress,
    });

    if (isExist) {
      let response = {
        status: false,
        message: "Airdrop already exist with this contract address",
        data: null,
      };

      return res.status(httpStatus.CONFLICT).send(response);
    }

    const airdrop = await Airdrop.create(req.body);

    let response = {
      status: true,
      message: "Airdrop created successfully",
      data: airdrop,
    };

    return res.status(httpStatus.CREATED).send(response);
  } catch (err) {
    console.log(err);

    let response = {
      status: false,
      message: "Something went wrong",
      data: null,
    };

    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(response);
  }
};

const get = async (req, res) => {
  try {
    const airdrops = await Airdrop.find();

    let response = {
      status: true,
      message: "Airdrops fetched successfully",
      data: airdrops,
    };

    return res.status(httpStatus.OK).send(response);
  } catch (err) {
    console.log(err);

    let response = {
      status: false,
      message: "Something went wrong",
      data: null,
    };

    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(response);
  }
};

const put = async (req, res) => {
  try {
    const airdrop = await Airdrop.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!airdrop) {
      let response = {
        status: false,
        message: "Airdrop not found",
        data: null,
      };

      return res.status(httpStatus.NOT_FOUND).send(response);
    }

    let response = {
      status: true,
      message: "Airdrop updated successfully",
      data: airdrop,
    };

    return res.status(httpStatus.OK).send(response);
  } catch (err) {
    console.log(err);

    let response = {
      status: false,
      message: "Something went wrong",
      data: null,
    };

    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(response);
  }
};

const drop = async (req, res) => {
  try {
    const airdrop = await Airdrop.findByIdAndDelete(req.params.id);

    if (!airdrop) {
      let response = {
        status: false,
        message: "Airdrop not found",
        data: null,
      };

      return res.status(httpStatus.NOT_FOUND).send(response);
    }

    let response = {
      status: true,
      message: "Airdrop deleted successfully",
      data: airdrop,
    };

    return res.status(httpStatus.OK).send(response);
  } catch (err) {
    console.log(err);

    let response = {
      status: false,
      message: "Something went wrong",
      data: null,
    };

    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(response);
  }
};

const getSingle = async (req, res) => {
  try {
    const airdrop = await Airdrop.findOne({ _id: req.params.id });

    if (!airdrop) {
      let response = {
        status: false,
        message: "Airdrop not found",
        data: null,
      };

      return res.status(httpStatus.NOT_FOUND).send(response);
    }

    let response = {
      status: true,
      message: "Airdrop fetched successfully",
      data: airdrop,
    };

    return res.status(httpStatus.OK).send(response);
  } catch (err) {
    console.log(err);

    let response = {
      status: false,
      message: "Something went wrong",
      data: null,
    };

    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(response);
  }
};

module.exports = { post, get, put, drop, getSingle };
