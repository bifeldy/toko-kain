import { Injectable, isDevMode, Inject, PLATFORM_ID } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  readonly allKeyboardKeysRegex = /^[a-zA-Z0-9~`!@#\$%\^&\*\(\)_\-\+={\[\}\]\|\\:;"'<,>\.\?\/  \n]*$/;

  public isBrowser = null;

  public gridListBreakpoint = 1;
  public isDesktop = true;

  constructor(
    @Inject(PLATFORM_ID) platformId: string
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.onResize('First Run Checking Window Size');
    }
  }

  log(message: string, data: any = null, type: string = 'log'): void {
    if (isDevMode()) {
      if (type === 'log') {
        if (data) {
          console.log(message, data);
        } else {
          console.log(message);
        }
      } else if (type === 'error') {
        console.error(message, data);
      }
    }
  }

  getDirtyValues(formGroup: FormGroup): any {
    const dirtyValues = {};
    for (const control of Object.keys(formGroup.controls)) {
      const currentControl = formGroup.get(control);
      if (currentControl.dirty) {
        dirtyValues[control] = currentControl.value;
      }
    }
    return dirtyValues;
  }

  get randomColor(): any {
    // tslint:disable-next-line: no-bitwise
    return (Math.random() * 0xFFFFFF << 0).toString(16);
  }

  onResize(event): void {
    this.log('[ReSize]', event);
    if (window.innerWidth >= 1200) {
      this.isDesktop = true;
      this.gridListBreakpoint = 3;
    } else if (window.innerWidth >= 992) {
      this.isDesktop = true;
      this.gridListBreakpoint = 2;
    } else {
      this.isDesktop = false;
      this.gridListBreakpoint = 1;
    }
  }

  htmlToText(htmlString: string): string {
    return htmlString.replace(/<[^>]*>/g, ' ').trim();
  }

  shuffle(array): any {
    let currentIndex = array.length;
    let temporaryValue = 0;
    let randomIndex = 0;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

}
