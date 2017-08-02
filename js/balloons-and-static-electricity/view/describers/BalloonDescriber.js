// Copyright 2002-2016, University of Colorado Boulder

/**
 * This type allows for determining descriptions for the balloon.  Describing the location of the balloon
 * is quite complicated so this distributes the description work so that BalloonNode does not become
 * a massive file.  Used for accessibility.
 *
 * TODO: Bring up to standards, immprove documentation, delete many functions which are now unused.
 *
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var PlayAreaMap = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/PlayAreaMap' );
  var BalloonDirectionEnum = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/BalloonDirectionEnum' );
  var Range = require( 'DOT/Range' );
  var Vector2 = require( 'DOT/Vector2' );
  var WallDescriber = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/describers/WallDescriber' );
  var BASEA11yStrings = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEA11yStrings' );
  var BalloonsAndStaticElectricityDescriber = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/describers/BalloonsAndStaticElectricityDescriber' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );

  // strings
  var balloonButtonHelpString = BASEA11yStrings.balloonButtonHelpString;
  var balloonStickingToString = BASEA11yStrings.balloonStickingToString;
  var balloonOnString = BASEA11yStrings.balloonOnString;
  var balloonTouchingString = BASEA11yStrings.balloonTouchingString;
  var balloonNetChargePatternString = BASEA11yStrings.balloonNetChargePatternString;
  var balloonNoString = BASEA11yStrings.balloonNoString;
  var balloonNegativeString = BASEA11yStrings.balloonNegativeString;
  var balloonRelativeChargePatternString = BASEA11yStrings.balloonRelativeChargePatternString;
  var balloonChargeDifferencesPatternString = BASEA11yStrings.balloonChargeDifferencesPatternString;
  var balloonLocationAttractiveStatePatternString = BASEA11yStrings.balloonLocationAttractiveStatePatternString;
  var balloonShowAllChargesPatternString = BASEA11yStrings.balloonShowAllChargesPatternString;
  var balloonDescriptionWithHelpPatternString = BASEA11yStrings.balloonDescriptionWithHelpPatternString;
  var balloonShowNoChargesPatternString = BASEA11yStrings.balloonShowNoChargesPatternString;
  var grabbedString = BASEA11yStrings.grabbedString;
  var releasedString = BASEA11yStrings.releasedString;
  var movesToObjectPatternString = BASEA11yStrings.movesToObjectPatternString;
  var towardsSweaterString = BASEA11yStrings.towardsSweaterString;
  var toWallString = BASEA11yStrings.toWallString;
  var verySlowlyString = BASEA11yStrings.verySlowlyString;
  var slowlyString = BASEA11yStrings.slowlyString;
  var quicklyString = BASEA11yStrings.quicklyString;
  var veryQuicklyString = BASEA11yStrings.veryQuicklyString;
  var upString = BASEA11yStrings.upString;
  var leftString = BASEA11yStrings.leftString;
  var downString = BASEA11yStrings.downString;
  var rightString = BASEA11yStrings.rightString;
  var upAndToTheRightString = BASEA11yStrings.upAndToTheRightString;
  var upAndToTheLeftString = BASEA11yStrings.upAndToTheLeftString;
  var downAndToTheRightString = BASEA11yStrings.downAndToTheRightString;
  var downAndToTheLeftString = BASEA11yStrings.downAndToTheLeftString;
  var atLeftEdgeString = BASEA11yStrings.atLeftEdgeString;
  var atTopString = BASEA11yStrings.atTopString;
  var atBottomString = BASEA11yStrings.atBottomString;
  var atRightEdgeString = BASEA11yStrings.atRightEdgeString;
  var onSweaterString = BASEA11yStrings.onSweaterString;
  var offSweaterString = BASEA11yStrings.offSweaterString;  
  var balloonAtLocationPatternString = BASEA11yStrings.balloonAtLocationPatternString;
  var balloonOnLocationPatternString = BASEA11yStrings.balloonOnLocationPatternString;
  var closerToObjectPatternString = BASEA11yStrings.closerToObjectPatternString;
  var sweaterString = BASEA11yStrings.sweaterString;
  var wallString = BASEA11yStrings.wallString;
  var centerOfPlayAreaString = BASEA11yStrings.centerOfPlayAreaString;
  var rightEdgeOfPlayAreaString = BASEA11yStrings.rightEdgeOfPlayAreaString;
  var topEdgeOfPlayAreaString = BASEA11yStrings.topEdgeOfPlayAreaString;
  var bottomEdgeOfPlayAreaString = BASEA11yStrings.bottomEdgeOfPlayAreaString;
  var noChangeInPositionPatternString = BASEA11yStrings.noChangeInPositionPatternString;
  var noChangeAndLocationPatternString = BASEA11yStrings.noChangeAndLocationPatternString;
  var nearSweaterString = BASEA11yStrings.nearSweaterString;
  var balloonNearString = BASEA11yStrings.balloonNearString;
  var locationAndInducedChargePatternString = BASEA11yStrings.locationAndInducedChargePatternString;
  var singleStatementPatternString = BASEA11yStrings.singleStatementPatternString;
  var stillMovingPatternString= BASEA11yStrings.stillMovingPatternString;

  // constants
  var A_FEW_RANGE = new Range( 1, 15 );
  var SEVERAL_RANGE = new Range( 15, 40 );
  var MANY_RANGE = new Range( 40, 57 );
  var MAX_BALLOON_CHARGE = -57;

  // maps balloon direction to a description string
  var BALLOON_DIRECTION_MAP = {
    UP: upString,
    DOWN: downString,
    LEFT: leftString,
    RIGHT: rightString,
    UP_RIGHT: upAndToTheRightString,
    UP_LEFT: upAndToTheLeftString,
    DOWN_RIGHT: downAndToTheRightString,
    DOWN_LEFT: downAndToTheLeftString
  };

  // maximum velocity of a balloon immediately after release in this simulation, determined by observation
  var MAXIMUM_VELOCITY_ON_RELEASE = 0.4;

  // maps magnitude of velocity to the description
  var BALLOON_VELOCITY_MAP = {
    VERY_SLOWLY_RANGE: {
      range: new Range( 0, MAXIMUM_VELOCITY_ON_RELEASE / 100 ),
      description: verySlowlyString
    },
    SLOWLY_RANGE: {
      range: new Range( MAXIMUM_VELOCITY_ON_RELEASE / 100, MAXIMUM_VELOCITY_ON_RELEASE  / 50 ),
      description: slowlyString
    },
    QUICKLY_RANGE: {
      range: new Range( MAXIMUM_VELOCITY_ON_RELEASE / 50,  MAXIMUM_VELOCITY_ON_RELEASE / 4 ),
      description: quicklyString
    },
    VERY_QUICKLY_RANGE: {
      range: new Range( MAXIMUM_VELOCITY_ON_RELEASE / 4, Number.MAX_VALUE ),
      description: veryQuicklyString
    }
  };

  /**
   * @param {BalloonsAndStaticElectricityModel} model
   * @param {WallModel} wall
   * @param {BalloonModel} balloon
   * @constructor
   */
  function BalloonDescriber( model, wall, balloon, accessibleLabel ) {

    // @private
    this.model = model;
    this.wall = wall;
    this.balloon = balloon; // TODO: remove
    this.balloonModel = balloon;
    this.accessibleLabel = accessibleLabel;
    this.showChargesProperty = model.showChargesProperty;

    this.balloonLabelMap = {
      GREEN: BASEA11yStrings.greenBalloonString,
      YELLOW: BASEA11yStrings.yellowBalloonString
    };

    // @private - TODO: delete this?
    this.locationDescriptionMap = {
      TOP_LEFT: BASEA11yStrings.topLeftEdgeOfSweaterString,
      UPPER_LEFT: BASEA11yStrings.upperLeftEdgeOfSweaterString,
      LOWER_LEFT: BASEA11yStrings.lowerLeftEdgeOfSweaterString,
      BOTTOM_LEFT: BASEA11yStrings.bottomLeftEdgeOfSweaterString,

      TOP_LEFT_ARM: BASEA11yStrings.topLeftArmString,
      UPPER_LEFT_ARM: BASEA11yStrings.upperLeftArmString,
      LOWER_LEFT_ARM: BASEA11yStrings.lowerLeftArmString,
      BOTTOM_LEFT_ARM: BASEA11yStrings.bottomLeftArmString,

      TOP_LEFT_SWEATER: BASEA11yStrings.topLeftSideOfSweaterString,
      UPPER_LEFT_SWEATER: BASEA11yStrings.upperLeftSideOfSweaterString,
      LOWER_LEFT_SWEATER: BASEA11yStrings.lowerLeftSideOfSweaterString,
      BOTTOM_LEFT_SWEATER: BASEA11yStrings.bottomLeftSideOfSweaterString,

      TOP_RIGHT_SWEATER: BASEA11yStrings.topRightSideOfSweaterString,
      UPPER_RIGHT_SWEATER: BASEA11yStrings.upperRightSideOfSweaterString,
      LOWER_RIGHT_SWEATER: BASEA11yStrings.lowerRightSideOfSweaterString,
      BOTTOM_RIGHT_SWEATER: BASEA11yStrings.bottomRightSideOfSweaterString,

      TOP_RIGHT_ARM: BASEA11yStrings.topRightArmString,
      UPPER_RIGHT_ARM: BASEA11yStrings.upperRightArmString,
      LOWER_RIGHT_ARM: BASEA11yStrings.lowerRightArmString,
      BOTTOM_RIGHT_ARM: BASEA11yStrings.bottomRightArmString,

      TOP_LEFT_PLAY_AREA: BASEA11yStrings.topLeftSideOfPlayAreaString,
      UPPER_LEFT_PLAY_AREA: BASEA11yStrings.upperLeftSideOfPlayAreaString,
      LOWER_LEFT_PLAY_AREA: BASEA11yStrings.lowerLeftSideOfPlayAreaString,
      BOTTOM_LEFT_PLAY_AREA: BASEA11yStrings.bottomLeftSideOfPlayAreaString,

      TOP_CENTER_PLAY_AREA: BASEA11yStrings.topCenterOfPlayAreaString,
      UPPER_CENTER_PLAY_AREA: BASEA11yStrings.upperCenterOfPlayAreaString,
      LOWER_CENTER_PLAY_AREA: BASEA11yStrings.lowerCenterOfPlayAreaString,
      BOTTOM_CENTER_PLAY_AREA: BASEA11yStrings.bottomCenterOfPlayAreaString,

      TOP_RIGHT_PLAY_AREA: BASEA11yStrings.topRightSideOfPlayAreaString,
      UPPER_RIGHT_PLAY_AREA: BASEA11yStrings.upperRightSideOfPlayAreaString,
      LOWER_RIGHT_PLAY_AREA: BASEA11yStrings.lowerRightSideOfPlayAreaString,
      BOTTOM_RIGHT_PLAY_AREA: BASEA11yStrings.bottomRightSideOfPlayAreaString,

      TOP_RIGHT: BASEA11yStrings.topRightEdgeOfPlayAreaString,
      UPPER_RIGHT: BASEA11yStrings.upperRightEdgeOfPlayAreaString,
      LOWER_RIGHT: BASEA11yStrings.lowerRightEdgeOfPlayAreaString,
      BOTTOM_RIGHT: BASEA11yStrings.bottomRightEdgeOfPlayAreaString,

      TOP_EDGE: BASEA11yStrings.atTopOfPlayAreaString,
      BOTTOM_EDGE: BASEA11yStrings.atBottomOfPlayAreaString,
      LEFT_EDGE: BASEA11yStrings.leftEdgeString,
      RIGHT_EDGE: BASEA11yStrings.rightEdgeString,
      AT_WALL: BASEA11yStrings.atWallString

    };

    // @private - track the number of times each of the W, A, S and D keys have been pressed in a single interaction
    this.aKeyPressedCount = 0;
    this.wKeyPressedCount = 0;
    this.sKeyPressedCount = 0;
    this.dKeyPressedCount = 0;

    // @private - track the current bounds and state of the balloon
    this.balloonBounds = this.model.playArea.getPointBounds( balloon.getCenter() );
    this.balloonOnSweater = balloon.onSweater();
    this.transitionedToNewArea = false; // true when balloon moves across sweater
    this.balloonCharge = balloon.chargeProperty.get();
    this.balloonChargeRange = A_FEW_RANGE;
    this.balloonInChargeRangeCount = 0; // if stays in one range while picking up many charges, this is incremented
    this.balloonLocation = balloon.locationProperty.get(); // tracks when the value has changed
    this.balloonTouchingWall = balloon.touchingWall();
  }

  balloonsAndStaticElectricity.register( 'BalloonDescriber', BalloonDescriber );

  return inherit( Object, BalloonDescriber, {

    /**
     * Get the description for this balloon, including information about the Balloon's location, and charge
     * 
     * @return {string}
     */
    getBalloonDescription: function() {
      var description;
      var showCharges = this.showChargesProperty.get();

      var attractiveStateAndLocationString = this.getAttractiveStateAndLocationDescription();

      if ( showCharges === 'none' ) {
        description = StringUtils.fillIn( balloonShowNoChargesPatternString, {
          stateAndLocation: attractiveStateAndLocationString
        } );
      }
      else {
        // balloon net charge description
        var netChargeDescriptionString = this.getNetChargeDescription();

        // balloon relative charge string, dependent on charge visibility
        var relativeChargesString = this.getRelativeChargeDescription();

        description = StringUtils.fillIn( balloonShowAllChargesPatternString, {
          stateAndLocation: attractiveStateAndLocationString,
          netCharge: netChargeDescriptionString,
          relativeCharge: relativeChargesString
        } );
      }

      return StringUtils.fillIn( balloonDescriptionWithHelpPatternString, {
        description: description,
        help: balloonButtonHelpString
      } );
    },

    getNetChargeDescription: function() {
      var chargeAmountString = this.balloonModel.chargeProperty.get() < 0 ? balloonNegativeString : balloonNoString;
      return StringUtils.fillIn( balloonNetChargePatternString, {
        chargeAmount: chargeAmountString
      } );
    },

    getRelativeChargeDescription: function() {
      var chargeValue = Math.abs( this.balloonModel.chargeProperty.get() );
      var relativeChargesString = BalloonsAndStaticElectricityDescriber.getRelativeChargeDescription( chargeValue );

      var stringPattern;
      var showCharges = this.showChargesProperty.get();
      if ( showCharges === 'all' ) {
        stringPattern = balloonRelativeChargePatternString;
      }
      else if ( showCharges === 'diff' ) {
        stringPattern = balloonChargeDifferencesPatternString;
      }
      assert && assert( stringPattern, 'stringPattern not found for showChargesProperty value ' + showCharges );

      return StringUtils.fillIn( stringPattern, {
        amount: relativeChargesString
      } );
    },

    /**
     * Get a description that describes the attractive state or proximity of the balloon, such as
     * "On...", "sticking to...", "Near..." and so on.
     * 
     * @return {string}
     */
    getAttractiveStateOrProximityDescription: function() {
      var string = '';

      var wallVisible = this.wall.isVisibleProperty.get();
      var balloonRight = this.balloonModel.getRight();
      var wallLeft = this.wall.x;

      if ( this.balloonModel.onSweater() || this.balloonModel.touchingWall() ) {
        if ( !this.balloonModel.isDraggedProperty.get() && Math.abs( this.balloonModel.chargeProperty.get() ) > 0 ) {

          // has charged and not dragging, balloon is sticking to the object
          string = balloonStickingToString;
        }
        else {
          string = balloonTouchingString;
        }
      }
      else if ( this.balloonModel.nearWall() || ( balloonRight === wallLeft && !wallVisible ) ) {

        // use 'near' if near the wall, or at the wall location when the the wall is invisible
        // because we are near the right edge
        string = balloonNearString;
      }
      else {
        string = balloonOnString;
      }

      return string;
    },

    /**
     * Returns a string that combines the balloon's attractive state and location descriptions. Something
     * like "On center of play area." or "Sticking to wall."
     * 
     * @return {string}
     */
    getAttractiveStateAndLocationDescription: function() {
      // a string that peices together attractive state and location.
      var locationDescriptionString = this.getBalloonLocationDescription();
      
      var attractiveStateDescriptionString = this.getAttractiveStateOrProximityDescription();
      var attractiveStateAndLocationString = StringUtils.fillIn( balloonLocationAttractiveStatePatternString, {
        attractiveState: attractiveStateDescriptionString,
        location: locationDescriptionString 
      } );

      return attractiveStateAndLocationString;
    },

    /**
     * Return a phrase describing the location of the balloon in the play area.  This is usually described relative
     * to the center of the balloon, unless the balloon is touching an object, in which case it will be relative to the
     * point where the objects are touching.
     * 
     * @return {[type]} [description]
     */
    getBalloonLocationDescription: function() {
      var describedBalloonPosition = this.getDescribedPoint();
      var wallVisible = this.wall.isVisibleProperty.get();

      return BalloonsAndStaticElectricityDescriber.getLocationDescription( describedBalloonPosition, wallVisible );
    },

    /**
     * Get the point on the balloon that should be described. Generally, this is the balloon center.  If the balloon
     * is touching the sweater or the wall, the point of touching should be described.  If near the wall, the described
     * point is the edge of the wall to accomplish a description like "Yellow balloon, Near upper wall".
     * 
     * @return {Vector2}
     */
    getDescribedPoint: function() {
      var describedBalloonPosition;

      var balloonRight = this.balloonModel.getRight();

      // if the balloon is touching the wall (regardless of whether or not it is visible, describe
      // its right edge)
      if ( PlayAreaMap.COLUMN_RANGES.RIGHT_EDGE.contains( balloonRight ) ) {
        describedBalloonPosition = new Vector2( balloonRight, this.balloonModel.getCenterY() ); 
      }
      else if ( this.balloonModel.onSweater() ) {
        describedBalloonPosition = this.balloonModel.getSweaterTouchingCenter();
      }
      else if ( this.balloonModel.nearWall() ) {
        describedBalloonPosition = new Vector2( this.wall.x, this.balloonModel.getCenterY() );
      }
      else {
        describedBalloonPosition = this.balloonModel.getCenter();
      }

      return describedBalloonPosition;
    },

    getTouchingWallDescription: function( balloon, dragging ) {

      var upperLowerString;
      var balloonLocationDescription;
      if ( balloon.inUpperHalfOfPlayArea() ) {
        upperLowerString = BASEA11yStrings.upperWallString;
      }
      else {
        upperLowerString = BASEA11yStrings.lowerWallString;
      }

      if ( balloon.chargeProperty.get() === 0 || dragging ) {
        balloonLocationDescription = StringUtils.format( BASEA11yStrings.touchingWallStringPattern, upperLowerString );
      }
      else {
        balloonLocationDescription = StringUtils.format( BASEA11yStrings.stickingToWallStringPattern, upperLowerString );
      }

      return balloonLocationDescription;
    },

    /**
     * Get a description of the proximity of the balloon to other items in the play area.
     * @param  {BalloonModel} balloon
     * @returns {string}
     */
    getBalloonProximityDescription: function( balloon ) {
      var proximityDescription;
      var balloonOnSweater = balloon.onSweater();
      if ( balloon.nearSweater() ) {
        proximityDescription = BASEA11yStrings.nearSweaterString; 
      }
      else if ( balloon.nearWall() && this.model.wall.isVisibleProperty.get() ) {
        proximityDescription = BASEA11yStrings.nearWallString;
      }
      else if ( balloonOnSweater !== this.balloonOnSweater ) {
        if ( balloonOnSweater ) {

          // only anounce on sweater the first time it hits the sweater
          // if the balloon picks up a charge as it touches the sweater, anounce this
          if ( balloon.chargeProperty.get() !== this.balloonCharge ) {
            proximityDescription = StringUtils.format( BASEA11yStrings.onSweaterPatternStringString, BASEA11yStrings.picksUpNegativeChargesString );
            this.balloonCharge = balloon.chargeProperty.get();
          }
          else {
            proximityDescription = StringUtils.format( BASEA11yStrings.onSweaterPatternStringString, '' );
          }
        }
        else {
          proximityDescription = BASEA11yStrings.offSweaterString;
        }
        this.balloonOnSweater = balloonOnSweater;
        this.transitionedToNewArea = true;
      }
      else if ( balloonOnSweater === this.balloonOnSweater ) {
        this.transitionedToNewArea = false;
      }

      return proximityDescription;
    },

    getBalloonChargeDescription: function() {
      // delete this?
    },

    /**
     * Get an alert that indicates that the balloon has been grabbed for dragging.
     * @return {string}
     */
    getDraggedAlert: function() {
      return grabbedString;
    },

    /**
     * Get an alert that indicates that the balloon has been released.
     * @return {string}
     */
    getReleasedAlert: function() {
      return releasedString;
    },

    /**
     * Generally announced right after the balloon as been released, this is read as an alert. Generates
     * something like "Moves toward sweater."
     *
     * @param {Vector2} location - the current location of the balloon
     * @param {Vector2} oldLocation - the previous location of the balloon
     * @return {string}
     */
    getInitialReleaseDescription: function( location, oldLocation ) {

      // the balloon is moving with some initial velocity, describe that
      var velocityString = this.getVelocityString();
      var toObjectString = this.getToObjectString( location, oldLocation );

      var description = StringUtils.fillIn( movesToObjectPatternString, {
        balloonLabel: this.accessibleLabel,
        velocity: velocityString,
        toObject: toObjectString
      } );

      return description;
    },

    /**
     * Get a description of continuous movement of the balloon after it has been released and is
     * still moving through the play area.  Will return something like
     * "Still moving towards sweater."
     * 
     * @param {Vector2} location   
     * @param {Vector2} oldLocation
     * @return
     */
    getContinuousReleaseDescription: function( location, oldLocation ) {
      var attractedObjectString;

      var deltaX = location.x - oldLocation.x;
      if ( deltaX > 0 ) {
        attractedObjectString = wallString;
      }
      else {
        attractedObjectString = sweaterString;
      }

      return StringUtils.fillIn( stillMovingPatternString, {
        toObject: attractedObjectString
      } );
    },

    /**
     * Produces an alert when there is no change in position.  Indicates that there is no change
     * and also reminds user where the balloon currently is.
     * 
     * @return {string}
     */
    getNoChangeReleaseDescription: function() {

      var noChangeString = StringUtils.fillIn( noChangeInPositionPatternString, {
        balloonLabel: this.accessibleLabel
      } );

      var attractiveStateAndLocationDescription = this.getAttractiveStateAndLocationDescription();

      return StringUtils.fillIn( noChangeAndLocationPatternString, {
        noChange: noChangeString,
        location: attractiveStateAndLocationDescription
      } );
    },

    /**
     * Get a description of velocity for this balloon, one of "very slowly", "slowly", "quickly", "very quickly"
     * 
     * @private
     * @return {string}
     */
    getVelocityString: function() {
      var velocityString;

      var balloonVelocity = this.balloonModel.velocityProperty.get();

      var keys = Object.keys( BALLOON_VELOCITY_MAP );
      for ( var i = 0; i < keys.length; i++ ) {
        var entry = BALLOON_VELOCITY_MAP[ keys[ i ] ];
        if ( entry.range.contains( balloonVelocity.magnitude() ) ) {
          velocityString = entry.description;
          break;
        }
      }

      assert && assert( velocityString, 'no velocity description found' );

      return velocityString;
    },

    /**
     * Get a string that describes what the balloon is moving toward, one of "to wall" or "towards sweater"
     * 
     * @return {string}
     */
    getToObjectString: function( location, oldLocation ) {

      // if moving right, return moving to wall string, otherwise, moving to sweater
      return ( location.x - oldLocation.x > 0 ) ? toWallString : towardsSweaterString;
    },

    /**
     * Get a movement description from the movement direction tracked in the model.  The direction
     * is one of BalloonDirectionEnum.
     *
     * @param {string} direction - one of BalloonDirectionEnum
     * @return {string}
     */
    getMovementDirectionDescription: function( direction ) {
      var movementString = BALLOON_DIRECTION_MAP[ direction ];

      assert && assert( movementString, 'no direction description found for balloon moving direction ' + direction );
      return movementString;
    },

    /**
     * Get a description of wich boundary the balloon is touching.
     * 
     * @return {string}
     */
    getTouchingBoundaryDescription: function() {
      assert && assert ( this.balloonModel.isTouchingBoundary(), 'balloon is not touching a boundary' );

      var boundaryString;
      if ( this.balloonModel.isTouchingBottomBoundary() ) {
        boundaryString = atBottomString;
      }
      else if ( this.balloonModel.isTouchingLeftBoundary() ) {
        boundaryString = atLeftEdgeString;
      }
      else if ( this.balloonModel.isTouchingRightBoundary() ) {
        boundaryString = atRightEdgeString;
      }
      else if ( this.balloonModel.isTouchingTopBoundary() ) {
        boundaryString = atTopString;
      }

      assert && assert ( boundaryString, 'No boundary string found for balloon.' );
      return boundaryString;
    },

    getOnSweaterString: function( onSweater ) {
     return onSweater ? onSweaterString : offSweaterString;
    },

    /**
     * Get the dragging description while the balloon is moving through the play area being dragged.
     * 
     * @return {string}
     */
    getPlayAreaDragNewRegionDescription: function() {

      // if in a boundary location that touches the edge of the play area, considered "On",
      // otherwise considered "At" location
      var balloonCenter = this.balloonModel.getCenter();
      var nearSide = PlayAreaMap.COLUMN_RANGES.RIGHT_PLAY_AREA.contains( balloonCenter.x ) ||
                     PlayAreaMap.COLUMN_RANGES.LEFT_PLAY_AREA.contains( balloonCenter.x );

      var patternString = nearSide ? balloonOnLocationPatternString : balloonAtLocationPatternString;

      var wallVisible = this.model.wall.isVisibleProperty.get();
      var locationString = BalloonsAndStaticElectricityDescriber.getLocationDescription( balloonCenter, wallVisible );

      return StringUtils.fillIn( patternString, {
        location: locationString 
      } );
    },

    /**
     * Get a progress string toward the sweater, wall, top edge, bottom edge, or center of play area.
     * 
     * @return {string}
     */
    getPlayAreaDragProgressDescription: function() {
      var nearestObjectString;

      var centerPlayAreaX = PlayAreaMap.X_LOCATIONS.AT_CENTER_PLAY_AREA;
      var centerPlayAreaY = PlayAreaMap.Y_LOCATIONS.AT_CENTER_PLAY_AREA;
      var balloonCenterX = this.balloonModel.getCenterX();
      var balloonCenterY = this.balloonModel.getCenterY();
      var balloonDirection = this.balloonModel.direction;

      if ( balloonDirection === BalloonDirectionEnum.LEFT ) {

        // if right of center, describe closer to center, otherwise closer to sweater
        nearestObjectString = ( balloonCenterX > centerPlayAreaX ) ? centerOfPlayAreaString : sweaterString;
      }
      else if ( balloonDirection === BalloonDirectionEnum.RIGHT ) {

        if ( balloonCenterX < centerPlayAreaX ) {

          // if left of center, describe that we are closer to the center
          nearestObjectString = centerOfPlayAreaString;
        }
        else {

          // otherwise describe closer to wall or righe edge depending on wall visibility
          nearestObjectString = this.model.wall.isVisibleProperty.get() ? wallString : rightEdgeOfPlayAreaString;
        }
      }
      else if ( balloonDirection === BalloonDirectionEnum.UP ) {

        // below center describe closer to center, otherwise closer to top of play area
        nearestObjectString = ( balloonCenterY > centerPlayAreaY ) ? centerOfPlayAreaString : topEdgeOfPlayAreaString;
      }
      else if ( balloonDirection === BalloonDirectionEnum.DOWN ) {

        // above center describe closer to center, otherwise closer to bottom edge of play area
        nearestObjectString = ( balloonCenterY < centerPlayAreaY ) ? centerOfPlayAreaString : bottomEdgeOfPlayAreaString;
      }

      assert && assert( nearestObjectString, 'no nearest object found for movement direction: ' + balloonDirection );
      return StringUtils.fillIn( closerToObjectPatternString, {
        object: nearestObjectString
      } );
    },

    /**
     * Get a description of where the balloon jumped to.  Depending on where the balloon goes, there
     * could be an indication of where the balloon is in the play area, and potentially the state of
     * the induced charge in the wall.
     * 
     * @public
     * @param  {Vector2} center
     * @return {string}
     */
    getJumpingDescription: function( center ) {
      var description = '';

      // all jumping is in the x direction
      var centerX = center.x;

      // determine which description we should use depending on the center location of the balloon
      if ( centerX === PlayAreaMap.X_LOCATIONS.AT_NEAR_SWEATER ) {
        description = nearSweaterString;
      }
      else {

        // general location description for the balloon
        var locationDescription = this.getAttractiveStateAndLocationDescription();

        // state variables used to generate description content
        var wallVisible = this.wall.isVisibleProperty.get();
        var inducingCharge = this.balloonModel.inducingCharge;
        var showCharges = this.showChargesProperty.get();

        // if there is an induced charge and the charges are visible, describe induced charge
        if ( wallVisible && inducingCharge && showCharges === 'all' ) {
          var inducedChargeDescription = WallDescriber.getInducedChargeDescription( this.balloonModel, this.accessibleLabel, wallVisible );
          description = StringUtils.fillIn( locationAndInducedChargePatternString, {
            location: locationDescription,
            inducedCharge: inducedChargeDescription
          } );
        }
        else {

          // otherwise, only provide the location description
          description = StringUtils.fillIn( singleStatementPatternString, {
            statement: locationDescription
          } );
        }
      }
      return description;
    },

    getSweaterRubbingDescription: function() {
      
    },

    /**
     * Get a description of the balloon's charge.
     * TODO: This kind of method of getting descriptions based on numerical values in a range
     * could be generalized some how.
     *
     * @param  {Baloon} balloon
     * @returns {string}
     */
    getBalloonChargeDescriptionDeprecated: function( balloon, dragging ) {
      var chargeString; // qualitative description of balloon charge
      var neutralityString; // description of whether balloon has no or negative charge
      var inducedChargeString; // qualitative description for induced charge

      // assemble a description for the balloon's charge
      var balloonChargeDescription;
      var balloonLabel = this.balloonLabelMap[ balloon.balloonLabel ];

      var charge = Math.abs( balloon.chargeProperty.value );
      if ( charge === 0 ) {
        chargeString = BASEA11yStrings.noString;
        neutralityString = BASEA11yStrings.neutralString;
        inducedChargeString = BASEA11yStrings.doNotMoveString;
      }
      else if ( A_FEW_RANGE.contains( charge ) ) {
        chargeString = BASEA11yStrings.aFewString;
        neutralityString = BASEA11yStrings.negativeString;
        inducedChargeString = BASEA11yStrings.moveALittleBitString;
      }
      else if ( SEVERAL_RANGE.contains( charge ) ) {
        chargeString = BASEA11yStrings.severalString;
        neutralityString = BASEA11yStrings.negativeString;
        inducedChargeString = BASEA11yStrings.moveALotString;
      }
      else if ( MANY_RANGE.contains( charge ) ) {
        chargeString = BASEA11yStrings.manyString;
        neutralityString = BASEA11yStrings.negativeString;
        inducedChargeString = BASEA11yStrings.moveQuiteALotString;
      }
      assert && assert( chargeString, 'no description found for balloon with charge: ' + balloon.chargeProperty.get() );

      if ( dragging ) {
        balloonChargeDescription = StringUtils.format( BASEA11yStrings.namedBalloonChargeDescriptionPatternString, balloonLabel, neutralityString, chargeString );
      }
      else {
        balloonChargeDescription = StringUtils.format( BASEA11yStrings.balloonChargeStringPattern, neutralityString, chargeString );
      }

      var wallChargeDescription = StringUtils.format( BASEA11yStrings.atWallTouchPointPatternString, inducedChargeString );

      // assemble a description for the wall charge if the balloon is touching the wall
      if ( balloon.touchingWall() && this.model.wall.isVisibleProperty.get() ) {
        return StringUtils.format( '{0} {1}', balloonChargeDescription, wallChargeDescription );
      }
      else {
        return balloonChargeDescription;
      }

    },

    getSweaterChargeDescription: function( balloon ) {
      var chargeString;
      var neutralityString;

      var charge = Math.abs( balloon.chargeProperty.value );
      if ( charge === 0 ) {
        chargeString = BASEA11yStrings.noString;
        neutralityString = BASEA11yStrings.neutralString;
      }
      else if ( A_FEW_RANGE.contains( charge ) ) {
        chargeString = BASEA11yStrings.aFewString;
        neutralityString = BASEA11yStrings.positiveString;
      }
      else if ( SEVERAL_RANGE.contains( charge ) ) {
        chargeString = BASEA11yStrings.severalString;
        neutralityString = BASEA11yStrings.positiveString;
      }
      else if ( MANY_RANGE.contains( charge ) ) {
        chargeString =BASEA11yStrings. manyString;
        neutralityString = BASEA11yStrings.positiveString;
      }

      assert && assert( chargeString, 'no description found for sweater with charge: ' + -balloon.chargeProperty.get() );
      return StringUtils.format( BASEA11yStrings.sweaterChargePatternString, neutralityString, chargeString );
    },

    /**
     * Get a description of the balloon leaving the wall as a function of distance from the wall.
     *
     * @param  {BalloonModel} balloon
     * @returns {string}
     */
    getLeavingWallDescription: function( balloon ) {
      var distanceToWall = Math.abs( balloon.getDistanceToWall() );

      if ( distanceToWall < 40 ) {
        return StringUtils.format( BASEA11yStrings.wallChargesReturnString, BASEA11yStrings.slightlyString );
      }
      else {
        return StringUtils.format( BASEA11yStrings.wallChargesReturnString, BASEA11yStrings.allTheWayString );
      }
    },

    /**
     * Get a description of the balloon rubbing the wall.  This should only be called
     * if the balloon is touching the wall.  This description includes the induced charge
     * in the wall.
     * @param  {BalloonModel} balloon
     * @returns {string}
     */
    getWallRubDescription: function( balloon ) {
      var charge = Math.abs( balloon.chargeProperty.get() );
      var inducedChargeDescription;

      if ( charge === 0 ) {
        inducedChargeDescription = BASEA11yStrings.doNotMoveString;
      }
      else if ( A_FEW_RANGE.contains( charge ) ) {
        inducedChargeDescription = BASEA11yStrings.moveALittleBitString;
      }
      else if ( SEVERAL_RANGE.contains( charge ) ) {
        inducedChargeDescription = BASEA11yStrings.moveALotString;
      }
      else if ( MANY_RANGE.contains( charge ) ) {
        inducedChargeDescription = BASEA11yStrings.moveQuiteALotString;
      }

      return StringUtils.format( BASEA11yStrings.wallRubStringPattern, inducedChargeDescription );
    },

    /**
     * Get an alert for when the balloon rubs on the sweater.
     * @param  {BalloonModel} balloon
     * @returns {string}
     */
    getSweaterRubDescription: function( balloon ) {
      var currentBalloonCharge = balloon.chargeProperty.get();
      var currentBalloonChargeRange = this.getCurrentChargeRange();

      var balloonChargeString;
      var sweaterChargeString;
      var balloonPicksUpChargesString;

      var sweater = this.model.sweater;
      if ( sweater.chargeProperty.get() === -MAX_BALLOON_CHARGE ) {
        return BASEA11yStrings.noMoreChargesRemainingOnSweaterString;
      }
      else if ( currentBalloonCharge !== this.balloonCharge ) {

        // the balloon has picked at least one charge
        this.balloonCharge = balloon.chargeProperty.get();

        if ( this.balloonChargeRange !== currentBalloonChargeRange ) {

          // the balloon has picked up enough charges to remind the user of the
          // charge difference between sweater and balloon
          this.balloonInChargeRangeCount = 0;
          this.balloonChargeRange = currentBalloonChargeRange;
        }

        if ( this.balloonInChargeRangeCount === 0 ) {

          // this is the first time picking up a charge in this range
          balloonChargeString = this.getBalloonChargeDescription( balloon, true /*dragging*/ );
          sweaterChargeString = this.getSweaterChargeDescription( balloon );

        }
        else if ( this.balloonInChargeRangeCount === 1 ) {
          balloonPicksUpChargesString = BASEA11yStrings.balloonPicksUpMoreChargesString;
        }
        else {
          balloonPicksUpChargesString = BASEA11yStrings.againMoreChargesString;
        }

        this.balloonInChargeRangeCount++;
      }
      else {

        // no charge was picked up, so tell the user where they can find more
        var moreChargesString = this.getChargePositionCue();

        // Once we give this cue, the user needs more context when they pick up additional charges
        this.balloonInChargeRangeCount = 1;

        var locationHelpStringPattern = '{0} {1} {2}';
        var balloonLocation = '';
        if ( balloon.centerInSweaterChargedArea() ) {
          var locationBounds = this.model.playArea.getPointBounds( balloon.getCenter() );
          var locationDescription = this.locationDescriptionMap[ locationBounds ];

          balloonLocation = StringUtils.format( BASEA11yStrings.draggingLocationStringPattern, locationDescription );
        }
        return StringUtils.format( locationHelpStringPattern, BASEA11yStrings.noChangeInChargesString, balloonLocation, moreChargesString );
      }

      if ( balloonPicksUpChargesString ) {
        return balloonPicksUpChargesString;
      }
      else {
        var stringPattern = '{0} {1}';
        return StringUtils.format( stringPattern, balloonChargeString, sweaterChargeString );
      }

    },

    /**
     * Return the range that contains the current charge value of the balloon.
     * @returns {Range|null}
     */
    getCurrentChargeRange: function() {
      var charge = Math.abs( this.balloon.chargeProperty.get() );

      if ( charge === 0 ) {
        return;
      }
      else if ( A_FEW_RANGE.contains( charge ) ) {
        return A_FEW_RANGE;
      }
      else if ( SEVERAL_RANGE.contains( charge ) ) {
        return SEVERAL_RANGE;
      }
      else if ( MANY_RANGE.contains( charge ) ) {
        return MANY_RANGE;
      }

    },

    /**
     * Reset all key counters used for hysteresis when checking balloon
     */
    resetKeyCounts: function() {
      this.aKeyPressedCount = 0;
      this.wKeyPressedCount = 0;
      this.sKeyPressedCount = 0;
      this.dKeyPressedCount = 0;
    },

    /**
     * Reset all flags that monitor the balloon and define hysteresis for descriptions.
     * @public
     */
    reset: function() {
      this.aKeyPressedCount = 0;
      this.wKeyPressedCount = 0;
      this.sKeyPressedCount = 0;
      this.dKeyPressedCount = 0;

      this.balloonBounds = this.model.playArea.getPointBounds( this.balloon.getCenter() );
      this.balloonOnSweater = this.balloon.onSweater();
      this.transitionedToNewArea = false;
      this.balloonCharge = this.balloon.chargeProperty.get();
      this.balloonChargeRange = A_FEW_RANGE;
      this.balloonInChargeRangeCount = 0;
      this.balloonLocation = this.balloon.locationProperty.get();
      this.balloonTouchingWall = this.balloon.touchingWall();
    },

    /**
     * Get a description of the balloon after it has been released.
     * This description id dependent on the position.
     * @returns {string}
     */
    getReleaseDescription: function() {

      var descriptionString = '';
      if ( this.balloon.chargeProperty.get() === 0 ) {

        // when the charge is zero, we want to hear the balloon Label, release position, no change in position,
        // no change in charges, button label
        descriptionString = StringUtils.format( BASEA11yStrings.balloonReleasedNoChangePatternString, BASEA11yStrings.noChangeInPositionOrChargeString );
      }
      else if ( this.balloon.touchingWall() ) {
        var touchingWallDescription = this.getTouchingWallDescription( this.balloon );
        descriptionString = StringUtils.format( BASEA11yStrings.balloonReleasedNoChangePatternString, touchingWallDescription );
      }
      else if ( this.balloon.centerInSweaterChargedArea() ) {
        var stickingString = StringUtils.format( BASEA11yStrings.stickingToLocationPatternString, BASEA11yStrings.sweaterString );
        descriptionString = StringUtils.format( BASEA11yStrings.balloonReleasedNoChangePatternString, stickingString );
      }
      else {

        // otherwise, we want to hear direction and speed of balloon movement.
        var velocityDescription = this.getVelocityDescription();

        var attractedObject = this.getAttractedObject();

        // put it together
        descriptionString = StringUtils.format( BASEA11yStrings.balloonReleasedPatternString, velocityDescription, attractedObject );
      }

      return descriptionString;
    },

    getAttractedObject: function() {

      // determine which object the balloon is moving toward
      var attractedDirection = this.balloon.getAttractedDirection();

      var attractedObject;
      if ( attractedDirection === BalloonDirectionEnum.RIGHT ) {
        attractedObject = BASEA11yStrings.wallString;
      }
      else {
        attractedObject = BASEA11yStrings.sweaterString;
      }

      return attractedObject;
    },

    /**
     * Return true when it is time to reset the dragging descriptions.
     * @returns {boolean}
     */
    keyCountsNeedToBeReset: function() {
      var countsTooHigh =
        this.dKeyPressedCount > 5 ||
        this.sKeyPressedCount > 5 ||
        this.aKeyPressedCount > 5 ||
        this.wKeyPressedCount > 5;

      return countsTooHigh || this.transitionedToNewArea;
    },

    /**
     * Get a description of how quickly the balloon moves to another object in the play area
     * as a function of the charge.
     * @param  {number} charge
     * @returns {string}
     */
    getVelocityDescription: function() {
      var velocityDescription = '';

      // map the charges to ranges
      var verySlowRange = new Range( 1, 14 );
      var slowRange = new Range( 15, 29 );
      var quickRange = new Range( 30, 44 );
      var veryQuickRange = new Range( 45, 57 );
      var absCharge = Math.abs( this.balloon.chargeProperty.get() );

      if ( verySlowRange.contains( absCharge ) ) {
        velocityDescription = 'very slowly';
      }
      else if ( slowRange.contains( absCharge ) ) {
        velocityDescription = 'slowly';
      }
      else if ( quickRange.contains( absCharge ) ) {
        velocityDescription = 'quickly';
      }
      else if ( veryQuickRange.contains( absCharge ) ) {
        velocityDescription = 'very quickly';
      }
      return velocityDescription;
    }
  } );
} );