import usersModel from "../models/usersModel";

class usersServiceProvider {

  getUsers = async ({query, sort = null, limit = null, projection = {}}) => {
    const users = await usersModel.find(query);
    return users;
  }
}