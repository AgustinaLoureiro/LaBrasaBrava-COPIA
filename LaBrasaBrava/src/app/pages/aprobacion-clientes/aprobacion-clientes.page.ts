import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';

@Component({
  selector: 'app-aprobacion-clientes',
  templateUrl: './aprobacion-clientes.page.html',
  styleUrls: ['./aprobacion-clientes.page.scss'],
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class AprobacionClientesPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
