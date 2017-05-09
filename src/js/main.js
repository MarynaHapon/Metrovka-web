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

"use strict";

;(function(factory){
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }
})(function($){
    var coolCarousel = (function(element, settings){
        var instanceUid = 0;
        function _coolCarousel(element, settings){
            this.defaults = {
                //'infinite' : 'true',
                //'index' : '0',
                //'slidesVisible' : '1',
                //'slidesToScroll' : '1',
                //'arrows' : 'true',
                //'swipeAble' : 'true',
                //'pagination' : 'true',
                //'autoplay' : 'true',
                'slideDuration' : '5000',
                'speed' : '500',
                'arrowRight' : '.arrow-right',
                'arrowLeft' : '.arrow-left'
            };
            this.settings = $.extend({},this,this.defaults,settings);

            this.initials = {
                currSlide : 0,
                $currSlide: null,
                totalSlides : false,
                csstransitions: false
            };

            $.extend(this,this.initials);

            this.$el = $(element);

            this.changeSlide = $.proxy(this.changeSlide,this);

            this.init();

            this.instanceUid = instanceUid++;
        }

        return _coolCarousel;

    })();

    coolCarousel.prototype.init = function(){
        this.csstransitionsTest();
        this.$el.addClass('cool-carousel');
        this.build();
        this.events();
        this.activate();
        this.initTimer();
    };

    coolCarousel.prototype.csstransitionsTest = function(){
        var elem = document.createElement('modernizr');
        //A list of properties to test for
        var props = ["transition","WebkitTransition","MozTransition","OTransition","msTransition"];
        //Iterate through our new element's Style property to see if these properties exist
        for ( var i in props ) {
            var prop = props[i];
            var result = elem.style[prop] !== undefined ? prop : false;
            if (result){
                this.csstransitions = result;
                break;
            }
        }
    };

    coolCarousel.prototype.addCSSDuration = function(){
        var _ = this;
        this.$el.find('.slide').each(function(){
            this.style[_.csstransitions+'Duration'] = _.settings.speed+'ms';
        });
    },

        coolCarousel.prototype.removeCSSDuration = function(){
            var _ = this;
            this.$el.find('.slide').each(function(){
                this.style[_.csstransitions+'Duration'] = '';
            });
        },

        coolCarousel.prototype.build = function(){
            var $indicators = this.$el.append('<ul class="indicators" >').find('.indicators');
            this.totalSlides = this.$el.find('.slide').length;
            for(var i = 0; i < this.totalSlides; i++) $indicators.append('<li data-index='+i+'>');
        };

    coolCarousel.prototype.activate = function(){
        this.$currSlide = this.$el.find('.slide').eq(0);
        this.$el.find('.indicators li').eq(0).addClass('active');
    };

    coolCarousel.prototype.events = function(){
        $('body')
            .on('click',this.settings.arrowRight,{direction:'right'},this.changeSlide)
            .on('click',this.settings.arrowLeft,{direction:'left'},this.changeSlide)
            .on('click','.indicators li',this.changeSlide);
    };

    coolCarousel.prototype.clearTimer = function(){
        if (this.timer) clearInterval(this.timer);
    };

    coolCarousel.prototype.initTimer = function(){
        this.timer = setInterval(this.changeSlide, this.settings.slideDuration);
    };

    coolCarousel.prototype.startTimer = function(){
        this.initTimer();
        this.throttle = false;
    };

    coolCarousel.prototype.changeSlide = function(e){

        if (this.throttle) return;
        this.throttle = true;

        this.clearTimer();

        var direction = this._direction(e);

        var animate = this._next(e,direction);
        if (!animate) return;

        var $nextSlide = this.$el.find('.slide').eq(this.currSlide).addClass(direction + ' active');

        if (!this.csstransitions){
            this._jsAnimation($nextSlide,direction);
        } else {
            this._cssAnimation($nextSlide,direction);
        }
    };

    coolCarousel.prototype._direction = function(e){
        var direction;

        if (typeof e !== 'undefined'){
            direction = (typeof e.data === 'undefined' ? 'right' : e.data.direction);
        } else {
            direction = 'right';
        }
        return direction;
    };

    coolCarousel.prototype._next = function(e,direction){

        var index = (typeof e !== 'undefined' ? $(e.currentTarget).data('index') : undefined);

        switch(true){

            case( typeof index !== 'undefined'):
                if (this.currSlide == index){
                    this.startTimer();
                    return false;
                }
                this.currSlide = index;
                break;
            case(direction == 'right' && this.currSlide < (this.totalSlides - 1)):
                this.currSlide++;
                break;
            case(direction == 'right'):
                this.currSlide = 0;
                break;
            case(direction == 'left' && this.currSlide === 0):
                this.currSlide = (this.totalSlides - 1);
                break;
            case(direction == 'left'):
                this.currSlide--;
                break;
        }
        return true;
    };

    coolCarousel.prototype._cssAnimation = function($nextSlide,direction){

        setTimeout(function(){
            this.$el.addClass('transition');
            this.addCSSDuration();
            this.$currSlide.addClass('shift-'+direction);
        }.bind(this),100);

        setTimeout(function(){
            this.$el.removeClass('transition');
            this.removeCSSDuration();
            this.$currSlide.removeClass('active shift-left shift-right');
            this.$currSlide = $nextSlide.removeClass(direction);
            this._updateIndicators();
            this.startTimer();
        }.bind(this),100 + this.settings.speed);
    };

    coolCarousel.prototype._jsAnimation = function($nextSlide,direction){
        var _ = this;

        if(direction == 'right') _.$currSlide.addClass('js-reset-left');

        var animation = {};
        animation[direction] = '0%';

        var animationPrev = {};
        animationPrev[direction] = '100%';

        this.$currSlide.animate(animationPrev,this.settings.speed);

        $nextSlide.animate(animation,this.settings.speed,'swing',function(){
            //Get rid of any JS animation residue
            _.$currSlide.removeClass('active js-reset-left').attr('style','');
            //Cache the next slide after classes and inline styles have been removed
            _.$currSlide = $nextSlide.removeClass(direction).attr('style','');
            _._updateIndicators();
            _.startTimer();
        });
    };

    coolCarousel.prototype._updateIndicators = function(){
        this.$el.find('.indicators li').removeClass('active').eq(this.currSlide).addClass('active');
    };

    $.fn.coolCarousel = function(options){
        return this.each(function(index,el){
            el.coolCarousel = new coolCarousel(el,options);
        });
    };
});

// Custom options for the carousel
$('.carousel').coolCarousel({
    arrowRight : '.arrow-right',
    arrowLeft : '.arrow-left',
    speed : 1000,
    slideDuration : 5000
});

$('#listings-carousel1').coolCarousel({
    arrowRight : '.arrow-right',
    arrowLeft : '.arrow-left',
    speed : 1000,
    slideDuration : 5000
});

$('#listings-carousel2').coolCarousel({
    arrowRight : '.arrow-right',
    arrowLeft : '.arrow-left',
    speed : 1000,
    slideDuration : 5000
});

$('#listings-carousel3').coolCarousel({
    arrowRight : '.arrow-right',
    arrowLeft : '.arrow-left',
    speed : 1000,
    slideDuration : 5000
});

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