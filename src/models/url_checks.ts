import {client} from "../database";

export type url_check = {
    id :number;
    name :string;
    url :string;
    protocol? :string;
    path?:string;
    port? :number;
    timeout? :number;
    interval? :number;
    threshold? :number;
    assert?  :number;
    responseTime?: number;
    uptime?: number;
    user_id :number;
};

export class url_checkStore{
    async index() : Promise<url_check[] | null> 
    {
        try{
        const conn = await client.connect();
        const sql = 'select * from url_checks';
        const result = await conn.query(sql);
        conn.release();
        return result.rows ;
    } catch (err) {
      throw new Error(`Could not get url. Error: ${err}`);
    }
  }

  async show(id: number): Promise<url_check> {
    try {
    const sql = 'SELECT * FROM url_checks WHERE id=($1)';
    const conn = await client.connect();
    const result = await conn.query(sql, [id]);
    conn.release();
    return result.rows[0];
    } catch (err) {
        throw new Error(`Could not find url ${id}. Error: ${err}`);
    }
  }

  async create(u: url_check): Promise<url_check> {
      try {
    const sql = 'INSERT INTO url_checks (name,url,protocol,path,port,timeout,interval,threshold,assert,responseTime,uptime,user_id) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *';
    const conn = await client.connect();
    const result = await conn.query(sql, [u.name,u.url,u.protocol,u.path,u.port,u.timeout,u.interval,u.threshold,u.assert,u.responseTime,u.uptime,u.user_id]);
    const check = result.rows[0];
    conn.release();
    return check;
      } catch (err) {
          throw new Error(`Could not add new url check. Error: ${err}`);
      }
  }
  
  async edit(u: url_check): Promise<url_check> {
    try {
      const sql = 'UPDATE url_checks SET name=$1,url=$2,protocol=$3,path=$4,port=$5,timeout=$6,interval=$7,threshold=$8,assert=$9,responseTime=$10,uptime=$11,user_id=$12  WHERE id=$13 RETURNING *';
      const conn = await client.connect();
      const result = await conn.query(sql, [u.name,u.url,u.protocol,u.path,u.port,u.timeout,u.interval,u.threshold,u.assert,u.responseTime,u.uptime,u.user_id,u.id]);
      const check = result.rows[0];
      conn.release();
      return check;
    } catch (err) {
      throw new Error(`Could not update the product. Error: ${err}`);
    }
  }
  
  async delete(id: number): Promise<url_check> {
      try {
    const sql = 'DELETE FROM url_checks WHERE id=($1)';
    const conn = await client.connect();
    const result = await conn.query(sql, [id]);
    const check = result.rows[0];
    conn.release();

    return check;
      } catch (err) {
          throw new Error(`Could not delete url check ${id}. Error: ${err}`)
      }
  }
}

export default url_checkStore;