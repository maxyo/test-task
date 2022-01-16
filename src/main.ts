import {NestFactory, Reflector} from '@nestjs/core';
import {AppModule} from './app.module';
import {ClassSerializerInterceptor, LogLevel, ValidationPipe} from "@nestjs/common";
import {DocumentBuilder, SwaggerDocumentOptions, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule,
    {
      logger: ['log', 'warn', 'error'].concat(process.env.ENVIRONMENT === 'dev' ? ['debug'] : []) as LogLevel[]
    });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  const config = new DocumentBuilder()
    .setTitle('Shop API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
}
bootstrap();
