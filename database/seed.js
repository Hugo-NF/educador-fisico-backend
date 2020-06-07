const dotenv = require('dotenv').config();
const seeder = require('mongoose-seed');
const mongoose = require('mongoose');
 
// Connect to MongoDB via Mongoose
seeder.connect(process.env.COSMOSDB_CONN_STRING, { useNewUrlParser: true, useUnifiedTopology: true }, function() {
 
  // Load Mongoose models
  seeder.loadModels([
    './src/models/Role',
    './src/models/Claim'
  ]);
 
  // Clear specified collections
  seeder.clearModels(['Role', 'Claim'], function() {
 
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
            {'name': 'Administrator', claims: [managePermissionsId, manageStudentsId, manageTrainingId, manageExercisesId]},
            {'name': 'Teacher', claims: [manageStudentsId, manageTrainingId, manageExercisesId]},
            {'name': 'Student'}
        ]
    }
];