
import { AfterContentInit, Component, ContentChildren, QueryList } from '@angular/core';
import { TabComponent  } from './tab.component';

@Component({
  selector: 'tabs',
  template: `

    <ul class="tabs">
      <button type="button" class="btn" *ngFor="let tab of tabs" (click)="activateTab(tab)" [class.active]="tab.active">
        <a>{{tab.name}}</a>
      </button>
    </ul>
    <ng-content></ng-content>
  `,
  styles: [`
    ul {
      margin: 0;
      padding: 0;
      overflow: hidden;
      height: 2.25em;
    }

    button {
      float: left;
      list-style: none;
      margin: 0;
      overflow: hidden;
      position: relative;
      z-index: 1;
      border-bottom: 1px solid #FFF;
      background-color: white
    }
    button:hover, .dropdown:hover .dropbtn {
      background-color: rgb(105, 64, 143);
    }
    button.active {
      z-index: 3;
    }

    a {
      float: left;
      height: 2em;
      line-height: 2em;
      border-radius: 0;
      background: transparent;
      border: 1px solid white;
      border-bottom: 0;
      padding: 0 10px;
      color: #000;
      font-weight: bold;
      text-decoration: none;
      margin-bottom:10%;
      background-color: white
    }

    .active a {
      background: #FFF;
      box-shadow: #CCC 0 0 .25em;
      border: 1px solid #CCC;
    }

    ::ng-deep .pane {
      border: 1px solid #CCC;
      background: #FFF;
      border-radius: 0;
      box-shadow: #CCC 0 0 .25em;
    }
`]
})
export class TabsComponent implements AfterContentInit {
  @ContentChildren(TabComponent) tabs!: QueryList<TabComponent>;

  ngAfterContentInit() {
    let activeTabs = this.tabs.filter(tab => tab.active);
    if(!activeTabs.length) {
      this.activateTab(this.tabs.first);
    }
  }

  activateTab(tab: TabComponent){
    this.tabs.toArray().forEach(item => item.active = false);
    tab.active = true;
  }
}
