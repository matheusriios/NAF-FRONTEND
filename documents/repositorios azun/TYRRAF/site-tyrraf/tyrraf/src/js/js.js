var $owl = $('.owl-carousel');

$owl.children().each( function( index ) {
  $(this).attr( 'data-position', index ); // NB: .attr() instead of .data()
});

$owl.owlCarousel({
  center: true,
  loop: true,
  items: 3,
});

$(document).on('click', '.owl-item>div', function() {
  $owl.trigger('to.owl.carousel', $(this).data( 'position' ) );
});


function slidetoggle(){
  var slider = document.getElementById("nav-slide");
  var botaomenu = document.getElementById("nav-btn");

  slider.style.height  = "auto";               
  slider.style.fontSize = "20px";
  slider.style.textDecoration = "#FFFFFF !important";

  if(slider.style.marginTop <= "0%"){
      slider.style.textDecoration.fontcolor = "#F5FBEF"
      slider.style.background = "#4DC479;";
      botaomenu.style.background = "none";
      botaomenu.classList.add('active')
      slider.style.marginTop = "90px";
      

  } else{
      slider.style.marginTop = "-70%";

      botaomenu.classList.remove('active')
      
  }

}