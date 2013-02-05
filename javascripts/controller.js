var home = new Home();
var discovery = new Discovery();
var spotlight = new Spotlight();

var currentPage = home;
var search_name;
var artist_name;
var artist_id;

function goHome() {
	home.on();
	discovery.off();
	spotlight.off();
}

function initialSearch(nextPage) {
	empty();
	getSearchName();
	if(search_name !== "") {
		getArtistName_digital();
		getArtistName_fm();
		if(nextPage !== home) {
			nextPage.populate(artist_name,artist_id);
		}
		if(currentPage !== nextPage) {
			currentPage.off();
			nextPage.on();
		}
		currentPage = nextPage;
	}
}

function stumbleThrough(search) {
	empty();
	search_name = search;
	getArtistName_digital();
	getArtistName_fm();
	discovery.populate(artist_name,artist_id);
}

function getSearchName() {
	if(currentPage === home) {
		search_name = document.getElementById('main_artist_searchpage').value;
	}
	else {
		search_name = document.getElementById('search_topbar').value;
		if(search_name === "") {
			search_name = artist_name;
		}
	}
	if(search_name === "") {
		alert("You didn't put an artist!");
	}
}

function populateTopTracks() {
	spotlight.postTopTracks(artist_id);
}

function getArtistName_digital() {
	var xml_obj = new XMLHttpRequest;
    xml_obj.onload = function(xmlEvent)
    {
        var xml_document = this.responseXML;
        if(xml_document.getElementsByTagName('totalItems')[0].textContent !== "0") {
        	artist_name = xml_document.getElementsByTagName('name')[0].textContent;
       	 	artist_id = xml_document.getElementsByTagName('artist')[0].attributes.id.textContent;
        }
    }
    var url_obj = 'http://api.7digital.com/1.2/artist/browse?letter='
                    + search_name + '&oauth_consumer_key=7dg99v5j5e2n&redirect=false&country=US';
    
    xml_obj.open('GET', encodeURI(url_obj), false);
    xml_obj.send();
}

function getArtistName_fm() {
	var xml_obj = new XMLHttpRequest;
	xml_obj.onload = function(xmlEvent) 
    {
        var xml_document = this.responseXML;
        var searchResults = xml_document.getElementsByTagName('artistmatches')[0];
        //first search result correlates to top hit from our input
        var firstResult = searchResults.getElementsByTagName('artist')[0];
        artist_name = firstResult.getElementsByTagName('name')[0].textContent;
        $("#main_artist_name").append("Artists Similar To..." + artist_name);
        $("#main_artist-heading").append(artist_name);
    }
    var url_obj = 'http://ws.audioscrobbler.com/2.0/?method=artist.search&artist='
                    + search_name + '&api_key=997058052f96f003088c5553fbd41c1a';
    xml_obj.open('POST', encodeURI(url_obj), false);
    xml_obj.send();
}

