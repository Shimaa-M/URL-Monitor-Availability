import express, { Request, Response } from 'express';
import isLogged from '../utilities/isLogged';
import { Report, reportStore } from '../models/reports';

const store = new reportStore();
 
const index = async (_req: Request, res: Response) => {
  const reports = await store.index();
  res.json(reports);
}

const show = async (_req: Request, res: Response) => {
   const report = await store.show(parseInt( _req.params.id ));
   res.json(report);
}

const create = async (_req: Request, res: Response) => {
    try {
    
        const report: Report = {
            id: _req.body.id,
            status: _req.body.status,
            availability :_req.body.availability,
            outages : _req.body.outages,
            uptime : _req.body.uptime,
           responseTime : _req.body.responseTime,
           user_id: parseInt( res.locals.user_id)
        };

        const newReport = await store.create(report);
        res.json(newReport);
      
    } catch(err) {
        res.status(400);
        res.json(err);
    }
}

const edit = async (_req: Request, res: Response) => {
    try{
            const report: Report ={
                id : parseInt( _req.params.id),
                status: _req.body.status,
                availability :_req.body.availability,
                outages : _req.body.outages,
                uptime : _req.body.uptime,
               responseTime : _req.body.responseTime,
               user_id: parseInt( res.locals.user_id)
                };
             
            const updatedReport = await store.edit(report);
            res.json(updatedReport);
        }catch(err){
          res.status(400);
          res.json(err);
        }
    }

const destroy = async (_req: Request, res: Response) => {
    const deleted = await store.delete(parseInt(_req.params.id));
    res.json(deleted);
}

export const report = async (_req:Request , res: Response, next: express.NextFunction) => {
   const makeReport= await store.report(_req.params.tag,parseInt( res.locals.user_id));
   //res.json(makeReport);
}

const reportRoutes = (app: express.Application) => {
  app.get('/reports', index)
 
  app.put('/reports/:id',isLogged, edit)
 // app.post('/reports', create)
  app.delete('/reports/:id',isLogged, destroy)
app.get('/get-report/:tag',isLogged, report);
};

export default reportRoutes;