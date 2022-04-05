import express, { NextFunction, Request, Response } from 'express';
import { User, userStore } from '../models/users';
import jwt from 'jsonwebtoken';

const store = new userStore();

const createSendToken = (user: User, statusCode: number, _req: Request, res: Response) => {
    //const token = signToken(user._id);
    const token = jwt.sign({user}, (process.env.JWT_TOKEN as unknown)as string);
    res.cookie('jwt', token, {
        expires: new Date(
          Date.now() + parseInt((process.env.JWT_COOKIE_EXPIRES_IN as unknown)as string) * 24 * 60 * 60 * 1000
        ),
      httpOnly: true,
      secure: _req.secure || _req.headers['x-forwarded-proto'] === 'https'
    });

    res.setHeader('Content-Type', 'application/json').status(statusCode).send({
      status: 'success',
      token,
      data: {
        user
      }
    });
  }
 

const index = async (_req: Request, res: Response) => {
  const users = await store.index();
  res.setHeader('Content-Type', 'application/json')
  .status(200).send(users);
}

const show = async (_req: Request, res: Response) => {
   const user = await store.show(parseInt(_req.params.id));
   res.setHeader('Content-Type', 'application/json')
   .status(200).send(user);
}

const create = async (_req: Request, res: Response) => {
    try {
        const user: User = {
            id: parseInt(_req.params.id),
            name: _req.body.name,
            email: _req.body.email,
            password: _req.body.password
        };
        const validateEmail = (email) => {
          return String(email)
            .toLowerCase()
            .match(
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
        }; 
       const Valid= validateEmail(user.email);
        if(!Valid)
        {
         return res.setHeader('Content-Type', 'application/json')
      .status(400).send('This email is not valid');
        }
        const newUser = await store.create(user);
        createSendToken(newUser,201,_req,res);
    } catch(err) {
      res.setHeader('Content-Type', 'application/json')
      .status(400).send(err);
    }
}

const edit = async (_req: Request, res: Response) => {
    try{
            const user: User ={
                id : parseInt(_req.params.id),
                name : _req.body.name,
                email : _req.body.email,
                password: _req.body.password
            };
             
            const updatedProduct = await store.edit(user);
            res.setHeader('Content-Type', 'application/json')
            .status(200).send(updatedProduct);
        }catch(err){
          res.setHeader('Content-Type', 'application/json')
          .status(400).send(err);
        }
    }

const destroy = async (_req: Request, res: Response) => {
    const deleted = await store.delete(parseInt(_req.params.id));
    res.setHeader('Content-Type', 'application/json')
    .status(204).send(deleted);
}

const authenticate = async (_req: Request, res: Response) => {
  const {email , password} = _req.body;
    try {
        const user = await store.authenticate(email,password);
       
        if(!user){
            res.status(401).json({message : 'error login credintial' });
        }
        else createSendToken(user,200,_req,res);
    } catch(err) {
      res.setHeader('Content-Type', 'application/json')
      .status(400).send(err);
    }
}


const userRoutes = (app: express.Application) => {
  app.get('/users', index)
  app.get('/users/:id', show)
  app.post('/users', create)
  app.delete('/users/:id', destroy)
  app.put('/users/:id', edit)
  app.post('/login', authenticate)
};

export default userRoutes;