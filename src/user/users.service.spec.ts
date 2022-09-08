import { UserModel } from './models/users.model';
import * as dbHandler from '../test/db';
import { UserService } from './users.service'

beforeAll(async () => {
    await dbHandler.connect()
});

afterEach(async () => {
    await dbHandler.clearDatabase()
});

afterAll(async () => {
    await dbHandler.closeDatabase()
});

describe('user test', () => {
    it('can be created correctly', async () => {
        // expect that two assertios will be made
        // expect.assertions(2)
        // create new post model instance
        const user = {
            displayName: 'abc',
            email: '',
            phoneNumber: '0349234123',
            password: 'hashedPassword',
            profilePicUrl: '',
        }

        const userSerivce = new UserService();
        
        // save test post to in-memory db
        await userSerivce.insertUser(user);

        // find inserted post by title
        const userInDb = await UserModel.findOne({phoneNumber: '0349234123'}).exec()
        // check that phoneNumber is expected
        expect(userInDb?.phoneNumber).toEqual('0349234123')
        // check that password is expected
        expect(userInDb?.password).toEqual('hashedPassword')
    });
});