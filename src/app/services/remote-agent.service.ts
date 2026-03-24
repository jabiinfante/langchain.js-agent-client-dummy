import { inject, Injectable, signal, Signal } from '@angular/core';
import { load } from '@langchain/core/load';
import { BaseMessage } from '@langchain/core/messages';
import { retry, Subscription, tap } from 'rxjs';
import { EventSourceService } from './event-source.service';

@Injectable({
  providedIn: 'root',
})
export class RemoteAgentService {
  private url!: string;
  private eventSource = inject(EventSourceService);
  private currentSubscription: Subscription | null = null;
  private currentUuid: string | null = null;

  private readonly _messages = signal<BaseMessage[]>([]);
  readonly messages: Signal<BaseMessage[]> = this._messages.asReadonly();

  registerURL(url: string) {
    this.url = url;
    return this;
  }

  async sendMessage(message: string, uuid: string): Promise<void> {
    const url = this.url + 'message' + (uuid ? '?uuid=' + uuid : '');
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
  }

  clearMessages() {
    this._messages.set([]);
  }

  disconnect() {
    if (this.currentSubscription) {
      this.currentSubscription.unsubscribe();
      this.currentSubscription = null;
      this.currentUuid = null;
    }
  }

  /**
   * TODO: fix disconnected... probably not right!
   * @param uuid
   * @returns 
   */

  getMessages(uuid: string): Signal<BaseMessage[]> {
    if (!this.url) {
      throw new Error('URL not registered');
    }

    // Si ya estamos conectados al mismo uuid, retornar los mensajes existentes
    if (this.currentUuid === uuid && this.currentSubscription) {
      return this.messages;
    }

    // Cerrar conexión anterior si existe
    this.disconnect();

    this.currentUuid = uuid;
    const url = this.url + 'stream' + (uuid ? '?uuid=' + uuid : '');

    this.currentSubscription = this.eventSource
      .connectToServerSentEvents<string>(() => url)
      .pipe(
        tap({
          error: (err) => {
            console.error('Stream error:', err);
          },
        }),
        retry({ count: Infinity, delay: 1000 }),
      )
      .subscribe({
        next: (message) => {
          load<BaseMessage>(message as string).then((m) => {
            this._messages.update((msgs) => [...msgs, m]);
          });
        },
        error: (err) => {
          console.error('Stream error:', err);
        },
      });

    return this.messages;
  }
}
