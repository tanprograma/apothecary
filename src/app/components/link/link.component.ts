import { DOCUMENT } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'anchor',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './link.component.html',
  styleUrl: './link.component.scss',
})
export class LinkAnchorComponent {
  @Input() link!: { name: string; url: string };
  document = inject(DOCUMENT);
}
