import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskLis } from './task-list';

describe('TaskLis', () => {
  let component: TaskLis;
  let fixture: ComponentFixture<TaskLis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskLis]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskLis);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
