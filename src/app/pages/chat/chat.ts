import { Component, ElementRef, computed, effect, inject, input, viewChild } from '@angular/core';
import { MessageFormComponent } from '../../components/message-form/message-form';
import { MessageComponent } from '../../components/message/message';
import { RemoteAgentService } from '../../services/remote-agent.service';

@Component({
  selector: 'app-chat',
  imports: [MessageComponent, MessageFormComponent],
  host: { class: 'flex-1 flex flex-col min-h-0' },
  template: `
    <!-- Messages Area -->
    <main
      #messagesContainer
      class="flex-1 min-h-0 overflow-y-auto px-4 py-6 max-w-4xl w-full mx-auto scroll-smooth"
    >
      @if (messages().length === 0) {
        <div class="text-center text-gray-400 mt-20">
          <p class="text-lg">¡Hola! Escribe un mensaje para comenzar</p>
        </div>
      }
      @for (message of messages(); track $index) {
        <app-message [message]="message" />
      }
    </main>

    <!-- Input Area -->
    <app-message-form (messageSent)="onMessageSent($event)" />
  `,
})
export default class ChatComponent {
  url = input<string>('http://localhost:3000/');
  uuid = input<string>('');

  private readonly messagesContainer = viewChild<ElementRef<HTMLElement>>('messagesContainer');


  // TODO: fix using linked signals probably
  private remoteAgent = inject(RemoteAgentService).registerURL(this.url());

  public readonly messages = computed(() => {
    const uuid = this.uuid();
    return this.remoteAgent.getMessages(uuid)();
  });

  constructor() {
    effect(() => {
      const length = this.messages().length;
      if (length > 0) {
        setTimeout(() => this.scrollToBottom());
      }
    });
  }

  private scrollToBottom() {
    const container = this.messagesContainer()?.nativeElement;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
    }
  }

  onMessageSent(text: string) {
    this.remoteAgent.sendMessage(text, this.uuid());
  }
}
