'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Messages', 'promiseNum', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Promises',
        key: 'promiseNum'
      },
      onUpdate: 'CASCADE',
    });

    // readStatus 컬럼 추가
    await queryInterface.addColumn('Messages', 'readStatus', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    // promiseNum 컬럼 제거
    await queryInterface.removeColumn('Messages', 'promiseNum');

    // readStatus 컬럼 제거
    await queryInterface.removeColumn('Messages', 'readStatus');
  }
};