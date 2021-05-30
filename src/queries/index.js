import client from '../database/index.js';

export const getUsers = async (req, res) => {
  try {
    const response = await client.query('SELECT * FROM users_tab ORDER BY id ASC');

    if (response) {
      return res.status(200).json({ status: 'Success', data: response.rows });
    }

    return res.status(404).json({ status : 'Failure', message: 'No data found!' });
  } catch (err) {
    console.log(`ERROR: ${err}`);
  }
};

export const addUser = async (req, res) => {
  const { name, email } = req.body;

  try {
    if(![ name, email ].every(Boolean)) {
      return res.status(400).json({ status: 'failed', message: 'Oops! Please fill in Name and Email!' });
    }

    const response = await client.query(
      'INSERT INTO users_tab (name, email) VALUES ($1, $2) RETURNING *',
      [ name.toLowerCase(), email.toLowerCase() ]
    );

    res.status(200).json({ status: 'Success', message: 'User added successfully!' });
    
  } catch (error) {
    console.log(error);
  }
};

export const editUser = async (req, res) => {
  const { id } = req.params;

  try {
    const id_data = await client.query('SELECT * FROM users_tab WHERE id = $1', [ id ]),
          [ data_row ] = id_data.rows,
          { name, email } = req.body;

    if(data_row) {
      if([ name, email ].some(Boolean)) {
        const { name: old_name, email: old_email } = data_row;
  
        await client.query(
          'UPDATE users_tab SET (name, email) = ($1, $2) WHERE id = $3', 
          [
            name ? name.toLowerCase() : old_name,
            email ? email.toLowerCase() : old_email,
            id
          ]
        )
        return res.status(200).json({ status: 'Success', message: `User detail(s) updated successfully!` });
      }
      return res.status(400).json({ status: 'Failed', message: `ERROR! Please submit parameter(s) to update.` });
    }
    res.status(404).json({ status: 'Failed', message: `Oops! No user with id ${id} found.` });
  } catch (error) {
    console.log(error);
  }
}

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const id_data = await client.query('SELECT * FROM users_tab WHERE id = $1', [ id ]),
          [ data_row ] = id_data.rows;

    if(!data_row) {
      return res.status(404).json({ status: 'Failed', message: `Oops! No user with id ${id} found.` });
    }

    await client.query('DELETE FROM users_tab WHERE id = $1', [ id ]);

    return res.status(200).json({ status: 'Success', message: 'User profile discarded!' });

  } catch (error) {
    console.log(error);
  }
}