import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {CanvasComponent} from "../canvas/canvas.component";
import {Line} from "../../models/line";

@Component({
  selector: 'app-app-overlay',
  templateUrl: './app-overlay.component.html',
  styleUrls: ['./app-overlay.component.scss']
})
export class AppOverlayComponent implements OnInit, AfterViewInit {

  @ViewChild('canvasComponent') private canvas!: CanvasComponent;
  ratio: number = 1;
  public lines: Line[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
  }

  async newLine(): Promise<void> {
    let line: Line = await this.canvas.newLine();
    this.lines.push(line);
  }

}
