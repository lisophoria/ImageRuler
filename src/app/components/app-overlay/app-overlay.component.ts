import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {CanvasComponent} from "../canvas/canvas.component";
import {Line} from "../../models/line";
import {MousePos} from "../../models/mouse-pos";
import {LineLength} from "../../models/line-length";

@Component({
  selector: 'app-app-overlay',
  templateUrl: './app-overlay.component.html',
  styleUrls: ['./app-overlay.component.scss']
})
export class AppOverlayComponent implements OnInit, AfterViewInit {

  @ViewChild('canvasComponent') private canvas!: CanvasComponent;
  private imageRatio!: number;
  ratio: number = 1;
  public lines: LineLength[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.imageRatio = this.canvas.ratio;
  }

  async newLine(): Promise<void> {
    let line: Line = {
      posX: await this.getPoint(),
      posY: await this.getPoint()};
    let lineLengthColor: LineLength = {
      posX: line.posX,
      posY: line.posY,
      length: this.calcLineLength(line.posX, line.posY)};
    this.canvas.drawLine(lineLengthColor);
    this.lines.push(lineLengthColor);
    console.log('newLine: ', line);
  }

  calcLineLength(posX: MousePos, posY: MousePos): string {
    return (Math.sqrt((posY.x - posX.x) ** 2 + (posY.y - posX.y) ** 2) * this.ratio).toFixed(2);
  }

  async getPoint(): Promise<MousePos> {
    return await this.canvas.getMousePosition();
  }

}
