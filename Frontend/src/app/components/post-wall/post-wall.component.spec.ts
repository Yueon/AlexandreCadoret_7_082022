import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostWallComponent } from './post-wall.component';

describe('PostWallComponent', () => {
  let component: PostWallComponent;
  let fixture: ComponentFixture<PostWallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostWallComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostWallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
