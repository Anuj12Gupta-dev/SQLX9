const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: String,
    required: true,
    trim: true
  },
  enrollmentDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create a virtual property for the user's name
studentSchema.virtual('name').get(function() {
  return this.user.name;
});

// Create a virtual property for the user's email
studentSchema.virtual('email').get(function() {
  return this.user.email;
});

// Ensure virtual fields are serialized
studentSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Student', studentSchema);