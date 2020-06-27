const dotenv = require('dotenv').config();
const seeder = require('mongoose-seed');
const mongoose = require('mongoose');

// Connect to MongoDB via Mongoose
seeder.connect(process.env.DB_CONN_STRING, { useNewUrlParser: true, useUnifiedTopology: true }, function() {
 
  // Load Mongoose models
  seeder.loadModels([
    './src/models/Role',
    './src/models/Claim',
    './src/models/User'
  ]);
 
  // Clear specified collections
  seeder.clearModels(['Role', 'Claim', 'User'], function() {
 
    // Callback to populate DB once collections have been cleared
    seeder.populateModels(data, function() {
      seeder.disconnect();
    });
 
  });
});
 
// Generating ObjectId to make relationships
let manageExercisesId = mongoose.Types.ObjectId();
let manageTrainingId = mongoose.Types.ObjectId();
let manageStudentsId = mongoose.Types.ObjectId();
let managePermissionsId = mongoose.Types.ObjectId();
let adminId = mongoose.Types.ObjectId();
let teacherId = mongoose.Types.ObjectId();

// Data array containing seed data - documents organized by Model
let data = [
    {
        'model': 'Claim',
        'documents': [
            { '_id': manageExercisesId, 'name': 'ManageExercises'},
            { '_id': manageTrainingId, 'name': 'ManageTraining' },
            { '_id': manageStudentsId, 'name': 'ManageStudents' },
            { '_id': managePermissionsId, 'name': 'ManagePermissions'}
        ]
    },
    {
        'model': 'Role',
        'documents': [
            {'_id': adminId, 'name': 'Administrator', claims: [managePermissionsId, manageStudentsId, manageTrainingId, manageExercisesId]},
            {'_id': teacherId, 'name': 'Teacher', claims: [manageStudentsId, manageTrainingId, manageExercisesId]},
            {'name': 'Student'}
        ]
    },
    {
      'model': 'User',
      'documents': [
          {
            '_id': '8719d08e-78ce-4c80-b936-71b2a258cbd5',
            "name": "Hugo Fonseca",
            "email": "hugonfonseca@hotmail.com",
            "password": "123456789",
            "birthDate": "1998-06-15T00:00:00.000Z",
            "sex": "Male",
            "phones": [
                { "type": "Mobile", "number": "+55(61)99110-1515" }
            ],
            "city": "Ceilândia",
            "state": "DF",
            roles: [adminId]
          }
      ]
    }
];