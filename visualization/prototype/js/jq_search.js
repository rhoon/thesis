

function search(ele) {
    if(event.keyCode == 13) {
        console.log(ele.value);
        var id = titleList.indexOf(ele.value);
        highlightNode(urlList[id]);
    }
}

function magClick() {
    var textToSearch = document.getElementById('search').value;
    if (textToSearch!='' && textToSearch!=undefined) {
      // alert(textToSearch);
      console.log(textToSearch);
      highlightNode(ele.value);
    }
}

function highlightNode(id) {
    // select a node with matching id
    // and show as the 'clicked' state

    id = '#'+id;
    console.log(id);
    var elem = d3.select(id)
      .style('fill', 'blue');

}
