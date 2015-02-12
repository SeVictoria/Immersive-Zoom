var zoom = (function ($) {
    var selectors = {
            document: document,
            window: window,
            body: 'body, html',
            scene: '.scene',
            layers: '.layer',
            depth: '.scene__depth',
            menu: '.menu',
            anchor: 'a[href^="#"]'
        },
        classes = {
            activeMenu: 'menu__item--active'
        },
        distance = 500,
        speed = 100,
        current = {
            layer: 0,
            progress: 0,
            menu: ''
        },
        depth,
        layers,
        nodes, 
		controller;

    function zoomScene() {
        // get scroll, cap within bounds
        var scroll = nodes.window.scrollTop();
        scroll = scroll >= 0 ? (scroll <= depth ? scroll : depth) : 0;

        // set currents
        current.layer = (scroll / distance) | 0;
        current.progress = (scroll - (current.layer * distance)) / distance;
        current.overallProgress = (scroll / (distance * layers));

        // adjust scene
        setZPosition(nodes.scene, scroll);

        // update menu and layer
        setActive();
    }

    function setActive() {
        // update menu
        var position = current.layer + Math.round(current.progress);

        if (position !== current.menu) {
            var layer = $('.layer[data-depth="' + position * distance + '"]');

            nodes.menu.find('.' + classes.activeMenu).removeClass(classes.activeMenu);

            nodes.menu.find('a[href="#' + layer.attr('id') + '"]').addClass(classes.activeMenu);

            current.menu = position;
        }
    }

    function setZPosition(element, z) {
        element.css({
            '-webkit-transform': 'translate3d(0, 0px, ' + z + 'px)',
            '-moz-transform': 'translate3d(0, 0, ' + z + 'px)',
            'transform': 'translate3d(0, 0, ' + z + 'px)'
        });
    }

    function scrollToLayer(target) {
        nodes.body.stop(true).animate({
            'scrollTop': target
        }, speed);
    }
	 function scrollFastToLayer(target) {
        nodes.body.stop(true).animate({
            'scrollTop': target
        }, speed/2);
    }

    function setDepth() {
        layers = nodes.layers.length;

        depth = (distance * (layers - 1)) + nodes.window.height();

        nodes.depth.css('height', depth + 'px');
    }

    return {
        init: function () {
			controller = new Leap.Controller();
			
			var maxDepth = 5000,
				depthOffset = 2000,
				maxLayerDepth = 5000,
				minLayDepth = 0,
				lastLayerDepth = 4100,
				lastLayerHandDepth=3000;
			
            nodes = utils.createNodes(selectors);

            // set environment depth
            setDepth();

            // set layer z position
            $.each(nodes.layers, function () {
                var layer = $(this);

                setZPosition(layer, -layer.data('depth'));
            });

            // set initial position
            zoomScene();

            // zooming
            var throttledZoom = _.throttle(zoomScene, 25);

            nodes.window.on('scroll', throttledZoom);

            // resize
            nodes.window.on('resize', setDepth);

            // anchors
            nodes.anchor.on('click', function (event) {
                var target = $($(this).attr('href')).data('depth');

                scrollToLayer(target);

                event.preventDefault();
            });
			window.scrollToLayer=scrollToLayer;
			controller.connect();
			window.controller= controller;
			
			//Leap.loop({hand: function(hand) {
			window.leapZoom = function(hand){
				

			
				var handDepth = hand.screenPosition()[2] + depthOffset;
				var fast = 0;
				
				//handDepth = handDepth > maxDepth ? maxDepth : handDepth;
				
				if (handDepth > lastLayerHandDepth){
					handDepth = lastLayerDepth;
					fast= 1;
				}
				
				//if (handDepth  > 5000) {
				//	handDepth = 5000;
				//} else {
				//	handDepth = handDepth;
				//}
					
				var normalizedHandDepth = handDepth/maxDepth;
				var newDepth = normalizedHandDepth * (maxLayerDepth - minLayDepth) + minLayDepth;
				
				
				//console.log(handDepth,newDepth);
				if (fast==1){
					scrollFastToLayer (newDepth);
				} else {
					scrollToLayer(newDepth);
				}
			  
			}
			

        }
    }
})(jQuery);

$(function () {
    zoom.init();
});