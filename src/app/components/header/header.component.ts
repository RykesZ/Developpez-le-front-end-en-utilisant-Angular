import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private breakpointObserver: BreakpointObserver
  ) {
    this.breakpointObserver
      .observe([
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XSmall,
        Breakpoints.HandsetPortrait,
        Breakpoints.HandsetLandscape,
      ])
      .subscribe((result) => {
        this.isSmallScreen =
          result.breakpoints[Breakpoints.Small] ||
          result.breakpoints[Breakpoints.XSmall] ||
          result.breakpoints[Breakpoints.HandsetPortrait] ||
          result.breakpoints[Breakpoints.HandsetLandscape];
        this.isMediumScreen = result.breakpoints[Breakpoints.Medium];
        this.isLargeScreen = result.breakpoints[Breakpoints.Large];
      });
  }
  onHomePage!: Boolean;
  isSmallScreen = false;
  isMediumScreen = false;
  isLargeScreen = false;

  isHomePage(): boolean {
    return this.router.url !== '/';
  }

  onClick(): void {
    this.router.navigateByUrl('');
  }
}
