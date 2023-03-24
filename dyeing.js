let sliverSize = 10, graypoint = 250; //150
let xover = 6/8, yover = 8/10;
let observations, slivers = [], clicks = -1, iterator = 0, clicking = true, text = true, sound = true, autoplay = false, playing=false, playpoem = false; //clicks=-1 to make it easier to work with the array indexes..
let chosenBranch;
let branchIterator = 0;
let playpoemCounter = 0;
let autoplayCounter = 0;

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
    sliverSize = window.innerWidth/27; // was /20 if small screen, tweak sliverSize to make tappable
  }

  xover *= windowWidth; //calculate the sliver of screen where text should not be displayed
  yover *= windowHeight; //ditto

  let sliversX = windowWidth/(sliverSize*2); //how many follicles fit horizontally?
  let sliversY = windowHeight/(sliverSize*2); //how many follicles fit vertically?

  for (let i=0; i<sliversY+1; i++){
    for (let j=0; j<sliversX;j++){
      //create an array of hair follicles
      //with x and y coordinates that populate screen
      slivers.push( new sliver( 2*sliverSize*j + sliverSize/2, 2*sliverSize*i + sliverSize/2 ) );
      // 2.5*sliverSize*j makes them look like strands of hair
      //it was  + sliverSize/2 for both x and y in order to make the first and last hairs go off screen
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

function readMe() {

  if( autoplay ){

    let autoplaying;

    if ( !playpoem ){
      autoplaying = random(slivers); //chooses random slivers to play
    } else {
      if ( autoplayCounter == slivers.length ){
        autoplayCounter = 0;
      }
      autoplaying = slivers[autoplayCounter];
      autoplayCounter++;
    }
    //console.log("chose this one:", autoplaying);
    if (autoplaying.life > 250){
      //console.log("I am gray!");
      //autoplaying.fill = 'pink';
      autoplaying.clicked();
      playing = true;
      setTimeout( readMe , 2000 );
    } else {
      //console.log("I am not gray!");
      readMe();
    }
  }

} //close readMe

function toggleTrueFalse(variable, value) {

  //console.log("I just received:", variable, "and it is:", value);
  if( value ){
    eval(variable + " = " + !value + ";");
    if( variable === 'text'){
      console.log("changing text");
      $('text').html("CHANGED");
    }
    if( variable === 'paintbucket'){
      console.log("changing text");
      $('text').html("<s>paintbucket</s>");
    }
    //console.log("I received:", variable, "and set it to:", !value);
  } else {
    eval(variable + " = " + !value + ";");
    if( variable === 'text' ){
      $('text').html("Abc");
    }
    //console.log("I received:", variable, "and set it to:", !value);
  }
}

function paintBucket(){
  console.log("painting hairs");
  for( let i=0; i < slivers.length; i++ ){
    slivers[i].fill = 0;
    slivers[i].life = random(0, graypoint-10);
   } //let's you tap black hairs (because they are aged even though they are black..)
  //for( let i=0; i < slivers.length; i++ ){ slivers[i].fill = 0; slivers[i].life = random(0, graypoint-50); } //effectively silences the poem
}


function draw() {

  if( autoplay == false ){
    playing = false;
  }

  //CANNOT BE LIKE THIS... this will call the function at EVERY draw cycle....
  if ( clicks > -1 && autoplay && !playing){
    readMe();
  }


  //for showing the user how far along they are in the reading of the work:
  /*
  if(clicks > -1){
    let p = createP(clicks + " / " + observations.slivers.length );
    p.position(20, 20);
    p.style("border-radius","25px");
  }
  */

  if( frameCount == 4 ){ //show instruction after person opens work
    let p;
    if ( autoplay ){
      p = createP("<em> wait for the first gray hair </em>");
    } else {
      p = createP("<em> wait for the first gray hair, then tap it </em>");
    }
    p.position(windowWidth/10, windowHeight/10);
    $( "p" ).fadeOut( 10000 );
  }

  clear();
  drawSlivers();
  // what color is the pixel/hair that the user is mousing over?
  let pixelColor = get(mouseX, mouseY)[0] + get(mouseX, mouseY)[3];
  if ( pixelColor == 255 || pixelColor == 0 ){
    cursor(ARROW); //show normal arrow for black hairs
  } else {
    //if(clicking){
      cursor(CROSS); //show crosshair for graying hairs
    //} else {
    //  cursor(WAIT); //show wait cursor while audio is playing.. not nice at all..
    //}
  }
}

function drawSlivers() {
  for( let i=0; i < slivers.length; i++ ){ slivers[i].display(); }
}


function mousePressed() {
  //console.log("mouse pressed");
  //upon touchStarted, check which hair was clicked by going through the array of hairs:
  if ( !autoplay && clicking && clicks <= observations.slivers.length-1 ){ //but only if there is still text left to show
    slivers.forEach( element => element.clicked(mouseX, mouseY) );
  } //else do nothing
}


/* //seems to not work on Firefox and Safari:
function touchStarted(event) {
  console.log("touch started");
  //upon touchStarted, check which hair was clicked by going through the array of hairs:
  if ( clicks <= observations.slivers.length-1 ){ //but only if there is still text left to show
    slivers.forEach( element => element.clicked(mouseX, mouseY) );
  } //else do nothing
  return false;
}
*/

function giveInfo(){ //TODO: infobutton, or maybe not necessary?
  info.show();
}

//Credits of this method go to TNT, courtesy of Tero Marttila (August of 2016)
//The code in play() is copied from Give me a Reason, which was written by
//Tero Marttila in August of 2016 when we refactored my otherwise functional code:
//of course it has been adapted here to the necessities of this work:
function play(chosen){ //so you are passing it an actual object from the json file
//this function is creating a new audio element each time play() is called,
//meaning that duplicates are made everytime the poem begins again,
//instead of pointing to one of the existing 300 audio elements which would be much smarter and useful

//instead: populate the audioDIV immediately (at setup or preload),

  var audioDiv = $('#audio');
  //audioDiv.empty(); //this stops all audio that is currently playing and starts playing the new audio
  //by NOT emptying the audioDiv, the user can layer the audio!! VERY NICE!
  //risk: page may crash because of too many simultaneous audio elements?
  var loading = 0;
  var playing = 0;

  loading++;
  if(loading == 1){
    //clicking = false; //enable this to force the user to finish listening before clicking again
    //the problem with this approach is that it feels like the interface doesn't work..
    clicking = true; //let the user click as quickly as they want - this way audio will cut off if it hasn't finished playing
    //letting the user click whenever they want to makes for a better user experience
    //it is likely that they will self regulate and pace their clicking in order to listen
  }

  var audio = $( "<audio></audio>", {
    src: observations.path+chosen.filename,
    txt: chosen.text,
    preload: 'auto',
    on: {
      canplaythrough: function(event){
        loading--;
        if(loading === 0){
          this.play();
        }
      },//close canplaythrough:
      ended: function(event){
        playing++;
        clicking = true;
        //TODO: remove this/itself from the audioDiv

      }//close ended:
    }//close on:
  });//close var audio
  audioDiv.append(audio);

}//close play()

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


if ( playpoem ){
    if ( playpoemCounter == observations.playpoem.length ){
      playpoemCounter = 0;
    }
    this.chosen = observations.playpoem[ playpoemCounter ]; // selects an object from the json file,
    playpoemCounter++;

}

  //as a counter we will use slivers.length,
  //because when we are creating the slivers,
  //we know the position of this sliver in the array by checking against
  //slivers.length

  //this.life = random(0, 20); //takes a veeery long time until grays start to appear
  //this.life = random(0, graypoint); //grays appear immediately

  //TODO: manage the lives of the hair follices in more detail?
  //make it so that the first one is the only one in a long time
  //and then exponentially & slowly more begin to appear?

  this.display = function() {
    this.life++;
    if(this.life >= graypoint){
      if( Math.round(this.life) === graypoint && clicks == -1){
        clicks++;
        this.fill = (226,226,226); //snap the firts gray hair to light gray immediately to catch attention

        if ( autoplay ){
          readMe();
        }

      } else if ( clicks == 0 && iterator == 1 ) {
    //} else if ( clicks == 1 && iterator == 1 ) { //when the text starts with an array instead of the title: Gray hairs (2023)
        this.fill = (37,37,37);

      } else {
         if(clicks < ( (2/3)*(observations.slivers.length) ) ){ //if the user has clicked through less than 2/3rds of the narrative
          //this.fill+=0.5; //fade the hairs more slowly
          this.fill+=0.3; //fade the hairs even more slowly
        } else {
          this.fill+=1; //for the last third, make the hairs fade faster
        }
      }
    }
    noStroke();
    fill(this.fill);
    ellipse(this.x, this.y, this.d);
  }

  this.clicked = function (x,y) {

    if ( !x && !y ){
      x = this.x;
      y = this.y;
    }
    let me = createVector(this.x, this.y);
    let mouse = createVector(x, y);
    let dist = me.dist(mouse);
    let chosen;

    if( dist <= this.r && this.life >= graypoint ) { //if taps within the radius of the circle

      if ( this.chosen ){
        chosen = this.chosen; //if chosen has been set initially, use it,
        //else choose the next one in the list according to clicks and branching and arrays...
      } else {

      //TODO: make clicks start at -1! It is easier for the array index...
      if( Array.isArray( observations.slivers[clicks] ) ){
        if( Array.isArray( observations.slivers[clicks][iterator] ) ){
          //if it is an array of arrays of fragments:
          //if there is an array at the index=iterator, then assume that there are various arrays
          //and choose a random array from within this array:
          console.log("there is an array of arrays at this index! Chosen branch is: ", chosenBranch);
          //choose random array:


          if( branchIterator == 0 ){
            chosenBranch = random( observations.slivers[clicks] );
            console.log("Chosen branch is: ", chosenBranch);

          }
          if( branchIterator < chosenBranch.length ) {
            chosen = chosenBranch[branchIterator];
            branchIterator++;
            if( branchIterator == chosenBranch.length ){ //once you've come to the last thought of that collection of fragments
              branchIterator = 0; //set the array iterator back to zero
              clicks++; //and then move on along the main array of fragments
              //chosenBranch = undefined;
            }
          }



        } else {
          //if it just an array of fragments, iterate through them:
          //console.log("its an array! And clicks = ", clicks);
          //console.log("its an array! Length is = ", observations.slivers[clicks].length);

          if( iterator < observations.slivers[clicks].length ) {
            chosen = observations.slivers[clicks][iterator];
            iterator++;
            if( iterator == observations.slivers[clicks].length ){ //once you've come to the last thought of that collection of fragments
              iterator = 0; //set the array iterator back to zero
              clicks++; //and then move on along the main array of fragments
            }
          }

        }
      } else {
        //console.log("its not an array! And clicks = ", clicks);
        chosen = observations.slivers[clicks];
        clicks++;
      }

        }


      //let p = createP(">> " + chosen.text); //originally: include ">>" before text
      //at this point the text has been chosen:

      //test what the experience is like without displaying the text at all, only audio:
      if ( text ){

        let p = createP(" " + chosen.text + " ");
        p.style("border-radius","25px");
        //border-radius: 25px;

        //the code below positions text and sets how long it takes to fade out:
        if( clicks == 0 && iterator == 1 ){ // == 2, this hardcodes for the first line of text to appear in top left
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


      }//end if ( text )

      if ( sound && chosen.filename ){
        play(chosen);
      }//end if ( sound )

      //finally, reset hair follicle to black and give it a new life:
      this.fill = 0;
      this.life = random(0,20);
    }//close if (tap within this hair)

  }//close this.clicked

}//close sliver()
