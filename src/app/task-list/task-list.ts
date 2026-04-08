import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../models/task';
import { TaskService } from '../services/task';
import { FormsModule } from '@angular/forms';

@Component({
selector: 'app-task-list',
standalone: true,
imports: [CommonModule,FormsModule],
templateUrl: './task-list.html',
styleUrls: ['./task-list.css']
})
export class TaskList {

private taskService = inject(TaskService);

tasks: Task[] = [];
editingTask: Task | null = null;

ngOnInit(){
this.tasks = this.taskService.getTasks();
}

delete(id:number){
this.taskService.deleteTask(id);
this.tasks = this.taskService.getTasks();
}

edit(task:Task){
this.editingTask = {...task};
}

save(){
if(this.editingTask){
this.taskService.updateTask(this.editingTask);
this.tasks = this.taskService.getTasks();
this.editingTask = null;
}
}

cancel(){
this.editingTask = null;
}

}