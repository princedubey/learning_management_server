import usersModel from "../models/usersModel";
class usersServiceProvider {

  async getAllUsers({ query = {}, sort= {created_at: -1}, limit=null, select=null, lean = false }) {
    return await usersModel.find(query).select(select).sort(sort).limit(limit)
  }

  async getUsers ({query, sort = null, limit = null, projection = {}}) {
    const users = await usersModel.find(query);
    return users;
  }
}

export default new usersServiceProvider();