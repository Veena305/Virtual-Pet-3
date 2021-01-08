var dog,sadDog,happyDog;

var garden,washroom, database;

var foodS,foodStock;

var fedTime,lastFed,currentTime;

var feed,addFood;

var foodObject;

var gameState,readState;

function preload() {

sadDog = loadImage("Dog.png");

happyDog = loadImage("happy dog.png");

garden = loadImage("Garden.png");

washroom = loadImage("Wash Room.png");

bedroom = loadImage("Bed Room.png");

}

function setup() {

  database = firebase.database();

  createCanvas(400,500);
  
  foodObject = new Food();

  foodStock = database.ref('Food');
  foodStock.on("value",readStock);

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data) {
     
    lastFed = data.val();

  });

  readState=database.ref('gameState');

  readState.on("value",function(data) {

    gameState = data.val();

  });
   
  dog = createSprite(200,400,150,150);
  dog.addImage(sadDog);
  dog.scale = 0.15;
  
  feed = createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
}

function draw() {

  currentTime = hour();

  if(currentTime == (lastFed + 1)) {

      update("Playing");
      foodObject.garden();

   }else if(currentTime == (lastFed + 2)) {

    update("Sleeping");
      foodObject.bedroom();

   }else if(currentTime > (lastFed + 2) && currentTime <= (lastFed + 4))
   {
    update("Bathing");
      foodObject.washroom();

   }else{

    update("Hungry")
    foodObject.display();

   }
   
   if(gameState != "Hungry") {

     feed.hide();
     addFood.hide();
     dog.remove();

   }else{

    feed.show();
    addFood.show();
    dog.addImage(sadDog);
    
   }
 
  drawSprites();
}

function readStock(data) { 

  foodS = data.val();
  foodObject.updateFoodStock(foodS); 

}
 
function feedDog() { 

  dog.addImage(happyDog);

  foodObject.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObject.getFoodStock(),
    FeedTime : hour(),
    gameState:"Hungry" 

  });
}

function addFoods() { 

  foodS++;
  database.ref('/').update({
    Food:foodS

  });
}

function update(state) { 

  database.ref('/').update({
    gameState:state

  });
}