import { NgOptimizedImage } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { User } from '@mega64/common';
import { PrimeNGConfig } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { UsersService } from './users/users.service';

/**
 * The AppComponent.
 *
 * @decorator `@Component`
 */
@Component({
  standalone: true,
  imports: [
    RouterModule,
    NgOptimizedImage,
    RippleModule,
    StyleClassModule,
    InputTextModule,
    BadgeModule,
  ],
  selector: 'ui-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  /**
   * The current user.
   */
  protected currentUser: User | undefined;

  /**
   * The constructor for the AppComponent.
   *
   * @param meta - The HTML meta object.
   * @param primengConfig - The PrimeNG config.
   * @param usersService - The UsersService.
   */
  public constructor(
    private meta: Meta,
    private primeNgConfig: PrimeNGConfig,
    private usersService: UsersService,
  ) {
    this.currentUser = usersService.getCurrentUser();
  }

  /**
   * Initialize the AppComponent.
   */
  public ngOnInit() {
    this.primeNgConfig.ripple = true;

    this.meta.addTag({
      name: 'description',
      content: 'Mega64 video & audio archives, and more!',
    });

    this.meta.addTag({
      name: 'keywords',
      content: 'Mega64 , archives, video, audio',
    });

    this.meta.addTag({
      name: 'author',
      content: 'MHarmony',
    });
  }

  /**
   * Sign out the current user.
   */
  public signOut() {
    this.usersService.signOut();
    this.currentUser = undefined;
  }
}
