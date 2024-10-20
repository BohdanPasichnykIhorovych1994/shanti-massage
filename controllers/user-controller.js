const { getReserwations } = require("../functions");

const getUsers = async (req, res) => {
  console.log(req.query);
  const limit = parseInt(req.query.limit) || 10;
  const skip = parseInt(req.query.skip) || 0;
  let direction = -1;

  if (req.query.direction) {
    direction = +req.query.direction;
  }
  let sort = { _id: direction };
  if (req.query.field) {
    sort = {
      [req.query.field]: direction,
    };
  }

  const params = {};
  if (req.query.name) {
    params["first_name"] = new RegExp(req.query.name, "i");
  }
  if (req.query.lastname) {
    params["last_name"] = new RegExp(req.query.lastname, "i");
  }
  const users = await db
    .collection("users")
    .find(params, { first_name: 1, last_name: 1, phone_number: 1 })
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .toArray();
  res.send(
    users.map((user) => {
      return {
        _id: user._id,
        firstName: user.first_name,
        lastName: user.last_name,
        phoneNumber: user.phone_number,
      };
    })
  );
};

const getUser = async (req, res) => {
  const phoneNumber = req.params.phoneNumber;
  const user = await db
    .collection("user_reservations")
    .find({ phone_number: phoneNumber })
    .project({ phone_number: 1, date: 1 })
    .sort({ date: -1 })
    .toArray();
  res.send(user);
};

const addUser = async (req, res) => {
  const user = await db.collection("users").insertOne(req.body);
  console.log(user);
  res.send("ok");
};
async function getReservationsList(req, res) {
  const list = await getReserwations();
  res.send(list);
}
module.exports = {
  getUsers,
  getUser,
  addUser,
  getReservationsList,
};
