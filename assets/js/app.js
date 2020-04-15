$(document).ready(function() {

	// if (typeof(Storage) !== "undefined") {
	// 	document.getElementById("user-name").innerHTML = localStorage.getItem("userName");
	// } else{
	// }


	// remove hero and tutorial if user is already registered
	// if($("#user-name").text().length > 0){
	// 	$("#hero").remove();
	// 	// $("#tutorial").remove();
	// }

	$("#sign-in").click(function(){
		var userName = $("input").val().trim();
		$("#user-name").append(userName);
		$(this).css("pointer-events" , "none")
		// localStorage.setItem("userName", userName);
	});


	$("input").keyup(function(){
		if($("input").val().length >= 3){
			$("#sign-in").css({
				"opacity" : "1",
				"pointer-events" : "auto"
			})
		} else{
			$("#sign-in").css({
				"opacity" : "0",
				"pointer-events" : "none"
			})
		}
	})


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

	var readingCards = localStorage.getItem("readingCards")!==null?localStorage.getItem("readingCards"):'';
	var readCards = localStorage.getItem("readCards")!==null?localStorage.getItem("readCards"):'';

 	$(".card").each(function(){

		if(readingCards.includes($(this).data("lesson"))){
			$(this).addClass("reading");
		}
		if(readCards.includes($(this).data("lesson"))){
			$(this).addClass("read");
			$(this).removeClass("reading");
		}

     });

	$(".card").click(function(){
		var $this = $(this)

		$this.addClass("reading")

		if(!readingCards.includes($(this).data("lesson"))){
			readingCards+=(readingCards.length>0?',':'')+$(this).data("lesson");
			localStorage.setItem("readingCards" , readingCards)
		}

		lessonCard = $this.attr("data-lesson")
		lessonContainer = lessonCard + ".html";

		$("#lesson").load(lessonContainer , function(){
			$("#lesson").css("transform" , "translateY(0)");
			var cardSelector = $(this).children(".container").attr("data-lesson").replace("-lesson" , "")
			if($('.card[data-lesson="pages/' +cardSelector+ '"]').hasClass("read")){
				$("#lesson #complete-lesson").text("You read this chapter!")
				$("#lesson #complete-lesson").addClass("pressed")
			}
		});

	})

	$("#lesson").on("click" , "#complete-lesson", function(){
		var $this = $(this)
		var lessonPage = $this.parent().parent().attr("data-lesson").replace("-lesson" , "")
		var cardSelector = $('.card[data-lesson="pages/' +lessonPage+ '"]')
		cardSelector.addClass("read")
		$this.addClass("pressed")
		$this.text("You read this chapter!")
		if(!readCards.includes(lessonPage)){
			readCards+=(readCards.length>0?',':'') + "pages/" + lessonPage;
			localStorage.setItem("readCards" , readCards)
		}
		$(".card").each(function(){
			if(readCards.includes($(this).data("lesson"))){
				$(this).removeClass("reading")
			}
		});
	});

	$("#lesson").on("click" , "#back", function(){
		$("#lesson").css("transform" , "translateY(-100%)")
		setTimeout(function(){
			$("#lesson").children().remove();
		}, 200)
	});

});
