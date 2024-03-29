import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest} from '@angular/common/http';
import { Observable, Observer } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { Shoppinglist } from './shoppinglist';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
        //'Accept' : 'application/json',
        //'Authorization' : 'Basic'
    })
}

export interface User {
  name : string | null;
  email : string | null;
  password : string | null;
  id : number;
}

@Injectable()
export class VFridgeService {
  base_domain : string =
    //"http://localhost:8080";
    //"https://45.129.46.25:8080";
    //"https://virtual-fridge-backend.de:8080";
    "https://dane-adequate-especially.ngrok-free.app";


  base_api : string  =
    this.base_domain + "/api/v1.0";
    //"https://45.129.46.25:8080/api/v1.0";
    //"https://virtual-fridge-backend.de:8080/api/v1.0";
    //"https://dane-adequate-especially.ngrok-free.app/api/v1.0";
  base_api2 : string  =
    this.base_domain + "/api/v1.1";
    //"https://45.129.46.25:8080/api/v1.0";
    //"https://virtual-fridge-backend.de:8080/api/v1.0";
    //"https://dane-adequate-especially.ngrok-free.app/api/v1.0";

  public user : User = {
    name : "",
    email : "",
    password : "",
    id : 0
  };
  public userLogined: boolean = false;

  public showLogin : boolean = true;

  constructor(private http:HttpClient) {}

 initFromUserCookies(){
   this.userLogined = ('true' === localStorage.getItem('login_token'));
    if(this.userLogined){
      this.user.name = localStorage.getItem('user_name');
      this.user.email = localStorage.getItem('user_email');
      this.user.password = localStorage.getItem('user_password');
    }

      this.getUserAuthenticated().subscribe(
        data => {
            this.userLogined = true;
            localStorage.setItem('login_token', 'true');
        },
        err =>{
          localStorage.setItem('login_token', 'false');
          this.userLogined = false;
          console.log(err);
          //alert("user credentials invalide");
        },
        () => {console.log('loading done.'+this.user.email);}
      );
    }

 deleteUserCookies(){
   this.userLogined = false;
   localStorage.removeItem('login_token');
      this.user.name = "";
        localStorage.removeItem('user_name');
      this.user.email = "";
        localStorage.removeItem('user_email');
      this.user.password = "";
      localStorage.removeItem('user_password');
      localStorage.clear();
  }



  encryptSecretKey = 'dffsdfs@fdsf';
  encryptData(data : any){
    return CryptoJS.AES.encrypt(JSON.stringify(data), this.encryptSecretKey).toString();
  }


    getAuthenticationHeaders() : HttpHeaders{
      /*const token : string = btoa(
        this.encryptData(this.user.email) + ':' + this.encryptData(this.user.password)
      );*/
      const token = window.btoa(this.user.email + ':' + this.user.password);
      console.log(token);

        //Buffer.from(this.user.email + ':' + this.user.password, 'utf8')

      const headers = new HttpHeaders( {
            'Authorization': 'Basic ' + window.btoa(this.user.email + ':' + this.user.password),
            'Content-Type' : 'application/json',
            'ngrok-skip-browser-warning': 'true'
      });


      return headers;
    }

    getLogedCurUser(){
      return this.user;
    }

    getStorageData(l_userID: number) {
        return this.http.get(this.base_api + '/user/storage/all?OwnerID=' + l_userID);
    }

  getUserData() {
      return this.http.get(this.base_api + '/user/email');
  }

  getUserAuthenticated() //: Observable<boolean>
  {
    console.log(this.user);

    let req = this.http.get(this.base_api + '/user/authenticated'
    ,{headers : this.getAuthenticationHeaders()}
                           );
    console.log(req);

    return req;
  }


  putUserData(putUser: object){
    let endPoint =
    this.base_api + "/user/update";
    return this.http.put(endPoint, putUser);

  }

  deleteUserData() {
    let endPoint =
    this.base_api + "/user/delete?userID="
    + this.user.id + "&email=" + this.user.email + "&password=" + "bla";
    this.http.delete(endPoint).subscribe(
      data => {
         console.log(data);
      },
      err => console.log(err),
    );
  }

    getGroceryData(l_storageID: number) {
      return this.http.get(this.base_api + '/storage/grocery/byID/all?storageID='+l_storageID);
    }

    getRecipeData(l_userID: number) {
      return this.http.get(this.base_api + '/recipe/all');
    }

    getSingleRecipeData(l_recipeID: number) {
      return this.http.get(this.base_api + '/recipe/byID?recipeID='+l_recipeID);
    }

    getIngredientData(l_recipeID: number) {
      return this.http.get(this.base_api+'/recipe/ingredient/all?recipeID='+l_recipeID);
    }

    addStorageData(postStorage: Object) {
        let endPoint =
        this.base_api+"/storage";
        return this.http.post(endPoint, postStorage);
      }

    addGroceryData(postGrocery: Object, storageID: number){
          let endPoint =
          this.base_api+"/grocery/byID?storageID=" + storageID;
          return this.http.post(endPoint, postGrocery);
          /*.subscribe(data => {
            console.log(data);
          });*/
      }

      addRecipeData(postRecipe: Object, userID: number) {
        let endPoint =
        this.base_api+"/recipe?OwnerID=" + userID;
        return this.http.post(endPoint, postRecipe);
      }

      putRecipeData(putRecipe: Object) {
        let endPoint =
        this.base_api+"/recipe";
        this.http.put(endPoint, putRecipe).subscribe(data => {
          console.log(data);
        });
      }

      addIngredientData(postIngredient: Object, ingredientID: number) {
        let endPoint =
        this.base_api+"/recipe/ingredient?RecipeID=" + ingredientID;
        return this.http.post(endPoint, postIngredient);
      }

      addRegisterData(userdata: User) {
        let endPoint =
        this.base_api+"/user/register";
        return this.http.post(endPoint, userdata, httpOptions );
      }

    deleteStorage(userID: number, storageID: number) {
        let endPoint =
        this.base_api+"/storage" +
        "?userID=" + userID +
        "&storageID=" + storageID;
       return  this.http.delete(endPoint);
      }

      deleteGrocery(storageID: number, groceryID: number) {
        let endPoint =
        this.base_api + "/grocery" +
        "?storageID=" + storageID +
        "&groceryID=" + groceryID;
        return this.http.delete(endPoint);
      }

      deleteRecipe(userID: number, recipeID: number) {
        let endPoint =
        this.base_api+"/recipe" +
        "?userID=" + userID +
        "&recipeID=" + recipeID;
        return this.http.delete(endPoint);
      }
      deleteIngredient(recipeID: number, ingredientID: number) {
        let endPoint =
        this.base_api+"/ingredient" +
        "?recipeID=" + recipeID +
        "&ingredientID=" + ingredientID;
        return this.http.delete(endPoint);
      }
      getRecSugData(l_userID: number, l_storageID: number) {
        return this.http.get(this.base_api+'/storage/recipe/suggestion?userID='+
        l_userID +'&storageID='+l_storageID);
      }

      createShoppinglist(l_shoppinglistname: Object) {
        return this.http.post(this.base_api + '/shoppinglist/add', l_shoppinglistname);
    }
      updateShoppinglist(l_userID: number, l_shoppinglistID: number, l_listupdate: Shoppinglist) {
      return this.http.put(this.base_api + '/shoppinglist?userID=' + l_userID+ '&listID=' +  l_shoppinglistID, l_listupdate);
   }
      deleteShoppinglist(l_shoppinglistID: number) {
        return this.http.delete(this.base_api + '/shoppinglist?shoppingListId=' + l_shoppinglistID);
    }
      getShoppinglist() {
        return this.http.get(this.base_api + '/shoppinglist/all');
    }

    getShoppinglistItems(l_shoppinglistID: number) {
      return this.http.get(this.base_api + '/shoppinglist/item/all?shoppingListId=' + l_shoppinglistID);
    }

    createShoppinglistItem(l_shoppingListID : number, postShoppinglistItem: Object) {
      return this.http.post(this.base_api + '/shoppinglist/item/add?shoppingListId=' + l_shoppingListID, postShoppinglistItem);
    }

    updateShoppinglistItem(l_shoppinglistID: number, l_shoppinglistItemID: number, l_shoppinglistTicked: boolean) {
      return this.http.put(this.base_api + '/shoppinglist/item/ticked?shoppingListId=' + l_shoppinglistID
                           + '&itemId=' +  l_shoppinglistItemID
                           + '&ticked=' + l_shoppinglistTicked, l_shoppinglistTicked);
   }

    deleteShoppinglistItem(l_shoppinglistID: number, l_shoppinglistItemID: number) {
        return this.http.delete(this.base_api + '/shoppinglist/item?shoppingListId=' + l_shoppinglistID + '&itemId=' + l_shoppinglistItemID);
    }

    postNewFood(food : any){
      return this.http.post(this.base_api2 + '/storagev2/food', food);
    }

    postAttributesAndValuesOfFood(food : any){
      return this.http.post(this.base_api2 + '/storagev2/food/attributes', food);
    }

    getFood(foodID : number){
      return this.http.get(this.base_api2 + '/storagev2/food?foodID='+foodID);
    }

    getAllFoods(){
      return this.http.get(this.base_api2 + '/storagev2/food/all');
    }

    getFoodWithAttributes(foodID : number){
      return this.http.get(this.base_api2 + '/storagev2/food/attributes?foodID='+foodID);
    }

    getInstancesOfFoodInStorage(storagev2ID : number){
      return this.http.get(this.base_api2 + '/storagev2/food/instances?storagev2ID='+storagev2ID);
    }

    postInstanceOfFoodToStorage(storagev2ID : number, foodInstance : any){
      return this.http.post(this.base_api2 + '/storagev2/food/instances?storagev2ID='+storagev2ID, foodInstance);
    }




}
