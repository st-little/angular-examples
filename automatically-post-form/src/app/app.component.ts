import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AppService, User } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private form: User = { name: '' };
  formGroup = this.formBuilder.group(this.form);

  constructor(
    private formBuilder: FormBuilder,
    private appService: AppService
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  onSubmit(): void {
    this.appService
      .postUser({
        name: this.formGroup.value.name || '',
      })
      .subscribe((status) => {
        console.log('post result:', status);
      });
  }
}
