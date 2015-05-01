var pg = require('pg');
var connString = process.env.DATABASE_URL || 'postgresql://myuser:test@localhost:5432/mydb';

// Add user
// Add organization
// Update user
// Update organization
// Retrieve user email and phone number
// Retrieve user
// Retrieve organization

// Schema:
// User
// id
// firstname
// middlename
// lastname
// password
// email
// picture
// organization_id
// department
// title

// Organization
// id
// logo
// name
// administrator
