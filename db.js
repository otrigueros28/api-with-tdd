const Sequelize = require('sequelize');
const {STRING, UUID, UUIDV4 } =  Sequelize;
const conn =  new Sequelize( process.env.DATABASE_URL || 'postgres://localhost/users_departments_db',
{
  logging: false
});

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
}, {
  hooks: {
    beforeSave: async function(user){
      try{
        if(user.departmentId === ''){
          user.departmentId = null;
        }
        if(user.departmentId){
          const users = await User.findAll({ where: {
            departmentId: user.departmentId,
            id: {
              [Sequelize.Op.ne]: user.id
            }
          }});
          count = users.length;
          if(count >= 5){
            const error = new Error();
            error.message = `there are already ${count} users in this role... sorry`;
            throw error;
          }
        }
      }
      catch(ex){
        console.log(ex);
        throw ex;
      }
    }
  }
});



User.belongsTo(Department);
Department.hasMany(User);

// const mapPromise = (items, model) => {
//   return Promise.all(items.map(item => model.create(item)))
// }

const syncAndSeed = async() => {
  await conn.sync({force: true});


  const departments = [
    {name: "Human"},
    {name: 'Dev'},
    {name: 'Sales'}
  ];
  const [human, dev, sale] = await Promise.all(departments.map(department => Department.create(department)));


  const users =[
    {name: 'John', departmentId: sale.id},
    {name: 'Steve', departmentId: sale.id},
    {name: 'Sarah', departmentId: dev.id},
    {name: 'Amanda', departmentId: human.id},
    {name: 'Chris', departmentId: dev.id}
  ];
  const [John, Steve, Sarah, Amanda, Chris] = await Promise.all(users.map(user => User.create(user)));





  return {
    users: {
      John,
      Steve,
      Sarah,
      Amanda,
      Chris
    },
    departments: {
      human,
      dev,
      sale
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

