import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist:true,
    forbidNonWhitelisted:true,
    transform:true,
    transformOptions:{enableImplicitConversion:true}
  }));

  const config = new DocumentBuilder()
  .setTitle('My Api')
  .setDescription('description')
  .setVersion('1.0')
  .addTag('users')
  .addBearerAuth()
  .build();

  const Document = SwaggerModule.createDocument(app,config);
  SwaggerModule.setup('api',app, Document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
