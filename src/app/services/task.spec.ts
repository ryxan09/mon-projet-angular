import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Task } from '../models/task';
import { TaskService } from './task';

describe('TaskService', () => {
  let service: TaskService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TaskService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('fetches tasks from the API', () => {
    const tasks: Task[] = [{ id: 1, title: 'Plan', description: '', status: 'TODO' }];

    service.getTasks().subscribe(result => expect(result).toEqual(tasks));
    httpTesting.expectOne('http://localhost:3000/tasks').flush(tasks);
  });

  it('creates, updates, and deletes tasks through the API', () => {
    const task: Task = { id: 5, title: 'Ship', description: 'Release', status: 'DOING' };

    service.addTask({ title: task.title, description: task.description, status: task.status }).subscribe();
    httpTesting.expectOne(request => request.method === 'POST' && request.url === 'http://localhost:3000/tasks')
      .flush(task);

    service.updateTask(task).subscribe();
    httpTesting.expectOne(request => request.method === 'PUT' && request.url === 'http://localhost:3000/tasks/5')
      .flush(task);

    service.deleteTask(task.id).subscribe();
    httpTesting.expectOne(request => request.method === 'DELETE' && request.url === 'http://localhost:3000/tasks/5')
      .flush(null);
  });
});
