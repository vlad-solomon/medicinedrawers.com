$(document).ready(function() {


	var drawer = document.getElementsByClassName("drawer-title");
	var k;

	for (k = 0; k < drawer.length; k++) {
 		drawer[k].addEventListener("click", function() {
			this.children[0].classList.toggle("rotate");
			this.classList.toggle("active");
			var cardsWrapper = this.nextElementSibling;
			if (cardsWrapper.style.maxHeight){
				cardsWrapper.style.maxHeight = null;
				cardsWrapper.style.overflow = "hidden";
			} else {
				cardsWrapper.style.maxHeight = cardsWrapper.scrollHeight + "px";
				cardsWrapper.style.overflow = "visible";
			}
			$(this).siblings(".cards-wrapper").children().toggleClass("visible");
 		});
	}

	$(".card").click(function(){
		var $this = $(this)
		$this.addClass("reading")
		lessonCard = $this.attr("data-lesson")
		lessonContainer = lessonCard + ".html";
		$("#lesson").load(lessonContainer , function(){
			$("#lesson").css("transform" , "translateY(0)");
			var cardSelector = $(this).children(".container").attr("data-lesson").replace("-content" , "")
			if($('.card[data-lesson="pages/' +cardSelector+ '"]').hasClass("read")){
				$("#lesson #complete-lesson").text("Mark as unread")
				$("#lesson #complete-lesson").addClass("pressed")
			}
		});
	})

	$("#lesson").on("click" , "#complete-lesson", function(){
		var $this = $(this)
		var lessonPage = $this.parent().parent().attr("data-lesson").replace("-content" , "")
		var cardSelector = $('.card[data-lesson="pages/' +lessonPage+ '"]')
		cardSelector.toggleClass("read")
		$this.toggleClass("pressed")
		if($this.text() === "Mark as read"){
			$this.text("Mark as unread")
		} else{
			$this.text("Mark as read")
		}
	});

	$("#lesson").on("click" , "#back", function(){
		$("#lesson").css("transform" , "translateY(-100%)")
		setTimeout(function(){
			$("#lesson").children().remove();
		}, 200)
	});

});