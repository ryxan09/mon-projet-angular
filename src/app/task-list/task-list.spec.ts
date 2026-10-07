import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Task } from '../models/task';
import { TaskList } from './task-list';
import { TaskService } from '../services/task';

describe('TaskList', () => {
  let component: TaskList;
  let fixture: ComponentFixture<TaskList>;
  const tasks: Task[] = [
    { id: 1, title: 'First task', description: 'Loaded from API', status: 'TODO' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskList],
      providers: [
        {
          provide: TaskService,
          useValue: {
            getTasks: () => of(tasks),
            deleteTask: () => of(undefined),
            updateTask: (task: unknown) => of(task),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads tasks on the initial page visit', () => {
    expect(component.loading).toBe(false);
    expect(component.tasks).toEqual(tasks);
  });
});
