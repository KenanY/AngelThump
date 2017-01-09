'use strict';

// users-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    validator = require('validator');

const usersSchema = new Schema({
  email: { type: String, required: true, unique: true, validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email!' }},
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  streamkey: { type: String, unique: true},
  verified_email: { type: Boolean, 'default': false},
  banned:    {type: Boolean, 'default': false},
  patreon: {type: Boolean, 'default': false},
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
});


const usersModel = mongoose.model('users', usersSchema);

module.exports = usersModel;