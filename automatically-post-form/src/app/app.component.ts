import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AppService, PostUserQueue, User } from './app.service';

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
    this.appService.postUserQueue$.subscribe((result) =>
      console.log('Queue result: ', result)
    );

    this.enableAutoSave();
  }

  ngOnDestroy(): void {
    this.disableAutoSave();
  }

  onSubmit(): void {
    this.formGroup.markAsPristine();
    this.formGroup.markAsUntouched();

    const queue: PostUserQueue = {
      user: {
        name: this.formGroup.value.name || '',
      },
      isAutoSave: false,
    };
    this.appService.addToPostUserQueue(queue);
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
        const queue: PostUserQueue = {
          user: {
            name: this.formGroup.value.name || '',
          },
          isAutoSave: true,
        };
        this.appService.addToPostUserQueue(queue);
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
