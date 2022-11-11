import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MousePos} from "../models/mouse-pos";

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit, AfterViewInit {

  @ViewChild('imageCanvas', {static: true}) imageCanvas!: ElementRef;
  public canvasContext!: CanvasRenderingContext2D;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.canvasContext = this.imageCanvas.nativeElement.getContext('2d');
    this.setCanvas();
    this.imageCanvas.nativeElement.addEventListener("click", (evt: MouseEvent) => {
      let mousePos = this.getMousePosition(evt);
      console.log(mousePos);
    });
  }

  setCanvas(): void {
    this.canvasContext.fillStyle = "rgba(1,1,1,1)"
    this.canvasContext.fillRect(1,1,
      this.imageCanvas.nativeElement.getAttribute("width"),
      this.imageCanvas.nativeElement.getAttribute("height"));
  }

  getMousePosition(evt: MouseEvent): MousePos {
    let rect = this.imageCanvas.nativeElement.getBoundingClientRect();
    return {x: evt.clientX - rect.left, y: evt.clientY - rect.top}
  }

}
