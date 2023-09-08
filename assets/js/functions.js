/*
 * Template functions file.
 */
jQuery(function () {
    "use strict";
    var screen_has_mouse = false
        , $body = jQuery("body")
        , $logo = jQuery("#identity")
        , $social_links = jQuery("#social-profiles")
        , $menu = jQuery("#site-menu")
        , $content_wrap = jQuery(".content-wrap")
        , $hero_media = jQuery(".hero-media")
        , $hero_carousel = jQuery(".hero-media .owl-carousel")
        , win_width = jQuery(window).width();
    // Simple way of determining if user is using a mouse device.
    function themeMouseMove() {
        screen_has_mouse = true;
    }
    function themeTouchStart() {
        jQuery(window).off("mousemove.mccan");
        screen_has_mouse = false;
        setTimeout(function () {
            jQuery(window).on("mousemove.mccan", themeMouseMove);
        }, 250);
    }
    if (!navigator.userAgent.match(/(iPad|iPhone|iPod)/g)) {
        jQuery(window).on("touchstart.mccan", themeTouchStart).on("mousemove.mccan", themeMouseMove);
        if (window.navigator.msPointerEnabled) {
            document.addEventListener("MSPointerDown", themeTouchStart, false);
        }
    }
    // Initialize custom scrollbars
    if (jQuery.fn.overlayScrollbars) {
        jQuery("body, .additional-menu-content").each(function () {
            jQuery(this).overlayScrollbars({
                nativeScrollbarsOverlaid: {
                    initialize: false
                }
                , overflowBehavior: {
                    x: "hidden"
                }
                , scrollbars: {
                    autoHide: "scroll"
                }
            });
        });
    }
    // Handle both mouse hover and touch events for traditional menu + mobile hamburger.
    jQuery(".site-menu-toggle").on("click.mccan", function (e) {
        $body.toggleClass("mobile-menu-opened");
        jQuery(window).resize();
        if (!$body.hasClass("mobile-menu-opened")) {
            $menu.removeAttr("style");
            $social_links.removeAttr("style");
        }
        e.preventDefault();
    });
    jQuery("#site-menu .menu-expand").on("click.mccan", function (e) {
        var $parent = jQuery(this).parent();
        if (jQuery(".site-menu-toggle").is(":visible")) {
            $parent.toggleClass("collapse");
        }
        e.preventDefault();
    });
    jQuery("#site-menu .current-menu-parent").addClass("collapse");
    jQuery(document).on({
        mouseenter: function () {
            if (screen_has_mouse) {
                jQuery(this).addClass("hover");
            }
        }
        , mouseleave: function () {
            if (screen_has_mouse) {
                jQuery(this).removeClass("hover");
            }
        }
    }, "#site-menu li");
    if (jQuery("html").hasClass("touchevents")) {
        jQuery("#site-menu li.menu-item-has-children > a:not(.menu-expand)").on("click.mccan", function (e) {
            if (!screen_has_mouse && !window.navigator.msPointerEnabled && !jQuery(".site-menu-toggle").is(":visible")) {
                var $parent = jQuery(this).parent();
                if (!$parent.parents(".hover").length) {
                    jQuery("#site-menu li.menu-item-has-children").not($parent).removeClass("hover");
                }
                $parent.toggleClass("hover");
                e.preventDefault();
            }
        });
    }
    else {
        // Toggle visibility of dropdowns on keyboard focus events.
        jQuery("#site-menu li > a:not(.menu-expand), #top .site-title a, #social-links-menu a:first").on("focus.mccan blur.mccan", function (e) {
            if (screen_has_mouse && !jQuery("#top .site-menu-toggle").is(":visible")) {
                var $parent = jQuery(this).parent();
                if (!$parent.parents(".hover").length) {
                    jQuery("#site-menu .menu-item-has-children.hover").not($parent).removeClass("hover");
                }
                if ($parent.hasClass("menu-item-has-children")) {
                    $parent.addClass("hover");
                }
                e.preventDefault();
            }
        });
    }
    // Handle custom my info.
    jQuery(".my-info .field > a").on("click.mccan", function (e) {
        var $field = jQuery(this).parent();
        $field.toggleClass("show-dropdown").siblings().removeClass("show-dropdown");
        e.preventDefault();
    });
    jQuery(".my-info .dropdown .values a").on("click.mccan", function (e) {
        jQuery(this).parent().addClass("selected").siblings().removeClass("selected");
        var $field = jQuery(this).parents(".field");
        jQuery("input[type=hidden]", $field).val(jQuery(this).data("value"));
        jQuery("span.field-value", $field).html(jQuery(this).html());
        e.preventDefault();
    });
    if (jQuery.fn.owlCarousel) {
        var multiple_items = jQuery(".item", $hero_carousel).length > 1
            , prev_video_active;
        if (!multiple_items) {
            jQuery(".my-info").addClass("full-width");
        }
        var onTranslate = function (event) {
                jQuery("video", event.target).each(function () {
                    this.pause();
                });
            }
            , onTranslated = function (event) {
                jQuery(".owl-item.active video", event.target).each(function () {
                    this.play();
                });
                if (jQuery(".owl-item.active .light-hero-colors", event.target).length > 0) {
                    $body.addClass("light-hero-colors");
                }
                else {
                    $body.removeClass("light-hero-colors");
                }
            };
        $hero_carousel.owlCarousel({
            items: 1
            , loop: multiple_items
            , mouseDrag: multiple_items
            , touchDrag: multiple_items
            , nav: true
            , navElement: 'a href="#"'
            , navText: ['<span class="ti ti-arrow-left"></span>', '<span class="ti ti-arrow-right"></span>']
            , dots: false
            , lazyLoad: true
            , lazyLoadEager: 1
            , video: true
            , responsiveRefreshRate: 0
            , onTranslate: onTranslate
            , onTranslated: onTranslated
            , onLoadedLazy: onTranslated
            , onInitialized: function (event) {
                if (multiple_items) {
                    $body.addClass("hero-has-nav");
                }
                jQuery('<div class="owl-expand"><a href="#"><span class="ti"></span></a></div>').insertAfter(jQuery(".owl-nav", event.target)).on("click.mccan", function (e) {
                    e.preventDefault();
                    if ($body.hasClass("expanded-hero-start")) {
                        return;
                    }
                    var initialAttribs, finalAttribs, completed = 0
                        , duration = $hero_carousel.data("expand-duration")
                        , $hero_collection = $hero_media.add($hero_carousel);
                    if (isNaN(duration)) {
                        duration = 1000;
                    }
                    $body.toggleClass("expanded-hero").addClass("expanded-hero-start").removeClass("expanded-hero-completed");
                    if ($body.hasClass("expanded-hero")) {
                        initialAttribs = {
                            "right": $hero_media.css("right")
                            , "textIndent": 0
                        };
                        finalAttribs = {
                            "right": 0
                            , "textIndent": 100
                        };
                    }
                    else {
                        initialAttribs = {
                            "textIndent": 100
                            , "right": 0
                        };
                        $hero_media.css("right", "");
                        finalAttribs = {
                            "textIndent": 0
                            , "right": $hero_media.css("right")
                        };
                        $hero_media.css("right", "0");
                    }
                    jQuery(".hero-media .ti-spin").css(initialAttribs).animate(finalAttribs, {
                        duration: duration
                        , easing: "easeOutCubic"
                        , step: function (now, fx) {
                            if ("right" === fx.prop) {
                                $hero_collection.css("right", now);
                                $hero_carousel.data("owl.carousel").refresh(true);
                            }
                            else {
                                $content_wrap.css({
                                    "-webkit-transform": "translate(" + now + "%)"
                                    , "-ms-transform": "translate(" + now + "%)"
                                    , "transform": "translate(" + now + "%)"
                                , });
                            }
                        }
                        , complete: function () {
                            completed++;
                            if (completed < 1) {
                                return;
                            }
                            $body.addClass("expanded-hero-completed").removeClass("expanded-hero-start");
                            // clear JS set properties, as they will be set in the CSS as well by the "expanded-hero-completed" selector
                            $hero_media.add($hero_carousel).add($content_wrap).removeAttr("style");
                        }
                    });
                    if (!$body.hasClass("cv")) {
                        var $nav_buttons = jQuery(this).add(jQuery(this).prev(".owl-nav"));
                        $nav_buttons.animate({
                            "bottom": (-jQuery(this).outerHeight())
                        }, {
                            duration: duration / 2
                            , complete: function () {
                                var $nav = jQuery(".owl-nav", $hero_carousel)
                                    , $expand = jQuery(".owl-expand", $hero_carousel)
                                    , right_expand;
                                if ($body.hasClass("expanded-hero")) {
                                    $nav.css({
                                        "right": 0
                                    });
                                    if ($nav.hasClass("disabled")) {
                                        right_expand = 0;
                                    }
                                    else {
                                        right_expand = $nav.outerWidth();
                                    }
                                    $expand.css({
                                        "right": right_expand
                                        , "margin-right": 0
                                    });
                                }
                                else {
                                    jQuery(this).css({
                                        "right": ""
                                        , "margin-right": ""
                                    });
                                }
                                jQuery(this).animate({
                                    "bottom": 0
                                }, {
                                    duration: duration / 2
                                    , complete: function () {
                                        if (!$body.hasClass("expanded-hero")) {
                                            jQuery(this).removeAttr("style");
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
                jQuery(".owl-stage", event.target).on("dblclick.mccan", function (e) {
                    $hero_carousel.find(".owl-expand:visible").trigger("click.mccan");
                });
                var tapedTwice = false;
                jQuery(".owl-stage", event.target).on("touchstart.mccan", function (e) {
                    if (!tapedTwice) {
                        tapedTwice = true;
                        setTimeout(function () {
                            tapedTwice = false;
                        }, 300);
                    }
                    else {
                        $hero_carousel.find(".owl-expand:visible").trigger("click.mccan");
                    }
                });
                jQuery(".ti-loading", $hero_media).addClass("finished");
            }
        });
    }
    jQuery(".menu-overlay").on("click.mccan", function (e) {
        if (e.offsetX < 0 && $body.hasClass("mobile-menu-opened")) {
            jQuery(".site-menu-toggle").trigger("click.mccan");
        }
    });
    jQuery(window).on("resize", function () {
        win_width = jQuery(window).width();
        if ($body.hasClass("mobile-menu-opened")) {
            var menu_pos = 0;
            if (win_width < 767) {
                $menu.css({
                    top: $logo.position().top * 2 + $logo.outerHeight()
                });
            }
            else {
                $menu.removeAttr("style");
                $social_links.removeAttr("style");
            }
        }
        else {
            if ($body.hasClass("full-content")) {
                $content_wrap.css("padding-top", "");
                var contentTop = parseInt($content_wrap.css("padding-top"), 10)
                    , logoHeight = jQuery(".logo", $logo).outerHeight() + $logo.offset().top * 2;
                if (logoHeight > contentTop) {
                    $content_wrap.css("padding-top", logoHeight);
                }
            }
        }
    });
    if ($body.hasClass("full-content")) {
        jQuery(window).resize();
    }
    jQuery.extend(jQuery.easing, {
    easeOutCubic: function (x, t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b;
    }});

});

// // Contact Form
//     var form = $('.contact__form'),
//         message = $('.contact__msg'),
//         form_data;
//     // success function
//     function done_func(response) {
//         message.fadeIn().removeClass('alert-danger').addClass('alert-success');
//         message.text(response);
//         setTimeout(function () {
//             message.fadeOut();
//         }, 2000);
//         form.find('input:not([type="submit"]), textarea').val('');
//     }
//     // fail function
//     function fail_func(data) {
//         message.fadeIn().removeClass('alert-success').addClass('alert-success');
//         message.text(data.responseText);
//         setTimeout(function () {
//             message.fadeOut();
//         }, 2000);
//     }
//     form.submit(function (e) {
//         e.preventDefault();
//         form_data = $(this).serialize();
//         $.ajax({
//             type: 'POST',
//             url: form.attr('action'),
//             data: form_data
//         })
//         .done(done_func)
//         .fail(fail_func);
//     });

// function to display current year on the footer
document.addEventListener('DOMContentLoaded', function() {
    let  currentYear = new Date().getFullYear();
    document.getElementById("currentYear").textContent = currentYear;
});

// function to download cv on the click of the button on home page
function downloadFile(fileUrl, fileName) {
    let link = document.createElement('a');
    link.href = fileUrl;
    link.setAttribute('download', fileName);
    link.click();
}

// helper function to get the value of the input fields
function getValue(id){
    return document.getElementById(id).value;
}
// helper function to validate the input fields
function validateRegex(input, regex){
    return input.match(regex) ? input : '';
}
//helper function to validate inputs without regex
function validateWithoutRegex(input){
    return input.length > 0 ? input : '';
}

// function to validate contact form on the contact page
function validateForm() {
    const fullNameRegex = /^[a-zA-Z'-]{2,20}(?:\s[a-zA-Z'-]{2,20}){1,2}$/;
    // const phoneRegex = /^([0-9]{3} ?){2}[0-9]{4}$/;
    // const emailRegex = /^([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63})$/;


    validateEmail(document.getElementById("email").value);
    validatePhone(document.getElementById("phone").value);

    let userInputs = {
        name: getValue("name"),
        // phone: getValue("phone"),
        // email: getValue("email"),
        subject: getValue("subject"),
        message: getValue("message")
    }

    userInputs.name = validateRegex(userInputs.name, fullNameRegex)
    // userInputs.phone = validateRegex(userInputs.phone, phoneRegex);
    // userInputs.email = validateRegex(userInputs.email, emailRegex);
    userInputs.subject = validateWithoutRegex(userInputs.subject);
    userInputs.message = validateWithoutRegex(userInputs.message);

    console.log('userInputs', userInputs);

    let message = $('.contact__msg');
    let isValid = true;
    let invalidInputs = [];

    Object.entries(userInputs).forEach(([key, value]) => {
        if(value.length === 0) {
            isValid = false;
            invalidInputs.push(key);
        }
    });

    if(isValid) {
        message.text(`Thank you for your message. I will get back to you shortly`);
        message.removeClass('alert-danger').addClass('alert-success');
        setTimeout(function () {
            message.fadeOut();
        }, 3000);
    } else {
        let fields = invalidInputs.join(', ');
        message.text(`Please fill out the following fields: ${fields.toLocaleUpperCase()}`);
        message.removeClass('alert-success').addClass('alert-danger');
        setTimeout(function () {
            message.fadeOut();
        }, 3000);

        // Clear only the invalid inputs
        invalidInputs.forEach(id => {
            document.getElementById(id).value = '';
        });
    }

    message.fadeIn();


}

//function to validate email with regex and api call
// function validateEmail(email){
//     const emailRegex = /^([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63})$/;
//
//     const myHeaders = new Headers();
//     myHeaders.append('apikey', 'yek5T9dPdTYrbbGWJoq57iWgg3NbZlL8');
//
//     let requestOptions = {
//         method: 'GET',
//         redirect: 'follow',
//         headers: myHeaders
//     }
//
//     if(email.trim().match(emailRegex)){
//         try{
//            fetch(`https://api.apilayer.com/email_verification/check?email=${email}`,requestOptions)
//              .then(res => res.json())
//              .then(data => {
//                  console.log(data);
//                  console.log(data.smtp_check)
//              })
//         }
//         catch(error){
//             console.error(error);
//         }
//     }
// }


function validatePhone(phone){
    const phoneRegex = /^([0-9]{3} ?){2}[0-9]{4}$/;
    let reformattedPhone = '+1' + phone

    const myHeaders = new Headers()
    myHeaders.append('apikey', 'yek5T9dPdTYrbbGWJoq57iWgg3NbZlL8')

    let requestOptions = {
        method: "GET",
        redirect: "follow",
        headers: myHeaders
    }

    if(phone.trim().match(phoneRegex))    {
        try{
            fetch(`https://api.apilayer.com/number_verification/validate?number=${reformattedPhone}`, requestOptions)
              .then(res => res.json())
              .then(data => {
                  console.log(data)
                  console.log(data.valid)


              })
        }catch(err){
            console.error(err)
        }
}
}

// function validateEmail(email) {
//     const emailRegex = /^([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63})$/;
//
//     const myHeaders = new Headers();
//     myHeaders.append('apikey', 'yek5T9dPdTYrbbGWJoq57iWgg3NbZlL8');
//
//     let requestOptions = {
//         method: 'GET',
//         redirect: 'follow',
//         headers: myHeaders
//     };
//
//     if (email.trim().match(emailRegex)) {
//         fetch(`https://api.apilayer.com/email_verification/check?email=${email}`, requestOptions)
//           .then(res => {
//               if (!res.ok) {
//                   throw new Error(res.status);
//               }
//               return res.json();
//           })
//           .then(data => {
//               console.log(data);
//               console.log(data.smtp_check);
//               return data.smtp_check;
//           })
//           .catch(error => {
//               if (error.message === '405') {
//                   console.error('Method Not Allowed: The requested HTTP method is not supported.');
//               } else if (error.message === '404') {
//                   console.error('Not Found: The requested resource could not be found.');
//               } else {
//                   console.error('An error occurred during the API request:', error.message);
//               }
//           })
//           .catch(error => {
//               console.error('Network error occurred:', error);
//           });
//     } else {
//         console.error('Invalid email format.');
//     }
//
//
// }
// async function validateEmail(email) {
//     // const emailRegex = /^([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63})$/;
//     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//
//     if (!email.trim().match(emailRegex)) {
//         console.error('Invalid email format.');
//         return false;
//     }
//
//     const myHeaders = new Headers();
//     myHeaders.append('apikey', '2d0b8346501d4f759286087960b07494');
//
//     let requestOptions = {
//         method: 'GET',
//         headers: myHeaders
//     };
//
// const apiKey = 'api_key=2d0b8346501d4f759286087960b07494';
//     try {
//         // const res = await fetch(`https://api.apilayer.com/email_verification/check?email=${email}`, requestOptions)
//         const res = await fetch(`https://emailvalidation.abstractapi.com/v1/&email=${email}`, requestOptions)
//
//         if (!res.ok) {
//             throw new Error(res.status.toString());
//         }
//
//         const data = await res.json();
//         console.log(data);
//
//         return data.smtp_check;
//     } catch (error) {
//         if (error.message === '405') {
//             console.error('Method Not Allowed: The requested HTTP method is not supported.');
//         } else if (error.message === '404') {
//             console.error('Not Found: The requested resource could not be found.');
//         } else {
//             console.error('An error occurred during the API request:', error.message);
//         }
//
//         return false;
//     }
// }

async function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!email.trim().match(emailRegex)) {
        console.error('Invalid email format.');
        return false;
    }

    const apiKey = 'api_key=2d0b8346501d4f759286087960b07494';

    try {
        const res = await fetch(`https://emailvalidation.abstractapi.com/v1/?${apiKey}&email=${email}`)

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }


        if (!res.ok) {
            // Directly handle the status codes without converting to string
            if (res.status === 405) {
                console.error('Method Not Allowed: The requested HTTP method is not supported.');
            } else if (res.status === 404) {
                console.error('Not Found: The requested resource could not be found.');
            } else {
                console.error('An error occurred:', res.statusText);
            }
            return false;
        }

        const data = await res.json();
        console.log(data);

        return data.smtp_check;
    } catch (error) {
        console.error('An unexpected error occurred during the API request:', error.message);
        return false;
    }
}
