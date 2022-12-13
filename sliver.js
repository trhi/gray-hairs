let x, y;
let url, audio;
let anotherSliver, slivers = [];
let soundofsliver, soundsofslivers = [];

function preload() {
  soundofsliver = createAudio('assets/audio/sliver01.mp3');
  //load soundsofslivers

  //in p5/preload() this will load before going into setup:
  url = 'assets/audio/slivers.json';
  audio = loadJSON(url);
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  for(let n=0; n<5; n++){
    anotherSliver = new sliver();
    slivers.push(anotherSliver);
  }

}

function draw() {

  frameRate(1);

  //at each draw-cycle, create a new sliver object:
  //then, at each draw cycle, display sliver object, but with grayscale going from 0 -> 100
  //anotherSliver = new sliver();
  //slivers.push(anotherSliver);

  //background(220);
  //ellipse(50,50,80,80);

  drawSlivers();



}

function touchStarted(event) {
  console.log(event, mouseX, mouseY);
  slivers.forEach( element => element.clicked(mouseX, mouseY) );
}

function drawSlivers() {

  //OR: populate first with x black dots,
  //then time their graying == playing to start much later, slowly...
  for(let i=0; i < slivers.length; i++){
    slivers[i].display();
  }


}

function sliver(){

  //how to avoid having them all on top of eachother?
  this.x = random(0, width-100);
  this.y = random(0, height-100);
  this.d = 100;
  this.fill = 0;

  this.life = random(0,95);
  this.audio = createAudio('assets/audio/sliver1.mp3');

  this.clicked = function (x,y) {
    //if length of this.x, this.y VS. mouseX, mouseY is less than this.d/3
    //ie. if click happens within first third of circle:
    let me = createVector(this.x, this.y);
    let mouse = createVector(x, y);
    let dist = me.dist(mouse);
    if( dist <= this.d/3 && this.life>=95 ) {

      //console.log("clicked me!", slivers.indexOf(this) );
      //console.log(">>", audio.slivers[2].text);

      let chosen = random(audio.slivers);

      //but this text is overwritten at every loop:
      //textSize(20);
      //text(">>" + chosen.text, this.x, this.y);

      let p = createP(">> " + chosen.text);
      //p.style('font-size', '30px');
      //p.style('color', 'white');
      //p.style('background-color', 'black');
      p.position(this.x, this.y);
       $( "p" ).fadeOut( 1600 );
      //p.fadeOut();
      //p.fadeOut();


      this.audio.pause();
      //play a musing about going gray / dyeing
      this.fill=0;
      this.life = random(0,95);
    }
  }

  this.display = function() {

    this.life++;
    //make this start only once their "life" ends:
    if(this.life>=95){
      if(this.audio.isPlaying ){

      } else {
        //ADD A BEGINNING SOUND to know when a sliver enters
        //this.audio.play();
        //THEN: if the user clicks on the sliver:
        //change back to black
        //play audio musing about slivers
      }
      //how to trigger the audio only once?? and not at every draw cycle...
      this.audio.play();

      if(this.fill == 100){
        console.log("going gray", slivers.indexOf(this));
      }

      if(this.fill <= 100){

        this.fill+=10;
      }
    }

    stroke(100);
    strokeWeight(2);
    fill(this.fill);
    ellipse(this.x, this.y, this.d, this.d);
  }

}
