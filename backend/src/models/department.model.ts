import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';

interface DepartmentAttributes {
  id: number;
  name: string;
  code: string;
  coordinatorName: string;
  totalCredits: number;
  eventCount: number;
}

interface DepartmentCreationAttributes extends Optional<DepartmentAttributes, 'id' | 'totalCredits' | 'eventCount'> { }

export class Department extends Model<DepartmentAttributes, DepartmentCreationAttributes> {
  declare id: number;
  declare name: string;
  declare code: string;
  declare coordinatorName: string;
  declare totalCredits: number;
  declare eventCount: number;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Department.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    coordinatorName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    totalCredits: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    eventCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'departments',
  }
);