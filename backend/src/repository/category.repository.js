const Category = require('../models/Category');

class CategoryRepository {
  /**
   * Find all categories matching a filter
   * @param {object} filter
   * @returns {Promise<Array>}
   */
  async findAll(filter = {}) {
    return await Category.find(filter).sort({ name: 1 });
  }

  /**
   * Find a category by ID
   * @param {string} id
   * @returns {Promise<Document|null>}
   */
  async findById(id) {
    return await Category.findById(id);
  }

  /**
   * Find a category by name (case-insensitive)
   * @param {string} name
   * @returns {Promise<Document|null>}
   */
  async findByName(name) {
    return await Category.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
    });
  }

  /**
   * Create a new category
   * @param {object} categoryData
   * @returns {Promise<Document>}
   */
  async create(categoryData) {
    return await Category.create(categoryData);
  }

  /**
   * Insert multiple categories (seeding)
   * @param {Array<object>} categories
   * @returns {Promise<Array>}
   */
  async insertMany(categories) {
    return await Category.insertMany(categories);
  }

  /**
   * Count categories matching filter
   * @param {object} filter
   * @returns {Promise<number>}
   */
  async count(filter = {}) {
    return await Category.countDocuments(filter);
  }

  /**
   * Update category by ID
   * @param {string} id
   * @param {object} updateData
   * @returns {Promise<Document|null>}
   */
  async updateById(id, updateData) {
    return await Category.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }

  /**
   * Delete category by ID
   * @param {string} id
   * @returns {Promise<Document|null>}
   */
  async deleteById(id) {
    return await Category.findByIdAndDelete(id);
  }
}

module.exports = new CategoryRepository();
