import { Inject } from '@nestjs/common';
import Stripe from 'stripe';

import { LoggingService } from '@infrastructure/config/logging/logging.service';
import { EventsPublisherService } from '@infrastructure/events-publisher/services/events-publisher.service';
import { EVENTS } from '@shared/constants/events.constant';

export class ReceiveEventsUseCase {
  private logger = new LoggingService(ReceiveEventsUseCase.name);

  constructor(
    @Inject(EventsPublisherService)
    private readonly eventPublisher: EventsPublisherService,
  ) {}

  async execute(event: Stripe.Event): Promise<void> {
    if (event.type === 'payment_intent.succeeded') {
      await this.eventPublisher.emit(EVENTS.PAYMENT_SUCCESS.name, {
        ...event.data.object.metadata,
        transactionId: event.data.object.id,
      });
    }
  }
}
