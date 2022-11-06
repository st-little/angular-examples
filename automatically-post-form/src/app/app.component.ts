import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AppService, User } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly AUTO_SAVE_INTERVAL = 60000;
  private autoSave: NodeJS.Timer | null = null;
  private form: User = { name: '' };
  formGroup = this.formBuilder.group(this.form);

  constructor(
    private formBuilder: FormBuilder,
    private appService: AppService
  ) {}

  ngOnInit(): void {
    this.enableAutoSave();
  }

  ngOnDestroy(): void {
    this.disableAutoSave();
  }

  onSubmit(): void {
    this.formGroup.markAsPristine();
    this.formGroup.markAsUntouched();

    this.appService
      .postUser({
        name: this.formGroup.value.name || '',
      })
      .subscribe((status) => {
        console.log('post result:', status);
      });
  }

  private isEnabledAutoSave(): boolean {
    return this.autoSave !== null;
  }

  private enableAutoSave(): void {
    console.log('Enable auto save');
    if (this.autoSave !== null) {
      return;
    }

    this.autoSave = setInterval(() => {
      if (this.formGroup.touched && this.formGroup.dirty) {
        this.appService
          .postUser({
            name: this.formGroup.value.name || '',
          })
          .subscribe((status) => {
            console.log('post result:', status);
          });
      }
    }, this.AUTO_SAVE_INTERVAL);
  }

  private disableAutoSave(): void {
    console.log('Disable auto save');
    if (this.autoSave === null) {
      return;
    }

    clearInterval(this.autoSave);
    this.autoSave = null;
  }
}
