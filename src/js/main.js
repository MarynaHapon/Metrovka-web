/*
 * Third party
 */
//= ../../bower_components/jquery/dist/jquery.js


/*
 * Custom
 */
//= partials/jquery.select.js


$('#toggle').click(function() {
   $(this).toggleClass('active');
   $('#overlay').toggleClass('open');
  });

$('.toggle-advert').click(function() {
   $(this).toggleClass('active-advert');
   $('#overlay-advert').toggleClass('open-advert');
  });

/** search **/
function openSearch(searchElement) {
    var i;
    var x = document.getElementsByClassName("searchElement");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none"; 
    }
    document.getElementById(searchElement).style.display = "block"; 
}

/*
select
*/

$(document).ready(function() {
  $('#select-list').jqSelect();
});

$(document).ready(function() {
  $('#select-list-metro-station').jqSelect();
});

$(document).ready(function() {
  $('#select-list-district').jqSelect();
});

$(document).ready(function() {
  $('#select-list-metro').jqSelect();
});