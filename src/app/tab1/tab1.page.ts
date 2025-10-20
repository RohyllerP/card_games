import { Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { PalabrasService } from '../core/services/palavras-service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {
  lang: string | null = null;
  palabras: any[] = [];
  palabrasMitad: any[] = [];
  palabrasCopy: any[] = [];
  av: any[] = [];
  orderNormal: boolean = true;
  constructor(private palabrasService: PalabrasService) { }

  async ngOnInit() {
    const { value } = await Preferences.get({ key: 'lang' });

    if (value) {
      this.lang = value === 'pt' ? 'Portugues' : value === 'en' ? 'English' : null;
    }
    this.palabrasService.palabras$.subscribe({
      next: (result) => {
        this.av = result;
        this.palabrasCopy = this.shuffleArray(this.av);
        this.palabras = [...this.palabrasCopy];
      },
      error: (err) => {
        console.error('Error al recibir las palabras:', err);
        // Aquí puedes mostrar un alert, toast, etc.
      }
    });
    this.palabrasService.showPalavras();
  }
  currentIndex = 0;
  showTranslation = false;

  get currentWord() {
    return this.palabras[this.currentIndex];
  }

  toggleTranslation() {
    this.showTranslation = !this.showTranslation;
  }

  nextCard() {
    if (this.currentIndex < this.palabras.length - 1) {
      this.currentIndex++;
      this.showTranslation = false;
    }
  }

  previousCard() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.showTranslation = false;
    }
  }
  shuffleArray(array: any[]) {
    const shuffled = [...array]; // Clonamos el array original
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  showAll() {
    this.palabras = [...this.palabrasCopy];
    this.currentIndex = 0;
  }

  showHalf() {
    const mitad = Math.ceil(this.palabrasCopy.length / 2);
    this.palabras = this.palabrasCopy.slice(0, mitad);
    this.currentIndex = 0;
  }

  show30() {
    this.palabras = this.av.slice(0, 30);
    this.currentIndex = 0;
  }
  show30Last() {
    this.palabras = this.av.slice(-30);
    this.currentIndex = 0;
  }
  toggleFavorite(palavra: any) {
    palavra.favorite = !palavra.favorite;
    this.palabrasService.updatePalavra(palavra, false);
  }
  changeLanguage() {
    this.orderNormal = !this.orderNormal;
  }
}
