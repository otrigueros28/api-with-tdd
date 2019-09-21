const {expect} = require('chai');
const db = require('./db');
const {User, Department} = db.models
const app = require('supertest')(require('./app'));

  describe('Data start', ()=>{
    let seed;
    beforeEach( async()=> seed = await db.syncAndSeed());
    it('John, Steve, Sarah, Amanda and Chris are all users', ()=>{
      expect(seed.users.John.name).to.equal('John');
      expect(seed.users.Steve.name).to.equal('Steve');
      expect(seed.users.Sarah.name).to.equal('Sarah');
      expect(seed.users.Amanda.name).to.equal('Amanda');
      expect(seed.users.Chris.name).to.equal('Chris');
    })
    it('user belongs to a department', ()=>{
      expect(seed.user.John.departmentId).to.equal(seed.departments.sale.id);
    })
  })



