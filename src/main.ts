import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as cookieParser from 'cookie-parser'
// import { Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');
  
  app.use(cookieParser());

  // app.use("*", (req: Request, res: Response) => {
  //   // logger.info("(Invalid Route) => Error in route");
  //   res.status(404).render("404", { user: res.locals.user || null });
  // });

  await app.listen(3150);
}
bootstrap();
