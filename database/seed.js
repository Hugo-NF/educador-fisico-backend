require('dotenv/config');
const seeder = require('mongoose-seed');
const mongoose = require('mongoose');

const connection = process.env.NODE_ENV === 'test' ? process.env.TESTDB_CONN_STRING : process.env.DB_CONN_STRING;

// Connect to MongoDB via Mongoose
seeder.connect(connection, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
  // Load Mongoose models
  seeder.loadModels([
    './src/models/Role',
    './src/models/Claim',
    './src/models/User',
    './src/models/Exercise',
    './src/models/Circuit',
    './src/models/Health',
  ]);

  // Generating ObjectId to make relationships
  const manageExercisesId = mongoose.Types.ObjectId();
  const manageTrainingId = mongoose.Types.ObjectId();
  const manageStudentsId = mongoose.Types.ObjectId();
  const managePermissionsId = mongoose.Types.ObjectId();
  const adminId = mongoose.Types.ObjectId();
  const teacherId = mongoose.Types.ObjectId();

  const healthCheckpointId = mongoose.Types.ObjectId('5f382c26c21c6b7f70227f5e');
  const currentUTC = new Date();

  // Data array containing seed data - documents organized by Model
  const data = [
    {
      model: 'Claim',
      documents: [
        { _id: manageExercisesId, name: 'ManageExercises' },
        { _id: manageTrainingId, name: 'ManageTraining' },
        { _id: manageStudentsId, name: 'ManageStudents' },
        { _id: managePermissionsId, name: 'ManagePermissions' },
      ],
    },
    {
      model: 'Role',
      documents: [
        { _id: adminId, name: 'Administrator', claims: [managePermissionsId, manageStudentsId, manageTrainingId, manageExercisesId] },
        { _id: teacherId, name: 'Teacher', claims: [manageStudentsId, manageTrainingId, manageExercisesId] },
        { name: 'Student' },
      ],
    },
    {
      model: 'User',
      documents: [
        {
          _id: '8719d08e-78ce-4c80-b936-71b2a258cbd5',
          name: 'Hugo Fonseca',
          email: 'hugonfonseca@hotmail.com',
          emailConfirmed: false,
          password: '123456789',
          birthDate: '1998-06-15T00:00:00.000Z',
          sex: 'Male',
          phone: { type: 'Mobile', number: '+55(61)99110-1515' },
          city: 'Ceilândia',
          state: 'DF',
          roles: [adminId],
        },
        {
          _id: '879a0055-715f-4230-ae25-a4e89fac7aa5',
          name: 'Hugo Fonseca',
          email: 'hugolockado@hotmail.com',
          emailConfirmed: false,
          password: '123456789',
          birthDate: '1998-06-15T00:00:00.000Z',
          sex: 'Male',
          phone: { type: 'Mobile', number: '+55(61)99110-1515' },
          city: 'Ceilândia',
          state: 'DF',
          lockoutUntil: new Date(currentUTC.getFullYear() + 200, 1, 1),
          claims: [manageStudentsId, manageTrainingId, manageExercisesId],
        },
        {
          _id: 'e036b5f4-f857-4384-8c55-39e1a58758fd',
          name: 'Hugo Fonseca',
          email: 'hugolockado2@hotmail.com',
          emailConfirmed: false,
          password: '123456789',
          birthDate: '1998-06-15T00:00:00.000Z',
          sex: 'Male',
          phone: { type: 'Mobile', number: '+55(61)99110-1515' },
          city: 'Ceilândia',
          state: 'DF',
          lockoutUntil: new Date(currentUTC.getFullYear() + 200, 1, 1),
          lockoutReason: 'conta inativa',
          claims: [manageStudentsId, manageTrainingId, manageExercisesId],
        },
        {
          _id: '9792a3ce-aa6c-4c8e-b9d6-69b988e16d60',
          name: 'Hugo Fonseca',
          email: 'hugoquaselockado@hotmail.com',
          emailConfirmed: false,
          password: '123456789',
          birthDate: '1998-06-15T00:00:00.000Z',
          sex: 'Male',
          phone: { type: 'Mobile', number: '+55(61)99110-1515' },
          city: 'Ceilândia',
          state: 'DF',
          accessFailedCount: 9,
          roles: [teacherId],
          claims: [managePermissionsId],
        },
        {
          _id: '1a76ec91-d544-4ba6-aa6f-75daaca59b42',
          name: 'Hugo Fonseca',
          email: 'hugomanual@hotmail.com',
          emailConfirmed: false,
          password: '123456789',
          birthDate: '1998-06-15T00:00:00.000Z',
          sex: 'Male',
          phone: { type: 'Mobile', number: '+55(61)99110-1515' },
          city: 'Ceilândia',
          state: 'DF',
          claims: [manageStudentsId, manageTrainingId, manageExercisesId],
        },
        {
          _id: '5bae7622-9d0e-47c1-b693-cafca194f8d5',
          name: 'Hugo Fonseca',
          email: 'hugomixado@hotmail.com',
          emailConfirmed: false,
          password: '123456789',
          birthDate: '1998-06-15T00:00:00.000Z',
          sex: 'Male',
          phone: { type: 'Mobile', number: '+55(61)99110-1515' },
          city: 'Ceilândia',
          state: 'DF',
          roles: [teacherId],
          claims: [managePermissionsId],
        },
        {
          _id: '86094390-89e8-4fee-a238-33a42808c29d',
          name: 'Hugo Fonseca',
          email: 'hugomatchespassword@hotmail.com',
          emailConfirmed: false,
          password: '123456789',
          birthDate: '1998-06-15T00:00:00.000Z',
          sex: 'Male',
          phone: { type: 'Mobile', number: '+55(61)99110-1515' },
          city: 'Ceilândia',
          state: 'DF',
          accessFailedCount: 9,
          roles: [adminId],
        },
        {
          _id: 'd346b29e-6c4b-47a4-a5d9-958c0e7ed9a7',
          name: 'Hugo Fonseca',
          email: 'hugoresetpw@hotmail.com',
          emailConfirmed: false,
          password: '123456789',
          birthDate: '1998-06-15T00:00:00.000Z',
          sex: 'Male',
          phone: { type: 'Mobile', number: '+55(61)99110-1515' },
          city: 'Ceilândia',
          state: 'DF',
          accessFailedCount: 0,
          roles: [adminId],
        },
        {
          _id: '1a4e212a-3aca-4f0a-b58a-a3ada325034d',
          name: 'Hugo Fonseca',
          email: 'hugoresetpwtwice@hotmail.com',
          emailConfirmed: false,
          password: '123456789',
          birthDate: '1998-06-15T00:00:00.000Z',
          sex: 'Male',
          phone: { type: 'Mobile', number: '+55(61)99110-1515' },
          city: 'Ceilândia',
          state: 'DF',
          accessFailedCount: 0,
          roles: [adminId],
        },
        {
          _id: '322c582d-ed39-4f90-8e0c-5b2409736bda',
          name: 'Ailamar Alves',
          email: 'ailamar.sedentaria@hotmail.com',
          emailConfirmed: false,
          password: '123456789',
          birthDate: '1998-06-15T00:00:00.000Z',
          sex: 'Female',
          phone: { type: 'Mobile', number: '+55(61)99110-1515' },
          city: 'Ceilândia',
          state: 'DF',
          accessFailedCount: 0,
          roles: [adminId],
          healthCheckpoints: [healthCheckpointId, mongoose.Types.ObjectId('5f382b5076119f513dcd055f')],
        },
      ],
    },
    {
      model: 'Exercise',
      documents: [
        { _id: '5eed3320725afd09805b72c6', name: 'Elevação Lateral', video: 'youtube.com/elevacao-lateral' },
        { _id: '5eed3be55d28c2255016b868', name: 'Elevação Frontal', video: 'youtube.com/elevacao-frontal' },
      ],
    },
    {
      model: 'Circuit',
      documents: [
        {
          _id: '5eed3357725afd09805b72c7',
          name: 'Elevação Lateral - Avançado',
          exercises: [{
            exercise: '5eed3320725afd09805b72c6',
            repetitions: 15,
            charge: 120,
          }],
        },
      ],
    },
    {
      model: 'Health',
      documents: [
        {
          _id: healthCheckpointId,
          measures: {
            height: 2.10,
            weight: 85,
            chest: 48,
            abdomen: 15,
            hip: 12,
            forearm: 52,
            arm: 13,
            thigh: 54,
            calf: 58,
          },
          bodyStats: {
            vo2max: 3.5,
            fatPercentage: 0.29,
            iac: 10,
            imc: 32,
          },
          ipaq: {
            walkPerWeek1a: 3,
            walkTimePerDay1b: 100,
            moderateActivityPerWeek2a: 5,
            moderateActivityTimePerDay2b: 120,
            vigorousActivityPerWeek3a: 200,
            vigorousActivityTimePerDay3b: 140,
            seatedTimeWeekday4a: 210,
            seatedTimeWeekend4b: 210,
          },
          objective: 'Ficar forte pra carai',
        },
      ],
    },
  ];

  // Clear specified collections
  seeder.clearModels(['Role', 'Claim', 'User', 'Exercise', 'Circuit', 'Health'], () => {
    // Callback to populate DB once collections have been cleared
    seeder.populateModels(data, () => {
      seeder.disconnect();
    });
  });
});
