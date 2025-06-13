import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { DOCUMENT } from '@angular/common';
@Injectable({
  providedIn: 'root',
})
export class OriginService {
  document = inject(DOCUMENT);
  origin = !!environment.origin
    ? environment.origin
    : this.document.location.origin;
  constructor() {}
}
