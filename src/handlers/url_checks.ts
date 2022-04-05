import express, { Request, Response } from 'express';
import axios, { AxiosResponse } from 'axios';
import  {sendEmail}  from '../utilities/sendEmail';
import { url_check, url_checkStore } from '../models/url_checks';
import {User, userStore } from '../models/users';
import url from 'url';
let responseTime;
const urlTOCheck = [
  {
   'url': 'https://resturantreservation2022.herokuapp.com/',
   'name': 'resturant',
   'user_id': [8]
  },
  {
    'url': 'https://ninja-blog2020.herokuapp.com/blogs',
    'name': 'blog',
    'user_id': [8,9]
   }
  ];

const store = new url_checkStore();
 
const index = async (_req: Request, res: Response) => {
  const checks = await store.index();
  res.json(checks);
}

const show = async (_req: Request, res: Response) => {
   const check = await store.show(parseInt( _req.params.id ));
   res.json(check);
}

// const create = async (_req: Request, res: Response) => {
//     try {
    
//         // const check = {
//         //     id: _req.body.id,
//         //     name: _req.body.name,
//         //     url :_req.body.url,
//         //     protocol : _req.body.protocol,
//         //     path : _req.body.path,
//         //     port : _req.body.port,
//         //     timeout :5,
//         //     interval :600,
//         //     threshold :1,
//         //     assert  : _req.body.status,
//         //     responseTime: (responseTime as unknown)as string,
//         //     user_id :
            
//         // };

//         const newCheck = await store.create(check);
//         res.json(newCheck);
//       }
//     } catch(err) {
//         res.status(400);
//         res.json(err);
//     }
// }

const edit = async (_req: Request, res: Response) => {
    try{
            const check ={
                id : parseInt( _req.params.id),
                name : _req.body.name,
                url :_req.body.url,
                protocol : _req.body.protocol,
                path : _req.body.path,
                port : _req.body.port,
                timeout :5,
                interval :600,
                threshold :1,
                assert  : _req.body.status,
                responseTime: (responseTime as unknown)as number,
                user_id :2
                  };
             
            const updatedCheck = await store.edit(check);
            res.json(updatedCheck);
        }catch(err){
          res.status(400);
          res.json(err);
        }
    }

const destroy = async (_req: Request, res: Response) => {
    const deleted = await store.delete(parseInt(_req.params.id));
    res.json(deleted);
}

export const check = async (_req:Request , res: Response, next: express.NextFunction) => {
    let check :url_check,start,finish,time;
    urlTOCheck.forEach(element => {
      console.log(`params: ${element.url} ${element.name}`)
   start = Date.now();
   axios.get(element.url)
      .then(  (response) => {
           finish = Date.now();
           time = (finish - start) / 1000;
           console.log(`uptime: ${JSON.stringify(process.uptime())}`);
           element.user_id.forEach(async user=> {
            check = {
              id: _req.body.id,
              name : element.name,
              url :element.url,
              protocol :(url.parse(element.url).protocol as unknown)as string,
              path :(url.parse(element.url).path as unknown)as string,
              port :(url.parse(element.url).port as unknown)as number,
              timeout :5,
              interval :600,
              threshold :1,
              assert  :response.status,
              responseTime: time,
              uptime: parseFloat (JSON.stringify(process.uptime())),
              user_id :user
            }
            const addCheck =  await store.create(check);
        return  res.status(200).json({
            message: 'success',
            data : addCheck
          });
        })   
      })
      .catch( (error) => {
        element.user_id.forEach(async user=> {
        check  = {
          id: _req.body.id,
          name : element.name,
          url :element.url,
          protocol :(url.parse(element.url).protocol as unknown)as string,
          path :(url.parse(element.url).path as unknown)as string,
          port :(url.parse(element.url).port as unknown)as number,
          timeout :5,
          interval :600,
          threshold :1,
          assert  :404 ,
          responseTime: time,
          uptime: 0,
          user_id :user
        }
       const uStore = new userStore();
       const {email} = await uStore.show(user)
       console.log(email);
        sendEmail(error,element.url,email);
        const addCheck =  await store.create(check);
     
      })
      })
    });
      
};

const checkRoutes = (app: express.Application) => {
  app.get('/url-to-check', index)
  app.get('/url-to-check/:id', show)
  app.patch('/url-to-check/:id', edit)
  //app.post('/url-to-check', create)
  app.delete('/url-to-check/:id', destroy)
};

export default checkRoutes;