// Not needed if using raw queries in controller
const menuModel = {
  getAll: async (db) => {
    return db.query('SELECT * FROM menu_items ORDER BY id ASC');
  },
};

export default menuModel;
