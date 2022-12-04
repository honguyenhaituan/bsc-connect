import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { AppModule } from './app.module';

function setupSwagger(app: any) {
  // swagger
  const config = new DocumentBuilder()
    .setTitle('BSC connect Restful API')
    .setVersion('1.0')
    .setExternalDoc('Postman Collection', '/swagger-json')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
      cacheControl: false,
      docExpansion: 'none',
      etag: false,
    },
    customSiteTitle: 'BSC connect Restful API',
  };
  SwaggerModule.setup('swagger', app, document, customOptions);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupSwagger(app);

  await app.listen(5678);
}
bootstrap();
