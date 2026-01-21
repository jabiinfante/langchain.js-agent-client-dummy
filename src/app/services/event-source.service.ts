import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';

/**
 * Server-Sent Events service
 */
@Injectable({
  providedIn: 'root',
})
export class EventSourceService {
  /**
   * Method for establishing connection and subscribing to events from SSE
   * @param url - SSE server api path
   * @param options - configuration object for SSE
   */
  connectToServerSentEvents<RetType>(
    urlFn: () => string,
    options: EventSourceInit = {},
  ): Observable<RetType> {
    return new Observable((subscriber: Subscriber<RetType>) => {
      const url = urlFn();

      const eventSource = new EventSource(url, options);

      eventSource.onerror = (error) => {
        console.error('SSE error:', error);
        eventSource.close();
        subscriber.error(error);
      };

      eventSource.onmessage = (event) => {
        try {
          subscriber.next(event.data as unknown as RetType);
        } catch (err) {
          console.error('Error parsing event data', err);
        }
      };

      //eventSource.onopen = () => { };

      return () => {
        eventSource?.close();
      };
    });
  }
}
