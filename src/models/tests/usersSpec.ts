
import { User, userStore } from '../users';


const store = new userStore();

describe('Test users endpoint response', () => {

    it('should create new user', async () => {
        const user:User={
        id:1,
         name: "Mariam",
         email: "mariam@mailsac.com",
         password: "test1234"
        }
        const res= await store.create(user);
        expect(res.name).toBe("Mariam"); 
       
    });
    it('should update user', async () => {
        const editUser : User ={
            id: 1,
            name: "Saeed",
            email: "Saeed@mailsac.com",
            password: "test1234"
        }
       
        const res=await store.edit(editUser);
        expect(res.email).toBe("Saeed@mailsac.com"); 
        
    });
    it('should get all users', async () => {
        const res = await store.index();
        expect(res?.length).toBe(1); 
    });

    it('should get 1 user', async () => {
        const res= await store.show(1);
        expect(res?.id).toEqual(1); 
    });

    it('should authenticate user', async () => {
        const email: string="mariam@mailsac.com";
        const password: string="test1234"
        
        const response = await store.authenticate(email,password);
        expect(response).toThrowError(); 
    });

    it('should throw an error to delete a user not found', async () => {
        const response = await store.delete(3);
        expect(response).toThrowError(); 
    
    });
});  