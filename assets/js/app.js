$(document).ready(function() {

	function initLoading(){
		const loadingIcon = "<img src='./assets/img/loading-icon.svg'>"
		const loadingScreen = "<div class='loading-screen'>" +loadingIcon+ "</div>"

		$("body").append(loadingScreen)

		setTimeout(function(){
			$(".loading-screen").css("opacity" , "1")
		})
	}

	initLoading();

	function destroyLoading(){
		setTimeout(function(){
			$(".loading-screen").css({
				"opacity" : "0",
				"transform" : "scale(1.2)"
			})
		}, 400)
		setTimeout(function(){
			$(".loading-screen").remove();
		}, 800)
	}

	if(!localStorage.getItem("userName")){
		$("#tutorial").load("./assets/html/includes/tutorial.html")
		$("#hero").load("./assets/html/includes/hero.html" , function(){

			destroyLoading();

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
				setTimeout(function(){
					$("#tutorial").css("position" , "absolute")
				}, 1100)
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
					setTimeout(function(){
						$("#dashboard").css("position" , "absolute")
					}, 1100)
					setTimeout(function(){
						$("#hero").remove();
						$("#tutorial").remove();
					}, 2000)
					loadDashboard();
				})
			});
		})
	} else{
		loadDashboard();
		$("#hero").remove();
		$("#tutorial").remove();
		$("#dashboard").css({
			"transform" : "none",
			"opacity" : "1",
			"transition" : "none",
			"position" : "absolute"
		})
	}

	function loadDashboard(){

		initLoading();

		if(localStorage.getItem("userName")){
			$("#dashboard").load("./assets/html/includes/dashboard.html" , function(){

				destroyLoading();

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
				 			completionTracker.html("You've completed " + countRead + " chapter from this section.<span> That puts you at " + calculatePercentage.toFixed(0)+ "% completion.</span>")
				 		} else{
				 			completionTracker.html("You've completed " + countRead + " chapters from this section.<span> That puts you at " + calculatePercentage.toFixed(0)+ "% completion.</span>")
				 		}
				 	})
			 	}

			 	calculateCompletion();

				$(".card").click(function(){

					initLoading();

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

						destroyLoading();

						$("#lesson").css({
							"transform" : "none",
							"transition" : "1s"
						});
						setTimeout(function(){
							$("#lesson").css("overflow-y" , "auto")
						}, 1000)
						var cardSelector = $(this).children(".container").attr("data-lesson").replace("-lesson" , "")
						if($('.card[data-lesson="pages/' +cardSelector+ '"]').hasClass("read")){
							$("#lesson .side-menu .modal-button").remove();
							$("#lesson .nav .modal-button").css("pointer-events" , "none").attr("src" , "./assets/img/completed.svg")
						}
						$("body").css("overflow" , "hidden")
						if($(window).width() <= 1150){
							$(".nav").css("transform" , "translateY(70px)")
							setTimeout(function(){
								$(".nav").css({
									"transform" : "none",
									"transition" : "400ms"
								})
							}, 600)
						}
					});
				})


				$("#lesson").on("click" , "#complete-lesson", function(){
					var $this = $(this)
					var lessonPage = $this.parent().parent().parent().attr("data-lesson").replace("-lesson" , "")
					var cardSelector = $('.card[data-lesson="pages/' +lessonPage+ '"]')
					cardSelector.addClass("read");

					var modalButton = $this.parent().parent().siblings(".side-menu").children(".button");

					var completeButton = $this.parent().parent().siblings(".nav").children(".modal-button")

					modalButton.remove();
					completeButton.css("pointer-events" , "none").attr("src" , "./assets/img/completed.svg")

					if(!readCards.includes(lessonPage)){
						readCards+=(readCards.length>0?',':'') + "pages/" + lessonPage;
						localStorage.setItem("readCards" , readCards)
					}
					$(".card").each(function(){
						if(readCards.includes($(this).data("lesson"))){
							$(this).removeClass("reading")
						}
					});
					closeModal();
					calculateCompletion()
				});

				$("#lesson").on("click" , "#back", function(){
					$("#lesson").css({
						"transform" : "translateX(100vw)",
						"overflow-y" : "hidden"
					})
					$("#dashboard").css("transform" , "none")
					setTimeout(function(){
						$("body").removeAttr("style")
						$("#lesson").children().remove();
						$("#dashboard").css("pointer-events" , "auto")
					}, 1000)

					if($(window).width() <= 1150){
						$(".nav").remove();
					}

				});

				$("#lesson").on("click" , "#chapters-button" , function(){
					$("#lesson").css("overflow-y" , "hidden")
					$(".nav").css({
						"transition" : "400ms",
						"transform" : "translateY(100%)",
					});
					$(".side-menu").css("z-index" , "1")
					setTimeout(function(){
						$(".side-menu").css({
							"opacity" : "1",
							"transition" : "400ms",
							"pointer-events" : "auto"
						})
					}, 400)
				});

				$("#lesson").on("click" , "#close-chapters" , function(){
					closeChapters();
				})

				$("#lesson").on("click" , "a" , function(){
					if($(window).width() <= 1150){
						closeChapters()
					}
				});

				$(window).resize(function(){
					if($(window).width() >= 1150){
						$(".side-menu").removeAttr("style")
						$(".nav").removeAttr("style")
						$("#lesson").css("overflow-y" , "auto")
					}
				})
					
				function closeChapters(){
					$(".side-menu").css({
						"opacity" : "0",
						"pointer-events" : "none"
					})
					setTimeout(function(){
						$(".side-menu").css({
							"transition" : "none",
							"z-index" : "-1",
						})
						$(".nav").css({
							"transform" : "none"
						})
						$("#lesson").css("overflow-y" , "auto")
					}, 400)
				}

				$("#lesson").on("click" , ".modal-button" , function(){
					let modalContent = [
						"<span>Do you want to mark this lesson as read?</span>",
						"<div class='button' id='complete-lesson'>Yes, I've completed this lesson</div>",
						"<div class='button' id='close-modal'>No, I want to continue reading</div>",
					]
					let modal = "<div class='modal'>" + modalContent.join("") + "</div>"
					let modalOverlay = "<div class='modal-overlay'>" + modal + "</div>"

					$("#lesson").children(".container").append(modalOverlay)

					setTimeout(function(){
						$(".modal-overlay").css("opacity" , "1");
						$(".modal").css({
							"opacity" : "1",
							"transform" : "none"
						})
					})

					$("#lesson").css("overflow-y" , "hidden")
					$(".nav").css({
						"transition" : "400ms",
						"transform" : "translateY(100%)",
						"pointer-events" : "none"
					});

					if($(window).width() >= 1150){
						$(".nav").css("transform" , "translateX(-25px)")
					}

				});

				$("#lesson").on("click" , "#close-modal" , function(){
					closeModal();
				});

				function closeModal(){
					$(".modal-overlay").css("opacity" , "0")
					setTimeout(function(){
						$(".modal-overlay").remove();
					}, 400)
					$("#lesson").css("overflow-y" , "auto")
					$(".nav").css({
						"transform" : "none",
						"pointer-events" : "auto"
					})
					if($(window).width() >= 1150){
						$(".nav").css("transform" , "translateX(-25px)")
					}			
				}
			});
		}
	}

});
