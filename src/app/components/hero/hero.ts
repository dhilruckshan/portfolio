import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  templateUrl: './hero.html',
  styleUrls: ['./hero.css']
})
export class HeroComponent implements OnInit, OnDestroy {
  typingText = '';
  private words = ["Websites", "Applications", "Experiences", "Solutions"];
  private wordIndex = 0;
  private charIndex = 0;
  private isDeleting = false;
  private typeSpeed = 100;
  private timeoutId: any;

  ngOnInit() {
    this.type();
  }

  ngOnDestroy() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  private type() {
    const currentWord = this.words[this.wordIndex];

    if (this.isDeleting) {
      this.typingText = currentWord.substring(0, this.charIndex - 1);
      this.charIndex--;
      this.typeSpeed = 50;
    } else {
      this.typingText = currentWord.substring(0, this.charIndex + 1);
      this.charIndex++;
      this.typeSpeed = 150;
    }

    if (!this.isDeleting && this.charIndex === currentWord.length) {
      this.isDeleting = true;
      this.typeSpeed = 2000;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.wordIndex = (this.wordIndex + 1) % this.words.length;
      this.typeSpeed = 500;
    }

    this.timeoutId = setTimeout(() => this.type(), this.typeSpeed);
  }
}
