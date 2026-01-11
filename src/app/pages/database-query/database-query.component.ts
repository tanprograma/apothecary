import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'database-query',
  imports: [RouterLink, RouterOutlet, RouterLinkActive],
  templateUrl: './database-query.component.html',
  styleUrl: './database-query.component.scss',
})
export class DatabaseQueryComponent {}
