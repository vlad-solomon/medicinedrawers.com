$(document).ready(function() {

	if(!localStorage.getItem("userName")){
		$("#tutorial").load("./assets/html/includes/tutorial.html")
		$("#hero").load("./assets/html/includes/hero.html" , function(){
			$("input").keyup(function(){
				if($("input").val().trim().length >= 3){
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
			$("#sign-in").click(function(){
				$("#hero").css({
					"transform" : "translateX(-100vw)",
					"opacity" : "0"
				})
				$("#tutorial").css({
					"transform" : "none",
					"opacity" : "1",
					"transition" : "1s"
				})

				var userName = $("input").val().trim();
				$("#user-name").text(userName);
				$(this).css("pointer-events" , "none")
				localStorage.setItem("userName", userName);

				$("#close-tutorial").click(function(){
					$("#tutorial").css({
						"transform" : "translateX(-100vw)",
						"opacity" : "0",
					})
					$("#dashboard").css({
						"transform" : "none",
						"opacity" : "1"
					})
					loadDashboard();
				})
			});
		})
	} else{
		loadDashboard();
		$("#dashboard").css({
			"transform" : "none",
			"opacity" : "1",
			"transition" : "none"
		})
	}

	function loadDashboard(){

		if(localStorage.getItem("userName")){
			$("#dashboard").load("./assets/html/includes/dashboard.html" , function(){

				$("#user-name").text(localStorage.getItem("userName"))

				
				var time = new Date();
				var hour = time.getHours();

				if(hour >= 5 && hour < 12){
					$("#time-of-day").html("Good morning")
				} else if(hour >= 12 && hour < 17){
					$("#time-of-day").html("Good afternoon")
				} else{
					$("#time-of-day").html("Good evening")
				}


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
						$(this).siblings(".cards-wrapper").children(".card").toggleClass("visible");
						$(this).siblings(".cards-wrapper").children(".completion-tracker").toggleClass("visible");
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

			 	function calculateCompletion(){
				 	$(".drawer").each(function(){
				 		var countRead = $(this).children(".cards-wrapper").children(".read").length
				 		var countTotal = $(this).children(".cards-wrapper").children(".card").length
				 		var completionTracker = $(this).children(".cards-wrapper").children(".completion-tracker")

				 		var calculatePercentage = (100 * countRead) / countTotal

				 		if(countRead == 0){
				 			completionTracker.html("You haven't finished any chapter from this section")
				 		} else if(countRead == countTotal){
				 			completionTracker.html("You have completed this section")
				 		} else if(countRead == 1){
				 			completionTracker.html("You've completed " + countRead + " chapter from this section. That puts you at " + calculatePercentage.toFixed(0)+ "% completion.")
				 		} else{
				 			completionTracker.html("You've completed " + countRead + " chapters from this section. That puts you at " + calculatePercentage.toFixed(0)+ "% completion.")
				 		}
				 	})
			 	}

			 	calculateCompletion();

				$(".card").click(function(){
					var $this = $(this)

					$this.addClass("reading")
					$("#dashboard").css({
						"transform" : "translateX(-100vw)",
						"transition" : "1s",
						"pointer-events" : "none"
					})

					if(!readingCards.includes($(this).data("lesson"))){
						readingCards+=(readingCards.length>0?',':'')+$(this).data("lesson");
						localStorage.setItem("readingCards" , readingCards)
					}

					lessonCard = $this.attr("data-lesson")
					lessonContainer = lessonCard + ".html";

					$("#lesson").load(lessonContainer , function(){
						$("#lesson").css({
							"transform" : "none",
							"transition" : "1s"
						});
						var cardSelector = $(this).children(".container").attr("data-lesson").replace("-lesson" , "")
						if($('.card[data-lesson="pages/' +cardSelector+ '"]').hasClass("read")){
							$("#lesson #complete-lesson").text("You've read this chapter")
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
					$this.text("You've read this chapter")
					if(!readCards.includes(lessonPage)){
						readCards+=(readCards.length>0?',':'') + "pages/" + lessonPage;
						localStorage.setItem("readCards" , readCards)
					}
					$(".card").each(function(){
						if(readCards.includes($(this).data("lesson"))){
							$(this).removeClass("reading")
						}
					});
					calculateCompletion()
				});

				// $("#lesson").on("click" , ".side-menu span a" , function(event){
				// 	var test = $(this).attr("href").replace("#" , "");
				// 	var target = $('.lesson-content h1[id="' +test+ '"]')

				// 	event.peventDefault()
				// 	$("#lesson").animate({
				// 		scrollTop: target.offset().top
				// 	}, 1000)
				// });

				$("#lesson").on("click" , "#back", function(){
					$("#lesson").css({
						"transform" : "translateX(100vw)",
					})
					$("#dashboard").css("transform" , "none")
					setTimeout(function(){
						$("#lesson").children().remove();
						$("#dashboard").css("pointer-events" , "auto")
					}, 1000)
				});
			});
		}
	}

});
