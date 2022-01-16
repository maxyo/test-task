import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import * as request from 'supertest';
import {AppModule} from '../../src/app.module';
import {Connection} from "typeorm";
import {cleanAll, loadFixtures} from "../../lib/utils/spec.util";


describe('ProductController (e2e)', () => {
  let app: INestApplication;
  const userId: string | null = null;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    const connection = app.get<Connection>(Connection);
    await cleanAll(connection, connection.entityMetadatas);
    await loadFixtures(connection);

    await app.init();
  });

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
