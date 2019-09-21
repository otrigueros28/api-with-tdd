const express = require('express');
const app = express();
const db = require('./db');
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(require('cors')());

app.get('/api/users', (req, res, next)=>{
  db.models.User.findAll()
    .then(item => res.send(item))
    .catch(next)
});

app.post('/api/users', (req, res, next)=>{
  db.models.User.create(req.body)
    .then(item => res.status(201).send(item))
    .catch(next)
});

app.delete('/api/users/:id', (req, res, next)=>{
  db.models.User.findByPk(req.params.id)
    .then(item => item.destroy())
    .then(item => res.sendStatus(204))
    .catch(next)
});

app.put('/api/users/:id', (req, res, next)=>{
  db.models.User.findByPk(req.params.id)
    .then(item => item.update(req.body))
    .then(item => res.send(item))
    .catch(next)
});



app.get('/api/departments', (req, res, next)=>{
  db.models.Department.findAll()
    .then(item => res.send(item))
    .catch(next)
});

app.post('/api/departments', (req, res, next)=>{
  db.models.Department.create(req.body)
    .then(item => res.status(201).send(item))
    .catch(next)
});

app.delete('/api/departments/:id', (req, res, next)=>{
  db.models.Department.findByPk(req.params.id)
    .then(item => item.destroy())
    .then(item => res.sendStatus(204))
    .catch(next)
});

app.put('/api/departments/:id', (req, res, next)=>{
  db.models.Department.findByPk(req.params.id)
    .then(item => item.update(req.body))
    .then(item => res.send(item))
    .catch(next)
});


db.syncAndSeed()
  .then(()=> {
    app.listen(port, console.log(`listening on port ${port}`));
  })
