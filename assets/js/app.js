$(document).ready(function() {

	// Initialize loading screen
	function initLoading(){

		const loadingIcon = "<img src='./assets/img/loading-icon.svg'>"
		const loadingScreen = "<div class='loading-screen'>" + loadingIcon + "</div>"

		// Append the loading screen to the body
		$("body").append(loadingScreen)

		// Give the loading screen a fade-in
		setTimeout(function(){
			$(".loading-screen").css("opacity" , "1")
		})
	}

	initLoading();

	// Remove the loading screen
	function destroyLoading(){
		// Fade out the loading screen
		setTimeout(function(){
			$(".loading-screen").css({
				"opacity" : "0",
				"transform" : "scale(1.2)"
			})
		}, 1000)
		// Wait for the loading screen to fade-out
		// then remove it
		setTimeout(function(){
			$(".loading-screen").remove();
		}, 1400)
	}

	// If the user is not registered, load the hero and tutorial screens,
	// else remove the hero and tutorial screens and load the dashboard
	if(!localStorage.getItem("userName")){

		$("#hero").load("./assets/html/includes/hero.html" , function(){

			destroyLoading();

			// Show the sign-in button only if the value of the input
			// is at least 3 characters long
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

			// Translate hero out of view and translate the tutorial
			// into view when the sign-in button is clicked
			$("#sign-in").click(function(){
				// Remove any pointer events of the button
				$(this).css("pointer-events" , "none")

				$("#hero").css({
					"transform" : "translateX(-100vw)",
					"opacity" : "0"
				})

				$("#tutorial").css({
					"transform" : "none",
					"opacity" : "1",
					"transition" : "1s"
				})

				// Wait for the tutorial screen to be in view,
				// then position it absolute
				setTimeout(function(){
					$("#tutorial").css("position" , "absolute")
				}, 1100)

				// Get the trimmed value of the input
				let userName = $("input").val().trim();
				// Display the users name
				$("#user-name").text(userName);
				// Store the users name locally
				localStorage.setItem("userName", userName);
			});
		});

		$("#tutorial").load("./assets/html/includes/tutorial.html" , function(){

			// Translate the tutorial out of view and translate the dashboard
			// into view when the close-tutorial button is clicked
			$("#close-tutorial").click(function(){
				initLoading();
				
				// Load the dashboard
				loadDashboard();

				$("#tutorial").css({
					"transform" : "translateX(-100vw)",
					"opacity" : "0",
				})
				$("#dashboard").css({
					"transform" : "none",
					"opacity" : "1"
				})

				// Wait for the dashboard to be in view,
				// then position it absolute
				setTimeout(function(){
					$("#dashboard").css("position" , "absolute")
				}, 1100)

				// Wait for 2 seconds the remove the
				// hero and tutorial screens
				setTimeout(function(){
					$("#hero").remove();
					$("#tutorial").remove();
				}, 2000)

			})
		})
	} else{

		loadDashboard();

		// Remove the tutorial and hero screens
		$("#hero").remove();
		$("#tutorial").remove();

		// Translate and fade-in the dashboard
		// when it finishes loading
		$("#dashboard").css({
			"transform" : "none",
			"opacity" : "1",
			"transition" : "none",
			"position" : "absolute"
		})
	}

	function loadDashboard(){

		// If the user has selected a theme load that theme
		// when accessing the page
		if(localStorage.getItem("theme")){
			$("body").addClass(localStorage.getItem("theme") + "-theme")
		}

		// If the user is registered load the dashboard
		if(localStorage.getItem("userName")){
			$("#dashboard").load("./assets/html/includes/dashboard.html" , function(){

				destroyLoading();

				// Append and fade in the settings modal when the settings icon is clicked
				$("#dashboard").on("click" , "#settings" ,function(){
					$("#dashboard").append(modalOverlay)
					$(".modal-overlay").load("./assets/html/components/settings-modal.html" , function(){
						setTimeout(function(){
							$(".modal-overlay").css("opacity" , "1");
							$(".modal").css({
								"opacity" : "1",
								"transform" : "none"
							})
						})

						// Remember which theme the user has selected
						// when opening the settings modal
						if(localStorage.getItem("theme")){
							$(".theme").removeClass("selected-theme")
							$(".theme[id='"+localStorage.getItem("theme")+"']").addClass("selected-theme")
						}

						// Change page theme and save it locally 
						$(".theme").click(function(){
							let themeValue = $(this).attr("id")
							$(".theme").removeClass("selected-theme")
							$(this).addClass("selected-theme")
							$("body").removeClass().addClass(themeValue + "-theme")
							localStorage.setItem("theme", themeValue);
						});

						// Reset to default theme when clicking
						// on the default "Blue" theme
						$("#default").click(function(){
							$("body").removeClass();
							localStorage.removeItem("theme")
						});

						// Change the button text and an id when the "Delete user data"
						// button is clicked
						$(".modal.settings .button").click(function(){
							$(this).text("Are you sure?")
							setTimeout(function(){
								$(".modal.settings .button").attr("id" , "delete-data")
							})
						});

						// Delete all stored data and reload the page when the user
						// confirms the "Delete user data" action
						$(".modal.settings").on("click" , "#delete-data" , function(){
							location.reload();
							localStorage.clear();
						})

						// Close the modal when the close button is clicked
						$("#close-settings").click(function(){
							closeModal();
						})
					})
				})

				let time = new Date();
				// Get the hour
				let hour = time.getHours();

				// Change greetings based on the time of the day
				// Morning: 5 --> 12
				// Afternoon: 12 --> 17
				// Evening: 17 --> 5
				if(hour >= 5 && hour < 12){
					$("#time-of-day").html("Good morning")
				} else if(hour >= 12 && hour < 17){
					$("#time-of-day").html("Good afternoon")
				} else{
					$("#time-of-day").html("Good evening")
				}

				// Display the users name
				$("#user-name").text(localStorage.getItem("userName"))

				// Define the drawer
				let drawer = document.getElementsByClassName("drawer-title");

				// Accordion function that opens / closes the drawers
				for (k = 0; k < drawer.length; k++) {

					drawer[k].addEventListener("click", function() {
						this.children[0].classList.toggle("rotate");
						this.classList.toggle("active");
						let cardsWrapper = this.nextElementSibling;
						if (cardsWrapper.style.maxHeight){
							cardsWrapper.style.maxHeight = null;
							cardsWrapper.style.overflow = "hidden";
						} else {
							cardsWrapper.style.maxHeight = cardsWrapper.scrollHeight + "px";
							cardsWrapper.style.overflow = "visible";
						}

						// Toggle the visibilty of the cards in the drawer
						$(this).siblings(".cards-wrapper").children(".card").toggleClass("visible");
						// Toggle the visibily of the completion tracker in the drawer
						$(this).siblings(".cards-wrapper").children(".completion-tracker").toggleClass("visible");
					});

				}

				// Define the locally storred arrays of "reading" and "read" cards
				let readingCards = localStorage.getItem("readingCards")!==null?localStorage.getItem("readingCards"):'';
				let readCards = localStorage.getItem("readCards")!==null?localStorage.getItem("readCards"):'';

				// If the data-lesson of the clicked card coincides with any of the
				// data-lesson values locally stored in the "reading" or "read" arrays, 
				// show a "still reading" respectively "read" badge on the card
			 	$(".card").each(function(){

					if(readingCards.includes($(this).data("lesson"))){
						$(this).addClass("reading");
					}
					if(readCards.includes($(this).data("lesson"))){
						$(this).removeClass("reading");
						$(this).addClass("read");
					}

			    });

			 	// Calculate the completion of each drawer
			 	function calculateCompletion(){
				 	$(".drawer").each(function(){
				 		let countRead = $(this).children(".cards-wrapper").children(".read").length
				 		let countTotal = $(this).children(".cards-wrapper").children(".card").length
				 		const completionTracker = $(this).children(".cards-wrapper").children(".completion-tracker")

				 		// Transform the quotient of the division into a percentage
				 		let calculatePercentage = ((100 * countRead) / countTotal).toFixed(0) + "%"

				 		if(countRead == 0){
				 			completionTracker.html("You haven't finished any lesson from this section")
				 		} else if(countRead == countTotal){
				 			completionTracker.html("You have completed this section")
				 		} else if(countRead == 1){
				 			completionTracker.html("You've completed " + countRead + " lesson from this section.<span> That puts you at " + calculatePercentage + " completion.</span>")
				 		} else{
				 			completionTracker.html("You've completed " + countRead + " lessons from this section.<span> That puts you at " + calculatePercentage + " completion.</span>")
				 		}
				 	})
			 	}

			 	// Calculate the completion of each drawer
			 	// when the page is loaded
			 	calculateCompletion();

			 	// All the functions that run when a card is clicked
				$(".card").click(function(){

					initLoading();

					let $this = $(this);
					$this.addClass("reading")

					// Translate the dashboard out of view
					$("#dashboard").css({
						"transform" : "translateX(-100vw)",
						"transition" : "1s",
						"pointer-events" : "none"
					})

					// If the data-lesson doesn't coincide with any of the
					// values locally storred in the "reading-cards" array
					// then add the card to the "reading-cards" array
					if(!readingCards.includes($(this).data("lesson"))){
						readingCards+=(readingCards.length>0?',':'')+$(this).data("lesson");
						localStorage.setItem("readingCards" , readingCards)
					}

					lessonCard = $this.attr("data-lesson")
					lessonContainer = lessonCard + ".html";

					// Load the selected lesson in the lesson container
					$("#lesson").load(lessonContainer , function(){

						// Hide the overflow of the body
						$("body").css("overflow" , "hidden")

						// Translate the lesson into view
						$("#lesson").css({
							"transform" : "none",
							"transition" : "1s"
						});

						// Wait for the lesson to translate into view and then
						// give it overflow auto on the Y axis
						setTimeout(function(){
							$("#lesson").css("overflow-y" , "auto")
						}, 1000)

						// Automatically nest all the links that contain digits
						for(i = 1; i <= 9; i++){
							$("a:contains(."+i+".)").addClass("nested")
						}

						// Automatically add hrefs to all the links
						let chapterNumber = 1;
						$(".quick-chapters a").each(function(){
							$(this).attr("href" , "#chapter" + chapterNumber);
							chapterNumber++;
						})

						// Automatically add ids to all the h1 titles
						// coresponding to the links hrefs
						let chapterTitle = 1
						$(".lesson-content h1").each(function(){
							$(this).attr("id" , "chapter" + chapterTitle);
							chapterTitle++
						})

						// Define the nav container
						let nav = "<div class='nav'></div>"

						// Create the nav container in which the navigation will load
						$("#lesson").children(".container").prepend(nav)
						// Destroy the loading when the nav is completely loaded
						$(".nav").load("./assets/html/components/navigation.html" , function(){

							destroyLoading();
							
							// If the window width is less than 1150px translate the mobile nav into view
							if($(window).width() <= 1150){
								$(".nav").css("transform" , "translateY(70px)")
								setTimeout(function(){
									$(".nav").css({
										"transform" : "none",
										"transition" : "400ms"
									})
								}, 1000)
							}

							let cardSelector = $(this).parent().attr("data-lesson").replace("-lesson" , "")
							if($('.card[data-lesson="pages/' +cardSelector+ '"]').hasClass("read")){
								$("#lesson .nav .modal-button").css("pointer-events" , "none")
								$("#lesson .nav .modal-button").addClass("completed")
							}
						})

						// Link the selected lesson to the clicked card
						// by targeting the "data-lesson" attribute
						let cardSelector = $(this).children(".container").attr("data-lesson").replace("-lesson" , "")

						// If the lesson selected is already marked as read
						// remove the "Mark as read" button and replace nav button with the "read" one
						if($('.card[data-lesson="pages/' +cardSelector+ '"]').hasClass("read")){
							$("#lesson .side-menu .modal-button").remove();
							// $("#lesson .nav .modal-button").css("pointer-events" , "none").attr("src" , "./assets/img/completed.svg")
							// $("#lesson .nav").children().css("border" , "1px solid red")
						}

					});
				})

				// Define the wrapper in which every modal will load
				let modalOverlay = "<div class='modal-overlay'></div>"

				// All the function that run when the confirmation for the
				// "Mark as read" button is clicked
				$("#lesson").on("click" , ".modal-button" , function(){

					// Create the modal overlay in which the modal will load
					$("#lesson").children(".container").append(modalOverlay)
					$(".modal-overlay").load("./assets/html/components/confirmation-modal.html" , function(){

						// Fade in the modal
						setTimeout(function(){
							$(".modal-overlay").css("opacity" , "1");
							$(".modal").css({
								"opacity" : "1",
								"transform" : "none"
							})
						})
					})

					// Hide the overflow of the modal container and translate
					// the mobile nav out of view
					$("#lesson").css("overflow-y" , "hidden")
					$(".nav").css({
						"transition" : "400ms",
						"transform" : "translateY(100%)",
						"pointer-events" : "none"
					});

					// If the window width is higher than 1150px reset the desktop navigation
					if($(window).width() >= 1150){
						$(".nav").css("transform" , "translateX(-25px)")
					}

				});

				// All the functions that run when the complete-lesson button is clicked
				$("#lesson").on("click" , "#complete-lesson", function(){
					$this = $(this)

					// Link the complete-lesson button to the card its representing
					let lessonPage = $this.parent().parent().parent().attr("data-lesson").replace("-lesson" , "")
					let cardSelector = $('.card[data-lesson="pages/' +lessonPage+ '"]')

					// Add the class of read to the card
					cardSelector.addClass("read");

					let modalButton = $this.parent().parent().siblings(".side-menu").children(".button");
					let completeButton = $this.parent().parent().siblings(".nav").children(".modal-button")

					// Remove the "Mark as read" button
					modalButton.remove();

					// Remove the pointer events for the nav "Mark as read" button and change its source
					// completeButton.css("pointer-events" , "none").attr("src" , "./assets/img/completed.svg")
					completeButton.css("pointer-events" , "none")
					completeButton.addClass("completed")

					// If the "data-lesson" value of the lesson doesn't coincide with any value from
					// the readCards local array, then add it to the array
					if(!readCards.includes(lessonPage)){
						readCards+=(readCards.length>0?',':'') + "pages/" + lessonPage;
						localStorage.setItem("readCards" , readCards)
					}

					// If the "data-lesson" value of the card coincides with any value from
					// the readCards local array, the remove the "reading" class
					$(".card").each(function(){
						if(readCards.includes($(this).data("lesson"))){
							$(this).removeClass("reading")
						}
					});

					// Close the "Mark as read" modal
					closeModal();

					// Show the lesson overflow
					$("#lesson").css("overflow-y" , "auto")

					// Translate back into view the mobile nav
					$(".nav").css({
						"transform" : "none",
						"pointer-events" : "auto"
					})

					if($(window).width() >= 1150){
						$(".nav").css("transform" , "translateX(-25px)")
					}

					// Calculate the completion for the section the card is in
					calculateCompletion()
				});

				// Close the complete-lesson modal when the close-modal button is clicked
				$("#lesson").on("click" , "#close-modal" , function(){

					closeModal();

					// Show the lesson overflow
					$("#lesson").css("overflow-y" , "auto")

					// Translate back into view the mobile nav
					$(".nav").css({
						"transform" : "none",
						"pointer-events" : "auto"
					})

					if($(window).width() >= 1150){
						$(".nav").css("transform" , "translateX(-25px)")
					}	
				});

				// All the functions that run when the "back" button is clicked
				$("#lesson").on("click" , "#back", function(){

					// Translate the lesson container out of view and hide its overflow
					$("#lesson").css({
						"transform" : "translateX(100vw)",
						"overflow-y" : "hidden"
					})

					// Translate the dashboard into view
					$("#dashboard").css("transform" , "none")

					// Wait for the dashboard to be translated into view,
					// then show the body's overflow, remove the lesson that was closed
					// and give the dashboard pointer-events
					setTimeout(function(){
						$("body").removeAttr("style")
						$("#lesson").children().remove();
						$("#dashboard").css("pointer-events" , "auto")
					}, 1000)

					// If the window width is less than 1150px remove the nav
					if($(window).width() <= 1150){
						$(".nav").remove();
					}
				});

				// All the functions than run when the nav's chapter-button is clicked
				$("#lesson").on("click" , "#chapters-button" , function(){
					
					// Hide the overflow of the lesson
					$("#lesson").css("overflow-y" , "hidden")

					// Translate the nav out of view
					$(".nav").css({
						"transition" : "400ms",
						"transform" : "translateY(100%)",
					});

					// Fade in side-menu containing all the chapter lings
					$(".side-menu").css("z-index" , "1")
					setTimeout(function(){
						$(".side-menu").css({
							"opacity" : "1",
							"transition" : "400ms",
							"pointer-events" : "auto"
						})
					}, 400)
				});

				// When a user cliks on a chapter link, close the overlay
				// if the window width is less than 1150px
				$("#lesson").on("click" , "a" , function(){
					if($(window).width() <= 1150){
						closeChapters()
					}
				});

				// Close the chapters overlay
				$("#lesson").on("click" , "#close-chapters" , function(){
					closeChapters();
				})

				// Function that hides the chapter overlay
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

				// If the window width is larget than 1150px when the user
				// resizes the page hide the mobile nav and display the desktop side-menu
				$(window).resize(function(){
					if($(window).width() >= 1150){
						$(".side-menu").removeAttr("style")
						$(".nav").removeAttr("style")
						$("#lesson").css("overflow-y" , "auto")
					}
				})

				// All the functions that run when the user-name is clicked
				$("#dashboard").on("click" , "#user-name" , function(){

					// Append the modal overlay to the dashboard and load the modal into it
					$("#dashboard").append(modalOverlay)
					$(".modal-overlay").load("./assets/html/components/rename-modal.html" , function(){

						// Fade in the modal
						setTimeout(function(){
							$(".modal-overlay").css("opacity" , "1");
							$(".modal").css({
								"opacity" : "1",
								"transform" : "none"
							})
						})
					})

					// Hide the overflow of the body
					$("body").css("overflow-y" , "hidden")
				});

				// Don't show the rename button unless the value of the input
				// is at least 3 characters long
				$("#dashboard").on("keyup" , "#rename-input" , function(){
					if($("#rename-input").val().trim().length >= 3){
						$("#change-name").css({
							"opacity" : "1",
							"pointer-events" : "auto"
						})
					} else{
						$("#change-name").css({
							"opacity" : "0",
							"pointer-events" : "none"
						})
					}
				})

				// All the functions that run when the rename button is clicked
				$("#dashboard").on("click" , "#change-name" , function(){

					// Define the value of the input field
					let newName = $(".modal.change-name input").val().trim()
					$("#user-name").text("").text(newName)

					// Overwrite the local userName value
					localStorage.setItem("userName", newName);

					closeModal()

					// Show the body overflow
					$("body").removeAttr("style")
				});

				// All the function that run when the rename modal is closed
				$("#dashboard").on("click" , "#cancel-change" , function(){

					closeModal()

					// Show the body overflow
					$("body").removeAttr("style")
				})

				// Function that closes the modal
				function closeModal(){

					// Fade out and remove the modal
					$(".modal-overlay").css("opacity" , "0")
					setTimeout(function(){
						$(".modal-overlay").remove();
					}, 400)		
				}
			});
		}
	}

});
