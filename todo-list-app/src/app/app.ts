import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastContainer } from "./components/toast-container/toast-container";

@Component({
  selector: 'app-root',
  imports: [ToastContainer, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('todo-list-app');
}
