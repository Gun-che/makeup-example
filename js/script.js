
document.addEventListener('DOMContentLoaded', function(){
    let svgObj = document.getElementById('map_object');
    let wrapper = document.querySelector('.location_section');
    let list = document.querySelector('.list_location');

    wrapper.onmouseover = function(event) {
        let target = event.target.closest('[data-location]');
        let location = target.dataset.location;
        
        list.querySelector(`[data-location="${location}"]`).style.color = '#5090f0';
        if(location == 14) location = 6;
        svgObj.querySelector(`[data-location="${location}"]`).style.fill = '#c4ccd9';
    }

    wrapper.onmouseout = function(event) {
        let location =  event.target.closest('[data-location]').dataset.location;
        
        list.querySelector(`[data-location="${location}"]`).style.color = '';
        if(location == 14) location = 6;
        svgObj.querySelector(`path[data-location="${location}"]`).style.fill = '';
    }
  
})    

function Slider(sliderId) {
    let id = document.getElementById(sliderId);
    if (id) {
        this.sliderRoot = id;
    }
    else {
        this.sliderRoot = document.querySelector('.slider');
    };

    this.sliderList = this.sliderRoot.querySelector('.slider_list');
    this.sliderElements = this.sliderList.querySelectorAll('.slider_element');
    this.sliderElemFirst = this.sliderList.querySelector('.slider_element');
    this.leftArrow = this.sliderRoot.querySelector('.slider_arrow_left');
    this.rightArrow = this.sliderRoot.querySelector('.slider_arrow_right');
    this.indicatorDots = this.sliderRoot.querySelector('.slider_dots');

    this.options = Slider.defaults;
    Slider.initialize(this);
};

Slider.defaults = {
    elemVisible: 1,
    loop: true,
    auto: false,
    interval: 8000,
    speed: 250,
    touch: true,
    arrow: true,
    dots: true,
};

Slider.prototype.elemPrev = function(num) {
    num = num || 1;

    if(this.options.dots) {
        this.dotOn(this.currentElement);
    }
    this.currentElement -= num;
    if(this.currentElement < 0) this.currentElement = this.dotsVisible - 1;
    if(this.options.dots) this.dotOff(this.currentElement);
    
    if(!this.options.loop) {
        this.currentOffset += this.elemWidth * num;
        this.sliderListstyle.marginLeft = this.currentOffset + 'px';
        if(this.currentElement == 0) {
            this.leftArrow.style.display = 'none';
            this.touchPrev = false;
        }
        this.rightArrow.style.display = 'block';
        this.touchNext = true;
    }else{
        let elem, buf, this$ = this;
        for(let i = 0; i < num; i++) {
            elem = this.sliderList.lastElementChild;
            buf = elem.cloneNode(true);
            this.sliderList.insertBefore(buf, this.sliderList.firstElementChild);
            this.sliderList.removeChild(elem);
        };
        this.sliderList.style.marginLeft = '-' + this.elemWidth * num + 'px';
        let compStyle = window.getComputedStyle(this.sliderList).marginLeft;
        this.sliderList.style.cssText = 'transition:margin ' + this.options.speed + 'ms ease;';
        this.sliderList.style.marginLeft = '0px';
        setTimeout(function() {
            this$.sliderList.style.cssText = 'transition:none;'
        }, this.options.speed);
    }
};
Slider.prototype.elemNext = function(num) {
    num = num || 1;

    if (this.options.dots) {
        this.dotOn(this.currentElement);
    }
    this.currentElement += num;
    if(this.currentElement == this.dotsVisible) this.currentElement = 0;
    if(this.options.dots) this.dotOff(this.currentElement);

    if(!this.options.loop) { 
		this.currentOffset -= this.elemWidth * num;
		this.sliderList.style.marginLeft = this.currentOffset + 'px';
		if(this.currentElement == this.dotsVisible - 1) {
			this.rightArrow.style.display = 'none'; this.touchNext = false;
		}
		this.leftArrow.style.display = 'block'; this.touchPrev = true;
    }else{
        let elem, buf, this$ = this;
        this.sliderList.style.cssText = 'transition:margin ' + this.options.speed + 'ms ease;';
        this.sliderList.style.marginLeft = '-' + this.elemWidth * num + 'px';
        setTimeout(function() {
            this$.sliderList.style.cssText = 'transition:none;';
            for(let i = 0; i < num; i++) {
                elem = this$.sliderList.firstElementChild;
                buf = elem.cloneNode(true);
                this$.sliderList.appendChild(buf);
                this$.sliderList.removeChild(elem);
            };
            this$.sliderList.style.marginLeft = '0px';
        }, this.options.speed);
    }
};

Slider.prototype.dotOn = function(num) {
    this.indicatorDotsAll[num].style.cssText = 'background-color: #d7d8d8; cursor: pointer;';
};
Slider.prototype.dotOff = function(num) {
    this.indicatorDotsAll[num].style.cssText = 'background-color: #373b3e; cursor: pointer;';
}

Slider.initialize = function(that) {
    
    that.elemCount = that.sliderElements.length;
    that.dotsVisible = that.elemCount;
    let elemStyle = window.getComputedStyle(that.sliderElemFirst);
    that.elemWidth = that.sliderElemFirst.offsetWidth + parseInt(elemStyle.marginLeft) + parseInt(elemStyle.marginRight);
    
    that.currentElement = 0; 
    that.currentOffset = 0;
    that.touchPrev = true; 
    that.touchNext =  true;
    let xTouch, yTouch, xDiff, yDiff, stTime, mvTime;
    let bgTime = getTime();

    function getTime() {
        return new Date().getTime();
    };
    function setAutoScroll() {
        that.autoScroll = setInterval(function() {
            let fnTime = getTime();
            if(fnTime + bgTime + 10 > that.options.interval) {
                bgTime = fnTime;
                that.elemNext();
            }
        }, that.options.interval);
    };

    if(that.elemCount <= that.options.elemVisible) {  // Отключить навигацию
        that.options.auto = false; 
        that.options.touch = false;
        that.options.arrows = false; 
        that.options.dots = false;
        that.leftArrow.style.display = 'none'; 
        that.rightArrow.style.display = 'none';
    };
    
	if(!that.options.loop) {      // если нет цикла - уточнить количество точек
		that.dotsVisible = that.elemCount - that.options.elemVisible + 1;
		that.leftArrow.style.display = 'none';  
		that.touchPrev = false;   
		that.options.auto = false; 
    }else if(that.options.auto){
        setAutoScroll();
        that.sliderList.addEventListener('mouseenter', function() {
            clearInterval(that.autoScroll);
        }, false);
        that.sliderList.addEventListener('mouseleave', setAutoScroll, false);
    };

    if(that.options.touch) {
        that.sliderList.addEventListener('touchstart', function(event) {
            xTouch = parseInt(event.touches[0].clientX);
            yTouch = parseInt(event.touches[0].clientY);
            stTime = getTime();
        }, false);
        that.sliderList.addEventListener('touchmove', function(event) {
            if(!xTouch || !yTouch) return;
            xDiff = xTouch - parseInt(event.touches[0].clientX);
            yDiff = yTouch - parseInt(event.touches[0].clientY);
            mvTime = getTime();
            if(Math.abs(xDiff) > 15 && Math.abs(xDiff) > Math.abs(yDiff) && mvTime - stTime < 75) {
                stTime = 0;
                if(that.touchNext && xDiff > 0) {
                    bgTime = mvTime; 
                    that.elemNext();
                }else if(that.touchPrev && xDiff < 0) {
                    bgTime = mvTime;
                    that.elemPrev();
                }
            }
        }, false)
    };
    if(that.options.arrow) {
        if (!that.options.loop) {
            that.sliderList.style.cssText = 'transition: margin '+ that.options.speed + 'ms ease;';
        }
        that.leftArrow.addEventListener('click', function() {
			let fnTime = getTime();
			if(fnTime - bgTime > that.options.speed) {
				bgTime = fnTime; that.elemPrev()
			}
		}, false);
		that.rightArrow.addEventListener('click', function() {
			let fnTime = getTime();
			if(fnTime - bgTime > that.options.speed) {
				bgTime = fnTime; that.elemNext()
			}
		}, false);
    }else{
        that.leftArrow.style.display = 'none';
        that.rightArrow.style.display = 'none';
    };
    if (that.options.dots) {
        let sum = '', diffNum;
        for (let i = 0; i < that.dotsVisible; i++) {
            sum += '<span class = "dot"></span>'; 
        };
        that.indicatorDots.innerHTML  = sum;
        that.indicatorDotsAll = that.sliderRoot.querySelectorAll('.dot');
        for(let n = 0; n < that.dotsVisible; n++) {
			that.indicatorDotsAll[n].addEventListener('click', function() {
				diffNum = Math.abs(n - that.currentElement);
				if(n < that.currentElement) {
                    bgTime = getTime(); 
                    that.elemPrev(diffNum);
				}
				else if(n > that.currentElement) {
                    bgTime = getTime(); 
                    that.elemNext(diffNum)
				}
			}, false)
        };
        that.dotOff(0);
        for (let i = 1; i < that.dotsVisible; i++) {
            that.dotOn(i);
        }
    }
};
new Slider();

{
    let anchors = document.querySelectorAll('a[href*="#"]');

    for (let anchor of anchors) {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            let blockID = anchor.getAttribute('href').substring(1);
            
            document.getElementById(blockID).scrollIntoView({
            behavior: 'smooth',
            block: 'start'
            });
        });
    }
}
$(window).on('load', function() {
    $('.phone_number').mask('+7 (999) 999 99 99', {placeholder: '+7 (---) --- -- --'});
});

// {
//     if (window.matchMedia('(max-width: 414px)').matches) {
//         let replaceVidget = document.querySelector('.calculator_back').cloneNode(true);
//         document.querySelector('.vidget_item').before(replaceVidget);
//         document.querySelector('.calculator_back').classList.add('replace_vidget');
//     }
    
// }