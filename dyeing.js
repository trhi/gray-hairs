let sliverSize = 10, graypoint = 250; //150
let xover = 6/8, yover = 8/10;
let clicks = -1, observations, slivers = [], text = true, sound = true, autoplay = false, playing=false, started = false, linear = true; //clicks=-1 to make it easier to work with the array indexes..;
let iterator = 0, clicking = true, playpoem = false; //TODO: not using clicks, iterator, clicking? TODO: check if using playpoem and playing?
let chosenBranch, branchIterator = 0, autoplayCounter = 0; //TODO: remove these, no longer used?
let playpoemCounter = 0, linearClicks = 0; //used for attributing audio elements to the hairs, used to keep track of where the user is in the reading of the linear poem
let infoButton;

function preload() {
  observations = loadJSON('assets/audio/slivers.json', loadAudios );
  //loadAudios as callback of loadJSON
  //ie. loadJSON, and once that asynchronous process is done,
  //loadAudios (ie. populate audioDiv with all the audio elements that you got from the JSON)

function loadAudios(){
    var audioDiv = $('#audio');
    var loadingAudio = 0; //may not need this variable... letting users layer audio on top of eachother
    var playingAudio = 0; //may not need this variable either, because letting users layer audio on top of eachother.
    //don't really need either of these since loadAudios is happening inside preload
    //meaning that setup() will not run until all asynchronous functions within preload() have resolved their promises?

    for ( let i=0; i<observations.playpoem.length; i++ ){
      var audio = $( "<audio></audio>", {
        id: i, //in order to later maps hairs to audio elements
        src: observations.path+observations.playpoem[i].filename,
        txt: observations.playpoem[i].text, //in order to get the hair-related text directly out of the audio element
        preload: 'auto',
        on: {
          canplaythrough: function(event){
            loadingAudio--;
            if(loadingAudio === 0){
              //this.play(); //comment this out for now, because we create all audio elements first, play them later..
            }
          },//close canplaythrough:
          ended: function(event){
            playingAudio++;
            clicking = true; //not using this atm:
            //can use this to enable/disable clicking while audio is playing,
            //but decided to enable clicking always because its nice to layer the audio
            //TODO: remove this/itself from the audioDiv?
            //^^ no longer necessary: creating a maximum of 300 audio elements

          }//close ended:
        }//close on:
      });//close var audio
      audioDiv.append(audio);
    }
  }//close loadAudios()


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
    sliverSize = window.innerWidth/27; // changed to 27 to fit all 300 fragments, was /20:
    //if small screen, tweak sliverSize to make tappable
  }

  xover *= windowWidth; //calculate the sliver of screen where text should not be displayed
  yover *= windowHeight; //ditto

  let sliversX = windowWidth/(sliverSize*2); //how many follicles fit horizontally?
  let sliversY;

  if( window.innerWidth >= 992 ){
    sliversY = (windowHeight-50)/(sliverSize*2); //how many follicles fit vertically?
    //cutoff point so that slivers are not created under menu bar
  } else {
    sliversY = (windowHeight-75)/(sliverSize*2); //how many follicles fit vertically?
    //cutoff point so that slivers are not created under menu bar
  }

  for (let i=0; i<sliversY+1; i++){
    for (let j=0; j<sliversX;j++){
      //create an array of hair follicles
      //with x and y coordinates that populate screen
      slivers.push( new sliver( 2*sliverSize*j + sliverSize/2, 2*sliverSize*i + sliverSize/2 ) );
      // 2.5*sliverSize*j makes them look like strands of hair
      //it was  + sliverSize/2 for both x and y in order to make the first and last hairs go off screen
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
      autoplaying = random(slivers); //chooses random slivers to play
    } else {
      if ( autoplayCounter == slivers.length ){
        autoplayCounter = 0;
      }
      autoplaying = slivers[autoplayCounter];
      autoplayCounter++;
    }
    if (autoplaying.life > graypoint){
      autoplaying.clicked();
      playing = true;
      setTimeout( readMe , 2000 );
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
  for( let i=0; i < slivers.length; i++ ){
    slivers[i].fill = 0; //paint all hairs black
    slivers[i].life = random(0, graypoint-10); //give them a new life, quite close to graypoint
   }
   //alterantely, use this: which also let's you tap black hairs (because they are aged even though they are black..)
   //ie. this does not set the life of the hairs backwards:
  //for( let i=0; i < slivers.length; i++ ){ slivers[i].fill = 0; slivers[i].life = random(0, graypoint-50); } //effectively silences the poem
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

function mousePressed() {
  if ( !autoplay ){ //clicking is disabled when in autoplay
//if ( !autoplay || autoplay ){ //clicking is always enabled
    slivers.forEach( element => element.clicked(mouseX, mouseY) );
  }
}//close mousePressed



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

  if ( playpoemCounter == observations.playpoem.length ){
    playpoemCounter = 0;
  }
  this.audio = $("#" + playpoemCounter);
  playpoemCounter++;

  this.display = function() {
    this.life++;
    if(this.life >= graypoint){
      if( Math.round(this.life) === graypoint && clicks == -1){
        clicks++;
        this.fill = (226,226,226); //snap the firts gray hair to light gray immediately to catch attention
        started = true;
      } else {
         if(clicks < ( (2/3)*(observations.slivers.length) ) ){ //if the user has clicked through less than 2/3rds of the narrative
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
        if( linearClicks == observations.playpoem.length ){
          linearClicks = 0;
        }
        //associate a onetime "chosen" to an audio element instead of assigning it to this.audio
        //when the user has linear narrative mode selected
        //TODO: remove this.chosen (because chosen/linear is a onetime variable
        //so no need to update it to the sliver object itself)
        chosen = $("#"+linearClicks);
        linearClicks++;
      } else {
        //if its not in linear mode, then clicking a dot means that
        //chosen - ie. what we will soon play, is this.audio.
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
          if ( linear && linearClicks == observations.playpoem.length ){ //if in linear, fade out: the end very very slowly
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

}//close sliver()
