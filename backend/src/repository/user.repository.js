const User = require('../models/User');

/**
 * User Repository - Handles all direct database operations on the User collection
 */
class UserRepository {
  /**
   * Find a user by phone number
   * @param {string} phone
   * @returns {Promise<Document|null>}
   */
  async findByPhone(phone) {
    return await User.findOne({ phone });
  }

  /**
   * Find a user by email address
   * @param {string} email
   * @returns {Promise<Document|null>}
   */
  async findByEmail(email) {
    return await User.findOne({ email });
  }

  /**
   * Find a user by email or phone, including the passwordHash field
   * @param {string} identifier - phone or email
   * @returns {Promise<Document|null>}
   */
  async findByIdentifierWithPassword(identifier) {
    const cleanIdentifier = identifier.trim();
    const isEmail = cleanIdentifier.includes('@');

    const query = isEmail
      ? { email: cleanIdentifier.toLowerCase() }
      : { phone: cleanIdentifier };

    return await User.findOne(query).select('+passwordHash');
  }

  /**
   * Find a user by ID with optional field projection
   * @param {string} id
   * @param {string|object} [projection]
   * @returns {Promise<Document|null>}
   */
  async findById(id, projection = '') {
    return await User.findById(id).select(projection);
  }

  /**
   * Find a user by ID including passwordHash field
   * @param {string} id
   * @returns {Promise<Document|null>}
   */
  async findByIdWithPassword(id) {
    return await User.findById(id).select('+passwordHash');
  }

  /**
   * Create and persist a new user document
   * @param {object} userData
   * @returns {Promise<Document>}
   */
  async create(userData) {
    return await User.create(userData);
  }

  /**
   * Save changes on an existing user document
   * @param {Document} userDocument
   * @returns {Promise<Document>}
   */
  async save(userDocument) {
    return await userDocument.save();
  }

  /**
   * Update a user document by ID
   * @param {string} id
   * @param {object} updateData
   * @param {object} [options]
   * @returns {Promise<Document|null>}
   */
  async updateById(id, updateData, options = { new: true }) {
    return await User.findByIdAndUpdate(id, updateData, options);
  }
}

module.exports = new UserRepository();
