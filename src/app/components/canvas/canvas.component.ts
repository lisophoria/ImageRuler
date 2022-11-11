import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MousePos} from "../../models/mouse-pos";

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit, AfterViewInit {

  @ViewChild('imageCanvas', {static: true}) imageCanvas!: ElementRef;
  public canvasContext!: CanvasRenderingContext2D;
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

  ngAfterViewInit(): void {
    this.canvasContext = this.imageCanvas.nativeElement.getContext('2d');
    this.setCanvas();
  }

  // Масштабирование изображение и его отрисовка на холсте
  setCanvas(): void {
    let that = this;
    this.image.onload = function() {
      that.ratio = Math.min((that.maxWidth / that.image.width), (that.maxHeight / that.image.height));
      that.image.width *= that.ratio;
      that.image.height *= that.ratio;
      that.imageCanvas.nativeElement.height = that.image.height;
      that.imageCanvas.nativeElement.width = that.image.width;
      that.canvasContext.drawImage(that.image, 0, 0, that.image.width, that.image.height);
    }
  }

  async getMousePosition(): Promise<MousePos> {
    return new Promise<MousePos>((resolve) => {
      this.imageCanvas.nativeElement.addEventListener("click",
        (evt: MouseEvent) => {
          let rect = this.imageCanvas.nativeElement.getBoundingClientRect();
          resolve({x: evt.clientX - rect.left, y: evt.clientY - rect.top});
        }, {once: true});
    })
  }

}
