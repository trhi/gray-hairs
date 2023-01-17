let x, y, countX, countY, sliversX, sliversY, sliverSize = 10, graypoint = 250; //150
let url, observations;
let anotherSliver, slivers = [];
let soundofsliver, soundsofslivers = [], soundCounter = 0, maxAudios = 20, clicks = 0, sound = false;

//make an easy disable / able sound button/function

//change name to:
// pluck
// going gray
// why do only the women d|yi|e?
// why do only women dye?
// aging
// fading
// death

function preload() {
  //soundofsliver = createAudio('assets/audio/sliver01.mp3');
  //load soundsofslivers

  //in p5/preload() this will load before going into setup:
  //url = 'assets/audio/slivers.json';
  //audio = loadJSON(url);


    observations = loadJSON('assets/audio/slivers.json');

}

//conceptually: I like the idea of this being something where you just click
//through and you hear the musings... eventually, the musings run out -
//the musings are silenced and the gray hairs take over,
//there are so many of them that you can no longer pluck
//you give in. You let it go gray.
//yet: in the silence of the musings, there is the chorus of the voice

function windowResized() {
  location.reload();
}

function setup() {

  let canvas =createCanvas(windowWidth, windowHeight);
  canvas.style('display', 'block');

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


  //audioSliver = createAudio('assets/audio/sliver01.mp3');
  //audioSliver.play();

/*
  stroke('black');
  strokeWeight(sliverSize/2);
  noFill();
  rect(0, 0, windowWidth, windowHeight);
  */

  //background(0, 0, 0);
  sliversX = windowWidth/(sliverSize*2);
  sliversY = windowHeight/(sliverSize*2);

  for (let i=0; i<sliversY+1; i++){
    for (let j=0; j<sliversX+1;j++){

      //anotherSliver = new sliver(2*sliverSize*j, 2*sliverSize*i);
      //slivers.push(anotherSliver);

      slivers.push( new sliver(2*sliverSize*j + sliverSize/2, 2*sliverSize*i + sliverSize/2) );

    }
  }

  //make an audio on/off button for testing purposes:


  //var protection = 0;
  //let overlapping = false;

/*
  for(let n=0; n < 37; n++){
      anotherSliver = new sliver();
      slivers.push(anotherSliver);
  }
  */



  //AT SOME POINT THIS WORKED AND NOW IT DOES NOT!!!!
  //for(let n=0; n<5; n++){
  //while( slivers.length < 37 ){

/*
    for(let n=0; n < 20; n++){

    anotherSliver = new sliver();
    console.log("my coordinates are:", anotherSliver.x, anotherSliver.y);
    //slivers.push(anotherSliver);

    for(let j=0; j<slivers.length; j++){

      let sliver = slivers[j];
      console.log("sliver[j] is:", sliver);

      var d = dist(anotherSliver.x, anotherSliver.y, sliver.x, sliver.y)
      if ( d < anotherSliver.r + sliver.r){
        //Dont add this one
        overlapping = true;
        break;
      }

      if(!overlapping){
        slivers.push(anotherSliver);
      }

    }

    /*protection++;
    if(protection > 100000){
      break;
    }*/



}

function draw() {

  //background(0, 0, 0);
  clear();

  frameRate(4);

  //at each draw-cycle, create a new sliver object:
  //then, at each draw cycle, display sliver object, but with grayscale going from 0 -> 100
  //anotherSliver = new sliver();
  //slivers.push(anotherSliver);

  //background(220);
  //ellipse(50,50,80,80);

  drawSlivers();

  let pixelColor = get(mouseX, mouseY)[0] + get(mouseX, mouseY)[3];
  //console.log( get(mouseX, mouseY) );
  //console.log(pixelColor);
  //console.log(get(mouseX, mouseY)[1]);
  //console.log(get(mouseX, mouseY)[4]);

  //if hair has started graying, allow pluck:
  if ( pixelColor == 255 || pixelColor == 0 ){
    cursor(ARROW);
  } else {
    cursor(CROSS);
  }
  //console.log("pixel color is:", get(mouseX, mouseY) );



}

function touchStarted(event) {
  //console.log(event, mouseX, mouseY);
  slivers.forEach( element => element.clicked(mouseX, mouseY) );
}

function drawSlivers() {

  //OR: populate first with x black dots,
  //then time their graying == playing to start much later, slowly...
  for(let i=0; i < slivers.length; i++){
    slivers[i].display();
  }


}

function giveInfo(){
  //let info =
  //info.style('visibility', 'visible');
  info.show();

}

function sliver(x, y){

  //how to avoid having them all on top of eachother?
  //try: bubble fill algorithm
  //just try putting them all in a grid..
  if(!x || !y){
    x = random(0, width);
    y = random(0, height);
  }

  this.x = x;
  this.y = y;
  //this.r = random(25, 50);
  this.r = sliverSize;
  this.d = 2*this.r;
  this.fill = 0;

  //life is either at 0 or at graypoint

  //manage the lives of the hair follices in more detail:
  //make it so that the first one is the only one in a long time
  //and then exponentially slowly more begin to appear:

  this.life = random(0, graypoint-50);
  //this.life = random(0, 20); //takes a veeery long time until grays start to appear
  //this.life = random(0, graypoint); //grays appear immediately



  //this.life = random(0,95);



  this.clicked = function (x,y) {
    //if length of this.x, this.y VS. mouseX, mouseY is less than this.d/3
    //ie. if click happens within first third of circle:

    //this.audio.pause();

    //console.log("these are all the audio elements:", soundsofslivers);

    //click broke because I am drawing it at x-this.r...
    let me = createVector(this.x, this.y);
    let mouse = createVector(x, y);
    let dist = me.dist(mouse);
    //if( dist <= this.d/3 && this.life >= graypoint ) { //kind of hard to hit the tiny dots

    if( dist <= this.r && this.life >= graypoint ) {


      if( sound ){
        if(this.audio){
          //when you click -> assign this.audio to some other sliver:
          this.audio.pause();
          maxAudios--;

        }
      }

      //console.log("clicked me!", slivers.indexOf(this) );
      //console.log(">>", audio.slivers[2].text);

      //let chosen = random(audio.slivers);
      //recounts a linear story:
      //BUT could also be random:
      let chosen = observations.slivers[clicks];
      clicks++;



      //but this text is overwritten at every loop:
      //textSize(20);
      //text(">>" + chosen.text, this.x, this.y);

      let p = createP(">> " + chosen.text);
      //p.style('font-size', '30px');
      //p.style('color', 'white');
      //p.style('background-color', 'black');

      if( clicks == 2 ){
        p.position(windowWidth/10, windowHeight/10);
      } else {
        if( x > 7/8*windowWidth || y > 8/10*windowHeight ) {
          if( x > 7/8*windowWidth && !(y > 8/10*windowHeight) ){
            p.position(this.x - 1/8*windowWidth, this.y);
          } else if ( !(x > 7/8*windowWidth) && y > 8/10*windowHeight ) {
            p.position(this.x, this.y - 3/10*windowHeight);
          }else if ( x > 7/8*windowWidth && y > 8/10*windowHeight ) {
            p.position(this.x - 1/8*windowWidth, this.y - 3/10*windowHeight);
          }
        } else {
          p.position(this.x, this.y);
        }
      }
       $( "p" ).fadeOut( 2500 );
       //$( "p" ).fadeOut( 1600 );

      //p.fadeOut();
      //p.fadeOut();


      //this.audio.pause();
      //play a musing about going gray / dyeing
      this.fill = 0;
      this.life = random(0,20);
    }
  }

  this.display = function() {

    //this.audio.play();

    this.life++;

    if(this.life >= graypoint){
      if(Math.round(this.life) === graypoint && clicks == 0){
        clicks++;
        this.fill = (226,226,226);
      } else{
        this.fill+=1;
      }
    }

/*
    //test by playing only one sliver:
    //make this start only once their "life" ends:
    if( slivers.indexOf(this) == 0 ) {
      //console.log( this.life, Math.round(this.life) );
      if( Math.round(this.life) === graypoint ){
        console.log("this.audio file:", this.audio);
        this.audio.loop();
        console.log ("playing audio");
      }
    }
    */

    if( sound ){
      if( Math.round(this.life) === graypoint ){

        //if(slivers.indexOf(this) == 0 ) {
        if(soundCounter < maxAudios){
          soundCounter++;
          this.audio = createAudio('assets/audio/sliver02.mp3');
          soundsofslivers.push(this.audio);
          this.audio.volume(0.01);
          //this.audio.play();
          //this.audio = createAudio('assets/audio/sliver01.mp3', console.log("audio file is ready!"));

          //this.audio.loop();
          //}
        }

        //console.log("this.audio file:", this.audio);
        if(this.audio){
          this.audio.loop();
        }
        //console.log ("playing audio");
      }

      if( Math.round(this.life) === graypoint+100 ){
        //console.log("this.audio file:", this.audio);
        //console.log("this audio is now going to reverb:", this);

        if(this.audio){
          //this.audio.disconnect();
          reverb = new p5.Reverb();
          reverb.process(this.audio, 3, 2);
          //this.audio.loop();
        }
        //console.log ("playing audio");
      }

      if( Math.round(this.life) === graypoint+300 ){
        //console.log("this.audio file:", this.audio);
        //console.log("this audio is now going to reverb:", this);

        if(this.audio){
          //this.audio.disconnect();
          this.audio.pause();
          //reverb = new p5.Reverb();
          reverb.disconnect();
          //this.audio.loop();
        }
        //console.log ("playing audio");
      }
    }




      //if(  ){
  //  if( this.audio.isPlaying ){

//} else {
        //ADD A BEGINNING SOUND to know when a sliver enters
      //  this.audio.play();
        //THEN: if the user clicks on the sliver:
        //change back to black
        //play audio musing about slivers
      //}
      //how to trigger the audio only once?? and not at every draw cycle...
      //this.audio.play();

/*
      if(this.fill == graypoint){
        console.log("going gray", slivers.indexOf(this));
      }
      */

      //if(this.fill <= 100){

      //}
    //}

    //stroke(255); //light gray = 100, white = 255;
    //stroke(0, 0, 0, 0); //light gray = 100, white = 255;
    //strokeWeight(2);

    //with no stroke: somehow makes a black stroke around ellipse?
    //pretty/vilisee also, BUT doesn't fade into invisibilty like the original

    noStroke();
    fill(this.fill);
    ellipse(this.x, this.y, this.d);
    //ellipse(this.x-this.r, this.y-this.r, this.d);
  }

}
