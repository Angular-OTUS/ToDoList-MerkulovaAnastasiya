import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Nav } from './nav/nav';
import { TodoForm } from './todo-form/todo-form';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-sidebar',
  imports: [Nav, TodoForm, MatIcon, TranslocoModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {}
