const categoryService = require('../services/category.service');

/**
 * @desc    Get all active categories for donation/need dropdown
 * @route   GET /api/categories
 * @access  Public
 */
const getCategories = async (req, res, next) => {
  try {
    const status = req.query.status || 'active';
    const categories = await categoryService.getCategories(status);
    return res.status(200).json({
      success: true,
      count: categories.length,
      categories
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new category (e.g. from dropdown "+ Add Category" button)
 * @route   POST /api/categories
 * @access  Private (Donor / Receiver / Admin / Volunteer)
 */
const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const userId = req.user ? req.user._id : null;

    const category = await categoryService.createCategory({ name, description, userId });

    return res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update category
 * @route   PATCH /api/categories/:id
 * @access  Private (Admin)
 */
const updateCategory = async (req, res, next) => {
  try {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    return res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      category
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete category
 * @route   DELETE /api/categories/:id
 * @access  Private (Admin)
 */
const deleteCategory = async (req, res, next) => {
  try {
    await categoryService.deleteCategory(req.params.id);
    return res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
