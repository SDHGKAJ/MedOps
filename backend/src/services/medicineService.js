import Medicine from '../models/Medicine.js';

class MedicineService {
  async addMedicine(medicineData) {
    const medicine = new Medicine(medicineData);
    await medicine.save();
    return medicine;
  }

  async updateMedicine(medicineId, updateData) {
    const medicine = await Medicine.findByIdAndUpdate(medicineId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!medicine) {
      throw new Error('Medicine not found');
    }

    return medicine;
  }

  async deleteMedicine(medicineId) {
    const medicine = await Medicine.findByIdAndDelete(medicineId);

    if (!medicine) {
      throw new Error('Medicine not found');
    }

    return medicine;
  }

  async getMedicineById(medicineId) {
    return await Medicine.findById(medicineId);
  }

  async getAllMedicines() {
    return await Medicine.find();
  }

  async searchMedicines(query) {
    return await Medicine.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { manufacturer: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
      ],
    });
  }

  async checkAvailability(medicineId) {
    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
      throw new Error('Medicine not found');
    }

    return {
      medicineId,
      name: medicine.name,
      available: medicine.quantity > 0,
      quantity: medicine.quantity,
    };
  }
}

export default new MedicineService();
