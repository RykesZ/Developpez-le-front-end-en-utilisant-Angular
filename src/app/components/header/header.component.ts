import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  constructor(private router: Router, private route: ActivatedRoute) {}
  onHomePage!: Boolean;

  isHomePage(): boolean {
    return this.router.url !== '/';
  }

  onClick(): void {
    this.router.navigateByUrl('');
  }
}
