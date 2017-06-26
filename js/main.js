
var tileContainer = document.getElementById("content");
var btnAnimals = document.getElementById("btn-animals");
var btnFruitVegie = document.getElementById("btn-fruit-vegie");
var fetch = new XMLHttpRequest();
var query = '';

// Click event for Fetching Animals data
btnAnimals.addEventListener("click", function() {
	// query variables value will be the link below once the btnAnimals is clicked. 
	// this is used to dynamically change the path of the query for modal full size image. 
	// as this is using the same modal element and only changing the image and family details.
	query = 'http://www.adweb.agency/interview/api/animals';
	// Remove child elements of content. before generating new. to avoid multiple or duplicate dom tree problem.
	$(document).ready(function(){
		$( "#content" ).empty();
	});

	// Stablishing http request with method GET.
	fetch.open('GET', 'http://www.adweb.agency/interview/api/animals');
  	
  	// Create request listener.
  	fetch.onload = function() {
	    if (fetch.status >= 200 && fetch.status < 400) {
	      var objData = JSON.parse(fetch.responseText);
	      renderHTML(objData);
	    } else {
	      console.log("We connected to the server, but it returns an error.");
	    }
  	};

  	// Catch some error once it has.
  	fetch.onerror = function() {
    	console.log("Connection error");
    };

	// Sending request
	fetch.send();
	
	// Image loader called
	loadImgLoader();
	 
});

btnFruitVegie.addEventListener("click", function() {
	// query variables value will be the link below once the btnFruitVegie is clicked. 
	// this is used to dynamically change the path of the query for modal full size image. 
	// as this is using the same modal element and only changing the image and family details.
	query = 'http://www.adweb.agency/interview/api/fruitveg';
	$( "#content" ).empty();
	fetch.open('GET', 'http://www.adweb.agency/interview/api/fruitveg');
  
  fetch.onload = function() {
    if (fetch.status >= 200 && fetch.status < 400) {
      var objData = JSON.parse(fetch.responseText);
      renderHTML(objData);
    } else {
      console.log("We connected to the server, but it returns an error.");
    }
  };

  fetch.onerror = function() {
    console.log("Connection error");
  };

  fetch.send();

  // Image loader called
  loadImgLoader();
});

// Function that shows loader image
function loadImgLoader() {
	$('#loader').addClass('visible');
}

// Function that hide/remove the loader image
function hideImgLoader() {
  	$('#loader').removeClass('visible');
  	$('#modal-loader').removeClass('visible');
}

// Function that renders html that's ready to throw.
function renderHTML(data) {
	
  var htmlString = '';
  var description = '';
  var maxWords = 25;

  //Query JSon object with the use of loop to fetch unique index/data, wrap them in variable and ready to throw as html.
  for (i = 0; i < data.length; i++) {
  	description = data[i].Description;
    htmlString +=  `<div class='tile-container'> 
    					<img data-popup-open='popup-1' onclick=' window.getId(this);' class='btn imgs' id=`+data[i].Id+` src=`+data[i].ImageURLs.Thumb+`>
    					<h3>` + data[i].Title + `</h3> 
    					<h4>` + description.split(" ").splice(0,maxWords).join(" ") + `...</h4>` ; // Limit the Description into 25 maximum words.
    htmlString += '</div>';
  }
  	// Throw Html element into the DOM tree
  	tileContainer.insertAdjacentHTML('beforeend', htmlString);

  	// Hide Image loader, once loading is done.
  	hideImgLoader();
}

// Close Modal function, modal element is being removed and not hidden
function closeModal(event) {
	$('.modal').fadeOut( function() { $(this).remove(); });
}

function getId(_data) {

	var _id = _data.id;

	$(document).ready(function(){
		// Fetch Data, Get Full size image and Family details. query variable is dynamically changes value once the button fetch are clicked. 
        $.get(query, function(_data){
        	// Modal will display once class visible is added on modal-loader element
            $('#modal-loader').addClass('visible');

            // Adding Html element in DOM including Modal, Image full size, Label and image loader
            $('#modal').fadeIn( function() { $(this).prepend(`
            	<div class="modal" style="display: block;" data-popup="popup-1">
            		<div id="modal-inner" class="modal-inner">
            			<img class="modal-img" onload="hideImgLoader()" id="" src="`+_data[_id-1].ImageURLs.FullSize+`" /> 
            			<a onclick="closeModal(this);" class="popup-close" data-popup-close="popup-1" href="#">x</a>
            			<p class="label">`+_data[_id-1].Family+`</p>
            			<img id="modal-loader" class="visible" src="images/loader.gif">
            		</div>
            	</div>

            `)});

            // Calling the function closeModal to close the modal
            $('#modal').click(function() {
				closeModal();
			});

            // Prevent Modal to close when image elemen is being click
			$('#modal-inner').click(function(event){
				event.stopPropagation();
			});

			// Calling the function closeModal to close the modal
			$(document).keyup(function(e) {
			    if (e.keyCode == 27) { // escape key maps to keycode `27`
			        closeModal();
			    }
			});

        });

	});

}
