import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
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
export class TaskList implements OnInit {

private taskService = inject(TaskService);
private changeDetector = inject(ChangeDetectorRef);

tasks: Task[] = [];
editingTask: Task | null = null;
loading = true;
saving = false;
deletingTaskId: number | null = null;
errorMessage = '';

ngOnInit(): void {
this.loadTasks();
}

loadTasks(): void {
this.loading = true;
this.errorMessage = '';
this.taskService.getTasks().subscribe({
next: tasks => {
this.tasks = tasks;
this.loading = false;
this.changeDetector.markForCheck();
},
error: () => {
this.loading = false;
this.errorMessage = 'Could not load tasks. Check the API connection and try again.';
this.changeDetector.markForCheck();
}
});
}

delete(id:number){
this.errorMessage = '';
this.deletingTaskId = id;
this.taskService.deleteTask(id).subscribe({
next: () => {
this.tasks = this.tasks.filter(task => task.id !== id);
this.deletingTaskId = null;
this.changeDetector.markForCheck();
},
error: () => {
this.deletingTaskId = null;
this.errorMessage = 'Could not delete the task. Please try again.';
this.changeDetector.markForCheck();
}
});
}

edit(task:Task){
this.editingTask = {...task};
}

save(){
if (!this.editingTask || this.saving) {
return;
}

this.saving = true;
this.errorMessage = '';
this.taskService.updateTask(this.editingTask).subscribe({
next: updatedTask => {
this.tasks = this.tasks.map(task => task.id === updatedTask.id ? updatedTask : task);
this.editingTask = null;
this.saving = false;
this.changeDetector.markForCheck();
},
error: () => {
this.saving = false;
this.errorMessage = 'Could not save the task. Please try again.';
this.changeDetector.markForCheck();
}
});
}

cancel(){
this.editingTask = null;
}

}