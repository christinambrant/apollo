
var Artist = function() {
	if(currentPage === "home") {
		this.artist_name = document.getElementById('main_artist_searchpage').value;
	}
	else {
		this.artist_name = document.getElementById('search_topbar').value;
	}
	this.formatted_artist_name = "";
	this.digital_artist_id;
	this.bio_summary;
	this.image_url;
	this.genre = new Array();
	this.similar_artists_array;
}

Artist.prototype.getBio_fm = function() {
	
}

var Home = function() {
	this.div = $("#searchpage");
}

Home.prototype.on = function(){
	this.div.attr("class","on");
	this.div.css("display","block");
}

Home.prototype.off = function(){
	this.div.attr("class","off");
	this.div.css("display","none");
}

Home.prototype.logoHover = function() {
    $("#mySoundClip")[0].play();
}

var Discovery = function() {
	this.div = $("#discovery");
}

Discovery.prototype.on = function(){
	$("#center").attr("class","on");
	$("#discovery-nav").attr("class","active");
	$("#spotlight-nav").attr("class","inactive");
	this.div.attr("class","on");
}

Discovery.prototype.off = function(){
	this.div.attr("class","off");
	$("#center").attr("class","off");
}

Discovery.prototype.populate = function(artist_name,artist_id) {
	var xml_obj = new XMLHttpRequest();
    xml_obj.onload = function(xmlEvent)
    {
        var xml_document = this.responseXML;
        var similar_artists = xml_document.getElementsByTagName('similarartists')[0];
        similar_artists_array = similar_artists.getElementsByTagName('artist');
        if(similar_artists_array.length == 0)
        {
            var xml_obj = new XMLHttpRequest();
		    xml_obj.onload = function(xmlEvent)
		    {
		        var xml_document = this.responseXML;
		        var similar_artists = xml_document.getElementsByTagName('artists')[0];
		        this.similar_artists_array = similar_artists.getElementsByTagName('artist');
		    }
		    var url_obj = 'http://api.7digital.com/1.2/artist/similar?artistid='
		                    + artist_id + '&oauth_consumer_key=7dg99v5j5e2n&country=US';
		    xml_obj.open('POST', url_obj, false);
		    xml_obj.send();
        }

        var num_artist;

        if(similar_artists_array.length > 9) {
        	num_artist = 9;
        }

        for (var x=0; x<num_artist; x++) {
	        var similar_artist_name = similar_artists_array[x].getElementsByTagName('name')[0].textContent;
	        var similar_artist_image = similar_artists_array[x].getElementsByTagName('image')[3].textContent;

	        var similar_append = $('.similar_artists')[x];
	        var img = $('<img>');
	        img.attr('src',similar_artist_image);
	        img.click(function(similar_artist_name) {
	                    return function() {
	                        stumbleThrough(similar_artist_name);
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
	                       	stumbleThrough(similar_artist_name);
	                    }
	                    }(similar_artist_name));
	        similar_p.appendTo(similar_append);
	    }

	    if(num_artist < 9) {
	    	for(var i=num_artist; i<9; i++) {
	    		var similar_append = $('.similar_artists')[i];
	    		var img = $('<img>');
	    		img.attr('src','images/apollo_no_artist-02.jpg');
	    		img.appendTo(similar_append);
	    	}
	    }
    }
    var url_obj = 'http://ws.audioscrobbler.com//2.0/?method=artist.getsimilar&artist='
                    + artist_name + 
                    '&api_key=997058052f96f003088c5553fbd41c1a';
    xml_obj.open('POST', encodeURI(url_obj), false);
    xml_obj.send();
}

var Spotlight = function() {
	this.div = $("#spotlight");
}

Spotlight.prototype.on = function(){
	$("#center").attr("class","on");
	$("#discovery-nav").attr("class","inactive");
	$("#spotlight-nav").attr("class","active");
	this.div.attr("class","on");
}

Spotlight.prototype.off = function(){
	this.div.attr("class","off");
	$("#center").attr("class","off");
}

Spotlight.prototype.populate = function(artist_name,artist_id) {
	var tracks;

	var postArtistBio = function(artist_name) {
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
	        var artist_image = $('#main_artist-img');
	        var img = $('<img>');
	        img.attr('src',artist_image_url);
	        img.appendTo(artist_image);

	        var artist_bio = $('#main_artist-bio');
	        artist_bio.append(bio_summary);
	        
	        // var artist_genre_append = $('#genre');
	        
	        // artist_genre_append.append(artist_tag1);
	        // artist_genre_append.append(', ');
	        // artist_genre_append.append(artist_tag2);
	        // artist_genre_append.append(', ');
	        // artist_genre_append.append(artist_tag3);
	    }
	    var url_obj = 'http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=' 
	                    + artist_name + '&api_key=997058052f96f003088c5553fbd41c1a';

	    xml_obj.open('POST', encodeURI(url_obj), true);
	    xml_obj.send();
	}

	var postAlbumPrice = function(album_name, album_digital_id, album_digital_price, digital_url) {
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

	var postArtistAlbums = function(artist_id) {
		var xml_obj = new XMLHttpRequest;
	    
	    xml_obj.onload = function(xmlEvent)
	    {
	        var xml_document = this.responseXML;
	        var num_albums = xml_document.getElementsByTagName('totalItems')[0].textContent;
	        var artist_albums = xml_document.getElementsByTagName('release');
	        var album_names = [];
	        var index = 0;
	        if(num_albums > 5) {
	        	num_albums = 5;
	        }
	        for (var i=0; i<num_albums; i++)
	            {
	                var small_album_art = artist_albums[i].getElementsByTagName('image')[0].textContent;
	                var album_art_url = small_album_art.replace('50.jpg', '200.jpg');
	                var album_name = artist_albums[i].getElementsByTagName('title')[0].textContent;
	                if(album_names.indexOf(album_name) < 0) {
	                    album_names.push(album_name);
	                    var album_digital_price = artist_albums[i].getElementsByTagName('value')[0].textContent;
	                    var album_digital_id = artist_albums[i].attributes.id.textContent;

	                    var album_append = $(".main_artist-albums")[index];
	                    var album_art = $('<img>');
	                    var digital_url = artist_albums[i].getElementsByTagName('url')[0].textContent;
	                    album_art.attr('src', album_art_url);
	                    album_art.click(function(album_name, album_digital_id, album_digital_price, digital_url) {
	                                    return function() {
	                                    	$('#album_tracks').empty();
										    $('#album_title').empty();
	                                        getAlbumPrice(album_name, album_digital_id, album_digital_price, digital_url);
	                                        getPreviews(tracks);
	                                    }
	                                    }(album_name, album_digital_id, album_digital_price, digital_url));
	                    album_art.appendTo(album_append);

	                    var name_p = $('<h5></h5>');
	                    name_p.text(album_name);

	                    name_p.appendTo(album_append);
	                    index++;
	                }
	            }  

	        if(num_albums<5) {
	        	for(var j=index; j<5; j++) {
	        		var album_append = $(".main_artist-albums")[index];
	        		var album_art = $("<img>");
	        		album_art.attr("src","images/apollo_no_album-03.jpg");
	        		album_art.appendTo(album_append);
	        		index++;
	        	}
	        }
	    }

	    var url_obj = 'http://api.7digital.com/1.2/artist/releases?artistid='
	                    + artist_id + '&oauth_consumer_key=7dg99v5j5e2n&country=US&type=album';
	    console.log(url_obj);
	    xml_obj.open('GET', url_obj, true);
	    xml_obj.send();
	}

	var getAlbumPrice = function(album_name, album_digital_id, album_digital_price, digital_url) {
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
	        tracks = xml_document.getElementsByTagName('track');
	    }
	    xml_obj.send();
	}

	var getPreviews = function(tracks) {
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

	postArtistBio(artist_name);
	postArtistAlbums(artist_id);
}

Spotlight.prototype.postTopTracks = function(artist_id) {

	var insertTopTracks = function(track_id_map) {
		for (var i=0; i<track_id_map.length; i++)
	    {
	        var xml_obj = new XMLHttpRequest;
	        
	        xml_obj.onload = function(xmlEvent)
	        {
	            var xml_document = this.responseXML;
	            var url = xml_document.getElementsByTagName('url')[0].textContent;
	            var tracklist = $('#album_tracks');

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

	        var url_obj = 'http://api.7digital.com/1.2/track/preview?trackid=' 
	                        + track_id_map[i].id +
	                        '&oauth_consumer_key=7dg99v5j5e2n&redirect=false&country=US';
	        xml_obj.open('GET', url_obj, false);
	        xml_obj.send();
	    }
	}

	var findTopTracks = function(artist_id) {
		var xml_obj = new XMLHttpRequest;
	    
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
	        insertTopTracks(track_id_map);
	    }

	    var url_obj = 'http://api.7digital.com/1.2/artist/toptracks?artistid='
	                    + artist_id + '&oauth_consumer_key=7dg99v5j5e2n&country=US';
	    xml_obj.open('GET', url_obj, true);
	    xml_obj.send();
	}

	$('#album_tracks').empty();
    $('#album_title').empty();
	$("#album_title").append("Top Tracks");
	findTopTracks(artist_id);
}

function empty()
{
    $('#main_artist_name').empty();
    $('#main_artist-heading').empty();
    $('#main_artist-img').empty();
    $('#main_artist-bio').empty();
    // $('#genre').empty();
    $('.similar_artists').empty();
    $('#album_tracks').empty();
    $('#album_title').empty();
    // $('#artist_name_market').empty();
    $('.main_artist-albums').empty();
}
