import { Module } from '@nestjs/common';

import { QueueBindingService } from './services/queue-binding.service';

@Module({
  providers: [QueueBindingService],
})
export class QueuesModule {}
