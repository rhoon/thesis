// Scrapes and compiles data from wikipedia pages collected by 'collect.js'
// Takes two parameters: 1) content - the body of the scraped page,
// and 2) url - the url of the scraped page;

// Only collects links to human-written content, or images.
// Only collects links that are written into content (not navbars, navboxes, or similar items)
// Does not include duplicate links from a single page

var cheerio = require('cheerio');
var _ = require('lodash');
var detect = require('./s-detect');

//an array of images to ignore (they mean the page doesn't have a distinct image)
imgJunk = [
  "//upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Quill_and_ink.svg/25px-Quill_and_ink.svg.png",
  "//upload.wikimedia.org/wikipedia/en/thumb/9/99/Question_book-new.svg/50px-Question_book-new.svg.png",
  "//upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Padlock-silver.svg/20px-Padlock-silver.svg.png",
  "//upload.wikimedia.org/wikipedia/en/thumb/e/e7/Cscr-featured.svg/20px-Cscr-featured.svg.png",
  "//upload.wikimedia.org/wikipedia/commons/thumb/0/06/Wiktionary-logo-v2.svg/40px-Wiktionary-logo-v2.svg.png",
  "//upload.wikimedia.org/wikipedia/en/thumb/f/f2/Edit-clear.svg/40px-Edit-clear.svg.png",
  "//upload.wikimedia.org/wikipedia/en/thumb/4/4a/Commons-logo.svg/30px-Commons-logo.svg.png",
  "//upload.wikimedia.org/wikipedia/en/thumb/9/94/Symbol_support_vote.svg/19px-Symbol_support_vote.svg.png",
  "//upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Text_document_with_red_question_mark.svg/40px-Text_document_with_red_question_mark.svg.png",
  "//upload.wikimedia.org/wikipedia/en/thumb/d/db/Symbol_list_class.svg/16px-Symbol_list_class.svg.png",
  "//upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Ambox_important.svg/40px-Ambox_important.svg.png",
  "//upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Wikisource-logo.svg/12px-Wikisource-logo.svg.png",
  "//upload.wikimedia.org/wikipedia/en/thumb/6/6c/Wiki_letter_w.svg/40px-Wiki_letter_w.svg.png",
  "//upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Nuvola_apps_kdict.svg/40px-Nuvola_apps_kdict.svg.png",
  "//upload.wikimedia.org/wikipedia/commons/thumb/8/89/Symbol_book_class2.svg/16px-Symbol_book_class2.svg.png",
  "//upload.wikimedia.org/wikipedia/en/thumb/f/fd/Portal-puzzle.svg/16px-Portal-puzzle.svg.png",
  "//upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Sharp.svg/40px-Sharp.svg.png",
  "//upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Unbalanced_scales.svg/45px-Unbalanced_scales.svg.png",
  "//upload.wikimedia.org/wikipedia/commons/thumb/1/17/Blue_flag_waving.svg/70px-Blue_flag_waving.svg.png",
]


module.exports = {

 scrape: function(content, url, cb) {
  // var content = fs.readFileSync('data/dada.html');

  var wiki = '/wiki/'
  var $ = cheerio.load(content);
  var data = new Object;
  data.mapsTo = [];
  // url = url.slice(wiki.length, url.length);

  // get the first image for interface
  data.image = $('img').attr('src').trim();
  // check for noise-images
  for (var img in imgJunk) {
    if (data.image===imgJunk[img]) {
      data.image = null;
      break;
    }
  }

  // slice at $('a.image').indexOf('File:')
  console.log('IMG '+data.image);

  data.title = $('h1.firstHeading').text();
  console.log('H1 '+data.title);

  //from content, remove navboxes which are tangential information related to metadata
  $('div.navbox').remove();

  //find each a tag and write to an object
  $('div#bodyContent').find('a').each(function(i, elem) {

    var link = $(elem).attr('href');

    if (link!=undefined) {

      if (link.includes('wiki') && !link.includes(wiki+url)) {

        // reformat link to minimize excess
        link = link.slice(wiki.length, link.length);

        //check for junk, then check for wiki in href
        var skip = false;
        if (detect.isJunk(link) || detect.isYr(link) || detect.isTooBroad(link) || detect.isCountry(link)) skip = true;

        // create new object
        if (!skip) data.mapsTo.push(link);

      }
    }

  })

  //remove duplicates, append to object
  data.mapsTo = _.uniq(data.mapsTo);

  // set URLs to scrape
  data.wikiData = $('li#t-wikibase').find('a').attr('href');

  return data;

} //end scrape

} // end exports
