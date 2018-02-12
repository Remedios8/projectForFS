(function ($) {
    $(document).ready(function () {
        var h_hght = $('.firstScreen').outerHeight();
        // высота блока с меню, px
        var h_nav = $('.nav').outerHeight();
        var top;
        $(window).scroll(function () {
            // отступ сверху
            top = $(this).scrollTop();
            if ((h_hght - top) <= h_nav) {
                $('.nav').css('top', '0');

            }
        });

        var shouldPushState = false;
        var page = {
            title: "",
            url: location.pathname
        };

        page.url = '/home';
        page.title = 'Главная';

        history.replaceState(page, "", page.url);

        var loadingScreen = $("#loading");
        var nav = $(".nav");
        var navTabs = nav.find("a");

        loadPage();

        var mus = document.getElementById("music");
        nav.on("click", "i", function (event) {
            event.preventDefault();
            if ($('.nav li i').text() == 'volume_up') {
                $('.nav li i').text("volume_off");
                mus.pause();
            } else {
                $('.nav li i').text("volume_up");
                mus.play();
            }
        });

        nav.on("click", "a", function (event) {
            event.preventDefault();
            if ($(this).attr("href") != page.url) {
                shouldPushState = true;
                page.url = $(this).attr("href");
                loadPage();
                if (page.url != '/home') {
                    $('.header').css({'display': 'none'});
                    $('.nav').animate({
                        opacity: 1,
                        top: 0,
                        bottom: 'auto'
                    }, 1000);
                    var h_nav = $('.nav').outerHeight();
                    $('#navContent').animate({
                        top: h_nav
                    }, 1500);
                    $('#navContent').css({'position': 'absolute'});
                    $('.back').animate({
                        top: h_nav
                    }, 1200);
                    $('.back').css({'left': 0, 'right': 0, 'top': 0, 'bottom': 0, 'height': '100%'});
                }
                else {
                    $('.nav').animate({
                        opacity: 0.8,
                        top: 87 + '%'
                    }, 1500);
                    var h_nav = $('.nav').outerHeight();
                    $('#navContent').animate({
                        top: 100 + '%'
                    }, 1000);
                    $('#navContent').css({'position': 'fixed'});
                    $('.back').animate({
                        top: 100 + '%'
                    }, 1300);
                    $('.header').css({'display': ''});
                    // $('.back').css({'left': 0, 'right': 0, 'top': 0, 'bottom': 0, 'height': '100%'});
                }
            } else {
            }
        });

        function loadPage() {
            setActiveTab();
            getContent();
        }

        function setActiveTab() {
            var activeTab = $('.nav a[href="' + page.url + '"]');
            page.title = activeTab.html();
            document.title = page.title;
            navTabs.removeClass("active");
            activeTab.addClass("active");
        }

        function getContent() {
            $.ajax({
                url: page.url,
                dataType: "html",
                cache: false,
                beforeSend: function () {
                    if (page.url != '/home') {
                        showLoading();
                    }
                },
                complete: function () {
                    if (page.url != '/home') {
                        hideLoading();
                    }
                },
                success: function (data) {
                    if (shouldPushState && history.state.url !== page.url) {
                        history.pushState(page, "", page.url);
                        shouldPushState = false;
                    }

                    $("#navContent").html(data);
                    hideLoading();

                    if (page.url === "/booking") {
                        $("#bookingForm").submit(sendFormData);
                    } else if (page.url === "/news") {
                        $('#news').submit(subscribe);
                    }
                },
                error: function () {
                    alert("Failed to get content " + page.url);
                }
            });
        }

        function showLoading() {
            loadingScreen.fadeIn(0);
        }

        function hideLoading() {
            setTimeout(function () {
                loadingScreen.fadeOut(500);
            }, 500);
        }

        //ON booking page
        function sendFormData() {
            event.preventDefault();
            var form = $("#bookingForm");
            var booking = false;
            var l = $('.mesta');
            for (var i = 0; i < l.length; i++) {
                if (l[i].style.background == 'darkcyan') {
                    booking = true;
                    break;
                }
            }
            if (booking == false) {
                var noBooking = $("<div id='noBooking'>");
                noBooking.text("You have to choose some seats below!");
                form.prepend(noBooking);
            } else {
                var formData = {};
                form.serializeArray().map(function (field) {
                    formData[field.name] = field.value;
                });
                formData.numbersOfSeats = $('#num_')[0].innerHTML;
                var data = {};
                data.title = "title";
                data.message = "message";
                $.ajax({
                    url: "http://localhost:3000/sendForm",
                    dataType: "json",
                    type: "post",
                    data: JSON.stringify(formData),
                    contentType: "application/json",
                    success: function (data) {
                        var block = $("<div>");
                        block.text("Dear " + data.name + ", you have booked seats number " + data.numbersOfSeats + '\n Look all notifications on your mail');
                        form.html(block);
                    },
                    error: function (xhr) {
                        console.log(xhr.responseText);
                    }
                });
            }


        }

        //ON news page
        function subscribe() {
            event.preventDefault();
            var form = $('#news');
            var formDataEmail = {};
            form.serializeArray().map(function (field) {
                formDataEmail[field.name] = field.value;
            });
            $.ajax({
                url: "http://localhost:3000/subscribe",
                dataType: "json",
                type: "post",
                data: JSON.stringify(formDataEmail),
                contentType: "application/json",
                success: function (data) {
                    swal("Waiting for confirm", "There is notification on your mail", "success");
                },
                error: function (xhr) {
                    console.log(xhr.responseText);
                }
            });
        }

        function getCookie(name) {
            var matches = document.cookie.match(new RegExp(
                "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
            ));
            return matches ? decodeURIComponent(matches[1]) : undefined;
        }

        document.cookie = '';
        if (!getCookie('addWasShown')) {
            setTimeout(function () {
                add();
            }, 1000);
        }
        function add() {
            swal("Welcome!", "Enjoy the music! Also there is a mute button on menu.");
            document.cookie = "addWasShown=yes";
        }

    })
})(jQuery);