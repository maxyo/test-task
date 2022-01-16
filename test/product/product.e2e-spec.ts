import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import * as request from 'supertest';
import {AppModule} from '../../src/app.module';
import {Connection} from "typeorm";
import {cleanAll, uuidRegex} from "../../lib/utils/spec.utils";


describe('ProductController (e2e)', () => {
  let app: INestApplication;
  let productId: string | null = null;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    const connection = app.get<Connection>(Connection);
    await cleanAll(connection, connection.entityMetadatas);

    await app.init();
  });

  it('/api/product (GET) is empty', () => {
    return request(app.getHttpServer())
      .get('/api/product')
      .expect(200)
      .expect([]);
  });
  it('/api/product (POST) create product', () => {
    return request(app.getHttpServer())
      .post('/api/product')
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
  it('/api/product (POST) edit product', () => {
    return request(app.getHttpServer())
      .put(`/api/product/${productId}`)
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
  it('/api/product (Delete) delete product', () => {
    return request(app.getHttpServer())
      .delete(`/api/product/${productId}`)
      .expect(200)
      .expect(
        resp => {
          expect(resp.body).toEqual({});
          productId = null;
        }
      );
  });
});
