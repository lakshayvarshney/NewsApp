import { AfterViewInit, ChangeDetectorRef, Component,OnInit,ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenav, MatSidenavModule} from '@angular/material/sidenav';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import { BreakpointObserver } from '@angular/cdk/layout';
import {CommonModule} from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NewsService } from './service/news.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,RouterOutlet,MatToolbarModule,MatSidenavModule,MatDividerModule,MatIconModule,HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit,OnInit{
  title = 'NewsApp';
  public sources:any = [];
  public articles:any=[];
  public selectedNewsChannel: string = " Top 10 Trending News";

  @ViewChild(MatSidenav) sideNav!: MatSidenav;

  constructor(private observer : BreakpointObserver, private cdr: ChangeDetectorRef,private newsApi : NewsService){

  }
  ngOnInit(): void {
    this.newsApi.initArticles()
    .subscribe((res:any)=>{
      this.articles = res.articles

    })
    this.newsApi.initSources()
    .subscribe((res:any)=>{
      this.sources = res.sources;

    })
    
  }
  ngAfterViewInit(): void {
    this.sideNav.opened = true;
    this.observer.observe(['(max-width:787px)'])
    .subscribe((res)=>{
      if(res?.matches){
        this.sideNav.mode = "over";
        this.sideNav.close();
      }
      else{
        this.sideNav.mode = "side";
        this.sideNav.open();

      }

    });
    this.cdr.detectChanges();
  }

  searchSource(source:any){
    this.newsApi.getArticlesByID(source.id)
    .subscribe((res:any)=>{
      this.articles=res.articles;
      this.selectedNewsChannel=source.name

    })

  }
}
