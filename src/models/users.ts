import {client} from "../database";
import bcrypt from 'bcrypt';

const saltRounds =parseInt( process.env.SALT_ROUNDS as string);
const pepper = process.env.BCRYPT_PASSWORD

export type User = {
    id: number,
    name: string,
    email: string,
    password: string
};

export class userStore{
    async index() : Promise<User[] | null> 
    {
        try{
        const conn = await client.connect();
        const sql = 'select * from users';
        const result = await conn.query(sql);
        conn.release();
        return result.rows ;
    } catch (err) {
      throw new Error(`Could not get users. Error: ${err}`);
    }
  }

  async show(id: number): Promise<User> {
    try {
      console.log(id);
    const sql = 'SELECT * FROM users WHERE id=($1)';
    const conn = await client.connect();
    const result = await conn.query(sql, [id]);
    conn.release();
    return result.rows[0];
    } catch (err) {
        throw new Error(`Could not find user ${id}. Error: ${err}`);
    }
  }

  async create(u: User): Promise<User> {
      try {
    const sql = 'INSERT INTO users (name,email,password) VALUES ($1, $2, $3) RETURNING *';
    const hash = bcrypt.hashSync(u.password + pepper,saltRounds);
    const conn = await client.connect();
    const result = await conn.query(sql, [u.name,u.email,hash]);
    const user = result.rows[0];
    conn.release();
    return user;
      } catch (err) {
          throw new Error(`Could not add new user. Error: ${err}`);
      }
  }

  async edit(u: User): Promise<User> {
    try {
      const sql = 'UPDATE users SET name=$1 , email=$2, password=$3 WHERE id=$4 RETURNING *';
      const conn = await client.connect();
      const hash = bcrypt.hashSync(u.password + pepper, saltRounds);
      const result = await conn.query(sql, [u.name,u.email,hash,u.id]);
      const user = result.rows[0];
      conn.release();
      return user;
    } catch (err) {
      throw new Error(`Could not update the user. Error: ${err}`);
    }
  }

  async delete(id: number): Promise<User> {
      try {
    const sql = 'DELETE FROM users WHERE id=($1)';
    const conn = await client.connect();
    const result = await conn.query(sql, [id]);
    const user = result.rows[0];
    conn.release();

    return user;
      } catch (err) {
          throw new Error(`Could not delete user ${id}. Error: ${err}`)
      }
  }

  async authenticate(email: string, password: string): Promise<User | null> {
    try{
    const conn = await client.connect();
    const sql = 'SELECT * FROM users WHERE email=($1)';
    const result = await conn.query(sql, [email]);
    if(result.rowCount == 1) {
      const user = result.rows[0];
        if ( bcrypt.compareSync(password+pepper, user.password)) {
        return user;
      }
    }
    return null;
  }catch (err){
    throw new Error(`Could not authenticate user . Error: ${err}`)
  }
}
}

export default userStore;