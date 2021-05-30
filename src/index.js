import express from 'express';
import cors from 'cors';
import client from './database/index.js';
import { getUsers, addUser, editUser, deleteUser } from './queries/index.js';

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended : true }));

client.connect();

// CREATE
app.post('/users/add', addUser);

// READ
app.get('/users', getUsers);

// UPDATE
app.put('/users/edit/:id', editUser);

// DELETE
app.delete('/users/delete/:id', deleteUser);


app.listen(port, () => {
  console.log(`Server connected at  http://localhost:${port}`);
});
