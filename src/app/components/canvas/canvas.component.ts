import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {MousePos} from "../../models/mouse-pos";
import {CanvasSize} from "../../models/canvas-size";
import {Line} from "../../models/line";

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit, AfterViewInit {

  @ViewChild('imageCanvas', {static: true}) imageCanvas!: ElementRef;
  public canvasContext!: CanvasRenderingContext2D;
  @ViewChild('lineCanvas', {static: true}) lineCanvas!: ElementRef;
  public lineContext!: CanvasRenderingContext2D;
  @ViewChild('tempLineCanvas', {static: true}) tempLineCanvas!: ElementRef;
  @Input() coefficient!: number;
  public tempLineContext!: CanvasRenderingContext2D;
  public canvasSize!: CanvasSize;
  private image!: HTMLImageElement;
  private maxWidth = 800;
  private maxHeight = 600;
  private ratio = 1;

  constructor() { }

  ngOnInit(): void {
    // temp testing init
    this.image = new Image();
    this.image.src = 'file:///home/lisophoria/Pictures/image.jpg';
  }

  async ngAfterViewInit(): Promise<void> {
    this.canvasContext = this.imageCanvas.nativeElement.getContext('2d');
    this.lineContext = this.lineCanvas.nativeElement.getContext('2d');
    this.tempLineContext = this.tempLineCanvas.nativeElement.getContext('2d');
    await this.setImageCanvas().then(
      (onfulfilled) => {
        this.setLineCanvas(onfulfilled, this.lineCanvas);
        this.setLineCanvas(onfulfilled, this.tempLineCanvas);
        this.canvasSize = onfulfilled;
      });
  }

  // Масштабирование изображение и его отрисовка на холсте
  async setImageCanvas(): Promise<CanvasSize> {
    return new Promise<CanvasSize>((resolve) => {
      this.image.onload = () => {
        this.ratio = Math.min((this.maxWidth / this.image.width), (this.maxHeight / this.image.height));
        this.image.width *= this.ratio;
        this.image.height *= this.ratio;
        this.imageCanvas.nativeElement.height = this.image.height;
        this.imageCanvas.nativeElement.width = this.image.width;
        this.canvasContext.drawImage(this.image, 0, 0, this.image.width, this.image.height);
        resolve({width: this.image.width, height: this.image.height});
      }
    });
  }

  // Инициализация холста с линиями
  setLineCanvas(canvasSize: CanvasSize, canvas: ElementRef): void {
    canvas.nativeElement.width = canvasSize.width;
    canvas.nativeElement.height = canvasSize.height;
  }

  async newLine(): Promise<Line> {
    return new Promise<Line>(resolve => {
     this.getLineStartPos().then(async startPos => {
        await this.getLineEndPos(startPos).then(endPos => {
            let line: Line = this.makeLine(startPos, endPos);
            this.drawConstLine(line);
            resolve(line);
        });
     });
    });
  }

  // Получение позиции мыши по клику
  async getLineStartPos(): Promise<MousePos> {
    return new Promise<MousePos>((resolve) => {
      this.tempLineCanvas.nativeElement.addEventListener("click",
        (evt: MouseEvent) => {
          let rect = this.tempLineCanvas.nativeElement.getBoundingClientRect();
          resolve({x: evt.clientX - rect.left, y: evt.clientY - rect.top});
        }, {once: true});
    })
  }

  async getLineEndPos(startPos: MousePos): Promise<MousePos> {
    let rect = this.tempLineCanvas.nativeElement.getBoundingClientRect();
    let that = this;

    let tempLineEvent = function(evt: MouseEvent) {
      let finishPos: MousePos = {x: evt.clientX - rect.left, y: evt.clientY - rect.top};
      that.drawTempLine(that.makeLine(startPos, finishPos));
    }

    return new Promise<MousePos>(resolve => {
      this.tempLineCanvas.nativeElement.addEventListener('mousemove',
          tempLineEvent
        );
      this.tempLineCanvas.nativeElement.addEventListener('click',
        (evt: MouseEvent) => {
          let finishPos: MousePos = {x: evt.clientX - rect.left, y: evt.clientY - rect.top};
          this.drawTempLine(this.makeLine(startPos, finishPos))
          this.tempLineCanvas.nativeElement.removeEventListener('mousemove', tempLineEvent);
          this.clearContext(this.tempLineContext);
          resolve(finishPos);
        }, {once: true});
    })
  }

  drawLine(line: Line, context: CanvasRenderingContext2D): void {
    context.beginPath();
    context.moveTo(line.posX.x, line.posX.y);
    context.lineWidth = 5;
    context.lineCap = 'round';
    context.lineTo(line.posY.x, line.posY.y);
    context.strokeStyle = "#e91e63";
    context.stroke();
  }

  drawTempLine(line: Line): void {
    this.tempLineContext.clearRect(0,0,
      this.tempLineCanvas.nativeElement.width,
      this.tempLineCanvas.nativeElement.height);
    this.drawLine(line, this.tempLineContext);
  }

  drawConstLine(line: Line): void {
    this.drawLine(line, this.lineContext);
  }

  clearContext(context: CanvasRenderingContext2D): void {
    context.clearRect(0, 0, this.canvasSize.width, this.canvasSize.height);
  }

  makeLine(_posX: MousePos, _posY: MousePos): Line {
    let _length = (Math.sqrt((_posY.x - _posX.x) ** 2 + (_posY.y - _posX.y) ** 2) * this.ratio * this.coefficient).toFixed(2);
    return {posX: {x: _posX.x, y: _posX.y}, posY: {x: _posY.x, y: _posY.y}, length: _length};
  }

}
