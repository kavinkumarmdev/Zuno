import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalHttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('ZunoBootstrap');
  const app = await NestFactory.create(AppModule);

  // Enable flexible, production-ready CORS for cloud deployments (Cloudflare Pages, Render, localhost)
  const allowedOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',').map((o) => o.trim())
    : [];

  app.enableCors({
    origin: (origin, callback) => {
      // Allow server-to-server, curl, mobile, or missing origin
      if (!origin) return callback(null, true);

      if (
        process.env.CORS_ALLOW_ALL === 'true' ||
        allowedOrigins.includes('*') ||
        allowedOrigins.includes(origin) ||
        origin.endsWith('.pages.dev') ||
        origin.endsWith('.vercel.app') ||
        origin.endsWith('.onrender.com') ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1')
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
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

  // Global exception filter to sanitize database & Prisma errors
  app.useGlobalFilters(new GlobalHttpExceptionFilter());

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

  // Direct root endpoints matching user specification
  const express = require('express');
  const server = app.getHttpAdapter().getInstance();
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  server.post('/send-email', async (req: any, res: any) => {
    try {
      const { to, email, subject, message, html, text } = req.body || {};
      const targetTo = (to || email || '').trim();
      const targetSubject = (subject || '').trim();
      const targetMessage = (message || html || text || '').trim();

      if (!targetTo || !targetSubject || !targetMessage) {
        return res.status(400).json({
          success: false,
          message: 'All fields are required',
        });
      }

      const { MailService } = await import('./mail/mail.service');
      const mailService = app.get(MailService);
      const result = await mailService.sendEmail(targetTo, targetSubject, targetMessage);
      return res.json(result);
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Email sending failed',
      });
    }
  });

  server.post('/send-otp', async (req: any, res: any) => {
    try {
      const { email, to, purpose } = req.body || {};
      const target = (email || to || '').trim();
      if (!target) {
        return res.status(400).json({
          success: false,
          message: 'Recipient email address is required',
        });
      }
      const { AuthService } = await import('./auth/auth.service');
      const authService = app.get(AuthService);
      const result = await authService.sendGeneralOtp(target, purpose || 'Account Verification');
      return res.json(result);
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'OTP dispatch failed',
      });
    }
  });

  server.post('/verify-otp', async (req: any, res: any) => {
    try {
      const { email, to, otp } = req.body || {};
      const target = (email || to || '').trim();
      const cleanOtp = (otp || '').trim();
      if (!target || !cleanOtp) {
        return res.status(400).json({
          success: false,
          message: 'Email and OTP code are required',
        });
      }
      const { AuthService } = await import('./auth/auth.service');
      const authService = app.get(AuthService);
      const result = await authService.verifyGeneralOtp(target, cleanOtp);
      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || 'OTP verification failed',
      });
    }
  });

  const port = process.env.PORT || 4000;
  await app.listen(port, '0.0.0.0');
  logger.log(`🚀 Zuno ERP Backend API service running at: http://localhost:${port}/${apiPrefix.replace(/^\//, '')}`);
  logger.log(`📖 Swagger API documentation available at: http://localhost:${port}/api/docs`);
}

bootstrap();

