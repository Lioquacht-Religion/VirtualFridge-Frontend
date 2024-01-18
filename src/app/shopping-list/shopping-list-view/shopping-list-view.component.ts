import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VFridgeService } from 'app/vfridge-service';

@Component({
  selector: 'an-shopping-list-view',
  templateUrl: './shopping-list-view.component.html',
  styleUrls: ['./shopping-list-view.component.css']
})
export class ShoppingListViewComponent implements OnInit {


  public items: any;
  public shoppingListName: any;
  public shoppingListID: any;
  public checkBox = false;

  itemname = '';
  itemamount = '';
  itemunit = '';


  constructor(private route: ActivatedRoute, private vfservice: VFridgeService) {
    this.route.params.subscribe(params => this.shoppingListID = params['shoppingListID']);
    this.route.params.subscribe(params => this.shoppingListName = params['shoppingListName']);
  }

  ngOnInit(): void {
    this.getShoppingListItemFromDB();
  }


  getShoppingListItemFromDB() {
    this.vfservice.getShoppinglistItems(this.shoppingListID).subscribe(
      data => { this.items = data },
      err => console.log(err),
      () => {
        console.log('loading done.:');
        console.log(this.items);
      }
    );
  }

  shoppingListChecking() {
    if (this.checkBox == false) {
      this.checkBox = true;
      console.log(this.checkBox);
    }
    else {
      this.checkBox = false;
      console.log(this.checkBox);
    }

  }

  createShoppingListItem() {
    let itemToCreate = {
      ticked: this.checkBox,
      grocery: {
        name: this.itemname,
        amount: this.itemamount,
        unit: this.itemunit
      }
    };
    console.log(itemToCreate);
    this.vfservice.addShoppinglistItem(this.shoppingListID, itemToCreate).subscribe(
      data => {
        console.log(data);
      },
      () => this.getShoppingListItemFromDB()
    );
  }

  updateShoppingListItem(event: any, shoppingListID: number, shoppingListItemID: number) {
    if (this.checkBox == false) {
      this.checkBox = true;
      console.log(this.checkBox);
    }
    else {
      this.checkBox = false;
      console.log(this.checkBox);
    }
    console.log(shoppingListID, shoppingListItemID);
    console.log("checkboxchecked: " + event);
    this.vfservice.updateShoppinglistItem(shoppingListID, shoppingListItemID, event.target.checked).subscribe(
      data => { console.log(data) },
      err => { console.log(err) },
      () => { console.log("loading done") }
    );
    this.getShoppingListItemFromDB();
  }

  deleteShoppingListItem(shoppingListID: number, shoppingListItemID: number, item: any): void {
    console.log(item);
    console.log(shoppingListID, shoppingListItemID);
    this.vfservice.deleteShoppinglistItem(shoppingListID, shoppingListItemID).subscribe(
      data => { console.log(data); },
      () => { this.getShoppingListItemFromDB(); }
    );
  }

  deleteShoppingAllTicked(): void {
    if (this.items.length === 0) {
      return;
    }
    var filteredlist = this.items.filter((item: any) => item.ticked == true)
    console.log(filteredlist)
    if (filteredlist.length === 0) {
      return;
    }
    filteredlist.forEach((element: any) => {
      this.vfservice.deleteShoppinglistItem(this.shoppingListID, element.grocery.id).subscribe(
        data => { console.log(data); },
        () => { this.getShoppingListItemFromDB(); }
      );

    });

  }

}

