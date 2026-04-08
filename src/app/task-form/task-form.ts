import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../services/task';
import { Task } from '../models/task';

@Component({
selector: 'app-task-form',
standalone: true,
imports: [FormsModule],
templateUrl: './task-form.html',
styleUrls: ['./task-form.css']
})
export class TaskForm {

private taskService = inject(TaskService);

title = '';
description = '';
status: 'TODO' | 'DOING' | 'DONE' = 'TODO';

create(){

const task: Task = {
id: Date.now(),
title: this.title,
description: this.description,
status: this.status
};

this.taskService.addTask(task);

}

}