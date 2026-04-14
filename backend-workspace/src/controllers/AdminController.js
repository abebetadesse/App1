// controllers/AdminController.js
class AdminController {
  static async dashboard(req, res) {
    try {
      const stats = await AdminService.getDashboardStats();
      res.json({ success: true, data: stats });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getUsers(req, res) {
    try {
      const users = await AdminService.getAllUsers(req.query);
      res.json({ success: true, data: users });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async updateUser(req, res) {
    try {
      const user = await AdminService.updateUser(req.params.id, req.body);
      res.json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

export default AdminController;