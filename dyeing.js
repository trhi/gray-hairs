let sliverSize = 10, graypoint = 250; //150
let xover = 6/8, yover = 8/10;
let observations, slivers = [], clicks = 0;

//change name to:
// gray hairs
// dyeing
// sliver
// pluck
// going gray
// why do only the women d|yi|e?
// why do only women dye?
// aging
// fading
// death

function preload() {
  observations = loadJSON('assets/audio/slivers.json');
}

//conceptually: I like the idea of this being something where you just click
//through and you hear the musings... eventually, the musings run out -
//the musings are silenced and the gray hairs take over,
//there are so many of them that you can no longer pluck
//you give in. You let it go gray.
//yet: in the silence of the musings, there is the chorus of the voice
//dreaming of voice recordings and audio in next iteration of this work

function windowResized() {
  location.reload();
}

function setup() {

  let canvas =createCanvas(windowWidth, windowHeight);
  canvas.style('display', 'block'); //disable/hide scroll
  frameRate(4);

  if ( window.innerWidth >= 992 ){
    xover = 9/10; //allow clicks further into the right side of the screen for larger screens
  } else {
    sliverSize = window.innerWidth/20; //if small screen, tweak sliverSize to make tappable
  }

  xover *= windowWidth; //calculate the sliver of screen where text should not be displayed
  yover *= windowHeight; //ditto

  let sliversX = windowWidth/(sliverSize*2); //how many follicles fit horizontally?
  let sliversY = windowHeight/(sliverSize*2); //how many follicles fit vertically?

  for (let i=0; i<sliversY+1; i++){
    for (let j=0; j<sliversX+1;j++){
      //create an array of hair follicles
      //with x and y coordinates that populate screen
      slivers.push( new sliver(2*sliverSize*j + sliverSize/2, 2*sliverSize*i + sliverSize/2) );
    }
  }

//TODO: audio on/off button, play observations as recorded voice and/or text -> moved to audio.js

//TODO: create info-button? with instructions/background info + respawn button?
/*
    let infoButton = createButton('i');
    infoButton.class("infobutton");
    let info = createDiv();
    let infoText = createP("click on gray hairs to hear thoughts.");
    let respawnButton = createButton("respawn");
    //respawnButton.touchStarted( location.reload() );
    infoText.class("instructions");
    info.child(infoText);
    info.child(respawnButton);
    info.class("answers");
    info.hide();
    infoButton.mousePressed( () => {
      console.log("pressed");
      info.show();
      infoText.show();
    } );
  */

}

function draw() {
  if( frameCount == 4 ){ //show instruction after person opens work
    let p = createP("<em>wait for the first gray hair, then tap it</em>");
    p.position(windowWidth/10, windowHeight/10);
    $( "p" ).fadeOut( 6000 );
  }
  clear();
  drawSlivers();
  // what color is the pixel/hair that the user is mousing over?
  let pixelColor = get(mouseX, mouseY)[0] + get(mouseX, mouseY)[3];
  if ( pixelColor == 255 || pixelColor == 0 ){
    cursor(ARROW); //show normal arrow for black hairs
  } else {
    cursor(CROSS); //show crosshair for graying hairs
  }
}

function drawSlivers() {
  for( let i=0; i < slivers.length; i++ ){ slivers[i].display(); }
}

function touchStarted(event) {
  //upon touchStarted, check which hair was clicked by going through the array of hairs:
  if ( clicks <= observations.slivers.length-1 ){ //but only if there is still text left to show
    slivers.forEach( element => element.clicked(mouseX, mouseY) );
  } //else do nothing
}

function giveInfo(){ //TODO: infobutton, or maybe not necessary?
  info.show();
}

function sliver(x, y){

  if(!x || !y){ //if no x OR y given when they are created, put them in a random position:
    x = random(0, windowWidth);
    y = random(0, windowHeight);
  }

  this.x = x;
  this.y = y;
  this.r = sliverSize;
  this.d = 2*this.r;
  this.fill = 0;
  this.life = random(0, graypoint-50);
  //this.life = random(0, 20); //takes a veeery long time until grays start to appear
  //this.life = random(0, graypoint); //grays appear immediately

  //TODO: manage the lives of the hair follices in more detail?
  //make it so that the first one is the only one in a long time
  //and then exponentially & slowly more begin to appear?

  this.display = function() {
    this.life++;
    if(this.life >= graypoint){
      if(Math.round(this.life) === graypoint && clicks == 0){
        clicks++;
        this.fill = (226,226,226); //snap the firts gray hair to light gray immediately to catch attention
      } else{
        this.fill+=1; //let the rest fade slowly
      }
    }
    noStroke();
    fill(this.fill);
    ellipse(this.x, this.y, this.d);
  }

  this.clicked = function (x,y) {

    let me = createVector(this.x, this.y);
    let mouse = createVector(x, y);
    let dist = me.dist(mouse);

    if( dist <= this.r && this.life >= graypoint ) { //if taps within the radius of the circle
      let chosen = observations.slivers[clicks];
      clicks++;
      let p = createP(">> " + chosen.text);

      //the code below positions text and sets how long it takes to fade out:
      if( clicks == 2 ){
        p.position(windowWidth/10, windowHeight/10);
        $( "p" ).fadeOut( 5000 );
      } else {
        if( x > xover || y > yover ) { //don't let text go over side of screen
          if( x > xover && !(y > yover) ){
            p.position(this.x - 2/8*windowWidth, this.y);
          } else if ( !(x > xover) && y > yover ) {
            p.position(this.x, this.y - 3/10*windowHeight);
          }else if ( x > xover && y > yover ) {
            p.position(this.x - 2/8*windowWidth, this.y - 3/10*windowHeight);
          }
        } else { //if it's not going over screen, position it where the person clicked
          p.position(this.x, this.y);
        }
        if ( clicks == observations.slivers.length ){
          $( "p" ).fadeOut( 12345 ); //fade the last word out very slowly
        } else {
          $( "p" ).fadeOut( 2500 ); //fade other text out after normal interval
        }
      }
      //finally, reset hair follicle to black and give it a new life:
      this.fill = 0;
      this.life = random(0,20);
    }//close if (tap within this hair)

  }//close this.clicked

}//close sliver()
