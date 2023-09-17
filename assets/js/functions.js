/*
 * Template functions file.
 */
jQuery(function () {
    "use strict";
    let screen_has_mouse = false
      , $body = jQuery('body')
      , $logo = jQuery('#identity')
      , $social_links = jQuery('#social-profiles')
      , $menu = jQuery('#site-menu')
      , $content_wrap = jQuery('.content-wrap')
      , $hero_media = jQuery('.hero-media')
      , $hero_carousel = jQuery('.hero-media .owl-carousel')
      , win_width = jQuery(window).width()

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
        const $parent = jQuery(this).parent()
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
                const $parent = jQuery(this).parent()
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
                const $parent = jQuery(this).parent()
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
        const $field = jQuery(this).parent()
        $field.toggleClass("show-dropdown").siblings().removeClass("show-dropdown");
        e.preventDefault();
    });
    jQuery(".my-info .dropdown .values a").on("click.mccan", function (e) {
        jQuery(this).parent().addClass("selected").siblings().removeClass("selected");
        const $field = jQuery(this).parents('.field')
        jQuery("input[type=hidden]", $field).val(jQuery(this).data("value"));
        jQuery("span.field-value", $field).html(jQuery(this).html());
        e.preventDefault();
    });
    if (jQuery.fn.owlCarousel) {
        let multiple_items = jQuery('.item', $hero_carousel).length > 1
          , prev_video_active
        if (!multiple_items) {
            jQuery(".my-info").addClass("full-width");
        }
        const onTranslate = function(event) {
            jQuery('video', event.target).each(function() {
                this.pause()
            })
        }
          , onTranslated = function(event) {
            jQuery('.owl-item.active video', event.target).each(function() {
                this.play()
            })
            if (jQuery('.owl-item.active .light-hero-colors', event.target).length > 0) {
                $body.addClass('light-hero-colors')
            } else {
                $body.removeClass('light-hero-colors')
            }
        }
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
                    let initialAttribs, finalAttribs, completed = 0
                      , duration = $hero_carousel.data('expand-duration')
                      , $hero_collection = $hero_media.add($hero_carousel)
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
                        const $nav_buttons = jQuery(this).add(jQuery(this).prev('.owl-nav'))
                        $nav_buttons.animate({
                            "bottom": (-jQuery(this).outerHeight())
                        }, {
                            duration: duration / 2
                            , complete: function () {
                                let $nav = jQuery('.owl-nav', $hero_carousel)
                                  , $expand = jQuery('.owl-expand', $hero_carousel)
                                  , right_expand
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
                let tapedTwice = false
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
            const menu_pos = 0
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
                const contentTop = parseInt($content_wrap.css('padding-top'), 10)
                  , logoHeight = jQuery('.logo', $logo).outerHeight() + $logo.offset().top * 2
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

// function to display current year on the footer
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("currentYear").textContent = new Date().getFullYear();
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
// helper function to clear the input fields
function clearInputFields(fieldIds) {
    fieldIds.forEach((id) => {
        document.getElementById(id).value = '';
    });
}

// function to validate contact form on the contact page
async function handleSubmit() {
    // disable the submit button to prevent multiple clicks
    document.getElementById("submit").disabled = true;

    const fullNameRegex = /^[a-zA-Z'-]{2,20}(?:\s[a-zA-Z'-]{2,20}){1,2}$/;
    let isValidEmail, isValidPhone;
    let isValid = true;

    try {
        isValidEmail = await validateEmail(document.getElementById("email").value);
        // Wait for 1 second before proceeding to the next API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        isValidPhone = await validatePhone(document.getElementById("phone").value);
    } catch (error) {
        console.error("An error occurred:", error);
        isValid = false;
    }
    let userInputs = {
        name: getValue("name"),
        subject: getValue("subject"),
        message: getValue("message")
    }

    userInputs.name = validateRegex(userInputs.name, fullNameRegex)
    userInputs.subject = validateWithoutRegex(userInputs.subject);
    userInputs.message = validateWithoutRegex(userInputs.message);

    console.log('userInputs', userInputs);

    let message = $('.contact__msg');
    let invalidInputs = [];

    Object.entries(userInputs).forEach(([key, value]) => {
        if(value.length === 0) {
            isValid = false;
            invalidInputs.push(key);
        }
    });

    if (isValid && isValidEmail && isValidPhone) {
        message.text(`Thank you for your message. I will get back to you shortly.`);
        message.removeClass('alert-danger').addClass('alert-success');
        setTimeout(() => {
            message.fadeOut();
        }, 3000);
        // Clear all the input fields, including the submit button
        clearInputFields(['name', 'email', 'phone', 'subject', 'message', 'submit']);
    } else {
        let fields = invalidInputs.join(', ');
        if (!isValidEmail) fields += ', email';
        if (!isValidPhone) fields += ', phone';
        message.text(`Please fill out the following fields: ${fields.toLocaleUpperCase()}`);
        message.removeClass('alert-success').addClass('alert-danger');
        setTimeout(() => {
            message.fadeOut();
        }, 3000);
        // Clear only the invalid inputs
        invalidInputs.forEach(id => {
            document.getElementById(id).value = '';
        });
        // Enable the submit button
        document.getElementById("submit").disabled = false;
    }

    message.fadeIn();

}

async function validatePhone(phone){
    const phoneRegex = /^([0-9]{3} ?){2}[0-9]{4}$/;
    let reformattedPhone = '+1' + phone;

    if(!phone.trim().match(phoneRegex)){
        console.error('Invalid phone format.');
        return false;
    }

    // const apiKey = 'api_key=52abd12ed12941aba5bfbb144add14fd';
    const apiKey = 'api_key=7a0bd34f5bfd49beace2fbf794347d24';

    try {
        const res = await fetch(`https://phonevalidation.abstractapi.com/v1/?${apiKey}&phone=${reformattedPhone}`);
        if (!res.ok) {
            if (res.status === 405) {
                console.error('Method Not Allowed: The requested HTTP method is not supported.');
            } else if (res.status === 404) {
                console.error('Not Found: The requested resource could not be found.');
            } else if (res.status === 429) {
                console.error('Rate Limit Reached: Too many requests.');
            } else {
                console.error('An error occurred:', res.statusText);
            }
            return false;
        }
        const data = await res.json();
        console.log(data);

        if (data.valid !== undefined) {
            console.log(data.valid);
            return data.valid;
        } else {
            console.error('Unexpected response structure.');
            return false;
        }
    } catch (error) {
        console.error('An unexpected error occurred during the API request:', error.message);
        return false;
    }
}

async function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!email.trim().match(emailRegex)) {
        console.error('Invalid email format.');
        return false;
    }

    // const apiKey = 'api_key=2d0b8346501d4f759286087960b07494';
    const apiKey = 'api_key=3c738939ec6147eea877897cead10d29';
    try {
        const res = await fetch(`https://emailvalidation.abstractapi.com/v1/?${apiKey}&email=${email}`)

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
        console.log(data.is_smtp_valid.value);
        return data.is_smtp_valid.value;
    } catch (error) {
        console.error('An unexpected error occurred during the API request:', error.message);
        return false;
    }
}

