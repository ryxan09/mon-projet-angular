import { Injectable } from '@angular/core';
import { Task } from '../models/task';

@Injectable({
providedIn: 'root'
})
export class TaskService {

tasks: Task[] = [];

getTasks(){
return this.tasks;
}

addTask(task: Task){
this.tasks.push(task);
}

deleteTask(id:number){
this.tasks = this.tasks.filter(task => task.id !== id);
}

updateTask(updatedTask: Task){
const index = this.tasks.findIndex(t => t.id === updatedTask.id);
this.tasks[index] = updatedTask;
}

}