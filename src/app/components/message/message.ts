import { Component, computed, input } from '@angular/core';
import { BaseMessage, HumanMessage } from '@langchain/core/messages';
import { MarkdownComponent, MARKED_OPTIONS, provideMarkdown } from 'ngx-markdown';
import { JsonViewerComponent } from '../json-viewer';

@Component({
  selector: 'app-message',
  imports: [JsonViewerComponent, MarkdownComponent],
  providers: [
    provideMarkdown({
      markedOptions: {
        provide: MARKED_OPTIONS,
        useValue: {
          breaks: true,
        },
      },
    }),
  ],
  template: `
    @let msg = message(); @let IsHuman = isHumanMessage();
    <div class="mb-4 flex" [class.justify-end]="IsHuman" [class.justify-start]="!IsHuman">
      <div
        class="max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl"
        [class.bg-blue-300]="IsHuman"
        [class.text-white]="IsHuman"
        [class.bg-white]="!IsHuman"
        [class.text-gray-800]="!IsHuman"
        [class.border]="!IsHuman"
        [class.border-gray-200]="!IsHuman"
      >
        <p class="text-sm mb-1 text-gray-500">{{ messageLabel() }}</p>
        <markdown>{{ msg.content }}</markdown>

        <app-json-viewer [args]="msg" />
      </div>
    </div>
  `,
})
export class MessageComponent {
  message = input.required<BaseMessage>();

  messageLabel = computed(() => {
    const type = this.message().type;
    switch (type) {
      case 'human':
        return '👤 Human';
      case 'ai':
        return '🤖 AI';
      case 'tool':
        return '🔧 Tool';
      case 'system':
        return '⚙️ System';
      default:
        return `❓ ${type}`;
    }
  });

  isHumanMessage(): boolean {
    return HumanMessage.isInstance(this.message());
  }
}
