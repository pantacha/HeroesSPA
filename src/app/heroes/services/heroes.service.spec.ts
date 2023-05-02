import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { HttpClient } from "@angular/common/http";

import { HeroesService } from "./heroes.service";
import { Hero, Publisher } from "../interfaces/hero.interface";

describe('Heroes Service', () => {

  let heroesService: HeroesService;
  let http: HttpClient;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HeroesService],
      imports: [HttpClientTestingModule]
    });
    heroesService = TestBed.inject(HeroesService);
    http = TestBed.inject(HttpClient);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  })

  it('Service create', () => {
    expect(heroesService).toBeDefined();
  });

  it('should be return heroes api', () => {
    const testData = {
      id: "dc-wonder",
      superhero: "Wonder Woman",
      publisher: 'DCComics',
      alter_ego: "Princess Diana",
      first_appearance: "All Star Comics #8",
      characters: "Princess Diana"
    };
    const inputData: any = {
      id: "dc-wonder",
      superhero: "Wonder Woman",
      publisher: 'DCComics',
      alter_ego: "Princess Diana",
      first_appearance: "All Star Comics #8",
      characters: "Princess Diana"
    };
    heroesService.getHeroes().subscribe((resp) => expect(resp).toEqual(testData as any));
    const req = httpController.expectOne('http://localhost:3000/heroes');
    req.flush(inputData);
  });

  it('should be return a hero', () => {
    const testData = {
      id: "dc-martian",
      superhero: "Martian Manhunter",
      publisher: 'DCComics',
      alter_ego: "J\"onn J\"onzz",
      first_appearance: "Detective Comics #225",
      characters: "Martian Manhunter"
    };
    const inputData: any = {
      id: "dc-martian",
      superhero: "Martian Manhunter",
      publisher: 'DCComics',
      alter_ego: "J\"onn J\"onzz",
      first_appearance: "Detective Comics #225",
      characters: "Martian Manhunter"
    };
    heroesService.getHeroById("dc - martian").subscribe((resp) => expect(resp).toEqual(testData as any));
    const req = httpController.expectOne('http://localhost:3000/heroes/dc - martian');
    req.flush(inputData);
  });

  it('should update a hero', () => {
    const testData = {
      id: "dc-martian",
      superhero: "Martian Manhunter",
      publisher: Publisher.DCComics,
      alter_ego: "J\"onn J\"onzz",
      first_appearance: "Detective Comics #225",
      characters: "Martian Manhunter"
    };
    const inputData: Hero = {
      id: "dc-martian",
      superhero: "Martian Manhunter",
      publisher: Publisher.DCComics,
      alter_ego: "J\"onn J\"onzz",
      first_appearance: "Detective Comics #225",
      characters: "Martian Manhunter"
    };
    heroesService.updateHero(inputData).subscribe((resp) => expect(resp).toEqual(testData as any));
    const req = httpController.expectOne('http://localhost:3000/heroes/dc-martian');
    req.flush(inputData);
  });
})