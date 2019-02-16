import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

const port = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // express middleware here
  // app.use(cookieParser());
  const corsCfg = {
    origin: [
      'http://localhost:3000', // react port
      'http://localhost:4200', // angular port
    ],
  };
  app.enableCors(corsCfg);

  await app.listen(port);
  Logger.log(`Server running on http://localhost:${port}`, 'Bootstrap');
}

bootstrap();
