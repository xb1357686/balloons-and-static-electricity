// Copyright 2015, University of Colorado Boulder

/**
 * A node in the scene graph with representation in the Parallel DOM.  This node can be 'dragged' with
 * WASD keys.
 *
 * @author: Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Emitter = require( 'AXON/Emitter' );
  var Vector2 = require( 'DOT/Vector2' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var AccessibleNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/accessibility/AccessibleNode' );

  // constants
  var KEY_S = 83; // keycode for 's'
  var KEY_W = 87; // keyvode for 'w'
  var KEY_A = 65; // keycode for 'a'
  var KEY_D = 68; // keycode for 'd'
  var KEY_J = 74; // keycode for 'j'
  var KEY_LEFT = 37; // left arrow key
  var KEY_RIGHT = 39; // right arrow key
  var KEY_UP = 38; // up arrow key
  var KEY_DOWN = 40; // down arrow key

  /**
   * Constructor for a button Node.
   * @constructor
   **/
  function AccessibleDragNode( locationProperty, options ) {

    // validate options - the draggable node must be represented with <div role='application'> for screen reader support
    assert && assert( !options.tagName || options.tagName === 'div', 'a draggable element must be represented by a div' );
    assert && assert( !options.ariaRole || options.role === 'application', 'draggable peer must be of role "application"' );
    if ( options.events ) {
      assert && assert( !options.events.keydown && !options.events.keyup, 'please use options.onKeyUp or options.onKeyDown for keyboard dragging' );
    }

    options = _.extend( {
      tagName: 'div',
      ariaRole: 'application',
      events: {
        keydown: function( event ) {

          // if key is down for dragging, prevent default
          // this is required for VO, which tries to also move the virtual cursor
          if ( self.isDraggingKey( event.keyCode ) ) {
            event.preventDefault();
            self.dragWithKey( event );
          }
          options.onKeyDown( event );
        },
        keyup: function( event ) {
          self.keyUpEmitter.emit1( event );
          options.onKeyUp( event );
        }
      },
      onTab: function() {}, // optional function to call when user 'tabs' away
      restrictLocation: function() {}, // fires during the drag
      positionDelta: 5, // change in model coordinates when user presses directional key, in model coordinates
      dragBounds: Bounds2.EVERYTHING, // drag bounds (like MovableDragHandler) in model coordinate frame
      modelViewTransform: ModelViewTransform2.createIdentity(), // {ModelViewTransform2} defaults to identity
      focusable: true,
      onKeyUp: function() {},
      onKeyDown: function() {}
    }, options );


    var self = this;

    // @private - track the state of pressed keys - JavaScript doesn't handle multiple key presses, so we track which
    // keys are pressed and track how long they are down in ms via step()
    this.keyState = {};

    // @public - emit when the keystate changes
    this.keyStateChangedEmitter = new Emitter();
    this.keyUpEmitter = new Emitter();
    this.keyDownEmitter = new Emitter();

    // TODO Temporary hack to get working balloon
    this.keyState[ KEY_J ] = {
      isKeyDown: false,
      keyEvent: null
    };

    // TODO: Temporary for now...
    this.balloonJumpingEmitter = new Emitter();

    // @private
    this.restrictLocation = options.restrictLocation;

    // @private
    this.locationProperty = locationProperty;
    this._positionDelta = options.positionDelta;
    this._dragBounds = options.dragBounds;
    this._modelViewTransform = options.modelViewTransform;
    this._onTab = options.onTab;

    // button contained in a div so that it can contain descriptions or other children
    AccessibleNode.call( this, options );
  }

  balloonsAndStaticElectricity.register( 'AccessibleDragNode', AccessibleDragNode );

  return inherit( AccessibleNode, AccessibleDragNode, {

    dragWithKey: function( event ) {

      var deltaX = 0;
      var deltaY = 0;

      if ( event.keyCode === ( KEY_A ) || event.keyCode === ( KEY_LEFT ) ) {
        deltaX = -this._positionDelta;
      }
      if ( event.keyCode === ( KEY_D ) || event.keyCode === ( KEY_RIGHT ) ) {
        deltaX = this._positionDelta;
      }
      if ( event.keyCode === ( KEY_W ) || event.keyCode === ( KEY_UP ) ) {
        deltaY = -this._positionDelta;
      }
      if ( event.keyCode === ( KEY_S ) || event.keyCode === ( KEY_DOWN ) ) {
        deltaY = this._positionDelta;
      }
      if ( event.shiftKey ) {
        deltaX *= 2;
        deltaY *= 2;
      }

      var locationDelta = new Vector2( deltaX, deltaY );
      var newLocation = this.locationProperty.get().copy().plus( locationDelta );
      newLocation = this._dragBounds.closestPointTo( newLocation );

      // update the location if it is different
      if ( !newLocation.equals( this.locationProperty.value ) ) {
        this.locationProperty.set( newLocation );
      }
    },

    /**
     * Set the position delta for the draggable element when a key is pressed
     *
     * @param  {number} newDelta - delta for position in model coordinates
     */
    setPositionDelta: function( newDelta ) {
      this._positionDelta = newDelta;
    },

    /**
     * Check to see if the key up was one of the keys that drags the element.
     *
     * @param {number} keyCode - event key code on the 'keyup' event
     * @return {boolean}
     */
    isDraggingKey: function( keyCode ) {
      return ( keyCode === KEY_S || keyCode === KEY_W || keyCode === KEY_A || keyCode === KEY_D || 
                keyCode === KEY_LEFT || keyCode === KEY_RIGHT || keyCode === KEY_UP || keyCode === KEY_DOWN );
    },

    /**
     * Check to see if a key is currently down
     *
     * @private
     * @param  {number} keyCode
     * @return {Boolean}
     */
    isKeyDown: function( keyCode ) {
      return this.keyState[ keyCode ] && this.keyState[ keyCode ].isKeyDown;
    },

    /**
     * Sets the dragBounds.
     * In addition, it forces the location to be within the bounds.
     * @param {Bounds2} dragBounds
     * @public
     */
    setDragBounds: function( dragBounds ) {
      this._dragBounds = dragBounds.copy();
      this.locationProperty.set( this._dragBounds.closestPointTo( this.locationProperty.get() ) );
    },
    set dragBounds( value ) { this.setDragBounds( value ); },

    /**
     * Gets the dragBounds. Clients should not mutate the value returned.
     * @returns {Bounds2}
     * @public
     */
    getDragBounds: function() {
      return this._dragBounds;
    },
    get dragBounds() { return this.getDragBounds(); }
  } );
} );