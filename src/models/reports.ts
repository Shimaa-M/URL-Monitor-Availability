import express, { Request, Response } from 'express';
import {client} from "../database";

export type Report = {
    id: number,
    status: number,
    availability: number,
    outages: number,
    uptime: number,
    responseTime: number,
    user_id: number
};

export class reportStore{
    async index() : Promise<Report[] | null> 
    {
        try{
        const conn = await client.connect();
        const sql = 'select * from reports';
        const result = await conn.query(sql);
        conn.release();
        return result.rows ;
    } catch (err) {
      throw new Error(`Could not get reports. Error: ${err}`);
    }
  }

  async show(id: number): Promise<Report> {
    try {
    const sql = 'SELECT * FROM reports WHERE id=($1)';
    const conn = await client.connect();
    const result = await conn.query(sql, [id]);
    conn.release();
    return result.rows[0];
    } catch (err) {
        throw new Error(`Could not find report ${id}. Error: ${err}`);
    }
  }

  async create(r: Report): Promise<Report> {
      try {
    const sql = 'INSERT INTO reports (status,availability,outages,uptime,responseTime,user_id) VALUES($1,$2,$3,$4,$5,$6) RETURNING *';
    const conn = await client.connect();
    const result = await conn.query(sql, [r.status,r.availability,r.outages,r.uptime,r.responseTime,r.user_id]);
    const report = result.rows[0];
    conn.release();
    return report;
    
      } catch (err) {
          throw new Error(`Could not add new report. Error: ${err}`);
      }
  }
  
  async edit(r: Report): Promise<Report> {
    try {
      const sql = 'UPDATE reports SET status=$1 ,availability=$2,outages=$3 ,uptime=$4,responseTime=$5,user_id=$6  WHERE id=$7 RETURNING *';
      const conn = await client.connect();
      const result = await conn.query(sql, [r.status,r.availability,r.outages,r.uptime,r.responseTime,r.user_id,r.id]);
      const report = result.rows[0];
      conn.release();
      return report;
    } catch (err) {
      throw new Error(`Could not update the report. Error: ${err}`);
    }
  }
  
  async delete(id: number): Promise<Report> {
      try {
    const sql = 'DELETE FROM reports WHERE id=($1)';
    const conn = await client.connect();
    const result = await conn.query(sql, [id]);
    const report = result.rows[0];
    conn.release();

    return report;
      } catch (err) {
          throw new Error(`Could not delete report ${id}. Error: ${err}`)
      }
  }

  async report(name: string,user_id:number): Promise<Report|null> {
    try {
      
        const sql = "SELECT name, assert, COUNT(assert),SUM(uptime::NUMERIC) as uptime ,SUM(responseTime::NUMERIC) as responseTime FROM url_checks WHERE name LIKE ($1) AND user_id=($2)  GROUP BY assert ,name";
        const conn = await client.connect();
        const tag = name+'%'
        const curStatus = conn.query('SELECT assert FROM url_checks ORDER BY assert DESC LIMIT 1');
        const result = await conn.query(sql,[tag,user_id]);
        const res= JSON.stringify(result)
        conn.release();
        if(result.rowCount==0)
        {
          throw new Error(`this tag doesn't have report, try another one`);
          return null;
        }
        const currentStatus = JSON.stringify((await curStatus).rows[0].assert);
        console.log(res);
        const report: Report= {
          id: 1,
          status: parseInt(currentStatus),
         availability: ((parseInt(result.rows[0].count) / (parseInt(result.rows[0].count)+parseInt(result.rows[1].count))*100)as unknown)as number,
         outages: (result.rows[1].count as unknown)as number,
         uptime : (result.rows[0].uptime as unknown)as number,
         responseTime : (result.rows[0].responsetime as unknown)as number,
         user_id: user_id
        }
        console.log(report)
        const makeReport = this.create(report);
       return makeReport;
        } catch (err) {
            throw new Error(`Could not create report. Error: ${err}`);
            return null;
        }
}
}

export default reportStore;