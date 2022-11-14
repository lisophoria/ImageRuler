import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {CanvasComponent} from "../canvas/canvas.component";
import {Line} from "../../models/line";
import {MousePos} from "../../models/mouse-pos";

@Component({
  selector: 'app-app-overlay',
  templateUrl: './app-overlay.component.html',
  styleUrls: ['./app-overlay.component.scss']
})
export class AppOverlayComponent implements OnInit, AfterViewInit {

  @ViewChild('canvasComponent') private canvas!: CanvasComponent;
  private imageRatio!: number;
  public line!: Line;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.imageRatio = this.canvas.ratio;
  }

  async newLine(): Promise<void> {
    let line: Line = {posX: await this.getPoint(), posY: await this.getPoint()};
    this.canvas.drawLine(line);
    this.line = line;
    console.log('newLine: ', line);
  }

  async getPoint(): Promise<MousePos> {
    return await this.canvas.getMousePosition();
  }

}
