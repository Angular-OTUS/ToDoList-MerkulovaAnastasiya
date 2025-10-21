import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastContainer } from "./components/toast-container/toast-container";
import { MatIcon } from '@angular/material/icon';
import { Nav } from "./components/nav/nav";

@Component({
  selector: 'app-root',
  imports: [ToastContainer, RouterOutlet, MatIcon, Nav],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
}
