import { Component, inject, input } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { TaskService } from '../../services/task';

@Component({
  selector: 'app-task-list',
  imports: [MatTableModule, RouterLink],
  templateUrl: './task-list.html',
  styleUrl: `./task-list.css`,
  providers: [TaskService]
})
export class TaskList {
  tasks = inject(TaskService).getTasks;
  tasksLoading = inject(TaskService).loading;
  tasksResponse = input.required<TaskService[]>();
}
