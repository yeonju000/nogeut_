// member.js 신고횟수 추가
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const SeniorProfile = require('./seniorProfile');
const StudentProfile = require('./studentProfile');

const Member = sequelize.define('Member', {
  memberNum: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  memberPW: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  userType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  profileCreationStatus: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  reportCount: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  }
});

Member.hasOne(SeniorProfile, { foreignKey: 'seniorNum', sourceKey: 'memberNum' });
Member.hasOne(StudentProfile, { foreignKey: 'stdNum', sourceKey: 'memberNum' });

SeniorProfile.belongsTo(Member, { foreignKey: 'seniorNum', targetKey: 'memberNum' });
StudentProfile.belongsTo(Member, { foreignKey: 'stdNum', targetKey: 'memberNum' });


module.exports = Member;