import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

   userName: String = "";
  constructor() { }

  ngOnInit(): void {
    this.userName = String(localStorage.getItem("firstName")) ;
  }

}
