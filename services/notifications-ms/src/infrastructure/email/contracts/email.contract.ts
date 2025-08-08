import { ISendEmailInputDTO } from './dtos/send-email-input.dto';

export interface IEmailService {
  send(input: ISendEmailInputDTO): Promise<void>;
}
