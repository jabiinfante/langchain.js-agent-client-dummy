import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <div class="h-screen flex flex-col bg-gray-50 overflow-hidden">

    
      <!-- Header -->
      <header class="bg-white border-b border-gray-200 px-4 py-3">
        <h1 class="text-xl font-semibold text-gray-800 text-center">👾 Chat Agent 👾</h1>
      </header>

      <!-- Content -->
      <router-outlet />
    </div>
  `
})
export class App {}
