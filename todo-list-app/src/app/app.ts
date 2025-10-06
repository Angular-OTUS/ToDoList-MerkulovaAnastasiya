import { Component, signal } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
import { TodoList } from './components/todo-list/todo-list';
import { ToastContainer } from "./components/toast-container/toast-container";

@Component({
  selector: 'app-root',
  imports: [TodoList, ToastContainer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('todo-list-app');
}
