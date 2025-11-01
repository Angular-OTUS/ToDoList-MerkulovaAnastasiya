import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from "./components/sidebar/sidebar";
import { ToastContainer } from "./components/toast-container/toast-container";

@Component({
  selector: 'app-root',
  imports: [ToastContainer, RouterOutlet, Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
}
