const properties = require("./json/properties.json");
const users = require("./json/users.json");

const {Pool} = require('pg');
const pool = new Pool({
  user: 'labber',
  host:'localhost',
  password:'labber',
  database: 'lightbnb',
  port: 5432
})

const getAllProperties = (options, limit= 10) => {
 return pool
    .query(
      'SELECT * FROM properties LIMIT $1', [limit])
    .then((result) => {
      console.log(result.rows);
    })
    .catch((err) => {
      console.log(err.message);
    });
};


/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  return pool
  .query('SELECT * FROM users WHERE email = $1', [email])
  .then((result) => {
    return result.rows[0]; // Get the first user from the result
  })
  .catch((err) => {
    console.error('Error executing query:', err.message);
    return null; 
  });
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  return pool
  .query('SELECT * FROM users WHERE id = $1', [id])
  .then((result) => {
    return result.rows[0]; // Retrieve the first user from the result
  })
  .catch((err) => {
    console.error('Error executing query:', err.message);
    return null; 
  });
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  return pool
    .query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *', [
      user.name,
      user.email,
      user.password
    ])
    .then((result) => {
      return result.rows[0]; // Return the newly inserted user
    })
    .catch((err) => {
      console.error('Error executing query:', err.message);
      return null; // Return null if there's an error
    });
};

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  return pool
  .query(`
    SELECT reservations.id, properties.title, properties.cost_per_night,
           reservations.start_date, AVG(rating) as average_rating
    FROM reservations
    JOIN properties ON reservations.property_id = properties.id
    JOIN property_reviews ON properties.id = property_reviews.property_id
    WHERE reservations.guest_id = $1
    GROUP BY properties.id, reservations.id
    ORDER BY reservations.start_date
    LIMIT $2;
  `, [guest_id, limit])
  .then((res) => {
    return res.rows;
  })
  .catch((err) => {
    console.error('Error executing query', err);
    return null;
  });
};



/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};


module.exports ={
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty};