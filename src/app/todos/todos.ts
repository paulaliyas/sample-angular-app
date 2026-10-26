import { Component, computed, signal } from '@angular/core';

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

@Component({
  selector: 'app-todos',
  template: `
    <h2>Todos</h2>
    <form (submit)="add(input.value); input.value = ''; $event.preventDefault()">
      <input #input placeholder="What needs doing?" />
      <button type="submit">Add</button>
    </form>
    <ul>
      @for (todo of todos(); track todo.id) {
        <li [class.done]="todo.done">
          <label>
            <input type="checkbox" [checked]="todo.done" (change)="toggle(todo.id)" />
            {{ todo.text }}
          </label>
          <button (click)="remove(todo.id)" aria-label="Delete">✕</button>
        </li>
      } @empty {
        <li>Nothing to do 🎉</li>
      }
    </ul>
    <p>{{ remaining() }} of {{ todos().length }} remaining</p>
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
  protected readonly todos = signal<Todo[]>([
    { id: 1, text: 'Learn Angular', done: true },
    { id: 2, text: 'Build something', done: false },
  ]);
  protected readonly remaining = computed(() => this.todos().filter((t) => !t.done).length);

  add(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    this.todos.update((list) => [...list, { id: this.nextId++, text: trimmed, done: false }]);
  }

  toggle(id: number) {
    this.todos.update((list) => list.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  remove(id: number) {
    this.todos.update((list) => list.filter((t) => t.id !== id));
  }
}
