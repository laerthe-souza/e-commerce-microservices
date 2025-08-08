import { Module } from '@nestjs/common';

import { QueueBindingService } from './services/queue-binding.service';
import { QueueConsumerService } from './services/queue-consumer.service';

@Module({
  providers: [QueueBindingService, QueueConsumerService],
})
export class QueuesModule {}
