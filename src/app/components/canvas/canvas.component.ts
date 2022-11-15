import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MousePos} from "../../models/mouse-pos";
import {CanvasSize} from "../../models/canvas-size";
import {LineLength} from "../../models/line-length";

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
  image!: HTMLImageElement;
  maxWidth = 800;
  maxHeight = 600;
  ratio = 1;

  constructor() { }

  ngOnInit(): void {
    // temp testing init
    this.image = new Image();
    this.image.src = 'file:///home/lisophoria/Pictures/image.jpg';
  }

  async ngAfterViewInit(): Promise<void> {
    this.canvasContext = this.imageCanvas.nativeElement.getContext('2d');
    this.lineContext = this.lineCanvas.nativeElement.getContext('2d');
    await this.setImageCanvas().then(
      (onfulfilled) => {
        this.setLineCanvas(onfulfilled);
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
  setLineCanvas(canvasSize: CanvasSize): void {
    this.lineCanvas.nativeElement.width = canvasSize.width;
    this.lineCanvas.nativeElement.height = canvasSize.height;
  }

  // Получение позиции мыши по клику
  async getMousePosition(): Promise<MousePos> {
    return new Promise<MousePos>((resolve) => {
      this.lineCanvas.nativeElement.addEventListener("click",
        (evt: MouseEvent) => {
          let rect = this.lineCanvas.nativeElement.getBoundingClientRect();
          resolve({x: evt.clientX - rect.left, y: evt.clientY - rect.top});
        }, {once: true});
    })
  }


  drawLine(line: LineLength): void {
    this.lineContext.beginPath();
    this.lineContext.moveTo(line.posX.x, line.posX.y);
    this.lineContext.lineWidth = 5;
    this.lineContext.lineCap = 'round';
    this.lineContext.lineTo(line.posY.x, line.posY.y);
    this.lineContext.strokeStyle = "#e91e63";
    this.lineContext.stroke();
  }

}
