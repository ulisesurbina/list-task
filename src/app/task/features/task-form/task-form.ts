import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  input,
  effect,
} from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskCreate, TaskService } from '../../services/task';
import { toast } from 'ngx-sonner';
import { Router } from '@angular/router';
import {
  formatDate,
  combineDateTimeAndFormat,
} from '../../utils/date-formatter';

@Component({
  selector: 'app-task-form',
  providers: [provideNativeDateAdapter(), TaskService],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task-form.html',
  styleUrl: './task-form.css',
})
export class TaskForm {
  private _formBuilder = inject(FormBuilder);
  private _taskService = inject(TaskService);
  private _router = inject(Router);

  loading = signal(false);
  idTask = input.required<string>();

  form = this._formBuilder.group({
    id: this._formBuilder.control(''),
    areaInput: this._formBuilder.control('', Validators.required),
    taskInput: this._formBuilder.control('', Validators.required),
    initialDateInput: this._formBuilder.control(
      new Date(),
      Validators.required
    ),
    finalDateInput: this._formBuilder.control<Date | null>(
      null,
      Validators.required
    ),
    timeInput: this._formBuilder.control('12:00', Validators.required),
    completedInput: this._formBuilder.control(false, Validators.required),
  });

  constructor() {
    effect(() => {
      // console.log('ID Task:', this.idTask());
      const id = this.idTask();
      if (id && id !== '') {
        this.getTask(id);
      }
    });
  }

  async getTask(id: string) {
    try {
      this.loading.set(true);
      const taskReferenceId = await this._taskService.getTask(id);

      if (!taskReferenceId.exists()) {
        toast.error('Tarea no encontrada');
        this._router.navigateByUrl('/tasks');
        return;
      }

      const taskInfo = taskReferenceId.data() as TaskCreate;

      // Parsear las fechas correctamente
      let initialDate: Date;
      let finalDate: Date;
      let timeValue: string;

      // Manejar initialDate (puede venir en formato DD/MM/YYYY HH:MM)
      if (taskInfo.initialDate.includes('/')) {
        // Formato DD/MM/YYYY HH:MM - convertir a formato que Date pueda entender
        const [datePart, timePart] = taskInfo.initialDate.split(' ');
        const [day, month, year] = datePart.split('/');
        const [hours, minutes] = timePart ? timePart.split(':') : ['00', '00'];
        initialDate = new Date(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day),
          parseInt(hours),
          parseInt(minutes)
        );
      } else {
        initialDate = new Date(taskInfo.initialDate);
      }

      // Manejar finalDateTime
      if (taskInfo.finalDateTime.includes('/')) {
        // Formato DD/MM/YYYY HH:MM - convertir a formato que Date pueda entender
        const [datePart, timePart] = taskInfo.finalDateTime.split(' ');
        const [day, month, year] = datePart.split('/');
        const [hours, minutes] = timePart ? timePart.split(':') : ['12', '00'];
        finalDate = new Date(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day),
          parseInt(hours),
          parseInt(minutes)
        );
        timeValue = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
      } else {
        finalDate = new Date(taskInfo.finalDateTime);
        timeValue = finalDate.toISOString().slice(11, 16);
      }

      this.form.patchValue({
        areaInput: taskInfo.area,
        taskInput: taskInfo.task,
        initialDateInput: initialDate,
        finalDateInput: finalDate,
        timeInput: timeValue,
        completedInput: taskInfo.completed,
      });
    } catch (error) {
      console.error('Error loading task:', error);
      toast.error('Error al cargar la tarea');
    } finally {
      this.loading.set(false);
    }
  }

  async submit() {
    if (this.form.invalid) return;
    try {
      this.loading.set(true);
      const v = this.form.value;
      const date = v.finalDateInput;
      const time = v.timeInput;

      if (!date || !time) {
        toast.error('Fecha u hora no válida');
        return;
      }

      const task: TaskCreate = {
        area: v.areaInput!,
        task: v.taskInput!,
        initialDate: formatDate(
          v.initialDateInput instanceof Date
            ? v.initialDateInput
            : new Date(v.initialDateInput!)
        ),
        completed: v.completedInput ?? false,
        finalDateTime: combineDateTimeAndFormat(date, time),
      };

      const id = this.idTask();
      if (id) {
        await this._taskService.update(task, id);
      } else {
        await this._taskService.create(task);
      }

      // Si quieres guardar el ID dentro del doc:
      // await this._taskService.setId(docRef.id);  // implementa setId en el servicio

      toast.success(`Tarea ${id ? 'actualizada' : 'creada'} correctamente`);
      this.form.reset();
      this._router.navigateByUrl('/tasks');
    } catch (err) {
      // console.error('Error al crear tarea:', err);
      toast.error('Error al crear tarea, intenta nuevamente');
    } finally {
      this.loading.set(false);
    }
  }

  formatDateForDisplay(date: Date | string | null): string {
    if (!date) return '';
    const dateObj = date instanceof Date ? date : new Date(date);
    return formatDate(dateObj);
  }
}
