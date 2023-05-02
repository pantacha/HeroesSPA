import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';

import { NewPageComponent } from './new-page.component';
import { Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { HeroImagePipe } from '../../pipes/hero-image.pipe';

describe('NewPageComponent', () => {
  let comp: NewPageComponent;
  let fixture: ComponentFixture<NewPageComponent>;
  let de: DebugElement;
  let le: HTMLElement;
  let publisher: Publisher;
  let heroesService: HeroesService;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let heroesHttpSpy: jasmine.SpyObj<HeroesService>;

  const mockActivatedRoute = {
    params: of({ id: '123' })
  };

  beforeEach(async () => {

    dialogSpy = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
    heroesHttpSpy = jasmine.createSpyObj<any>('HeroesService', ['onDeleteHero', ['addHero'], ['deleteHeroById'], ['getHeroById']]);
    
    await TestBed.configureTestingModule({
      declarations: [
        NewPageComponent,
        HeroImagePipe
      ],
      imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        //ActivatedRoute,
        //Router,
        MatSnackBarModule,
        MatDialogModule
      ],
      providers: [
        { provide: HeroesService, useValue: heroesHttpSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        Router,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(NewPageComponent);
      comp=fixture.componentInstance;
      fixture.detectChanges();
      heroesService = TestBed.inject(HeroesService);
      de=fixture.debugElement.query(By.css('form'));
      le=de.nativeElement;
    });
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('Shoud have two publishers', () => {
    expect(Publisher.DCComics).toContain('DC Comics');
    expect(Publisher.MarvelComics).toContain('Marvel Comics');
  });

  it('form should be invalid', async() => {
    comp.heroForm.controls['superhero'].setValue('');
    comp.heroForm.controls['alter_ego'].setValue('');
    comp.heroForm.controls['first_appearance'].setValue('');
    comp.heroForm.controls['characters'].setValue('');
    comp.heroForm.controls['publisher'].setValue(null);

    expect(comp.heroForm.valid).toBeFalsy();
  });

  it('form should be valid', async () => {
    comp.heroForm.controls['superhero'].setValue('Wonder Woman');
    comp.heroForm.controls['alter_ego'].setValue('Princess Diana');
    comp.heroForm.controls['first_appearance'].setValue('All Star Comics #8');
    comp.heroForm.controls['characters'].setValue('Princess Diana');
    comp.heroForm.controls['publisher'].setValue(Publisher.DCComics);

    expect(comp.heroForm.valid).toBeTruthy();
    expect(comp.heroForm.contains('superhero')).toBeTruthy();
  });

  it('should call the onSubmit method', async() => {
    fixture.detectChanges();
    spyOn(comp, 'onSubmit');
    le = fixture.debugElement.query(By.css('button')).nativeElement;
    le.click();
    expect(comp.onSubmit).toHaveBeenCalledTimes(1);
  });

  it(`the init method should initialized one hero`, () => {
    heroesHttpSpy.getHeroById.and.returnValue(of([
      {
        id: "dc-martian",
        superhero: "Martian Manhunter",
        publisher: "DC Comics",
        alter_ego: "J\"onn J\"onzz",
        first_appearance: "Detective Comics #225",
        characters: "Martian Manhunter"
      }
    ]) as any);
    comp.ngOnInit();
    expect(comp.heroes.length).toBe(1);
  });

  it('should remove a Hero', () => {
    const newHero = {
      id: "dc-martian",
      superhero: "Martian Manhunter",
      publisher: "DC Comics",
      alter_ego: "J\"onn J\"onzz",
      first_appearance: "Detective Comics #225",
      characters: "Martian Manhunter"
    };
    heroesHttpSpy.addHero.and.returnValue(of(newHero as any));
    heroesHttpSpy.deleteHeroById.and.returnValue(of({} as any));
    comp.onDeleteHero;
    expect(comp.heroes.length).toBe(0);
  });

  it('the component should open the confirmation modal to remove', () => {
    const newHero = {
      id: "dc-martian",
      superhero: "Martian Manhunter",
      publisher: "DC Comics",
      alter_ego: "J\"onn J\"onzz",
      first_appearance: "Detective Comics #225",
      characters: "Martian Manhunter"
    };
    const dialogRef={afterClosed: () => of(true)} as MatDialogRef<unknown>;
    dialogSpy.open.and.returnValue(dialogRef);
    newHero.id;
    expect(dialogSpy.open).toHaveBeenCalled();
  })
});
