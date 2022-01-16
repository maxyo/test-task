import {Test, TestingModule} from "@nestjs/testing";
import {AppModule} from "../src/app.module";
import {Connection} from "typeorm";
import {cleanAll, loadFixtures, uuidRegex} from "../lib/utils/spec.util";
import {INestApplication} from "@nestjs/common";
import * as request from "supertest";
import {AuthService} from "../src/user/service/auth.service";


const getTestToken = async (app: INestApplication) => {
  const service = app.get(AuthService)
  return await service.login('test@example.com', '123456');
}

describe('E2E', () => {
  let app: INestApplication;
  let testToken: string;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [],
    }).compile();

    app = moduleFixture.createNestApplication();
    const connection = app.get<Connection>(Connection);
    await cleanAll(connection, connection.entityMetadatas);
    await loadFixtures(connection, connection.entityMetadatas);

    testToken = (await getTestToken(app)).accessToken;

    await app.init();
  });

  describe('AuthController (e2e)', () => {
    it('/api/auth/login (POST) failed auth', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'not-reault-user@example.com',
          password: '123456'
        })
        .expect(400);
    });
    it('/api/auth/login (POST) wrong password auth', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongPassword'
        })
        .expect(400);
    });
    it('/api/auth/login (POST) successful login', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: '123456'
        })
        .expect(201)
        .expect(res => {
          expect(res.body.accessToken).not.toBeNull()
          expect(res.body.refreshToken).not.toBeNull()
        });
    });
  });

  describe('ProductController (e2e)', () => {
    let productId: string | null = null;

    it('/api/product (GET) is empty', () => {
      return request(app.getHttpServer())
        .get('/api/product')
        .expect(200)
        .expect({
          page: 1,
          pageCount: 1,
          total: 0,
          count: 0,
          data: []
        });
    });

    it('/api/product (POST) failed to create product without token', () => {
      return request(app.getHttpServer())
        .post('/api/product')
        .send({
          name: 'Test'
        })
        .expect(401)
    });

    it('/api/product (POST) create product', () => {
      return request(app.getHttpServer())
        .post('/api/product')
        .auth(testToken, {type: 'bearer'})
        .send({
          name: 'Test'
        })
        .expect(201)
        .expect(
          resp => {
            expect(resp.body.id).toMatch(uuidRegex);
            expect(resp.body.name).toMatch('Test');
            productId = resp.body.id;
          }
        );
    });
    it('/api/product/:id (PUT) failed to edit product without token', async () => {
      return request(app.getHttpServer())
        .put(`/api/product/${productId}`)
        .send({
          name: 'Test 2'
        })
        .expect(401)
    });
    it('/api/product (PUT) edit product', () => {
      return request(app.getHttpServer())
        .put(`/api/product/${productId}`)
        .auth(testToken, {type: 'bearer'})
        .send({
          name: 'Test 2'
        })
        .expect(200)
        .expect(
          resp => {
            expect(resp.body.id).toMatch(uuidRegex);
            expect(resp.body.name).toMatch('Test 2');
          }
        );
    });
    it(`/api/product/:id (GET) one product`, () => {
      return request(app.getHttpServer())
        .get(`/api/product/${productId}`)
        .expect(200)
        .expect(
          resp => {
            expect(resp.body).toEqual({
              id: productId,
              name: 'Test 2'
            });
          }
        );
    });
    it(`/api/product (GET) product list`, () => {
      return request(app.getHttpServer())
        .get('/api/product?limit=10&offset=0')
        .expect(200)
        .expect(
          resp => {
            expect(resp.body).toEqual({
              page: 1,
              pageCount: 1,
              total: 1,
              count: 1,
              data: [{
                id: productId,
                name: 'Test 2'
              }]
            });
          }
        );
    });
    it('/api/product (Delete) failed to delete product without token', () => {
      return request(app.getHttpServer())
        .delete(`/api/product/${productId}`)
        .expect(401)
    });
    it('/api/product (Delete) delete product', () => {
      return request(app.getHttpServer())
        .delete(`/api/product/${productId}`)
        .auth(testToken, {type: 'bearer'})
        .expect(200)
        .expect(
          resp => {
            expect(resp.body).toEqual({});
            productId = null;
          }
        );
    });
  });

})


