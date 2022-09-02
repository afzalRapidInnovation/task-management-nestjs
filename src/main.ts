import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './transform.interceptor';

console.log(process.env.NODE);
async function bootstrap() {
  // console.log("check on main.ts 6th line ");
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  const port = 3000;
  await app.listen(port, () => {
    // console.log(`Server running on port : 3000`);
  });
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
