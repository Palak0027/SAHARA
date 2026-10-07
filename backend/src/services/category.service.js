const categoryRepository = require('../repository/category.repository');
const AppError = require('../utils/AppError');

const DEFAULT_CATEGORIES = [
  { name: 'Food', description: 'Prepared meals, dry rations, packaged groceries, cooked food', status: 'active' },
  { name: 'Clothes', description: 'Winter wear, clean shirts, pants, woolens, kidswear', status: 'active' },
  { name: 'Books', description: 'Textbooks, notebooks, storybooks, stationery', status: 'active' },
  { name: 'Blankets', description: 'Warm blankets, bedsheets, quilts for winter relief', status: 'active' },
  { name: 'Medicines & First Aid', description: 'Unopened basic medicines, bandages, first aid supplies', status: 'active' },
  { name: 'Other', description: 'Other useful household essentials or appliances', status: 'active' }
];

class CategoryService {
  /**
   * Ensure default initial categories exist
   */
  async ensureDefaultCategories() {
    const count = await categoryRepository.count();
    if (count === 0) {
      await categoryRepository.insertMany(DEFAULT_CATEGORIES);
    }
  }

  /**
   * Get all active categories for dropdowns
   * @param {string} [status]
   * @returns {Promise<Array>}
   */
  async getCategories(status = 'active') {
    await this.ensureDefaultCategories();
    const filter = status === 'all' ? {} : { status };
    return await categoryRepository.findAll(filter);
  }

  /**
   * Create or quick-add a new category from donation/need dropdown
   * @param {object} param0
   * @returns {Promise<Document>}
   */
  async createCategory({ name, description = '', userId = null }) {
    if (!name || !name.trim()) {
      throw new AppError('Category name is required', 400);
    }

    const cleanName = name.trim();

    // Check if category already exists (case-insensitive)
    const existing = await categoryRepository.findByName(cleanName);
    if (existing) {
      if (existing.status === 'inactive') {
        // Reactivate if previously deactivated
        existing.status = 'active';
        if (description) existing.description = description.trim();
        await existing.save();
        return existing;
      }
      // If already active, return the existing category so dropdown selection doesn't break
      return existing;
    }

    const newCategory = await categoryRepository.create({
      name: cleanName,
      description: description.trim(),
      status: 'active',
      createdBy: userId
    });

    return newCategory;
  }

  /**
   * Update category by ID
   * @param {string} id
   * @param {object} updateData
   * @returns {Promise<Document>}
   */
  async updateCategory(id, updateData) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      throw new AppError('Category not found', 404);
    }

    if (updateData.name && updateData.name.trim().toLowerCase() !== category.name.toLowerCase()) {
      const existing = await categoryRepository.findByName(updateData.name.trim());
      if (existing && existing._id.toString() !== id) {
        throw new AppError('A category with this name already exists', 409);
      }
    }

    return await categoryRepository.updateById(id, updateData);
  }

  /**
   * Delete category by ID
   * @param {string} id
   * @returns {Promise<Document>}
   */
  async deleteCategory(id) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      throw new AppError('Category not found', 404);
    }
    return await categoryRepository.deleteById(id);
  }
}

module.exports = new CategoryService();
