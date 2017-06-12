// Copyright 2017, University of Colorado Boulder

/**
 * A general type for keyboard dragging.  Updates a position Property with keyboard interaction.  Objects can be
 * dragged in two dimensions with the arrow keys and with the WASD keys.
 *
 * JavaScript does not natively handle multiple 'keydown' events at once, so we have a custom implementation that
 * tracks which keys are down and for how long in a step() function. To function, this drag handler requires a view step.
 * 
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var Vector2 = require( 'DOT/Vector2' );
  var Input = require('SCENERY/input/Input' );
  var Bounds2 = require( 'DOT/Bounds2' );

  /**
   * @constructor
   * @param {Property} positionProperty
   * @param {Object} options
   */
  function KeyboardDragHandler( positionProperty, options ) {

    var self = this;
    options = _.extend( {
      positionDelta: 5, // while direction key is down, 1D delta for the positionProperty
      shiftKeyMultiplier: 2, // if shift key is down, dragging speed will be changed by this multiplier
      dragBounds: Bounds2.EVERYTHING // position will be limited to these bounds
    }, options );

    // @private - tracks the state of the keyboard, array elements are objects with key-value pairs of keyCode {number},
    // isDown {boolean}, and timeDown {number}. JavaScript doesn't handle multiple key presses, so we track
    // which keys are currently down and update via step()
    this.keyState = [];

    // @private - groups of keys that will change the position property or have other behavior.  Entries of the array will look
    // like { keys: <Array.number>, callback: <Function> }.  Add hotkey groups with this.addHotkeyGroup
    this.hotkeyGroups = [];

    // @private - a key in the hot key group that is currently down.  Object collects { keyCode: <number>, timeDown: <number> }
    // when one of the hotkeys are pressed down, this 
    this.hotKeyDown = {};

    // @private - the change in position (in model coordinates) that will be applied by dragging with the keyboard
    this.positionDelta = options.positionDelta;

    // @private
    this.shiftKeyMultiplier = options.shiftKeyMultiplier;
    this.positionProperty = positionProperty;
    this._dragBounds = options.dragBounds;

    // @public (read-only) - listener that will be added to the node for dragging behavior, made public on the Object
    // so that a KeyboardDragHandler can be added via myNode.addAccessibleInputListener( myKeyboardDragHandler )
    this.keydown = function( event ) {

      // if the key is already down, don't do anything else (we don't want to create a new keystate object
      // for a key that is already being tracked and down)
      if ( self.keyInListDown( [ event.keyCode ] ) ) { return; }

      // required to work with Safari and VoiceOver, otherwise arrow keys will move virtual cursor
      if ( Input.isArrowKey( event.keyCode ) ) { event.preventDefault(); }

      // update the key state
      self.keyState.push( {
        keyDown: true,
        keyCode: event.keyCode,
        timeDown: 0 // in ms
      } );

    };

    // @public (read-only) - listener that will be added to the node for dragging behavior, made public on the Object
    // so that a KeyboardDragHandler can be added via myNode.addAccessibleInputListener( myKeyboardDragHandler )
    this.keyup = function( event ) {
      for ( var i = 0; i < self.keyState.length; i++ ) {
        if ( event.keyCode === self.keyState[ i ].keyCode ) {
          self.keyState.splice( i, 1 );
        }
      }
    };
  }

  balloonsAndStaticElectricity.register( 'KeyboardDragHandler', KeyboardDragHandler );

  return inherit( Object, KeyboardDragHandler, {

    /**
     * Step function for the drag handler. JavaScript does not natively handle many keydown events at once,
     * so we need to track the state of the keyboard in an Object and update the position Property in a step
     * function based on the keyboard state object every animation frame.  In order for the drag handler to
     * work, call this function somewhere in ScreenView.step().
     * 
     * @public
     */
    step: function( dt ) {

      //  for each key that is still down, increment the tracked time that they have been down
      for ( var i = 0; i < this.keyState.length; i++ ) {
        if ( this.keyState[ i ].keyDown ) {
          this.keyState[ i ].timeDown += dt;
        }
      }

      // check to see if any hotkey combinations are down -
      for ( var j = 0; j < this.hotkeyGroups.length; j++ ) {
        var hotkeysDown = [];
        var keys = this.hotkeyGroups[ j ].keys;

        for ( var k = 0; k < keys.length; k++ ) {
          for ( var l = 0; l < this.keyState.length; l++ ) {
            if ( this.keyState[ l ].keyCode === keys[ k ] ) {
              hotkeysDown.push( this.keyState[ l ] );
            }
          }
        }

        // the hotKeysDown array order should match the order of teh key group, so now we just need to make
        // sure that the key down times are in the right order
        var keysInOrder = false;
        for ( var m = 0; m < hotkeysDown.length - 1; m++ ) {
          if ( hotkeysDown[ m + 1 ] && hotkeysDown[ m ].timeDown > hotkeysDown[ m + 1 ].timeDown ) {
            keysInOrder = true;
          }
        }

        // if keys are in order, call the callback associated with the group
        if ( keysInOrder ) {
          this.hotkeyGroups[ j ].callback();
        }
      }

      var deltaX = 0;
      var deltaY = 0;
      var positionDelta = this.shiftKeyDown() ? ( this.positionDelta * this.shiftKeyMultiplier ) : this.positionDelta;

      if ( this.leftMovementKeysDown() ) {
        deltaX = -positionDelta;
      }
      if ( this.rightMovementKeysDown() ) {
        deltaX = positionDelta;
      }
      if ( this.upMovementKeysDown() ) {
        deltaY = -positionDelta;
      }
      if ( this.downMovementKeysDown() ) {
        deltaY = positionDelta;
      }

      // determine if the new position is within the constraints of the drag bounds
      var vectorDelta = new Vector2( deltaX, deltaY );
      var newPosition = this.positionProperty.get().plus( vectorDelta );
      newPosition = this._dragBounds.closestPointTo( newPosition );

      // update the position if it is different
      if ( !newPosition.equals( this.positionProperty.get() ) ) {
        this.positionProperty.set( newPosition );
      }
    },

    getKeyInState: function( keyCode ) {
      var keyObject = null;
      for ( var i = 0; i < this.keyState.length; i++ ) {
        if ( this.keyState[ i ].keyCode === keyCode ) {
          keyObject = this.keyState[ i ];
        }
      }
      return keyObject;
    },

    /**
     * Returns true if any of the keys in the list are currently down.
     * 
     * @param  {Array.<number>} keys
     * @return {boolean}
     */
    keyInListDown: function( keys ) {
      var keyIsDown = false;
      for ( var i = 0; i < this.keyState.length; i++ ) {
        if ( this.keyState[ i ].keyDown ) {
          for ( var j = 0; j < keys.length; j++ ) {
            if ( keys[ j ] === this.keyState[ i ].keyCode ) {
              keyIsDown = true;
              break;
            }
          }
        }
        if ( keyIsDown ) {
          // no need to keep looking
          break;
        }
      }

      return keyIsDown;
    },

    /**
     * Returns true if the keystate indicates that a key is down that should move the object to the left.
     * 
     * @private
     * @return {boolean}
     */
    leftMovementKeysDown: function() {
      return this.keyInListDown( [ Input.KEY_A, Input.KEY_LEFT_ARROW ] );
    },

    /**
     * Returns true if the keystate indicates that a key is down that should move the object to the right.
     * 
     * @public
     * @return {boolean}
     */
    rightMovementKeysDown: function() {
      return this.keyInListDown( [ Input.KEY_RIGHT_ARROW, Input.KEY_D ] );
    },

    /**
     * Returns true if the keystate indicatest that a key is down that should move the object up.
     * 
     * @public
     * @return {boolean}
     */
    upMovementKeysDown: function() {
      return this.keyInListDown( [ Input.KEY_UP_ARROW, Input.KEY_W ] );
    },

    /**
     * Returns true if the keystate indicates that a key is down that should move the upject down.
     * 
     * @public
     * @return {boolean}
     */
    downMovementKeysDown: function() {
      return this.keyInListDown( [ Input.KEY_DOWN_ARROW, Input.KEY_S ] );
    },

    enterKeyDown: function() {
      return this.keyInListDown( [ Input.KEY_ENTER ] );
    },

    /**
     * Returns true if the keystate indicates that the shift key is currently down.
     * 
     * @return {boolean}
     */
    shiftKeyDown: function() {
      return this.keyInListDown( [ Input.KEY_SHIFT ] );
    },

    /**
     * Sets the bounds for dragging with the keyboard.
     *
     * @public
     * @param {Bounds2} dragBounds
     */
    setDragBounds: function( dragBounds ) {
      this._dragBounds = dragBounds.copy();
      this.positionProperty.set( this._dragBounds.closestPointTo( this.positionProperty.get() ) );
    },
    set dragBounds( dragBounds ) { this.setDragBounds( dragBounds ); },

    /**
     * Get the Bounds2 Object wich constrains the possible Vector2 values of the position Property.
     * 
     * @public
     * @return {Bounds2}
     */
    getDragBounds: function() {
      return this._dragBounds;
    },
    get dragBounds() { return this.getDragBounds(); },

    /**
     * Add a set of hotkeys that will provide special behavior to 
     * @param {Array.<number>} keys
     * @param {Function} callback - called back when all keys listed in keys array are down
     */
    addHotkeyGroup: function( hotkeyGroup ) {
      this.hotkeyGroups.push( hotkeyGroup );
    },

    /**
     * Reset the keystate Object tracking which keys are currently pressed down.
     * 
     * @public
     */
    reset: function() {
      this.keyState = [];
    }
  } );
} );
