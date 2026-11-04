import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('ZunoBootstrap');
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend web application
  app.enableCors({
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:5173',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-razorpay-signature'],
  });

  // Global API routing prefix
  const apiPrefix = process.env.API_PREFIX || '/api/v1';
  app.setGlobalPrefix(apiPrefix.replace(/^\//, ''));

  // Global input validation and sanitization
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
      transformOptions: { enableImplicitConversion: true },
    })
  );

  // OpenAPI / Swagger Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('ZUNO ERP — Enterprise REST API')
    .setDescription(
      'Complete modular enterprise SaaS ERP backend APIs. Supports 243 approved database catalogue tables, dual-database architecture (Neon Operational + Supabase Historical), multi-tenant isolation, RBAC/PBAC, and subscription management.'
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter your JWT access token',
        in: 'header',
      },
      'bearer'
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Zuno ERP — API Specifications',
    customCss: '.swagger-ui .topbar { background-color: #0F172A; }',
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);
  logger.log(`🚀 Zuno ERP Backend API service running at: http://localhost:${port}/${apiPrefix.replace(/^\//, '')}`);
  logger.log(`📖 Swagger API documentation available at: http://localhost:${port}/api/docs`);
}

bootstrap();

