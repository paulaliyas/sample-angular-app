import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

@Component({
  selector: 'app-todos',
  imports: [CommonModule],
  template: `
    <h2>Todos</h2>
    <form (submit)="add(input.value); input.value = ''; $event.preventDefault()">
      <input #input placeholder="What needs doing?" />
      <button type="submit">Add</button>
    </form>
    <ul>
      <li *ngFor="let todo of todos" [class.done]="todo.done">
        <label>
          <input type="checkbox" [checked]="todo.done" (change)="toggle(todo)" />
          {{ todo.text }}
        </label>
        <button (click)="remove(todo)" aria-label="Delete">✕</button>
      </li>
      <li *ngIf="todos.length === 0">Nothing to do 🎉</li>
    </ul>
    <p>{{ remaining }} of {{ todos.length }} remaining</p>
  `,
  styles: `
    :host { display: block; max-width: 640px; margin: 0 auto; }
    form { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
    input:not([type]) { flex: 1; padding: 0.5rem; }
    ul { list-style: none; padding: 0; }
    li { display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #eee; }
    li.done label { text-decoration: line-through; color: #999; }
  `,
})
export class Todos {
  private nextId = 3;

  todos: Todo[] = [
    { id: 1, text: 'Learn Angular', done: true },
    { id: 2, text: 'Build something', done: false },
  ];

  get remaining(): number {
    return this.todos.filter((t) => !t.done).length;
  }

  add(text: string): void {
    const trimmed = text.trim();
    if (trimmed) {
      this.todos.push({ id: this.nextId++, text: trimmed, done: false });
    }
  }

  toggle(todo: Todo): void {
    todo.done = !todo.done;
  }

  remove(todo: Todo): void {
    this.todos = this.todos.filter((t) => t !== todo);
  }
}
