import UsersDao from "./dao.js";
export default function UserRoutes(app, db) {
 const dao = UsersDao(db);
  const createUser = (req, res) => { };
  const deleteUser = (req, res) => { };
  const findAllUsers = (req, res) => {
    const users = dao.findAllUsers();
    res.json(users);
  };

  const findUserById = (req, res) => { };
  const updateUser = (req, res) => {
    const userId = req.params.userId;
    const updates = req.body;

    const updated = dao.updateUser(userId, updates);

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.session.currentUser && req.session.currentUser._id === userId) {
      req.session.currentUser = updated;
    }

    res.json(updated);
  };


  const signup = (req, res) => {
    const { username, password } = req.body;

    const existing = dao.findUserByUsername(username);
    if (existing) {
      return res.status(400).json({ message: "Username already in use" });
    }

    const newUser = dao.createUser({ username, password });
    req.session.currentUser = newUser;

    res.json(newUser);
  };


  
const signin = (req, res) => {
  const { username, password } = req.body;
    const currentUser = dao.findUserByCredentials(username, password);
    if (currentUser) {
      req.session["currentUser"] = currentUser;
      res.json(currentUser);
    } else {
      res.status(401).json({ message: "Unable to login. Try again later." });
    }

};

  const signout = (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
  };


const profile = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    res.json(currentUser);
  };



  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);
}
