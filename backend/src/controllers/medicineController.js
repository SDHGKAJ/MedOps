import medicineService from '../services/medicineService.js';

class MedicineController {
  async getAllMedicines(req, res, next) {
    try {
      const medicines = await medicineService.getAllMedicines();

      res.status(200).json({
        success: true,
        count: medicines.length,
        medicines,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getMedicineById(req, res, next) {
    try {
      const { id } = req.params;
      const medicine = await medicineService.getMedicineById(id);

      if (!medicine) {
        return res.status(404).json({
          success: false,
          message: 'Medicine not found',
        });
      }

      res.status(200).json({
        success: true,
        medicine,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async addMedicine(req, res, next) {
    try {
      const { name, manufacturer, category, price, quantity, description } =
        req.body;

      // Validate input
      if (!name || !manufacturer || !category || price === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Name, manufacturer, category, and price are required',
        });
      }

      const medicine = await medicineService.addMedicine({
        name,
        manufacturer,
        category,
        price,
        quantity: quantity || 0,
        description,
      });

      res.status(201).json({
        success: true,
        message: 'Medicine added successfully',
        medicine,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateMedicine(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const medicine = await medicineService.updateMedicine(id, updateData);

      res.status(200).json({
        success: true,
        message: 'Medicine updated successfully',
        medicine,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async deleteMedicine(req, res, next) {
    try {
      const { id } = req.params;

      await medicineService.deleteMedicine(id);

      res.status(200).json({
        success: true,
        message: 'Medicine deleted successfully',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async searchMedicines(req, res, next) {
    try {
      const { query } = req.query;

      if (!query || query.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Search query is required',
        });
      }

      const medicines = await medicineService.searchMedicines(query);

      res.status(200).json({
        success: true,
        count: medicines.length,
        medicines,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async checkAvailability(req, res, next) {
    try {
      const { id } = req.params;

      const availability = await medicineService.checkAvailability(id);

      res.status(200).json({
        success: true,
        availability,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new MedicineController();
