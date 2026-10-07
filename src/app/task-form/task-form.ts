import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from '../services/task';

@Component({
selector: 'app-task-form',
standalone: true,
imports: [CommonModule, FormsModule],
templateUrl: './task-form.html',
styleUrls: ['./task-form.css']
})
export class TaskForm {

private taskService = inject(TaskService);
private router = inject(Router);
private changeDetector = inject(ChangeDetectorRef);

title = '';
description = '';
status: 'TODO' | 'DOING' | 'DONE' = 'TODO';
creating = false;
errorMessage = '';

create(){
if (this.creating || !this.title.trim()) {
return;
}

this.creating = true;
this.errorMessage = '';
this.taskService.addTask({
title: this.title,
description: this.description,
status: this.status
}).subscribe({
next: () => {
this.creating = false;
this.changeDetector.markForCheck();
void this.router.navigate(['/tasks']);
},
error: () => {
this.creating = false;
this.errorMessage = 'Could not create the task. Check the API connection and try again.';
this.changeDetector.markForCheck();
}
});
}

}