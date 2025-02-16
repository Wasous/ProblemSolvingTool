// models/Tag.js
const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const Tag = sequelize.define('Tag', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
});

module.exports = Tag;
