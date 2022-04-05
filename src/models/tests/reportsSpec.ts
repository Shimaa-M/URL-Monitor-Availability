
import { Report, reportStore } from '../reports';


const store = new reportStore();

describe('Test products endpoint response', () => {
       
    const report: Report= {
        id: 1,
        status: 200,
       availability: 90,
       outages:2,
       uptime : 348.8165842,
       responseTime : 15.230,
       user_id: 1
      }
    it('should create new report', async () => {
       
        const res= await store.create(report);
        expect(res.status).toBe(200); 
    });
    it('should update report', async () => {
        const editReport : Report ={
            id: 1,
        status: 200,
       availability: 90,
       outages:5,
       uptime : 348.8165842,
       responseTime : 15.230,
       user_id: 1
        }
       
        const res=await store.edit(editReport);
        expect(res.outages).toEqual(5); 
        
    });
    it('should get all reports', async () => {
      
        const res = await store.index();
        expect(res?.length).toBe(1); 
 
    });
    
    
    it('should delete the report', async () => {
        const response = await store.delete(2);
        expect(response).toThrowError(); 

    });

    });
    