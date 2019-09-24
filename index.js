const { expect } = require('chai');
const db = require('../db');
describe('Models', ()=> {
  let seed;
  beforeEach(async()=> seed = await db.syncAndSeed());
  describe('seeded data', ()=> {
    it('there are 3 departments', ()=> {
      expect(Object.keys(seed.departments).length).to.equal(3);
    });
    it('there are 3 users', ()=> {
      expect(Object.keys(seed.users).length).to.equal(4);
    });
  });
});



