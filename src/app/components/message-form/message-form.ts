import { Component, output, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';

interface MessageFormData {
  message: string;
}

@Component({
  selector: 'app-message-form',
  imports: [FormField],
  template: `
    <div class="border-t border-gray-200 bg-white px-4 py-4">
      <div class="max-w-4xl w-full mx-auto">
        <form (submit)="sendMessage($event)" class="flex gap-2">
          <input
            type="text"
            [formField]="messageForm.message"
            (keypress)="onKeyPress($event)"
            placeholder="Escribe tu mensaje..."
            class="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            [disabled]="!messageForm.message().value().trim()"
            class="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  `
})
export class MessageFormComponent {
  messageSent = output<string>();

  protected readonly messageFormModel = signal<MessageFormData>({
    message: ''
  });

  protected readonly messageForm = form(this.messageFormModel);

  sendMessage(event?: Event) {
    event?.preventDefault();
    const text = this.messageForm.message().value().trim();
    if (!text) {
      return;
    }

    this.messageSent.emit(text);
    this.messageForm.message().value.set('');
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}
