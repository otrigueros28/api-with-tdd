const Sequelize = require('sequelize');
const {STRING, UUID, UUIDV4 } =  Sequelize;
const conn =  new Sequelize( process.env.DATABASE_URL || 'postgres://localhost/users_departments_db');

const User = conn.define('user', {
  id: {
    primaryKey: true,
    type: UUID,
    defaultValue: UUIDV4
  },
  name:{
    type: STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
});

const Department = conn.define('department', {
  id: {
    primaryKey: true,
    type: UUID,
    defaultValue: UUIDV4
  },
  name: {
    type: STRING,
    unique: true,
    allowNull: false,
    validate:{
      notEmpty: true
    }
  }
});


User.belongsTo(Department);
Department.hasMany(User);

const mapPromise = (items, model) => {
  return Promise.all(items.map(item => model.create(item)))
}

const syncAndSeed = async() => {
  await conn.sync({force: true});

  const users =[
    {name: 'John', departmentId: Human.id},
    {name: 'Steve', departmentId: Sales.id},
    {name: 'Sarah', departmentId: Dev.id},
    {name: 'Amanda', departmentId: Human.id},
    {name: 'Chris', departmentId: Dev.id}
  ];

  const [John, Steve, Sarah, Amanda, Chris] = await mapPromise(users, User);

  const departments = [
    {name: "Human"},
    {name: 'Dev'},
    {name: 'Sales'}
  ];

  const [Human, Dev, Sales] = await Promise.all(departments.map(department => Department.create(department)));

  return {
    users: {
      John,
      Steve,
      Sarah,
      Amanda,
      Chris
    },
    departments: {
      Human,
      Dev,
      Sales
    }
  }
};

syncAndSeed();
module.exports = {
  syncAndSeed,
  models: {
    User,
    Department
  }
}

