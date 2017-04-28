var fs = require('fs');

//all of wikipedia's countryURLs
var countryURLs = ["United_Nations_System","Member_states_of_the_United_Nations","List_of_sovereign_states#Abkhazia","Afghanistan","Albania","Algeria","Andorra","Angola","Antigua_and_Barbuda","Argentina","Armenia","Australia","Austria","Azerbaijan","The_Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia_and_Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina_Faso","List_of_sovereign_states#Myanmar","Burundi","Cambodia","Cameroon","Canada","Cape_Verde","Central_African_Republic","Chad","Chile","China","List_of_sovereign_states#Taiwan","Colombia","Comoros","Democratic_Republic_of_the_Congo","Republic_of_the_Congo","List_of_sovereign_states#Cook_Islands","Costa_Rica","List_of_sovereign_states#Ivory_Coast","Croatia","Cuba","Cyprus","Czech_Republic","List_of_sovereign_states#Korea_North","List_of_sovereign_states#Congo.2C_Democratic_Republic_of_the","Denmark","Djibouti","Dominica","Dominican_Republic","East_Timor","Ecuador","Egypt","El_Salvador","Equatorial_Guinea","Eritrea","Estonia","Ethiopia","Fiji","Finland","France","Gabon","The_Gambia","Georgia_(country)","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana","Haiti","List_of_sovereign_states#Vatican_City","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Republic_of_Ireland","Israel","Italy","Ivory_Coast","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","North_Korea","South_Korea","List_of_sovereign_states#Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Republic_of_Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall_Islands","Mauritania","Mauritius","Mexico","Federated_States_of_Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","List_of_sovereign_states#Nagorno-Karabakh","Namibia","Nauru","Nepal","Kingdom_of_the_Netherlands","New_Zealand","Nicaragua","Niger","Nigeria","List_of_sovereign_states#Niue","List_of_sovereign_states#Northern_Cyprus","List_of_sovereign_states#Korea_North","Norway","Oman","Pakistan","Palau","State_of_Palestine","Panama","Papua_New_Guinea","Paraguay","Peru","Philippines","Poland","Portugal","List_of_sovereign_states#Transnistria","Qatar","List_of_sovereign_states#Korea_South","List_of_sovereign_states#Congo.2C_Republic_of_the","Romania","Russia","Rwanda","List_of_sovereign_states#SADR","Saint_Kitts_and_Nevis","Saint_Lucia","Saint_Vincent_and_the_Grenadines","Samoa","San_Marino","S%C3%A3o_Tom%C3%A9_and_Pr%C3%ADncipe","Saudi_Arabia","Senegal","Serbia","Seychelles","Sierra_Leone","Singapore","Slovakia","Slovenia","Solomon_Islands","Somalia","List_of_sovereign_states#Somaliland","South_Africa","List_of_sovereign_states#Korea_South","List_of_sovereign_states#South_Ossetia","South_Sudan","Spain","Sri_Lanka","Sudan","List_of_sovereign_states#South_Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","List_of_sovereign_states#Taiwan","Tajikistan","Tanzania","Thailand","List_of_sovereign_states#East_Timor","Togo","Tonga","List_of_sovereign_states#Transnistria","Trinidad_and_Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu","Uganda","Ukraine","United_Arab_Emirates","United_Kingdom","United_States","Uruguay","Uzbekistan","Vanuatu","Vatican_City","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe","Member_states_of_the_United_Nations","Abkhazia","Cook_Islands","Kosovo","Nagorno-Karabakh_Republic","Niue","Northern_Cyprus","Sahrawi_Arab_Democratic_Republic","Somaliland","South_Ossetia","Taiwan","Transnistria"]

// these are checked with 'includes'
var junkURLs = [
  'Special:',
  'Category:',
  'ex.php?',
  'Help:',
  'Wikipedia:LIBRARY',
  'Public_domain',
  'Wikipedia:Citation_needed',
  'File:Wikiquote-logo.svg',
  'File:Commons-logo.svg',
  "_modern_and_contemporary_",
  'User_talk',
  'Talk:',
  'Template:',
  'Wikipedia:',
  'Wikipedia_talk:',
  'User:',
  'Portal:',
  'w/index.php?',
  "Index_of_",
  "List_of_",
  "_century",
  "Culture_of_",
  "History_of_",
  "Timeline_of_",
  "es.wikipedia.org",
  "de.wikipedia.org",
  "ja.wikipedia.org",
  "nl.wikipedia.org",
  "Category:",
  "wikisource.org",
  "Glossary_of_",
  "Wikipedia:Verifiability",
  "International_Standard_Book_Number",
  "wiktionary.org",
  "_(disambiguation)",
  "Book_talk:",
  "fr.wikipedia.org",
  "_talk:",
  "Draft:",
  "21st-century_",
  "20th-century_",
  "19th-century_",
  "18th-century_",
  "World_War_",
];

// these are checked with equality
var tooBroad = [
  "Art",
  "Visual_arts",
  "Art_movement",
  "Poetry",
  "Performance_art",
  "Abstract_art",
  "Painting",
  "Poet",
  "Theatre",
  "Sculpture",
  "Satire",
  "Artist",
  "Literature",
  "French_literature",
  "Art_history",
  "Art_of_Europe",
  "Art_of_Asia",
  "Art_of_America",
  "Western_painting",
  "Cultural_movement",
  "Colonialism",
  "Irrationality",
  "Fascism_and_ideology",
  "Comedy_(drama)",
  "Retrospective",
]

// for filtering
var months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
]

function hasYear(myString) {
  return /\d\d\d\d/.test(myString);
}

module.exports = {

  isCountry: function(earl) {

    var fact = false;
    for (var c in countryURLs) {
      if (earl===countryURLs[c]) {
        fact = true;
        break;
      }
    }
    return fact;
  },

  isTooBroad: function(earl) {

    var fact = false;
    for (var t in tooBroad) {
      if (earl===tooBroad[t]) {
        fact = true;
        break;
      }
    }
    return fact;

  },

  isYr: function(earl) {

    var fact = false;
    if (hasYear(earl)) {
      for (var yr = 1800; yr<2018; yr++) {

        if (earl.includes(yr+'_in_')) {
          fact = true;
          break;
        } else if (earl == yr) {
          fact = true;
          break;
        } else if (earl == yr+'s') {
          fact = true;
          break;
        }

        if (earl.length>10) {
          for (var mo in months) {
            if (earl.includes(months[mo]+'_'+yr)) {
              fact = true;
              break;
            }
          }
        }

      }
    }
    return fact;

  },

  isJunk: function(earl) {

    var fact = false;
    for (var j in junkURLs) {
      if(earl.includes(junkURLs[j])) {
        fact = true;
        break;
      }
    }

    return fact;

  }

}
