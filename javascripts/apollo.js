// Cindy Zeng: czeng; Daniel Muller: dmuller

window.artist_name;
window.formatted_artist_name;
window.digital_artist_id;
window.previous_artist;
window.previous_state;





// PAGE NAVIGATIONS

//makes discovery div viewable and hides others
function discoveryOn()
{
    var discoveryDiv = $('#discovery');
    var marketplaceDiv = $('#marketplace');
    discoveryDiv.attr('class','on');
    marketplaceDiv.attr('class','off');
    discoveryDiv.css('display','block');
    marketplaceDiv.css('display','none');
    window.previous_state = 'discovery';
}

//hides discovery div and makes market place visible
function marketPlaceOn() {
    var discoveryDiv = $('#discovery');
    var marketplaceDiv = $('#marketplace');
    discoveryDiv.attr('class','off');
    marketplaceDiv.attr('class','on');
    discoveryDiv.css('display','none');
    marketplaceDiv.css('display','block');
    window.previous_state = 'marketplace';
}

function homeOn() {

}

function logoHover() {
    $("#mySoundClip")[0].play();
}

//get input from search box
function getfromHTML()
{
    window.artist_name = document.getElementById('main_artist_search').value;
    store_artist(artist_name);
}

//takes user to related artist and biography page
function goDiscover()
{
    window.artist_name = document.getElementById('main_artist_searchpage').value;
    if(window.artist_name == "") 
    {
        alert("Oh no! You didn't type an artist!");
    }
    else 
    {
        var bodyDiv = $('body');
        var centerDiv = $('#center');
        var searchpageDiv = $('#searchpage');
        bodyDiv.css('background-image',"url('images/lightpaperfibers_@2X.png')");
        centerDiv.attr('class','on');
        searchpageDiv.attr('class','off');
        searchpageDiv.css('display','none');

        discoveryOn();
        store_artist(artist_name);
    }
}



//takes inputted artist name, formates it and begins populating discoverty div
function store_artist(artist_name)
{
    empty();
    window.previous_artist = window.formatted_artist_name;
    getArtistName_digital(artist_name);

    if(window.formatted_artist_name === window.previous_artist)
    {
        getArtistName_fm(artist_name);
        last_fm_bio(window.formatted_artist_name);
        last_fm_similar_artist(window.formatted_artist_name);
        get7DigitalAlbums();
        //getItunesArtistId(window.formatted_artist_name);
    }
    else
    {
        last_fm_bio(window.formatted_artist_name);
        last_fm_similar_artist(window.formatted_artist_name);
        top_tracks(window.digital_artist_id);
        get7DigitalAlbums();
        //getItunesArtistId(window.formatted_artist_name);
    }
    var artist_name_discover = $('#main_artist_name');
    artist_name_discover.append(window.formatted_artist_name);
    var artist_name_market = $('#artist_name_market');
    artist_name_market.append(window.formatted_artist_name);
}

//emptys all divs containing previous artist information
function empty()
{
    $('#main_artist_name').empty();
    $('#main_artist_image').empty();
    $('#bio_text').empty();
    $('#genre').empty();
    $('.similar_artists').empty();
    $('#track_list').empty();
    $('#artist_name_market').empty();
    $('#albums').empty();
}

//gets artist name formatted to representation within 7Digital store
function getArtistName_digital(artist_name)
{
    var xml_obj = new XMLHttpRequest;
    xml_obj.onload = function(xmlEvent)
    {
        var xml_document = this.responseXML;
        window.formatted_artist_name = xml_document.getElementsByTagName('name')[0].textContent;
		console.log(window.formatted_artist_name);
        window.digital_artist_id = xml_document.getElementsByTagName('artist')[0].attributes.id.textContent;
    }
    var url_obj = 'http://api.7digital.com/1.2/artist/browse?letter='
                    + artist_name + '&oauth_consumer_key=7dg99v5j5e2n&redirect=false&country=US';
    
    xml_obj.open('GET', encodeURI(url_obj), false);
    xml_obj.send();
}

//gets artist name formatted to representation within last.fm
function getArtistName_fm(artist_name)
{
    var xml_obj = new XMLHttpRequest;
    xml_obj.onload = function(xmlEvent) 
    {
        var xml_document = this.responseXML;
        var searchResults = xml_document.getElementsByTagName('artistmatches')[0];
        //first search result correlates to top hit from our input
        var firstResult = searchResults.getElementsByTagName('artist')[0];
        window.formatted_artist_name = firstResult.getElementsByTagName('name')[0].textContent;
		console.log("fm");
		console.log(window.formatted_artist_name);
    }
    var url_obj = 'http://ws.audioscrobbler.com/2.0/?method=artist.search&artist='
                    + artist_name + '&api_key=997058052f96f003088c5553fbd41c1a';
    
    xml_obj.open('POST', encodeURI(url_obj), false);
    xml_obj.send();
}

//inserts artist biography from last fm
function last_fm_bio(artist_name)
{
    var xml_obj = new XMLHttpRequest();
    xml_obj.onload = function(xmlEvent)
    {
        var xml_document = this.responseXML;
        var bio_summary = xml_document.getElementsByTagName('summary')[0].textContent;
        var artist_image_url = xml_document.getElementsByTagName('image')[4].textContent;

        var artist_genre = xml_document.getElementsByTagName('tags')[0];
            var artist_tag1 = artist_genre.getElementsByTagName('name')[0].textContent;
            var artist_tag2 = artist_genre.getElementsByTagName('name')[1].textContent;
            var artist_tag3 = artist_genre.getElementsByTagName('name')[2].textContent;
        var artist_image = $('#main_artist_image');
        var img = $('<img>');
        img.attr('src',artist_image_url);
        img.appendTo(artist_image);

        var artist_bio = $('#bio_text');
        artist_bio.append(bio_summary);
        
        var artist_genre_append = $('#genre');
        
        artist_genre_append.append(artist_tag1);
        artist_genre_append.append(', ');
        artist_genre_append.append(artist_tag2);
        artist_genre_append.append(', ');
        artist_genre_append.append(artist_tag3);
    }
    var url_obj = 'http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=' 
                    + artist_name + '&api_key=997058052f96f003088c5553fbd41c1a';

    xml_obj.open('POST', encodeURI(url_obj), true);
    xml_obj.send();
}

//grabs 8 similar artists from last fm and populates existing divs
function last_fm_similar_artist(artist_name)
{
    var xml_obj = new XMLHttpRequest();
    xml_obj.onload = function(xmlEvent)
    {
        var xml_document = this.responseXML;
        var similar_artists = xml_document.getElementsByTagName('similarartists')[0];
        var similar_artist = similar_artists.getElementsByTagName('artist');

        if(similar_artist.length == 0)
        {
            digital_similar_artist(artist_name);
        }
        else {
            var x;
            for (x=0; x<9; x++) {
                var similar_artist_name = similar_artist[x].getElementsByTagName('name')[0].textContent;
                var similar_artist_image = similar_artist[x].getElementsByTagName('image')[3].textContent;

                var similar_append = $('.similar_artists')[x];
                var img = $('<img>');
                img.attr('src',similar_artist_image);
                img.click(function(similar_artist_name) {
                            return function() {
                                store_artist(similar_artist_name);
                            }
                            }(similar_artist_name));
                img.appendTo(similar_append);

                var similar_p = $('<p>');
                similar_p.text(similar_artist_name);

                var max=50;
                var relativeSize = max-(5*(similar_artist_name.length/11));

                similar_p.css('font-size',relativeSize+'px');

                similar_p.click(function(similar_artist_name) {
                            return function() {
                                store_artist(similar_artist_name);
                            }
                            }(similar_artist_name));
                similar_p.appendTo(similar_append);
            }
        }
    }
    var url_obj = 'http://ws.audioscrobbler.com//2.0/?method=artist.getsimilar&artist='
                    + artist_name + 
                    '&api_key=997058052f96f003088c5553fbd41c1a';

    xml_obj.open('POST', url_obj, true);
    xml_obj.send();
}

//grabs an artists 10 top tracks and displays as html-5 audio widgets
function top_tracks(artist_id)
{
    var xml_obj = new XMLHttpRequest;
    var url_obj = 'http://api.7digital.com/1.2/artist/toptracks?artistid='
                    + artist_id + '&oauth_consumer_key=7dg99v5j5e2n&country=US';
    xml_obj.open('GET', url_obj, true);
    xml_obj.onload = function(xmlEvent)
    {
        var xml_document = this.responseXML;
        artist_tracks = xml_document.getElementsByTagName('track');
        var track_id_map = [];
        
        for (var x=0; x<artist_tracks.length; x++)
        {
            var track = new Object();
            track.id = artist_tracks[x].attributes.id.textContent;
            track.name = artist_tracks[x].getElementsByTagName('title')[0].textContent;
            track_id_map.push(track);
        }
        insert_top_tracks(track_id_map);
    }
    xml_obj.send();
}

//inserts html-5 audio widgets into table
function insert_top_tracks(track_id_map)
{
    for (var i=0; i<track_id_map.length; i++)
    {
        var xml_obj = new XMLHttpRequest;
        var url_obj = 'http://api.7digital.com/1.2/track/preview?trackid=' 
                        + track_id_map[i].id +
                        '&oauth_consumer_key=7dg99v5j5e2n&redirect=false&country=US';
        xml_obj.open('GET', url_obj, false);
        xml_obj.onload = function(xmlEvent)
        {
            var xml_document = this.responseXML;
            var url = xml_document.getElementsByTagName('url')[0].textContent;
            var tracklist = $('#track_list');

            var track_name_str = "<h5>" + track_id_map[i].name + "</h5>";
            var track_name = $(track_name_str);
            track_name.appendTo(tracklist);

			
			if (!($.browser.mozilla))
			{
				var track_outer = $('<audio></audio>');
				track_outer.attr('controls','controls');
				track_outer.css('width','80%');

				var track_inner = $('<source>');
				track_inner.attr('src',url);
				track_inner.attr('type','audio/mpeg');
				track_inner.appendTo(track_outer);

				var track_embed = $('<embed>');
				track_embed.attr('src',url);
				track_embed.appendTo(track_outer);

				track_outer.appendTo(tracklist);
			}
			else
			{
				var track_embed = $('<embed>');
				track_embed.attr('src',url);
				track_embed.attr('autoplay', 'false');
				track_embed.appendTo(tracklist);
			}
        }
        xml_obj.send();
    }
}

//hides discovery div and makes market div visible
function goMarketplace() {
    window.artist_name = document.getElementById('main_artist_searchpage').value;
    if(window.artist_name == "") {
        alert("Oh no! You didn't type an artist!");
    }
    else
    {
        var bodyDiv = $('body');
        var centerDiv = $('#center');
        var searchpageDiv = $('#searchpage');
        bodyDiv.css('background-image',"url('images/lightpaperfibers_@2X.png')");
        centerDiv.attr('class','on');
        searchpageDiv.attr('class','off');
        searchpageDiv.css('display','none');

        marketPlaceOn();
        store_artist(artist_name);
    }
}

//grabs availible albums for current artist from 7digital
function get7DigitalAlbums()
{
    var xml_obj = new XMLHttpRequest;
    var url_obj = 'http://api.7digital.com/1.2/artist/releases?artistid='
                    + window.digital_artist_id + '&oauth_consumer_key=7dg99v5j5e2n&country=US&type=album';
    xml_obj.open('GET', url_obj, true);
    xml_obj.onload = function(xmlEvent)
    {
        var xml_document = this.responseXML;
        var num_albums = xml_document.getElementsByTagName('totalItems')[0].textContent;
        var artist_albums = xml_document.getElementsByTagName('release');
        var album_names = [];
        for (var i=0; i<num_albums; i++)
            {
                var small_album_art = artist_albums[i].getElementsByTagName('image')[0].textContent;
                var album_art_url = small_album_art.replace('50.jpg', '200.jpg');
                var album_name = artist_albums[i].getElementsByTagName('title')[0].textContent;
                if(album_names.indexOf(album_name) < 0) {
                    album_names.push(album_name);
                    var album_digital_price = artist_albums[i].getElementsByTagName('value')[0].textContent;
                    var album_digital_id = artist_albums[i].attributes.id.textContent;
                    var columns_div = $('<div></div>');
                    columns_div.attr('class', 'three columns');
                    var album_div = $('<div></div>');
                    var album_row = $('#albums');
                    var album_art = $('<img>');
                    var digital_url = artist_albums[i].getElementsByTagName('url')[0].textContent;
                    album_art.attr('src', album_art_url);
                    album_art.appendTo(album_div);
                    album_art.click(function(album_name, album_digital_id, album_digital_price, digital_url) {
                                    return function() {
                                        getAlbumPrice(album_name, album_digital_id, album_digital_price, digital_url);
                                        getPreviews(window.tracks);
                                    }
                                    }(album_name, album_digital_id, album_digital_price, digital_url));

                    var name_p = $('<h5></h5>');
                    name_p.text(album_name);

                    name_p.appendTo(album_div);
                    album_div.appendTo(columns_div);
                    columns_div.appendTo(album_row);
                }
            }    
    }
    xml_obj.send();
}

//sets pricing information for album and album tracks within market place
function getAlbumPrice(album_name, album_digital_id, album_digital_price, digital_url)
{
    var album_title = $('#album_title');
    album_title.empty();
	$('#album_tracks').empty();
    album_heading = album_name + " - $" + album_digital_price;
    album_title.append("<h1> "+ album_heading + " </h1>");
    album_title.attr('href', digital_url);
    var xml_obj = new XMLHttpRequest;
    url = 'http://api.7digital.com/1.2/release/tracks?releaseid=' + album_digital_id + '&oauth_consumer_key=7dg99v5j5e2n&country=US';
    xml_obj.open('GET', url, false);
    xml_obj.onload = function(xmlEvent)
    {
        var xml_document = this.responseXML;
        window.tracks = xml_document.getElementsByTagName('track');
    }
    xml_obj.send();
}

//gets previes for currently selected album in marketplace
function getPreviews(tracks) {
    album_tracks = $('#album_tracks');
    for(var i=0; i<tracks.length; i++) {
        var track_id = tracks[i].attributes.id.textContent;
        var track_name = tracks[i].getElementsByTagName('title')[0].textContent;
        var track_url = tracks[i].getElementsByTagName('url')[0].textContent;
        var track_price = tracks[i].getElementsByTagName('price')[0].getElementsByTagName('formattedPrice')[0].textContent;
        var track_html = $('<a> </a>');
        track_html.attr('href',track_url);
        var track_string = track_name + " - " + track_price;
        track_html.append("<h5>" + track_string + "</h5>");
        track_html.appendTo(album_tracks); 
        var xml_obj = new XMLHttpRequest;
        url_obj = 'http://api.7digital.com/1.2/track/preview?trackid=' + track_id + '&oauth_consumer_key=7dg99v5j5e2n&redirect=false';
        xml_obj.open('GET', url_obj, false);
        xml_obj.onload = function(xmlEvent) {
            var xml_document = this.responseXML;
            var url = xml_document.getElementsByTagName('url')[0].textContent;
			if (!($.browser.mozilla))
			{
				var track_outer = $('<audio></audio>');
				track_outer.attr('controls','controls');
				track_outer.css('width','80%');
				var track_inner = $('<source>');
				track_inner.attr('src',url);
				track_inner.attr('type','audio/mpeg');
				track_inner.appendTo(track_outer);
				var track_embed = $('<embed>');
				track_embed.attr('src',url);
				track_embed.appendTo(track_outer);
				track_outer.appendTo(album_tracks);
			}
			else
			{
				var track_embed = $('<embed>');
				track_embed.attr('src', url);
				track_embed.attr('autoplay', 'false');
				track_embed.appendTo(album_tracks);
			}
        }
        xml_obj.send();
    }
}
