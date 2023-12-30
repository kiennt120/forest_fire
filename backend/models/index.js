const sequelize = require('../configs/db/index');
const { DataTypes } = require('sequelize');

const Admin = sequelize.define(
    'Admin',
    {
        adminId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, allowNull: true },
        // email: {type: DataTypes.STRING, unique: true, allowNull: false},
    },
    {
        tableName: 'admin',
        timestamps: true,
    },
);

const MS = sequelize.define(
    'Monitoring_station',
    {
        // mSId: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        name: { type: DataTypes.STRING, allowNull: false, unique: true, primaryKey: true },
        city: { type: DataTypes.STRING, allowNull: true },
        district: { type: DataTypes.STRING, allowNull: true },
        ward: { type: DataTypes.STRING, allowNull: true },
        area: { type: DataTypes.STRING, allowNull: false },
        leader: { type: DataTypes.STRING, allowNull: true },
        phone: { type: DataTypes.STRING, allowNull: true, unique: true },
        slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    },
    {
        tableName: 'monitoring_station',
        timestamps: true,
    },
);

const Supervisor = sequelize.define(
    'Supervisor',
    {
        userId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, allowNull: false },
        // mSName: {type: DataTypes.STRING, allowNull: false},
        birthday: { type: DataTypes.DATEONLY, allowNull: true },
        phone: { type: DataTypes.STRING, allowNull: true, unique: true },
        // email: {type: DataTypes.STRING, unique: true, allowNull: false},
    },
    {
        tableName: 'supervisor',
        timestamps: true,
    },
);

const Camera = sequelize.define(
    'Camera',
    {
        cameraId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        // mSName: {type: DataTypes.STRING, allowNull: false},
        coordinate: { type: DataTypes.STRING, allowNull: false },
        infor: { type: DataTypes.STRING, allowNull: true },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'connect',
            allowNull: false,
            validate: { isIn: [['connect', 'disconnect']] },
        },
        ip: { type: DataTypes.STRING, allowNull: false, unique: true },
    },
    {
        tableName: 'camera',
        timestamps: true,
    },
);

const Fire = sequelize.define(
    'Fire',
    {
        fireId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        status: {
            type: DataTypes.STRING,
            defaultValue: 0,
            allowNull: false,
            validate: { isIn: [[0, 1]] },
        },
        city: { type: DataTypes.STRING, allowNull: false },
        district: { type: DataTypes.STRING, allowNull: false },
        ward: { type: DataTypes.STRING, allowNull: false },
        type_fire: { type: DataTypes.STRING, allowNull: false, validate: { isIn: [['fire', 'smoke', 'off']] } },
        image: { type: DataTypes.STRING, allowNull: false },
        address: { type: DataTypes.STRING, allowNull: false },
    },
    {
        tableName: 'fire',
        timestamps: true,
    },
);

const Email_sended = sequelize.define(
    'Email_sended',
    {
        eSId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    },
    {
        tableName: 'email_sended',
        timestamps: true,
        updatedAt: false,
    },
);

const Credential = sequelize.define(
    'Credential',
    {
        email: { type: DataTypes.STRING, allowNull: false, unique: true, primaryKey: true },
        password: { type: DataTypes.STRING, allowNull: false },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'user',
            validate: { isIn: [['admin', 'user']] },
        },
        passwordResetToken: { type: DataTypes.STRING, allowNull: true },
        passwordResetTokenExpries: { type: DataTypes.DATE, allowNull: true },
    },
    {
        tableName: 'credential',
        timestamps: true,
    },
);

MS.hasMany(Supervisor, {
    sourceKey: 'name',
    foreignKey: 'mSName',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
// Supervisor.belongsTo(MS);

MS.hasMany(Camera, {
    sourceKey: 'name',
    foreignKey: 'mSName',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
// Camera.belongsTo(MS);

Camera.hasMany(Fire, {
    foreignKey: 'cameraId',
    onUpdate: 'CASCADE',
});
// Fire.belongsTo(Camera);

Camera.hasMany(Email_sended, {
    foreignKey: 'cameraId',
    onUpdate: 'CASCADE',
});
// Email_sended.belongsTo(Camera);

Credential.hasOne(Admin, {
    sourceKey: 'email',
    foreignKey: 'email',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

Credential.hasOne(Supervisor, {
    sourceKey: 'email',
    foreignKey: 'email',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

module.exports = { MS, Supervisor, Admin, Camera, Fire, Email_sended, Credential };
