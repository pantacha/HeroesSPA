import { Injectable } from '@angular/core';
import { Hero, Publisher } from '../interfaces/hero.interface';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeroesServiceMock {

  constructor() { }

  getHeroById(id: string): Observable<any> {
    return of([
      {
        id: "dc-martian",
        superhero: "Martian Manhunter",
        publisher: Publisher.MarvelComics,
        alter_ego: "J\"onn J\"onzz",
        first_appearance: "Detective Comics #225",
        characters: "Martian Manhunter"
      }
    ])
  }
}
