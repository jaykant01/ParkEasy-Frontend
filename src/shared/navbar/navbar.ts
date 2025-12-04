import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgIf} from '@angular/common';
import {NavigationEnd, Router, RouterLink, RouterLinkActive} from '@angular/router';
import {filter, Subscription} from 'rxjs';
import {MatIcon} from '@angular/material/icon';
import {Auth} from '../../services/auth';
import {Profile} from '../../components/profile/profile';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-navbar',
  imports: [
    NgIf,
    RouterLink,
    RouterLinkActive,
    MatIcon
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit, OnDestroy {

  isMenuOpen = false;
  isLoggedIn = false;

  private routerSub!: Subscription;

  constructor(
    private router: Router,
    private auth: Auth,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.checkLoginStatus();

    this.routerSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkLoginStatus();

        // Auto redirect logged-in user
        if (this.isLoggedIn && this.router.url === "/login") {
          this.router.navigate(["/home"]);
        }

        this.isMenuOpen = false;
      });
  }

  ngOnDestroy(): void {
    if (this.routerSub) this.routerSub.unsubscribe();
  }

  checkLoginStatus() {
    this.isLoggedIn = this.auth.isLoggedIn();
  }

  logout() {
    this.auth.logout();
  }

  openProfilePopup() {
    const user = this.auth.getUserDetails();

    this.dialog.open(Profile, {
      width: "360px",
      panelClass: "profile-popup-panel",
      data: user
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

}
