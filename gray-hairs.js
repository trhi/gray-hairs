/*
*  Gray hairs (2023)
*  by Terhi Marttila
*
*  Gray hairs is about the gendered practice of dyeing one's hair.
*  A collection of fragments/observations collected in conversation with people.
*  Performed through the voice of Terhi Marttila under a collective "I".
*
*  Project credits and acknowledgments:
*
*  Terhi Marttila: concept, programming, texts, voice
*  Tero Marttila: for code written in 2016 for Give Me a Reason that has been
*  simplified to create the function loadAudios()
*  Diogo Cocharro: for recording equipment (audio interface, microphone, stand)
*  Silvia Freitas and Celeste Pedro: for support, encouragement and testing
*  Amanda Hodes and editorial team: for accepting Gray hairs for publication in
*  the Spring 2023 issue of the New River Journal
*
*  This work is part of Terhi's post doctoral artistic research at IST/ID.
*  This research was funded by the Portuguese Recovery and Resilience Program
*  (PRR), IAPMEI/ANI/FCT under Agenda C645022399-00000057 (eGamesLab).
*
*  You are not allowed to copy this work as a whole and present it on a website
*  without my consent. You are not allowed to copy and use the texts. You are
*  not allowed to copy and use the audio recordings.
*
*  The code itself and the concept, ie: fading clickable circles and associated
*  texts or audio recordings as well as the functionality of the menu buttons is licenced
*  under CC BY 4.0 - ie. you are welcome to copy any of this code and use it in
*  whatever way you want. I appreciate if you mention my work as an inspiration
*  or a reference. Please contact me to share any work that is in part inspired
*  by or based on my work, I will be happy to hear about it.
*
*/

let hairSize = 10, graypoint = 250; //150
let xover = 6/8, yover = 8/10;
let clicks = -1, observations, hairs = [], text = true, sound = true, autoplay = false, autoplayCounter = 0, autoplaypause = 2000, playing=false, started = false, linear = true; //clicks=-1 to make it easier to work with the array indexes..;
let fragmentCounter = 0, linearClicks = 0; //used for attributing audio elements to the hairs, used to keep track of where the user is in the reading of the linear poem

function preload() {
  observations = loadJSON('assets/audio/observations.json', loadAudios );
  //loadAudios as callback of loadJSON
  //ie. loadJSON, and once that asynchronous process is done,
  //loadAudios (ie. populate audioDiv with all the audio elements that you got from the JSON)

  function loadAudios(){
      var audioDiv = $('#audio');
      for ( let i=0; i<observations.fragments.length; i++ ){
        var audio = $( "<audio></audio>", {
          id: i, //in order to later maps hairs to audio elements
          src: observations.path+observations.fragments[i].filename,
          txt: observations.fragments[i].text, //in order to get the hair-related text directly out of the audio element
          preload: 'auto',
          on: {
            canplaythrough: function(event){//don't do anything
            },//close canplaythrough:
            ended: function(event){//don't do anything
            }//close ended:
          }//close on:
        });//close var audio
        audioDiv.append(audio);
      }
    }//close loadAudios()
}//close preload()

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
    hairSize = window.innerWidth/27; // changed to 27 to fit all 300 fragments, was /20:
    //if small screen, tweak hairSize to make tappable
  }

  xover *= windowWidth; //calculate the portion of screen where text should not be displayed
  yover *= windowHeight; //ditto

  let hairsX = windowWidth/(hairSize*2-0.2); //how many follicles fit horizontally?
  let hairsY;

  if( window.innerWidth >= 992 ){
    hairsY = (windowHeight-45)/(hairSize*2); //how many follicles fit vertically?
    //cutoff point so that hairs are not created under menu bar
  } else {
    hairsY = (windowHeight-70)/(hairSize*2); //how many follicles fit vertically?
    //cutoff point so that hairs are not created under menu bar
  }

  for (let i=0; i<hairsY+1; i++){
    for (let j=0; j<hairsX;j++){
      //create an array of hair follicles
      //with x and y coordinates that populate screen
      hairs.push( new hair( 2*hairSize*j + hairSize/2, 2*hairSize*i + hairSize/2 ) );
    }
  }
}//close setup

function giveInfo() {
  $("#instructions").show();
  $(".instructionsP").show();
  $(".instructionsP").stop();
}

function readMe() {

  if( autoplay && started ){
    let autoplaying;

    if ( !linear ){
      autoplaying = random(hairs); //chooses random hairs to play
    } else {
      if ( autoplayCounter == hairs.length ){
        autoplayCounter = 0;
      }
      autoplaying = hairs[autoplayCounter];
      autoplayCounter++;
    }
    if (autoplaying.life > graypoint){
      autoplaying.clicked();
      playing = true;
      setTimeout( readMe , autoplaypause ); // originally: 2000, autoplaypause
    } else {
      readMe();
    }
  }
} //close readMe

function toggleTrueFalse(variable, value) {

  //set image src for variable to opposite of what it was before:
  document.getElementById(variable).src = `assets/img/${variable}-${(!value).toString()}.jpg`;
  //only special condition is if ( variable === autoplay ):
  if ( variable === 'autoplay') {
      if ( value ){
        readMe(); //start autoplaying
      } else {
        playing = false; //stop autoplaying
      }
  }
  // if the value is currently false, set it to true and vice versa:
  eval(variable + " = " + !value + ";");
  //this line of code just changes the value to the opposite of what it was before

}//close toggleTrueFalse

function paintBucket(){
  started = false; //to stop autoplay, if it is on
  setTimeout( () => { started=true; readMe(); }, 3000); //take a 3s break
  //to give time for hairs to go gray
  //so that readMe does not go into infinite loop after dyeing hairs
  for( let i=0; i < hairs.length; i++ ){
    hairs[i].fill = 0; //paint all hairs black
    hairs[i].life = random(0, graypoint-10); //give them a new life, quite close to graypoint
   }
}

function draw() {
  if( autoplay == false ){
    playing = false;
    //if the user has paused autoplay,
    //this sets playing to false in order to break out of the ReadMe loop
  }

  if ( autoplay  && !playing ){ //if autoplay has been clicked to true
    //but playing is false, ie. nothing is playing, call readMe:
    readMe();
  }

  if( frameCount == 4 ){ //show instruction after person opens work
    let p;
    if ( autoplay ){
      p = createP("<em> wait for the first gray hair </em>");
    } else {
      p = createP("<em> wait for the first gray hair, then tap it </em>");
    }
    p.position(windowWidth/10, windowHeight/10);
    $( "p" ).fadeOut( 12000 );
  }

  clear();
  drawHairs();
  // what color is the pixel/hair that the user is mousing over?
  let pixelColor = get(mouseX, mouseY)[0] + get(mouseX, mouseY)[3];
  if ( pixelColor == 255 || pixelColor == 0 ){
    cursor(ARROW); //show normal arrow for black hairs
  } else {
    cursor(CROSS); //show crosshair for graying hairs
  }
}

function drawHairs() {
  for( let i=0; i < hairs.length; i++ ){ hairs[i].display(); }
}

function mousePressed() {
  if ( !autoplay ){ //clicking is disabled when in autoplay
//if ( !autoplay || autoplay ){ //clicking is always enabled
    hairs.forEach( element => element.clicked(mouseX, mouseY) );
  }
}//close mousePressed

function hair(x, y){

  if(!x || !y){ //if no x OR y given when they are created, put them in a random position:
    x = random(0, windowWidth);
    y = random(0, windowHeight);
  }

  this.x = x;
  this.y = y;
  this.r = hairSize;
  this.d = 2*this.r;
  this.fill = 0;
  this.life = random(0, graypoint-50);
  //this.life = random(0, 20); //takes a veeery long time until grays start to appear
  //this.life = random(0, graypoint); //grays appear immediately

  if ( fragmentCounter == observations.fragments.length ){
    fragmentCounter = 0;
  }
  this.audio = $("#" + fragmentCounter);
  fragmentCounter++;

  this.display = function() {
    this.life++;
    if(this.life >= graypoint){
      if( Math.round(this.life) === graypoint && clicks == -1){
        clicks++;
        this.fill = (226,226,226); //snap the firts gray hair to light gray immediately to catch attention
        started = true;
      } else {
         if(clicks < ( (2/3)*(observations.fragments.length) ) ){ //if the user has clicked through less than 2/3rds of the narrative
           if ( clicks == 0){
           } else {
             this.fill = (37,37,37); //starts the initial graying faster
           }
          this.fill+=0.3; //fade the hairs even more slowly, //this.fill+=0.5; //fade the hairs more slowly
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

    //first check if the user clicked inside this circle:
    if( dist <= this.r && this.life >= graypoint ) { //if taps within the radius of the circle

      //then check whether linear mode is on:
      if ( linear ){
        if( linearClicks == observations.fragments.length ){
          linearClicks = 0;
        }
        chosen = $("#"+linearClicks);
        linearClicks++;
      } else {
        //if its not in linear mode, then clicking a dot means that
        //chosen - ie. what we will soon play - is this.audio.
        chosen = this.audio;
      }

      if ( text ){
        let p = createP(" " + chosen.attr('txt') + " ");
        p.style("border-radius","25px");

        //the code below positions text and sets how long it takes to fade out:
        if( linear && linearClicks == 1 ){
          p.position(windowWidth/10, windowHeight/10);
          $( "p" ).fadeOut( 5000 );
        } else { //this just makes sure that the text displayed does not go over the edges of the screen:
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
          //we are no longer counting clicks... so this is not doing anything:
          if ( linear && linearClicks == observations.fragments.length ){ //if in linear, fade out: the end very very slowly
            $( "p" ).fadeOut( 12345 ); //fade the last word out very slowly
          } else {
            $( "p" ).fadeOut( 2500 ); //fade other text out after normal interval
            //this makes the p's of the info box also fade out....
          }
        }
      }//end if ( text )

      if ( sound ){
        chosen[0].play(); //not checking for if other audio is playing
        //in order to allow users to layer audio
      }//end if ( sound )

      //finally, reset hair follicle to black and give it a new life:
      this.fill = 0;
      this.life = random(0,20);
    }//close if (tap within this hair)
  }//close this.clicked

}//close hair()
