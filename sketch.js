//Create variables here
var dog,hDog,database,foodS;
var foods;
var dogSp;
var fc=0;
var milnImg;
var bFeed,bAdd;
var feedTime,lastFedH,lastFedM,lastFed;
var foodObj;
var lastFedF;
var changeState,readState;
var gameState ;
var bRoomI , gardenI , wRoomI;
var currentTime ;
var sadDog
function preload()
{
  //load images here
  dog = loadImage("images/dogImg.png");
  hDog = loadImage("images/dogImg1.png");
  bRoomI = loadImage("images/BedRoom.png") 
  gardenI = loadImage("images/Garden.png")
  wRoomI = loadImage("images/WashRoom.png")
  sadDog = loadImage("images/deadDog.png")
}

function setup() {
 database = firebase.database();
  console.log(firebase.database)

  createCanvas(500, 500);
  foodObj = new Food(lastFedF ,foods);

  dogSp = createSprite(250,375,50,50)

  dogSp.addImage(dog)
  dogSp.scale = 0.25;

  database.ref('gameState').on("value", (data)=>{
    gameState = data.val();
  });

var foodStock = database.ref('Food');
  foodStock.on("value" ,(data)=> {
    foods = data.val();
  });
  foodObj.getFoodStock();
  console.log(foods)

  //taking value of last fed from database
  var lastFedRef = database.ref('lastFed');
  lastFedRef.on("value",function(data){
    lastFedF= data.val()
  });
  
console.log(lastFedF)

  bAdd = createButton('Add Food');
  bFeed = createButton('Feed The Dog') 
  
  bAdd.position(450,75)
  bFeed.position(600,75)

  bFeed.mousePressed(()=>
  {
  lastFedH = hour();
  lastFedM = minute();
  //lastFed = lastFedH + ":" + lastFedM  + " hours"//+ ":" + lastFedS
  /*
  if(lastFedH > 12){
    lastFed=  lastFedH%12 
  }
   else if(lastFedH === 0){
     lastFed = 12 
  } 
  else {
  lastFed =  lastFedH 
  }
*/
  console.log(lastFedH)
  
  foodObj.updateLastFed(lastFedH)

    foods = foods - 1;
    if(foods<0){
      foods = 0;
      }
  foodObj.updateFoodStock(foods);
  dogSp.addImage(hDog)
  fc = frameCount
  });

  bAdd.mousePressed(()=>{
    foods = foods + 1;
    if(foods>30){
      foods =30;
      }
    foodObj.updateFoodStock(foods);
  });

}


function draw() {  
background(46, 139, 87)


console.log(foodS,foods)

var fc1= fc + 100
if(frameCount>fc1){
  dogSp.addImage(dog)

}

fill("black")
stroke("yellow");
textSize(20);
//text("LAST FED "+ lastFedF,150,75)


//console.log(lastFedF)

//starting the new game GAMESTATES

currentTime = hour() ;
console.log(currentTime)
console.log(lastFedF)
console.log(gameState)
if(currentTime=== lastFedF+1){
  foodObj.updateState("playing")
  foodObj.garden()
}
else if(currentTime === lastFedF+2){
  foodObj.updateState("sleeping")
  foodObj.bedroom()
}
else if(currentTime> (lastFedF +2) && currentTime<=(lastFedF+4)){
  foodObj.updateState("bathing")
  foodObj.washroom();
}

else {
  foodObj.updateState("hungry")
  foodObj.display()
}

if(gameState != "hungry"){
  bFeed.hide();
  bAdd.hide();
  dogSp.remove();
  }
  else{
    bFeed.show();
   bAdd.show();
   //dogSp.addImage(sadDog)
  }
  
  
drawSprites();

  }

