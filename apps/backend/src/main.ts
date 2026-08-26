import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Разрешаем CORS-запросы от React фронтенда
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 NestJS Backend running on: http://localhost:${port}`);
}
bootstrap();
