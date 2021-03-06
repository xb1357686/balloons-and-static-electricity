// Copyright 2013-2017, University of Colorado Boulder

/**
 * Model of a balloon, which can have charge, position and velocity.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Jesse Greenberg(PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var BalloonDirectionEnum = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/BalloonDirectionEnum' );
  var BalloonLocationEnum = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/BalloonLocationEnum' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Emitter = require( 'AXON/Emitter' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var PlayAreaMap = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/PlayAreaMap' );
  var PointChargeModel = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/PointChargeModel' );
  var Property = require( 'AXON/Property' );
  var PropertyIO = require( 'AXON/PropertyIO' );
  var Range = require( 'DOT/Range' );
  var Vector2 = require( 'DOT/Vector2' );
  var Vector2IO = require( 'DOT/Vector2IO' );

  // phet-io modules
  var BooleanIO = require( 'ifphetio!PHET_IO/types/BooleanIO' );

  // constants, most if not all of which were empirically determined to elicit the desired appearance and behavior
  var VELOCITY_ARRAY_LENGTH = 5;
  var THRESHOLD_SPEED = 0.0125;
  var BALLOON_WIDTH = 134;
  var BALLOON_HEIGHT = 222;

  // threshold for diagonal movement is +/- 15 degrees from diagonals
  var DIAGONAL_MOVEMENT_THRESHOLD = 15 * Math.PI / 180;

  // map that determines if an object is, down, horizontally or along a diagonal between two points. The exact quadrant
  // of the movement and the direction is determined by getDirection, see that function for use of this map
  var DIRECTION_MAP = {
    DOWN: new Range( 0, Math.PI / 4 - DIAGONAL_MOVEMENT_THRESHOLD ),
    DOWN_DIAGONAL: new Range( Math.PI / 4 - DIAGONAL_MOVEMENT_THRESHOLD, Math.PI / 4 + DIAGONAL_MOVEMENT_THRESHOLD ),
    HORIZONTAL: new Range( Math.PI / 4 + DIAGONAL_MOVEMENT_THRESHOLD, 3 * Math.PI / 4 - DIAGONAL_MOVEMENT_THRESHOLD ),
    UP_DIAGONAL: new Range( 3 * Math.PI / 4 - DIAGONAL_MOVEMENT_THRESHOLD, 3 * Math.PI / 4 + DIAGONAL_MOVEMENT_THRESHOLD ),
    UP: new Range( 3 * Math.PI / 4 + DIAGONAL_MOVEMENT_THRESHOLD, Math.PI )
  };

  // collection of charge positions on the balloon, relative to the top left corners
  // charges will appear in these positions as the balloon collects electrons
  var POSITIONS = [
    [ 14, 70 ],
    [ 18, 60 ],
    [ 14, 90 ],
    [ 24, 130 ],
    [ 22, 120 ],
    [ 14, 79 ],
    [ 25, 140 ],
    [ 18, 108 ],
    [ 19, 50 ],
    [ 44, 150 ],
    [ 16, 100 ],
    [ 20, 80 ],
    [ 50, 160 ],
    [ 34, 140 ],
    [ 50, 20 ],
    [ 30, 30 ],
    [ 22, 72 ],
    [ 24, 105 ],
    [ 20, 110 ],
    [ 40, 150 ],
    [ 26, 110 ],
    [ 30, 115 ],
    [ 24, 87 ],
    [ 24, 60 ],
    [ 24, 40 ],
    [ 38, 24 ],
    [ 30, 80 ],
    [ 30, 50 ],
    [ 34, 82 ],
    [ 32, 130 ],
    [ 30, 108 ],
    [ 30, 50 ],
    [ 40, 94 ],
    [ 30, 100 ],
    [ 35, 90 ],
    [ 24, 95 ],
    [ 34, 100 ],
    [ 35, 40 ],
    [ 30, 60 ],
    [ 32, 72 ],
    [ 30, 105 ],
    [ 34, 140 ],
    [ 30, 120 ],
    [ 30, 130 ],
    [ 30, 85 ],
    [ 34, 77 ],
    [ 35, 90 ],
    [ 40, 85 ],
    [ 34, 90 ],
    [ 35, 50 ],
    [ 46, 34 ],
    [ 32, 72 ],
    [ 30, 105 ],
    [ 34, 140 ],
    [ 34, 120 ],
    [ 30, 60 ],
    [ 30, 85 ],
    [ 34, 77 ]
  ];

  // determine average the Y position for the charges in the balloon
  var positionYSum = 0;
  for ( var i = 0; i < POSITIONS.length; i++ ) {
    positionYSum += POSITIONS[ i ][ 1 ]; // y coordinate is second value
  }
  var AVERAGE_CHARGE_Y = ( positionYSum / POSITIONS.length );

  /**
   * Constructor
   * @param {number} x - initial x position
   * @param {number} y - initial y position
   * @param {BASEModel} balloonsAndStaticElectricityModel - ensure balloon is in valid position in model coordinates
   * @param {boolean} defaultVisibility - is the balloon visible by default?
   * @param {string} labelString - label for the balloon
   * @param {Tandem} tandem
   * @constructor
   */
  function BalloonModel( x, y, balloonsAndStaticElectricityModel, defaultVisibility, labelString, tandem ) {

    var self = this;

    //------------------------------------------------
    // Properties

    // @public {number}
    this.chargeProperty = new NumberProperty( 0, {
      valueType: 'Integer',
      range: new Range( -POSITIONS.length, 0 ),
      tandem: tandem.createTandem( 'chargeProperty' ),
      phetioReadOnly: true
    } );

    // @public {Vector2}
    // use new Vector2() instead of Vector2.ZERO so equality check won't be thwarted by ImmutableVector2
    this.velocityProperty = new Property( new Vector2(), {
      tandem: tandem.createTandem( 'velocityProperty' ),
      phetioType: PropertyIO( Vector2IO ),
      useDeepEquality: true
    } );

    // @public {number}
    this.isVisibleProperty = new Property( defaultVisibility, {
      tandem: tandem.createTandem( 'isVisibleProperty' ),
      phetioType: PropertyIO( BooleanIO )
    } );

    // @public {boolean}
    this.isDraggedProperty = new Property( false, {
      tandem: tandem.createTandem( 'isDraggedProperty' ),
      phetioType: PropertyIO( BooleanIO )
    } );

    // @public {Vector2} - location of the upper left corner of the rectangle that encloses the balloon
    this.locationProperty = new Property( new Vector2( x, y ), {
      tandem: tandem.createTandem( 'locationProperty' ),
      phetioType: PropertyIO( Vector2IO ),
      useDeepEquality: true
    } );

    // @public {Vector2} - velocity of the balloon while dragging
    this.dragVelocityProperty = new Property( new Vector2( 0, 0 ), {
      tandem: tandem.createTandem( 'dragVelocityProperty' ),
      phetioType: PropertyIO( Vector2IO ),
      useDeepEquality: true
    } );

    // @public {boolean} - whether or not the balloon is on the sweater
    this.onSweaterProperty = new Property( false );

    // @public {boolean}
    this.touchingWallProperty = new Property( false );

    // @public {boolean} - whether or not the balloon is 'very close' to the sweaters
    this.atNearSweaterProperty = new Property( false );

    // @private string - the current row of the play area for the balloon
    this.playAreaColumnProperty = new Property( null );

    // @private string - the current column of the play area for the balloon
    this.playAreaRowProperty = new Property( null );

    // @private {string|null} - if the balloon is in a landmark location, this Property will be a key of PlayAreaMap.LANDMARK_RANGES
    this.playAreaLandmarkProperty = new Property( null );

    // @public {number} - value that correspondsd to the magnitude of displacement of wall charges during induced
    // charge
    this.chargeDisplacementProperty = new Property( 0 );

    // @public {string|null} - the direction of movement, can be one of BalloonDirectionEnum
    this.directionProperty = new Property( null );

    // @public {boolean} - whether or not the balloon is currently inducing a charge in the wall
    this.inducingChargeProperty = new Property( false );

    //------------------------------------------------

    // @public (read-only) dimensions of the balloon
    this.width = BALLOON_WIDTH;
    this.height = BALLOON_HEIGHT;

    // @public {MovablePointChargeModel} - the closest minus charge to the balloon which is in the wall
    this.closestChargeInWall = null;

    // @private (a11y) - the amount of time that has passed since balloon has been released
    this.timeSinceRelease = 0; // in ms

    // @public (read-only) - the old location of the balloon, used throughout the model and view to calculate
    // changes in position
    this.oldLocation = this.locationProperty.get().copy();

    // @private (a11y) {Vector2|null} - copy of the balloon position when balloon is released, null until
    // the balloon is  during user interaction
    this.locationOnRelease = null;

    // @private - positions of neutral atoms on balloon, don't change during simulation
    this.positionsOfStartCharges = [
      [ 44, 50 ],
      [ 88, 50 ],
      [ 44, 140 ],
      [ 88, 140 ]
    ];

    // @public - will emit an event when the balloon is reset
    this.resetEmitter = new Emitter();

    // @public - will emit when the user has completed an interaction with the balloon
    this.interactionEndEmitter = new Emitter();

    this.initialLocation = this.locationProperty.initialValue;
    this.plusCharges = [];
    this.minusCharges = [];
    this.balloonsAndStaticElectricityModel = balloonsAndStaticElectricityModel; // @private

    // @private {boolean} - flag that indicates if the balloon is sticking to the sweater
    this.isStickingToSweater = false;

    // @public {boolean} - flag that indicates if the balloon was previously sticking to the sweater on location change
    this.previousIsStickingToSweater = false;

    // @private {boolean} - flag that indicates when the balloon is very near to the sweater
    this.isNearSweater = false;

    // @private {boolean} - flag that tracks if the balloon was previously very near to the sweater
    this.previousIsNearSweater = false;

    // @private {boolean} - flag that tracks if the balloon is very near to the wall
    this.isNearWall = false;

    // @private {boolean} - flag that tracks if the the balloon was previously very near the wall when position changes
    this.previousIsNearWall = false;

    // @public {read-only} - flag that tracks whether or not the balloon is touching the wall
    this.isTouchingWall = false;

    // @public {read-only} - flag that tracks whether or not the balloon was previously touching the wall when location chanves
    this.previousIsTouchingWall = false;

    // @private {boolean} - flag that tracks if the balloon is very near to the right edge
    this.isNearRightEdge = false;

    // @private {boolean} - flag that tracks if the the balloon was previously very near the right edge when position changes
    this.previousIsNearRightEdge = false;

    // a label for the balloon, not the accessible label but one of BalloonColorsEnum
    // TODO: delete this, it is very confusing
    this.balloonLabel = labelString;

    // neutral pair of charges
    var plusChargesTandemGroup = tandem.createGroupTandem( 'plusCharges' );
    var minusChargesTandemGroup = tandem.createGroupTandem( 'minusCharges' );
    this.positionsOfStartCharges.forEach( function( entry ) {
      //plus
      var plusCharge = new PointChargeModel( entry[ 0 ], entry[ 1 ], plusChargesTandemGroup.createNextTandem(), false );
      self.plusCharges.push( plusCharge );

      //minus
      var minusCharge = new PointChargeModel(
        entry[ 0 ] + PointChargeModel.RADIUS,
        entry[ 1 ] + PointChargeModel.RADIUS,
        minusChargesTandemGroup.createNextTandem(),
        false
      );
      self.minusCharges.push( minusCharge );
    } );

    //charges that we can get from sweater
    POSITIONS.forEach( function( entry ) {
      //minus
      var minusCharge = new PointChargeModel( entry[ 0 ], entry[ 1 ], minusChargesTandemGroup.createNextTandem(), true );
      self.minusCharges.push( minusCharge );
    } );

    // model bounds, updated when position changes
    this.bounds = new Bounds2(
      this.locationProperty.get().x,
      this.locationProperty.get().y,
      this.locationProperty.get().x + this.width,
      this.locationProperty.get().y + this.height
    );
    this.locationProperty.link( function( location, oldLocation ) {
      self.bounds.setMinMax( location.x, location.y, location.x + self.width, location.y + self.height );

      if ( oldLocation ) {

        // the direction from the old location to the newLocation
        self.directionProperty.set( BalloonModel.getDirection( location, oldLocation ) );

        // update whether or not the balloon is very close to the sweater
        self.previousIsNearSweater = self.isNearSweater;
        self.isNearSweater = self.nearSweater();

        // update whether or not balloon is very close to the wall
        self.previousIsNearWall = self.isNearWall;
        self.isNearWall = self.nearWall();

        // update whether or not balloon is very close to the right edge of the play area
        self.previousIsNearRightEdge = self.isNearRightEdge;
        self.isNearRightEdge = self.nearRightEdge();

        // update whether or not the balloon is sticking to the sweater
        self.previousIsStickingToSweater = self.isStickingToSweater;
        self.isStickingToSweater = self.stickingToSweater();

        // update whether or not the balloon is on the sweater
        if ( self.onSweater() !== self.onSweaterProperty.get() ) {
          self.onSweaterProperty.set( self.onSweater() );
        }

        // update whether or not we are touching the wall
        if ( self.touchingWall() !== self.touchingWallProperty.get() ) {
          self.touchingWallProperty.set( self.touchingWall() );
        }
      }
    } );

    // when the balloon is released, reset the timer
    this.isDraggedProperty.link( function( isDragged ) {

      // reset time since release to 0
      if ( !isDragged ) {
        self.timeSinceRelease = 0;
      }
    } );

    this.reset();
  }

  balloonsAndStaticElectricity.register( 'BalloonModel', BalloonModel );

  inherit( Object, BalloonModel, {

    /**
     * If the balloon is in the upper half of the play area, return true.
     *
     * @returns {boolean}
     */
    inUpperHalfOfPlayArea: function() {
      return this.getCenter().y < this.balloonsAndStaticElectricityModel.playArea.lowerRow.top;
    },

    /**
     * Return true if the balloon is near the wall without touching it, and the wall is visible.
     *
     * @returns {boolean}
     */
    nearWall: function() {
      return PlayAreaMap.LANDMARK_RANGES.AT_NEAR_WALL.contains( this.getCenter().x );
    },

    /**
     * findClosestCharge - description
     *
     * @returns {type}  description
     */
    getClosestCharge: function() {

      // find the closest charge to the balloon that has not yet been picked up
      var sweater = this.balloonsAndStaticElectricityModel.sweater;

      // the closest charge is described relative to the center of this rectangle
      // which is what is used to pick up charges
      var balloonLocation = this.locationProperty.get();
      var x1 = balloonLocation.x - 5;
      var x2 = balloonLocation.x + 50;
      var y1 = balloonLocation.y - 10;
      var y2 = balloonLocation.y + this.height + 10;
      var centerX = ( x1 + x2 ) / 2;
      var centerY = ( y1 + y2 ) / 2;

      // loop through the charges to find the next closest one
      var difference = new Vector2( 0, 0 ); // allocated once to avoid burden to memory
      var minDistance = Number.POSITIVE_INFINITY;
      var closestCharge;
      for ( var i = 0; i < sweater.minusCharges.length; i++ ) {

        var charge = sweater.minusCharges[ i ];

        // if the charge has been moved already, skip it
        if ( charge.movedProperty.get() ) {
          continue;
        }

        var distX = charge.location.x - centerX;
        var distY = charge.location.y - centerY;
        difference.setXY( distX, distY );

        if ( difference.magnitude() < minDistance ) {
          minDistance = difference.magnitude();
          closestCharge = charge;
        }
      }

      assert && assert( closestCharge, 'Tried to find closest charge when no more charges remain on sweater.' );
      return closestCharge;
    },

    /**
     * Center of a rectangular area that defines the bounds of the balloon
     * that must drag acrosss the sweater to pick up a charge.
     *
     * @returns {Vector2}
     */
    getDraggingCenter: function() {
      var balloonLocation = this.locationProperty.get();
      var x1 = balloonLocation.x - 5;
      var x2 = balloonLocation.x + 50;
      var y1 = balloonLocation.y - 10;
      var y2 = balloonLocation.y + this.height + 10;

      var centerX = balloonLocation.x + ( ( x2 - x1 ) / 2 );
      var centerY = balloonLocation.y + ( ( y2 - y1 ) / 2 );

      return new Vector2( centerX, centerY );
    },

    /**
     * Determine if the balloon is on the sweater.  The balloon is considered to be rubbing on the sweater
     * if its center is in the charged area.
     *
     * @returns {type}  description
     */
    onSweater: function() {
      var sweaterBounds = this.balloonsAndStaticElectricityModel.sweater.bounds;
      if ( sweaterBounds.eroded( 0 ).intersectsBounds( this.bounds ) ) {
        return true;
      }
      else { return false; }
    },

    /**
     * returns whether or not the center of the balloon is within the charged area of the sweater
     * @public
     * @returns {boolean}
     */
    centerInSweaterChargedArea: function() {
      return this.balloonsAndStaticElectricityModel.sweater.chargedArea.containsPoint( this.getCenter() );
    },

    /**
     * If the balloon is near the sweater, return true.  Considered near the sweater when the center of the balloon
     * is within the LANDMARK_RANGES.AT_NEAR_SWEATER range of the PlayAreaMap.
     * @returns {boolean}
     * @public
     */
    nearSweater: function() {
      return PlayAreaMap.LANDMARK_RANGES.AT_NEAR_SWEATER.contains( this.getCenter().x );
    },

    /**
     * Return true if the balloon is near the right edge of the play area without touching it
     *
     * @returns {boolean}
     */
    nearRightEdge: function() {
      return PlayAreaMap.LANDMARK_RANGES.AT_NEAR_RIGHT_EDGE.contains( this.getCenterX() );
    },

    /**
     * Returns whether or not the right edge of the balloon is at the wall location, regardless of
     * balloon or wall visibility.  Useful for checking whether the balloon is at the wall location
     * when the wall is removed.
     *
     * @return {boolean}
     */
    rightAtWallLocation: function() {
      return this.getRight() === this.balloonsAndStaticElectricityModel.wall.x;
    },

    /**
     * Returns whether or not this balloon is at the right edge of the play area.
     *
     * @return {[type]} [description]
     */
    atRightEdge: function() {
      return this.getCenterX() === PlayAreaMap.X_BOUNDARY_LOCATIONS.AT_WALL;
    },

    /**
     * Returns whether or not this balloon is at the left edge of the play area.
     *
     * @return {string}
     */
    atLeftEdge: function() {
      return this.getCenterX() === PlayAreaMap.X_BOUNDARY_LOCATIONS.AT_LEFT_EDGE;
    },

    /**
     * Returns whether or not the balloon is very close to an object in the play area. Will return true if the center
     * is withing one of the "very close" ranges in the play area.
     *
     * @return {string}
     */
    veryCloseToObject: function() {
      var centerX = this.getCenterX();
      return PlayAreaMap.LANDMARK_RANGES.AT_VERY_CLOSE_TO_SWEATER.contains( centerX ) ||
             PlayAreaMap.LANDMARK_RANGES.AT_VERY_CLOSE_TO_WALL.contains( centerX ) ||
             PlayAreaMap.LANDMARK_RANGES.AT_VERY_CLOSE_TO_RIGHT_EDGE.contains( centerX );
    },

    /**
     * Returns true if the balloon is touching the wall
     *
     * @returns {boolean}
     */
    touchingWall: function() {
      var atWall = this.getCenter().x === this.balloonsAndStaticElectricityModel.playArea.atWall;
      var wallVisible = this.balloonsAndStaticElectricityModel.wall.isVisibleProperty.get();
      return ( atWall && wallVisible );
    },

    /**
     * Returns true if the balloon is currently sticking to the wall. The balloon is sticking to the wall
     * when it is charged, touching the wall, and not being dragged.
     * @public
     * @return {boolean}
     */
    stickingToWall: function() {
      return ( this.chargeProperty.get() > 0 ) && this.touchingWall() && !this.isDraggedProperty.get();
    },

    /**
     * Returns true if the balloon is sticking to the sweater.  Balloon is sticking to the sweater when
     * the balloon center is in the sweater charged area and the balloon has charges.
     * @return {boolean}
     */
    stickingToSweater: function() {
      return ( this.chargeProperty.get() < 0 && this.centerInSweaterChargedArea() );
    },

    /**
     * Get the distance from the center of this balloon to the wall.  Note that distances are all in ScreenView
     * coordinates for this simulation
     * @returns {number}
     */
    getDistanceToWall: function() {
      return this.getCenter().x - this.balloonsAndStaticElectricityModel.playArea.atWall;
    },

    /**
     * Returns true if the balloon is moving horizontally, left or right.
     * @public
     * @return {string} - "LEFT"|"RIGHT"
     */
    movingHorizontally: function() {
      var direction = this.directionProperty.get();
      return direction === BalloonDirectionEnum.LEFT || direction === BalloonDirectionEnum.RIGHT;
    },

    /**
     * Returns true if the balloon is movingv vertically, up or down
     * @public
     * @return {string} - "UP"|"DOWN"
     */
    movingVertically: function() {
      var direction = this.directionProperty.get();
      return direction === BalloonDirectionEnum.UP || direction === BalloonDirectionEnum.DOWN;
    },

    /**
     * Returns true if the balloon is moving horizontally, left or right.
     * @public
     * @return {string} - "UP_LEFT"|"UP_RIGHT"|"DOWN_LEFT"|"DOWN_RIGHT"
     */
    movingDiagonally: function() {
      var direction = this.directionProperty.get();
      return direction === BalloonDirectionEnum.UP_LEFT ||
             direction === BalloonDirectionEnum.UP_RIGHT ||
             direction === BalloonDirectionEnum.DOWN_LEFT ||
             direction === BalloonDirectionEnum.DOWN_RIGHT;
    },

    /**
     * Get whether or not the balloon is s moving to the right.
     *
     * @return {boolean}
     */
    movingRight: function() {
      var direction = this.directionProperty.get();
      return direction === BalloonDirectionEnum.RIGHT ||
             direction === BalloonDirectionEnum.UP_RIGHT ||
             direction === BalloonDirectionEnum.DOWN_RIGHT;
    },

    /**
     * Get whether or not the balloon is moving to the left.
     *
     * @return {boolean}
     */
    movingLeft: function() {
      var direction = this.directionProperty.get();
      return direction === BalloonDirectionEnum.LEFT ||
             direction === BalloonDirectionEnum.UP_LEFT ||
             direction === BalloonDirectionEnum.DOWN_LEFT;
    },

    /**
     * Returns a proportion of this balloon's movement through a region in the play area, dependent
     * on the direction of movement.  Returns a number out of 1 (full range of the region).  If moving
     * horizontally, progress will be proportion of width.  If moving vertically, progress will be
     * a proportion of the height.
     *
     * @return {number}
     */
    getProgressThroughRegion: function() {

      var range;
      var difference;
      if ( this.movingHorizontally() || this.movingDiagonally() ) {
        range = PlayAreaMap.COLUMN_RANGES[ this.playAreaColumnProperty.get() ];
        difference = this.getCenter().x - range.min;
      }
      else if ( this.movingVertically() ) {
        range = PlayAreaMap.ROW_RANGES[ this.playAreaRowProperty.get() ];
        difference = this.getCenter().y - range.min;
      }

      // determine how far we are through the region
      var progress = difference / range.getLength();

      // progress is the difference of the calculated proportion if moving to the left or up
      var direction = this.directionProperty.get();
      if ( direction === BalloonDirectionEnum.LEFT || direction === BalloonDirectionEnum.UP ) {
        progress = 1 - progress;
      }

      assert && assert( typeof progress === 'number' && progress >= 0, 'no progress through play area region was determined.' );
      return progress;
    },

    /**
     * Set the center location of the balloon. Sets the location Property but with an offset to account
     * for the balloon dimenstions.
     *
     * @param {number} x
     * @param {number} y
     * @public
     */
    setCenter: function( center ) {
      this.locationProperty.set( new Vector2(
        center.x - this.width / 2,
        center.y - this.height / 2
      ) );
    },

    /**
     * Get the center location of the balloon
     * @public
     * @returns {Vector2}
     */
    getCenter: function() {
      return new Vector2( this.locationProperty.get().x + this.width / 2, this.locationProperty.get().y + this.height / 2 );
    },

    /**
     * Get the vertical center of the balloon model.
     * @return {number}
     */
    getCenterY: function() {
      return this.locationProperty.get().y + this.height / 2;
    },

    /**
     * Get the horizontal center location of the balloon.
     * @return {number}
     */
    getCenterX: function() {
      return this.locationProperty.get().x + this.width / 2;
    },

    /**
     * Get the right edge of the balloon.
     *
     * @return {number}
     */
    getRight: function() {
      return this.locationProperty.get().x + this.width;
    },

    /**
     * Balloon charges aren't evenly distributed throughout the balloon, they conform to the upper left edge of the
     * balloon image, placed by visual inspection.  This returns a Vector2 pointing to what is approximately the center
     * of the balloon charges.  In x, this remains the center of the model bounds.  In y, this is the top of the
     * balloon plus the average y position of the charges.
     *
     * @public
     * @return {Vector2}
     */
    getChargeCenter: function() {
      var centerX = this.getCenter().x;
      var centerY = this.locationProperty.get().y + AVERAGE_CHARGE_Y;
      return new Vector2( centerX, centerY );
    },

    /**
     * Get the position of the touch point of the balloon on the wall.
     * @type {Vector2}
     */
    getWallTouchingCenter: function() {
      var centerX = this.locationProperty.get().x + this.width;
      var centerY = this.getCenter().y;
      return new Vector2( centerX, centerY );
    },

    /**
     * Get the position of the left touch point of the balloon against the sweater. If the balloon center is to the
     * right of the sweater, use  the left edge of the balloon. Otherwise, use the balloon center. This is necessary
     * so that when the balloon is on the right edge of the sweater, it isn't described  as in the left side of the
     * play area.
     *
     * TODO: consider a different approach so that this function  isn't necessary.  It requires developer knowledeg
     * of the sim layout.
     * @return {Vector2}
     */
    getSweaterTouchingCenter: function() {

      var sweater = this.balloonsAndStaticElectricityModel.sweater;
      var sweaterRight = sweater.x + sweater.width;

      var centerY = this.getCenter().y;
      if ( this.getCenter().x > sweaterRight ) {
        var centerX = this.locationProperty.get().x;

      }
      else {
        centerX = this.getCenter().x;
      }

      return new Vector2( centerX, centerY );
    },

    /**
     * Returns whether or not this balloon has any charge.  Just a helper function to avoid directly
     * getting the Property value everywhere.
     * @public
     * @return {boolean}
     */
    isCharged: function() {

      // value will be negative (electrons)
      return this.chargeProperty.get() < 0;
    },

    //reset balloon to initial state
    reset: function( notResetVisibility ) {
      //array of instantaneous velocity of balloon last 5 ticks
      //then we calculate average velocity and compares it with threshold velocity to check if we catch minus charge from sweater
      this.xVelocityArray = [ 0, 0, 0, 0, 0 ];
      this.xVelocityArray.counter = 0;
      assert && assert( this.xVelocityArray.length = VELOCITY_ARRAY_LENGTH, 'velocity array incorrectly initialized' );
      this.yVelocityArray = [ 0, 0, 0, 0, 0 ];
      this.yVelocityArray.counter = 0;
      assert && assert( this.yVelocityArray.length = VELOCITY_ARRAY_LENGTH, 'velocity array incorrectly initialized' );
      this.chargeProperty.reset();
      this.velocityProperty.reset();
      this.locationProperty.reset();

      if ( !notResetVisibility ) {
        this.isVisibleProperty.reset();
      }
      this.isDraggedProperty.reset();

      // broadcast a message when we are reset
      this.resetEmitter.emit();
    },

    /**
     * Steps the BalloonModel.
     * @param {BASEModel} model
     * @param {number} dtSeconds elapsed time in seconds
     */
    step: function( model, dtSeconds ) {

      // seconds to milliseconds - really, the model is fairly 'unitless' but multiplying the
      // time step by 1000 makes the sim look and feel like the Java version
      var dt = dtSeconds * 1000;

      // limit large values of dt - they probably mean that the sim just regained focus
      if ( dt > 500 ) {
        dt = 1 / 60 * 1000; // nominal time stamp at 60 fps
      }

      if ( this.isDraggedProperty.get() ) {

        // drag the balloon, which may cause it to pick up charges
        this.dragBalloon( model, dt );
      }
      else {
        this.applyForce( dt );

        // increment the time since release
        this.timeSinceRelease += dt;
      }
      this.oldLocation = this.locationProperty.get().copy();
    },

    /**
     * When balloon is dragged, check to see if we catch a minus charge.  Returns a boolean
     * that indicates whether or not a charge was picked up.
     *
     * @param  {BASEModel} model
     * @param  {number} dt
     * @returns {boolean} chargeFound
     */
    dragBalloon: function( model, dt ) {

      // Prevent a fuzzer error that tries to drag the balloon before step is called.
      if ( !this.oldLocation ) {
        return;
      }
      var vx = ( this.locationProperty.get().x - this.oldLocation.x ) / dt;
      var vy = ( this.locationProperty.get().y - this.oldLocation.y ) / dt;

      //calculate average velocity
      this.xVelocityArray[ this.xVelocityArray.counter++ ] = vx * vx;
      this.xVelocityArray.counter %= VELOCITY_ARRAY_LENGTH;
      this.yVelocityArray[ this.yVelocityArray.counter++ ] = vy * vy;
      this.yVelocityArray.counter %= VELOCITY_ARRAY_LENGTH;

      var averageX = 0;
      var averageY = 0;
      for ( var i = 0; i < VELOCITY_ARRAY_LENGTH; i++ ) {
        averageX += this.xVelocityArray[ i ];
        averageY += this.yVelocityArray[ i ];
      }
      averageX /= VELOCITY_ARRAY_LENGTH;
      averageY /= VELOCITY_ARRAY_LENGTH;

      // if average speed larger than threshold speed we try to move minus charges from sweater to balloon
      var speed = Math.sqrt( averageX * averageX + averageY * averageY );

      this.dragVelocityProperty.set( new Vector2( vx, vy ) );

      var chargeFound = false;
      if ( speed >= THRESHOLD_SPEED ) {
        chargeFound = model.sweater.checkAndTransferCharges( this );
      }

      return chargeFound;
    },

    /**
     * Get the force between this balloon and the sweater.
     *
     * @param  {SweaterModel} sweaterModel
     * @returns {Vector2}
     */
    getSweaterForce: function( sweaterModel ) {
      return BalloonModel.getForce(
        sweaterModel.center,
        this.getCenter(),
        -BalloonModel.FORCE_CONSTANT * sweaterModel.chargeProperty.get() * this.chargeProperty.get()
      );
    },

    /**
     * Get the name of the object that the balloon is currently attracted to.
     * @public
     *
     * @returns {string}
     */
    getAttractedDirection: function() {
      var force = this.getTotalForce();
      if ( force.x > 0 ) {
        return BalloonDirectionEnum.RIGHT;
      }
      else {
        return BalloonDirectionEnum.LEFT;
      }
    },

    /**
     * Returns whether or not the balloon is touching the boundary of the play area, including the bottom, left
     * and top edges, or the right edge or wall depending on wall visibility.
     * @return {string}
     */
    isTouchingBoundary: function() {
      return this.isTouchingRightBoundary() || this.isTouchingLeftBoundary() ||
             this.isTouchingBottomBoundary() || this.isTouchingTopBoundary();
    },

    /**
     * Returns whether or not the balloon is touching the right boundary of the play area.  If the wall
     * is visible, this will be the location where the balloon is touching the wall, otherwise it will
     * be the location where the balloon is touching the right edge of the play area.
     *
     * @return {boolean}
     */
    isTouchingRightBoundary: function() {
      var balloonX = this.getCenter().x;
      if ( this.balloonsAndStaticElectricityModel.wall.isVisibleProperty.get() ) {
        return PlayAreaMap.X_LOCATIONS.AT_WALL === balloonX;
      }
      else {
        return PlayAreaMap.X_BOUNDARY_LOCATIONS.AT_RIGHT_EDGE === balloonX;
      }
    },

    /**
     * Returns whether or not the balloon is touching the right most edge of the play area (should be impossible
     * if the wall is invisible)
     *
     * @return {boolean}
     */
    isTouchingRightEdge: function() {
      var balloonX = this.getCenterX();
      return PlayAreaMap.X_BOUNDARY_LOCATIONS.AT_RIGHT_EDGE === balloonX;
    },

    /**
     * Returns whether or not the balloon is touching the bottom boundary of the play area.
     * @return {boolean}
     */
    isTouchingBottomBoundary: function() {
      return PlayAreaMap.Y_BOUNDARY_LOCATIONS.AT_BOTTOM === this.getCenterY();
    },

    isTouchingLeftBoundary: function() {
      return PlayAreaMap.X_BOUNDARY_LOCATIONS.AT_LEFT_EDGE === this.getCenterX();
    },

    /**
     * Returns whether or not the balloon is touching the top boundary of the play area.
     *
     * @return {boolean}
     */
    isTouchingTopBoundary: function() {
      return PlayAreaMap.Y_BOUNDARY_LOCATIONS.AT_TOP === this.getCenterY();
    },

    /**
     * Get the object that the balloon is touching.  If the balloon is in free space, return null.
     *
     * @returns {string}
     */
    getBoundaryObject: function() {
      var playArea = this.balloonsAndStaticElectricityModel.playArea;
      var balloonCenter = this.getCenter();
      var centerX = balloonCenter.x;
      if ( !this.balloonsAndStaticElectricityModel.wall.isVisibleProperty.get() && centerX === playArea.atRightEdgeOfPlayArea ) {
        return BalloonLocationEnum.RIGHT_EDGE;
      }
      else if ( playArea.leftColumn.containsPoint( balloonCenter ) ) {
        return BalloonLocationEnum.LEFT_EDGE;
      }
      else if ( playArea.topRow.containsPoint( balloonCenter ) ) {
        return BalloonLocationEnum.TOP_EDGE;
      }
      else if ( playArea.bottomRow.containsPoint( balloonCenter ) ) {
        return BalloonLocationEnum.BOTTOM_EDGE;
      }
      else if ( playArea.rightArmColumn.containsPoint( balloonCenter ) && this.directionProperty.get() === BalloonDirectionEnum.LEFT ) {
        // only announce that we are on the sweater if we are moving left
        return BalloonLocationEnum.ON_SWEATER;
      }
      else if ( playArea.atWall === centerX && this.balloonsAndStaticElectricityModel.wall.isVisible ) {
        return BalloonLocationEnum.AT_WALL;
      }
      else {
        return null;
      }
    },

    /**
     * get a bounding rectangle
     * @returns {Bounds2}
     * @private
     */
    getBounds: function() {
      return new Bounds2(
        this.locationProperty.get().x,
        this.locationProperty.get().y,
        this.locationProperty.get().x + this.width,
        this.locationProperty.get().y + this.height
      );
    },

    /**
     * Apply a force on this balloon, and move it to new coordinates.  Also updates the velocity.
     * @private
     *
     * @param  {number} dt - in seconds
     */
    applyForce: function( dt ) {

      // only move if this balloon is not over the sweater
      var model = this.balloonsAndStaticElectricityModel;
      if ( !this.centerInSweaterChargedArea() ) {

        var rightBound = model.bounds.maxX;
        var force = this.getTotalForce();
        var newVelocity = this.velocityProperty.get().plus( force.timesScalar( dt ) );
        var newLocation = this.locationProperty.get().plus( this.velocityProperty.get().timesScalar( dt ) );

        if ( newLocation.x + this.width >= rightBound ) {

          // trying to go beyond right bound
          newLocation.x = rightBound - this.width;
          newVelocity.x = newVelocity.x > 0 ? 0 : newVelocity.x;
        }
        if ( newLocation.y + this.height >= model.bounds.maxY ) {

          // trying to go beyond bottom bound
          newLocation.y = model.bounds.maxY - this.height;
          newVelocity.y = newVelocity.y > 0 ? 0 : newVelocity.y;
        }
        if ( newLocation.x <= model.bounds.minX ) {

          // trying to go  beyond left bound
          newLocation.x = model.bounds.minX;
          newVelocity.x = newVelocity.x < 0 ? 0 : newVelocity.x;
        }
        if ( newLocation.y <= model.bounds.minY ) {
          newLocation.y = model.bounds.minY;
          newVelocity.y = newVelocity.y < 0 ? 0 : newVelocity.y;
        }

        // update location before velocity so that listeners associated with velocity can reference the correct
        // location on updated velocity
        this.locationProperty.set( newLocation );
        this.velocityProperty.set( newVelocity );
      }
      else {
        this.velocityProperty.set( new Vector2() ); // use new Vector2() instead of Vector2.ZERO so equality check won't be thwarted by ImmutableVector2
      }
    },

    /**
     * Get the total force on this balloon.  The balloon will feel forces from all objects in the play area, including
     * the sweater, the wall, and the other balloon if it is visible.
     * @private
     * @returns {Vector2}
     */
    getTotalForce: function() {
      var model = this.balloonsAndStaticElectricityModel;
      if ( model.wall.isVisibleProperty.get() ) {
        var distFromWall = model.wall.x - this.locationProperty.get().x;

        // if the balloon has enough charge and is close enough to the wall, the wall attracts it more than the sweater
        if ( this.chargeProperty.get() < -5 ) {
          var relDist = distFromWall - this.width;
          var fright = 0.003;
          if ( relDist <= 40 + this.chargeProperty.get() / 8 ) {
            return new Vector2( -fright * this.chargeProperty.get() / 20.0, 0 );
          }
        }
      }

      var force = this.getSweaterForce( model.sweater );
      var other = this.getOtherBalloonForce();
      var sumOfForces = force.plus( other );

      // Don't allow the force to be too high or the balloon can jump across the screen in 1 step, see #67
      var mag = sumOfForces.magnitude();
      var max = 1E-2;
      if ( mag > max ) {
        sumOfForces.normalize();
        sumOfForces.multiplyScalar( max );
      }
      return sumOfForces;
    },

    /**
     * Get the force on this balloon model from another balloon model. If the other balloon is being dragged, or is
     * invisible, zero is returned. See getForce() for the actual force calculation
     * @public
     *
     * @returns {Vector2}
     */
    getOtherBalloonForce: function() {
      if ( this.isDraggedProperty.get() || !this.isVisibleProperty.get() || !this.other.isVisibleProperty.get() ) {
        return new Vector2( 0, 0 );
      }
      var kqq = BalloonModel.FORCE_CONSTANT * this.chargeProperty.get() * this.other.chargeProperty.get();
      return BalloonModel.getForce( this.getCenter(), this.other.getCenter(), kqq );
    }
  }, {

    /**
     * Calculate the force between to charged objects using Coulomb's law.  This allows the client to provide a
     * different value for the exponent used on the radius, which can be used to tweak the visual performance of the
     * simulation.
     *
     * @public
     * @static
     *
     * @param  {Vector2} p1 - position of the first object
     * @param  {Vector2} p2 - position of the second object
     * @param  {number} kqq - some constant times the two charges
     * @param  {number} [power] - optional, default of 2, but 1 is added so the acceleration is exaggerated
     * @returns {Vector2}
     */
    getForce: function( p1, p2, kqq, power ) {

      // power defaults to 2
      power = power || 2;

      // calculate a vector from one point to the other
      var difference = p1.minus( p2 );
      var r = difference.magnitude();

      // if the points are right on top of one another, return an attraction value of zero
      if ( r === 0 ) {
        return new Vector2( 0, 0 );
      }

      // make this a unit vector
      difference.setMagnitude( 1 );

      // scale by the force value
      return difference.timesScalar( kqq / ( Math.pow( r, power ) ) );
    },

    /**
     * Get the direction of movement that would take you from point A to point B, returning one of BalloonDirectionEnum,
     * LEFT, RIGHT,  UP, DOWN,  UP_LEFT, UP_RIGHT, DOWN_LEFT, DOWN_RIGHT. Uses Math.atan2, so the angle is mapped from
     * 0 to +/- Math.PI.  We determine if movement is in the top or bottom half of the unit circle and then map to the
     * exact quadrant based on the sign of the angle.
     *
     * @param  {Vector2} pointA
     * @param  {Vector2} pointB
     * @return {string} - one of BalloonDirectionEnum
     * @static
     */
    getDirection: function( pointA, pointB ) {
      var direction;

      var dx = pointA.x - pointB.x;
      var dy = pointA.y - pointB.y;
      var angle = Math.atan2( dx, dy );
      var absAngle = Math.abs( angle );

      // atan2 will map from 0 to +/- PI instead of 0 to 2 PI, so we use the sign to determine whether we
      // are moving left/right, and then use the absolute value of angle to determine up/down
      if ( DIRECTION_MAP.DOWN.contains( absAngle ) ) {
        direction = BalloonDirectionEnum.DOWN;
      }
      else if ( DIRECTION_MAP.DOWN_DIAGONAL.contains( absAngle ) ) {

        // diagonal in the third or fourth quadrants
        direction = ( angle > 0 ) ? BalloonDirectionEnum.DOWN_RIGHT : BalloonDirectionEnum.DOWN_LEFT;
      }
      else if ( DIRECTION_MAP.HORIZONTAL.contains( absAngle ) ) {
        direction = ( angle > 0 ) ? BalloonDirectionEnum.RIGHT : BalloonDirectionEnum.LEFT;
      }
      else if ( DIRECTION_MAP.UP_DIAGONAL.contains( absAngle ) ) {
        direction = ( angle > 0 ) ? BalloonDirectionEnum.UP_RIGHT : BalloonDirectionEnum.UP_LEFT;
      }
      else if ( DIRECTION_MAP.UP.contains( absAngle ) ) {
        direction = BalloonDirectionEnum.UP;
      }

      return direction;
    },

    // @static - value for Coulomb's constant used in the calculations but NOT THE ACTUAL VALUE.  It has been tweaked in
    // order to get the visual behavior that we need in the sim.
    FORCE_CONSTANT: 0.05,
    BALLOON_WIDTH: BALLOON_WIDTH 

  } );

  return BalloonModel;
} );
