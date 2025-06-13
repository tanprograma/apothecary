import { DOCUMENT } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'dropdown-links',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dropdown-links.component.html',
  styleUrl: './dropdown-links.component.scss',
})
export class DropdownLinksComponent {
  document = inject(DOCUMENT);
  @Input() links!: { name: string; url: string }[];
  @Input() title!: string;
  @Input() open?: boolean;
}
