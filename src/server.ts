import express  from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import { check } from './handlers/url_checks';
import cookiesParser from 'cookie-parser';
import userRoutes from './handlers/users';
import reportRoutes from './handlers/reports';
import reportStore from './models/reports';
const store = new reportStore();
export const app: express.Application = express();
const address: string = "0.0.0.0:3000";

 const responseTime = app.use(morgan(' :response-time ms'));

app.use(bodyParser.json());
app.use(cookiesParser());

app.get('/', function (req: express.Request , res: express.Response) {
    res.send('Hello World'); 
    
});

setTimeout(function(){ 
app.get('/health', check);
}, 5000);
userRoutes(app);
reportRoutes(app);


app.listen(3000,  () => {
    console.log(`starting listening at ${address}`);
});
