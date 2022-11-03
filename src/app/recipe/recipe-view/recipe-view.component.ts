import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VFridgeService } from '../../vfridge-service';

@Component({
  selector: 'an-recipe-view',
  templateUrl: './recipe-view.component.html',
  styleUrls: ['./recipe-view.component.css']
})
export class RecipeViewComponent implements OnInit {


  public ingredients : any;
  public curRecipeID : number = 0;

  constructor(private route: ActivatedRoute, private vfservice: VFridgeService) {
    this.route.params.subscribe(params => this.curRecipeID = params['recipeID']);
    //this.route.parent.params.subscribe(params => console.log(params)); // Object {artistId: 12345}
  }

  ngOnInit(): void {
    this.vfservice.getIngredientData(this.curRecipeID).subscribe(
      data => { this.ingredients = data },
      err => console.log(err),
      () => console.log('loading done.:'+this.curRecipeID+this.ingredients)
  );

  }

}