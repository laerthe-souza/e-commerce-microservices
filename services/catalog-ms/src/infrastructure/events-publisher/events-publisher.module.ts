import { Global, Module } from '@nestjs/common';

import { EventsPublisherService } from './services/events-publisher.service';

@Global()
@Module({
  providers: [EventsPublisherService],
  exports: [EventsPublisherService],
})
export class EventsPublisherModule {}
