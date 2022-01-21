const User = require("../../model/User");

module.exports = async () => {
  await User.findOneAndDelete({ sort: { _id: -1 } });
};
