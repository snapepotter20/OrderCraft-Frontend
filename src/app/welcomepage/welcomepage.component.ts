import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-welcomepage',
  standalone: true,
  imports: [],
  templateUrl: './welcomepage.component.html',
  styleUrls: ['./welcomepage.component.css']
})
export class WelcomepageComponent {
  username: string = '';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const auth = localStorage.getItem('auth');
      if (auth) {
        const headers = new HttpHeaders({
          Authorization: 'Basic ' + auth
        });

        this.http.get('http://localhost:8090/username', {
          headers,
          responseType: 'text'
        }).subscribe({
          next: (data) => this.username = data,
          error: (err) => console.error('Failed to fetch username:', err)
        });
      }
    }
  }
}
