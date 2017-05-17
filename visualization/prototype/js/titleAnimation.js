
// until an element is clicked for the first time,
// or explore / methodology buttons are clicked, cycle through
// various nodes...

var ids = [ 'Thomas_Pynchon', 'George_Orwell', 'Stanley_Kubrick', 'Fyodor Dostoyevsky']
var c = 0;
var noClicks = true;

function starterAnimation() {
  setTimeout(function() {

    var event = document.createEvent("HTMLEvents");
    event.initEvent("click",true,false);
    document.getElementById(ids[c]).dispatchEvent(event);

    console.log('starter animation running '+c);
    c++;
    if (c>=ids.length-1) { c=0; }

    if (noClicks) {
      starterAnimation();
    }

  }, 4000)
}

function replaceTitle(d) {

  console.log('replaceTitle');
  var currentText = d3.select('span#nodeTitle').text(),
      newText = d.value.title,
      dura = 125,
      strIn = 0,
      subtracting = true;

  d3.select('h1#dynamic')
    .style('width', function() {
      var mod=Math.floor(newText.length/2);
      return 27+mod+'%';
    });

  currentText = currentText.split('(')[0];
  if (currentText.split(' ').length>4) {
    var fW = currentText.split(' ');
    currentText = fW[0]+' '+fW[1]+' '+fW[2]+' '+fW[3];
  }

  console.log('new text: '+newText);

  function newTitle() {           // create a loop function
       setTimeout(function () {

        if (subtracting) {
          currentText = currentText.slice(0,-1);
        } else {
          currentText = newText.slice(0, strIn);
          strIn++;
        }
        d3.select('span#nodeTitle').text(currentText);

        if (currentText.length<=0) {
          newTitle();
          console.log('subtracting');
        } else { subtracting=false; }

        if (!subtracting && strIn<=newText.length) {
          newTitle();
          console.log('not subtracting');
        }

    }, dura)
  } // removeTitle

  newTitle();

}
