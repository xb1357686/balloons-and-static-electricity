// Copyright 2017, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var scenery = require( 'SCENERY/scenery' );
  var Emitter = require( 'AXON/Emitter' );

  /**
   * 
   * @constructor
   */
  function AlertQueue() {

    this.running = false;
    this.queue = [];

    // store the previous utterance - if the next utterance
    this.previousUtterance;

    setInterval( this.next.bind( this ), 750 );

    // emits when the utterance changes
    this.utteranceEmitter = new Emitter();
  }

  scenery.register( 'AlertQueue', AlertQueue );

  return inherit( Object, AlertQueue, {

    /**
     * Add a function to the queue.  Function is added through an object with keys
     *
     * Something to say
     * and a callback to call that determines whether or not it should be said
     * {
     *   utterance: string,
     *   condition: function,
     *   type: string
     * } 
     * @param {[type]} timedCallback [description]
     */
    addFunction: function( queueItem ) {
      var self = this;

      self.queue.push( queueItem );

      // checks an optional condition - if false, we will never say the utterance
      var condition = queueItem.condition();

      for ( var i = this.queue.length - 1; i >= 0; i-- ) {
        var otherItem = this.queue[ i ];
        if ( otherItem.type === queueItem.type ) {
          // if another item in the queue has the same type, remove from the queue 
          this.queue.splice( i, 1 );
        }
      }

      var previousUtterance = self.queue[ self.queue.length - 1 ];
      if ( previousUtterance && ( previousUtterance.type === queueItem.type ) ) {
        self.queue[ self.queue.length - 1 ] = queueItem;
      }
      else {
        self.queue.push( queueItem );
      }
    },

    next: function() {
      this.running = false;

      // returns the next item in the queue
      var shift = this.queue.shift();

      if ( shift ) {
        this.running = true;
        this.utteranceEmitter.emit1( shift.utterance );
        console.log( shift.utterance );
      }
    }
  } );
} );
