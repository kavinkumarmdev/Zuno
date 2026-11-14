import { Controller, Post, Body, HttpCode, HttpStatus, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse as SwaggerApiResponse } from '@nestjs/swagger';
import { MailService } from './mail.service';
import { Public } from '../common/decorators/require-permission.decorator';

@ApiTags('Mail & Notifications')
@Controller()
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Public()
  @Post('send-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send email using Gmail SMTP transporter' })
  @SwaggerApiResponse({ status: 200, description: 'Email dispatched successfully' })
  async sendEmail(
    @Body()
    body: {
      to?: string;
      email?: string;
      subject?: string;
      message?: string;
      html?: string;
      text?: string;
    }
  ) {
    const to = (body.to || body.email || '').trim();
    const subject = (body.subject || '').trim();
    const message = (body.message || body.html || body.text || '').trim();

    if (!to || !subject || !message) {
      throw new BadRequestException({
        success: false,
        message: 'All fields are required (to/email, subject, message)',
      });
    }

    try {
      const result = await this.mailService.sendEmail(to, subject, message);
      return result;
    } catch (error: any) {
      throw new InternalServerErrorException({
        success: false,
        message: 'Email sending failed',
      });
    }
  }

  @Public()
  @Post('mail/send-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send email (alternative route)' })
  async sendEmailAlt(
    @Body()
    body: {
      to?: string;
      email?: string;
      subject?: string;
      message?: string;
      html?: string;
      text?: string;
    }
  ) {
    return this.sendEmail(body);
  }
}
