// Copyright 2002-2016, University of Colorado Boulder

/**
 * This type allows for determining descriptions for the balloon.  Describing the location of the balloon
 * is quite complicated so this distributes the description work so that BalloonNode does not become
 * a massive file.  Used for accessibility.
 *
 * !! The LocationEnum maps nicely to these descriptions, so this shouldn't be so bad!
 *
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var BalloonDirectionEnum = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/BalloonDirectionEnum' );
  var Range = require( 'DOT/Range' );
  var StringMaps = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/accessibility/StringMaps' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );

  // constants
  var A_FEW_RANGE = new Range( 1, 15 );
  var SEVERAL_RANGE = new Range( 15, 40 );
  var MANY_RANGE = new Range( 40, 57 );
  var MAX_BALLOON_CHARGE = -57;

  // strings
  var balloonDescriptionPatternString = '{0} {1} {2}'; // location, charge, interaction cue
  var balloonGrabbedDescriptionPatternString = '{0} {1} {2} {3}'; // grabbed, location, charge, interaction cue 
  var balloonDragDescriptionPatternString = '{0} {1} {2} {3} {4} {5}'; // direction, proximity, charge, 
  var grabButtonNavigationCueString = 'Look for grab button to play.';
  var dragNavigationCueString = 'Press W, A, S, or D key to drag balloon. Space bar to let go. H key for hotkeys and help.';

  // location strings (organized by collumns in the play area)
  var balloonLocationStringPattern = 'In {0}.';
  var draggingLocationStringPattern = 'At {0}.';
  var stickingToLocationPatternString = 'Sticking to {0}.';

  var grabbedString = 'Grabbed.';

  var topLeftEdgeOfSweaterString = 'top left edge of sweater';
  var upperLeftEdgeOfSweaterString = 'upper left edge of sweater';
  var lowerLeftEdgeOfSweaterString = 'lower left edge of sweater';
  var bottomLeftEdgeOfSweaterString = 'bottom left edge of sweater';

  var topLeftArmString = 'top left arm';
  var upperLeftArmString = 'upper left arm';
  var lowerLeftArmString = 'lower left arm';
  var bottomLeftArmString = 'bottom left arm';

  var topLeftSideOfSweaterString = 'top left side of sweater';
  var upperLeftSideOfSweaterString = 'upper left side of sweater';
  var lowerLeftSideOfSweaterString = 'lower left side of sweater';
  var bottomLeftSideOfSweaterString = 'bottom left side of sweater';

  var topRightSideOfSweaterString = 'top right side of sweater';
  var upperRightSideOfSweaterString = 'upper right side of sweater';
  var lowerRightSideOfSweaterString = 'lower right side of sweater';
  var bottomRightSideOfSweaterString = 'bottom right side of sweater';

  var topRightArmString = 'top right arm';
  var upperRightArmString = 'upper right arm';
  var lowerRightArmString = 'lower right arm';
  var bottomRightArmString = 'bottom right arm';

  var topLeftSideOfPlayAreaString = 'top left side of play area';
  var upperLeftSideOfPlayAreaString = 'upper left side of play area';
  var lowerLeftSideOfPlayAreaString = 'lower left side of play area';
  var bottomLeftSideOfPlayAreaString = 'bottom left side of play area';

  var topCenterOfPlayAreaString = 'top center of play area';
  var upperCenterOfPlayAreaString = 'upper center of play area';
  var lowerCenterOfPlayAreaString = 'lower center of play area';
  var bottomCenterOfPlayAreaString = 'bottom center of play area';

  var topRightSideOfPlayAreaString = 'top right side of play area';
  var upperRightSideOfPlayAreaString = 'upper right side of play area';
  var lowerRightSideOfPlayAreaString = 'lower right side of play area';
  var bottomRightSideOfPlayAreaString = 'bottom right side of play area';

  var topRightEdgeOfPlayAreaString = 'top right edge of play area';
  var upperRightEdgeOfPlayAreaString = 'upper right edge of play area';
  var lowerRightEdgeOfPlayAreaString = 'lower right edge of play area';
  var bottomRightEdgeOfPlayAreaString = 'bottom right edge of play area';

  // location strings while touching another object
  // var atWallPatternString = 'At {0} wall.';
  var touchingWallStringPattern = 'Touching {0} wall.';
  var stickingToWallStringPattern = 'Sticking to {0} wall.';
  var lowerWallString = 'lower';
  var upperWallString = 'upper';

  var stickingToSweaterString = 'Now sticking to upper right side of sweater.';

  // charge descriptions
  var namedBalloonChargeDescriptionPatternString = '{0} has net {1} charge, {2} more negative charges than positive charges.';
  var balloonChargeStringPattern = 'Has net {0} charge, {1} more negative charges than positive charges.';
  var sweaterChargePatternString = 'Sweater has net {0} charge, {1} more positive charges than negative charges.';

  var neutralString = 'neutral';
  var negativeString = 'negative';
  var positiveString = 'positive';

  var noString = 'no';
  var aFewString = 'a few';
  var severalString = 'several';
  var manyString = 'many';

  // wall charge descriptions
  var atWallString = 'At wall.';
  var atWallTouchPointPatternString = 'At touch point, negative charges in wall {0}. Positive charges do not move.  Wall has net neutral charge, many pairs of negative and positive charges.';
  var wallRubStringPattern = 'No transfer of charge.  At touch point, negative charges in wall {0}.  Positive charges do not move.';
  var wallChargesReturnString = 'Negative charges in wall return {0}.';

  var slightlyString = 'slightly';
  var allTheWayString = 'all the way';

  var noChangeInChargesString = 'No change in charges.';
  var aLittleBitString = 'move away from balloon a little bit';
  var aLotString = 'move away from balloon a lot';
  var quiteALotString = 'move away from balloon quite a lot';
  var doNotMoveString = 'do not move';

  var noMoreChargesRemainingOnSweaterString = 'No change in charges. No more charges remaining on sweater.';

  // TODO: Why are these commented out?
  // var positiveChargesDoNotMoveString = 'Positive charges do not move.';
  // var wallHasChargePairsString = 'Wall has many pairs of positive and negative charges';
  // var balloonHasChargesPatternString = 'Balloon has {0} more negative charges than positive charges.';

  // release descriptions
  var balloonReleasedPatternString = 'Balloon released. Moved {0} to {1}.';
  var balloonReleasedNoChangePatternString = 'Balloon Released. {0}';
  var noChangeInPositionOrChargeString = 'No change in position.  No change in charge.';

  var wallString = 'wall';
  var sweaterString = 'sweater';

  var movesToObjectPatternString = 'Moves {0} towards {1}.';

  // interaction descriptions
  var movementDirectionPatternString = '{0} {1}';

  // // towards descriptions
  // var towardsTopString = 'Towards top.';
  // var towardsSweaterString = 'Towards sweater.';
  // var towardsBottomString = 'Towards bottom.';
  // var towardsWallString = 'Towards wall.';
  // var towardsRightSideOfPlayArea = 'Towards right side of play area';

  // closer descriptions
  // var closerToTopString = 'Closer to top.';
  // var closerToSweaterString = 'Closer to sweater.';
  // var closerToBottomString = 'Closer to bottom.';
  // var closerToWallString = 'Closer to wall.';
  // var closerToRightSideString = 'Closer to right side of play area.';

  var morePairsOfChargesStringPattern = 'More pairs of charges {0}.';

  var wallRemovedString = 'Wall removed from play area.';
  var wallAddedString = 'Wall added to play area.';

  // boundary strings
  var atTopOfPlayAreaString = 'At top of play area.';
  var atBottomOfPlayAreaString = 'At bottom of play area';
  var leftEdgeString = 'At left edge of play area';
  var rightEdgeString = 'At right edge of play area';

  var nearSweaterString = 'Near sweater';
  var onSweaterPatternStringString = 'On sweater. {0}';
  var picksUpNegativeChargesString = 'Picks up negative charges from sweater.';
  var nearWallString = 'Near wall.';
  var offSweaterString = 'Off sweater.';

  var atCenterOfPlayAreaString = 'At center of play area.';
  var onRightSideOfPlayAreaString = 'On right side of play area.';
  var nearRightSideOfPlayAreaString = 'Near right side of play area.';

  var balloonPicksUpMoreChargesString = 'Balloon picks up more negative charges';
  var againMoreChargesString = 'Again, more negative charges.';

  // labels
  var greenBalloonString = 'Green balloon';
  var yellowBalloonString = 'Yellow balloon';

  /**
   * @param {BalloonsAndStaticElectricityModel} model
   * @param {WallModel} wall
   * @param {BalloonModel} balloon
   * @constructor
   */
  function BalloonDescriber( model, wall, balloon ) {

    // @private
    this.model = model;
    this.wall = wall;
    this.balloon = balloon;

    this.balloonLabelMap = {
      GREEN: greenBalloonString,
      YELLOW: yellowBalloonString
    };

    // @private
    this.locationDescriptionMap = {
      TOP_LEFT: topLeftEdgeOfSweaterString,
      UPPER_LEFT: upperLeftEdgeOfSweaterString,
      LOWER_LEFT: lowerLeftEdgeOfSweaterString,
      BOTTOM_LEFT: bottomLeftEdgeOfSweaterString,

      TOP_LEFT_ARM: topLeftArmString,
      UPPER_LEFT_ARM: upperLeftArmString,
      LOWER_LEFT_ARM: lowerLeftArmString,
      BOTTOM_LEFT_ARM: bottomLeftArmString,

      TOP_LEFT_SWEATER: topLeftSideOfSweaterString,
      UPPER_LEFT_SWEATER: upperLeftSideOfSweaterString,
      LOWER_LEFT_SWEATER: lowerLeftSideOfSweaterString,
      BOTTOM_LEFT_SWEATER: bottomLeftSideOfSweaterString,

      TOP_RIGHT_SWEATER: topRightSideOfSweaterString,
      UPPER_RIGHT_SWEATER: upperRightSideOfSweaterString,
      LOWER_RIGHT_SWEATER: lowerRightSideOfSweaterString,
      BOTTOM_RIGHT_SWEATER: bottomRightSideOfSweaterString,

      TOP_RIGHT_ARM: topRightArmString,
      UPPER_RIGHT_ARM: upperRightArmString,
      LOWER_RIGHT_ARM: lowerRightArmString,
      BOTTOM_RIGHT_ARM: bottomRightArmString,

      TOP_LEFT_PLAY_AREA: topLeftSideOfPlayAreaString,
      UPPER_LEFT_PLAY_AREA: upperLeftSideOfPlayAreaString,
      LOWER_LEFT_PLAY_AREA: lowerLeftSideOfPlayAreaString,
      BOTTOM_LEFT_PLAY_AREA: bottomLeftSideOfPlayAreaString,

      TOP_CENTER_PLAY_AREA: topCenterOfPlayAreaString,
      UPPER_CENTER_PLAY_AREA: upperCenterOfPlayAreaString,
      LOWER_CENTER_PLAY_AREA: lowerCenterOfPlayAreaString,
      BOTTOM_CENTER_PLAY_AREA: bottomCenterOfPlayAreaString,

      TOP_RIGHT_PLAY_AREA: topRightSideOfPlayAreaString,
      UPPER_RIGHT_PLAY_AREA: upperRightSideOfPlayAreaString,
      LOWER_RIGHT_PLAY_AREA: lowerRightSideOfPlayAreaString,
      BOTTOM_RIGHT_PLAY_AREA: bottomRightSideOfPlayAreaString,

      TOP_RIGHT: topRightEdgeOfPlayAreaString,
      UPPER_RIGHT: upperRightEdgeOfPlayAreaString,
      LOWER_RIGHT: lowerRightEdgeOfPlayAreaString,
      BOTTOM_RIGHT: bottomRightEdgeOfPlayAreaString,

      TOP_EDGE: atTopOfPlayAreaString,
      BOTTOM_EDGE: atBottomOfPlayAreaString,
      LEFT_EDGE: leftEdgeString,
      RIGHT_EDGE: rightEdgeString,
      AT_WALL: atWallString

    };

    // @private - track the number of times each of the W, A, S and D keys have been pressed in a single interaction
    this.aKeyPressedCount = 0;
    this.wKeyPressedCount = 0;
    this.sKeyPressedCount = 0;
    this.dKeyPressedCount = 0;

    // @private - tracks the number of times the user has moved the balloon up/left/down/right
    // the number count determines the verbosity of descriptions
    this.movementCountMap = {
      RIGHT: 0,
      LEFT: 0,
      UP: 0,
      DOWN: 0
    };

    // @private - track the current bounds and state of the balloon
    this.direction = null;
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

    getMovementDescription: function( direction ) {

      // final string to return
      var movementDescription;

      // string describing object that the balloon is moving towards
      var towardsObjectString;

      // string describing the object that the balloon is moving closer to
      var closerToObjectString;

      var directionString = StringMaps.DIRECTION_MAP[ direction ];

      // if moving to the right, wew need a description for the wall dependent on its
      // visibility
      var towardsDirection = direction;
      if ( direction === BalloonDirectionEnum.RIGHT ) {
        if ( this.wall.isVisibleProperty.get() ) {
          towardsDirection = BalloonDirectionEnum.RIGHT_WALL;
        }
        else {
          towardsDirection = BalloonDirectionEnum.RIGHT_NO_WALL;
        }
      }

      if ( this.balloon.onSweater() ) {

        // if the balloon is on the sweater, only use the direction string
        movementDescription = directionString;
      }
      else if ( this.movementCountMap[ direction ] === 0 ) {
        towardsObjectString = StringMaps.TOWARDS_OBJECT_MAP[ towardsDirection ];
        movementDescription = StringUtils.format( movementDirectionPatternString, directionString, towardsObjectString );
      }
      else if ( this.movementCountMap[ direction ] < 2 ) {
        closerToObjectString = StringMaps.CLOSER_OBJECT_MAP[ towardsDirection ];
        movementDescription = StringUtils.format( movementDirectionPatternString, directionString, closerToObjectString );
      }
      else {
        movementDescription = directionString;
      }

      return movementDescription;
    },

    getDirection: function( location, oldLocation ) {
      var delta = location.minus( oldLocation );
      var direction; // string

      if ( delta.x > 0 ) {
        direction = BalloonDirectionEnum.RIGHT;
      }
      else if ( delta.x < 0 ) {
        direction = BalloonDirectionEnum.LEFT;
      }
      else if ( delta.y > 0 ) {
        direction = BalloonDirectionEnum.DOWN;
      }
      else if ( delta.y < 0 ) {
        direction = BalloonDirectionEnum.UP;
      }

      return direction;
    },

    /**
     * Update the counts for each interaction.
     * 
     * @return {[type]}
     */
    updateInteractionCounts: function() {
      this.movementCountMap[ this.direction ] += 1;
    },

    /**
     * Get a description of the balloon location.
     *
     * @param  {Balloon} balloon
     * @return {string}
     */
    getBalloonLocationDescription: function( balloon, dragging ) {
      var balloonLocationDescription;

      var locationStringPattern;
      if ( dragging ) {
        locationStringPattern = draggingLocationStringPattern;
      }
      else {
        if ( balloon.chargeProperty.get() < 0 && balloon.onSweater() ) {
          locationStringPattern = stickingToLocationPatternString;
        }
        else {
          locationStringPattern = balloonLocationStringPattern;
        }
      }

      // if touching the wall (balloon has no charge)
      if ( this.model.playArea.atWall === balloon.getCenter().x ) {
        balloonLocationDescription = this.getTouchingWallDescription( balloon, dragging );
      }
      else {
        var locationBounds = this.model.playArea.getPointBounds( balloon.getCenter() );
        var locationDescription = this.locationDescriptionMap[ locationBounds ];

        balloonLocationDescription = StringUtils.format( locationStringPattern, locationDescription );
      }

      assert && assert( balloonLocationDescription, 'no description found for balloon location' );
      return balloonLocationDescription;
    },

    getTouchingWallDescription: function( balloon, dragging ) {

      var upperLowerString;
      var balloonLocationDescription;
      if ( balloon.inUpperHalfOfPlayArea() ) {
        upperLowerString = upperWallString;
      }
      else {
        upperLowerString = lowerWallString;
      }

      if ( balloon.chargeProperty.get() === 0 || dragging ) {
        balloonLocationDescription = StringUtils.format( touchingWallStringPattern, upperLowerString );
      }
      else {
        balloonLocationDescription = StringUtils.format( stickingToWallStringPattern, upperLowerString );
      }

      return balloonLocationDescription;
    },

    /**
     * Get a description of the proximity of the balloon to other items in the play area.
     * @param  {BalloonModel} balloon
     * @return {string}
     */
    getBalloonProximityDescription: function() {
      var balloon = this.balloon;

      var proximityDescription;
      var balloonOnSweater = balloon.onSweater();

      if ( balloon.nearSweater() ) {
        proximityDescription = nearSweaterString;
      }
      else if ( balloon.nearWall() && this.model.wall.isVisibleProperty.get() ) {
        proximityDescription = nearWallString;
      }
      else if ( balloon.nearRightSideOfPlayArea() && !this.model.wall.isVisibleProperty.get() ) {
        proximityDescription = nearRightSideOfPlayAreaString;
      }
      else if ( balloonOnSweater !== this.balloonOnSweater ) {
        if ( balloonOnSweater ) {

          // only anounce on sweater the first time it hits the sweater
          // if the balloon picks up a charge as it touches the sweater, anounce this
          if ( balloon.chargeProperty.get() !== this.balloonCharge ) {
            proximityDescription = StringUtils.format( onSweaterPatternStringString, picksUpNegativeChargesString );
            this.balloonCharge = balloon.chargeProperty.get();
          }
          else {
            proximityDescription = StringUtils.format( onSweaterPatternStringString, '' );
          }
        }
        else {
          proximityDescription = offSweaterString;
        }
        this.balloonOnSweater = balloonOnSweater;
        this.transitionedToNewArea = true;
      }
      else if ( balloonOnSweater === this.balloonOnSweater ) {
        this.transitionedToNewArea = false;
      }

      return proximityDescription;
    },

    /**
     * Get a description of the balloon's charge.
     * TODO: This kind of method of getting descriptions based on numerical values in a range
     * could be generalized some how.
     *
     * @param  {Baloon} balloon
     * @return {string}
     */
    getBalloonChargeDescription: function( balloon, dragging ) {
      var chargeString; // qualitative description of balloon charge
      var neutralityString; // description of whether balloon has no or negative charge
      var inducedChargeString; // qualitative description for induced charge

      // assemble a description for the balloon's charge
      var balloonChargeDescription;
      var balloonLabel = this.balloonLabelMap[ balloon.balloonLabel ];

      var charge = Math.abs( balloon.chargeProperty.value );
      if ( charge === 0 ) {
        chargeString = noString;
        neutralityString = neutralString;
        inducedChargeString = doNotMoveString;
      }
      else if ( A_FEW_RANGE.contains( charge ) ) {
        chargeString = aFewString;
        neutralityString = negativeString;
        inducedChargeString = aLittleBitString;
      }
      else if ( SEVERAL_RANGE.contains( charge ) ) {
        chargeString = severalString;
        neutralityString = negativeString;
        inducedChargeString = aLotString;
      }
      else if ( MANY_RANGE.contains( charge ) ) {
        chargeString = manyString;
        neutralityString = negativeString;
        inducedChargeString = quiteALotString;
      }
      assert && assert( chargeString, 'no description found for balloon with charge: ' + balloon.chargeProperty.get() );

      if ( dragging ) {
        balloonChargeDescription = StringUtils.format( namedBalloonChargeDescriptionPatternString, balloonLabel, neutralityString, chargeString );
      }
      else {
        balloonChargeDescription = StringUtils.format( balloonChargeStringPattern, neutralityString, chargeString );
      }

      var wallChargeDescription = StringUtils.format( atWallTouchPointPatternString, inducedChargeString );

      // assemble a description for the wall charge if the balloon is touching the wall
      if ( balloon.touchingWall() && this.model.wall.isVisibleProperty.get() ) {
        return StringUtils.format( '{0} {1}', balloonChargeDescription, wallChargeDescription );
      }
      else {
        return balloonChargeDescription;
      }

    },

    getJumpingDescription: function( balloon ) {
      var balloonCenterX = balloon.getCenter().x;

      var jumpDescription;
      if ( balloonCenterX === this.model.playArea.atNearSweater ) {
        jumpDescription = nearSweaterString;
      }
      else if ( balloonCenterX === this.model.playArea.atNearWall ) {
        if ( this.model.wall.isVisibleProperty.get() ) {
          jumpDescription = nearWallString;
        }
        else {
          jumpDescription = onRightSideOfPlayAreaString;
        }
      }
      else if ( balloonCenterX === this.model.playArea.atCenter ) {
        jumpDescription = atCenterOfPlayAreaString;
      }
      else if ( balloonCenterX === this.model.playArea.atWall ) {
        var chargeDescription = this.getBalloonChargeDescription( balloon, true );
        jumpDescription = StringUtils.format( '{0} {1}', atWallString, chargeDescription );
      }

      return jumpDescription;
    },

    getSweaterChargeDescription: function( balloon ) {
      var chargeString;
      var neutralityString;

      var charge = Math.abs( balloon.chargeProperty.value );
      if ( charge === 0 ) {
        chargeString = noString;
        neutralityString = neutralString;
      }
      else if ( A_FEW_RANGE.contains( charge ) ) {
        chargeString = aFewString;
        neutralityString = positiveString;
      }
      else if ( SEVERAL_RANGE.contains( charge ) ) {
        chargeString = severalString;
        neutralityString = positiveString;
      }
      else if ( MANY_RANGE.contains( charge ) ) {
        chargeString = manyString;
        neutralityString = positiveString;
      }

      assert && assert( chargeString, 'no description found for sweater with charge: ' + -balloon.chargeProperty.get() );
      return StringUtils.format( sweaterChargePatternString, neutralityString, chargeString );
    },

    /**
     * Get a description of the balloon as it is dragging.  This should be called when the user completes
     * a drag interaction (on key up, typically).
     *
     * @param  {Balloon} balloon
     * @return {string}
     */
    getDraggingDescription: function( location, oldLocation ) {

      // get direction of movement based on the change in position
      var direction = this.getDirection( location, oldLocation );
      this.direction = direction;

      var directionMovementDescription = this.getMovementDescription( direction );

      var proximityString = this.getBalloonProximityDescription();

      if ( this.balloonOnSweater ) {

        // this will be true on the first rub, after user hits sweater the first time
        var onSweaterDescription = this.getSweaterRubDescription( this.balloon );
      }
      if ( this.balloon.touchingWall() ) {
        var atWallDescription = this.getWallRubDescription( this.balloon );
      }
      if ( this.balloon.touchingWall() !== this.balloonTouchingWall ) {
        if ( !this.balloon.touchingWall() && this.balloon.chargeProperty.get() < 0 ) {

          // the balloon is leaving the wall, so describe the change in induced charge
          var leavingWallDescription = this.getLeavingWallDescription( this.balloon );
        }
        this.balloonTouchingWall = this.balloon.touchingWall();
      }

      var newBounds = this.model.playArea.getPointBounds( this.balloon.getCenter() );
      if ( newBounds !== this.balloonBounds || this.balloon.getBoundaryObject() ) {
        this.balloonBounds = newBounds;
        var locationString = this.getBalloonLocationDescription( this.balloon, true );
      }

      var string1 = '';
      var string2 = '';
      var string3 = '';
      var string4 = '';
      var string5 = '';
      var string6 = '';
      if ( directionMovementDescription && this.balloonLocation !== this.balloon.locationProperty.get() ) {
        string1 = directionMovementDescription;
      }
      if ( proximityString ) {
        string2 = proximityString;
      }
      if ( onSweaterDescription && this.balloon.onSweater() ) {

        // if the balloon moves off the sweater, we do not want to hear this
        string3 = onSweaterDescription;
      }
      if ( locationString && !this.balloon.onSweater() ) {
        string4 = locationString;
      }
      if ( atWallDescription && this.balloonLocation !== this.balloon.locationProperty.get() ) {
        string5 = atWallDescription;
      }
      if ( leavingWallDescription ) {
        string6 = leavingWallDescription;
      }

      this.balloonLocation = this.balloon.locationProperty.get();
      var draggingDescription = StringUtils.format( balloonDragDescriptionPatternString, string1, string2, string3, string4, string5, string6 );
      return draggingDescription;
    },

    /**
     * Get a description of the balloon leaving the wall as a function of distance from the wall.
     *
     * @param  {BalloonModel} balloon
     * @return {string}
     */
    getLeavingWallDescription: function( balloon ) {
      var distanceToWall = Math.abs( balloon.getDistanceToWall() );

      if ( distanceToWall < 40 ) {
        return StringUtils.format( wallChargesReturnString, slightlyString );
      }
      else {
        return StringUtils.format( wallChargesReturnString, allTheWayString );
      }
    },

    /**
     * Get a description of the balloon rubbing the wall.  This should only be called
     * if the balloon is touching the wall.  This description includes the induced charge
     * in the wall.
     * @param  {BalloonModel} balloon
     * @return {string}
     */
    getWallRubDescription: function( balloon ) {
      var charge = Math.abs( balloon.chargeProperty.get() );
      var inducedChargeDescription;

      if ( charge === 0 ) {
        inducedChargeDescription = doNotMoveString;
      }
      else if ( A_FEW_RANGE.contains( charge ) ) {
        inducedChargeDescription = aLittleBitString;
      }
      else if ( SEVERAL_RANGE.contains( charge ) ) {
        inducedChargeDescription = aLotString;
      }
      else if ( MANY_RANGE.contains( charge ) ) {
        inducedChargeDescription = quiteALotString;
      }

      return StringUtils.format( wallRubStringPattern, inducedChargeDescription );
    },

    /**
     * Get an alert for when the balloon rubs on the sweater.
     * @param  {BalloonModel} balloon
     * @return {string}
     */
    getSweaterRubDescription: function( balloon ) {
      var currentBalloonCharge = balloon.chargeProperty.get();
      var currentBalloonChargeRange = this.getCurrentChargeRange();

      var balloonChargeString;
      var sweaterChargeString;
      var balloonPicksUpChargesString;

      if ( this.balloonCharge === MAX_BALLOON_CHARGE ) {
        return noMoreChargesRemainingOnSweaterString;
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
          balloonPicksUpChargesString = balloonPicksUpMoreChargesString;
        }
        else {
          balloonPicksUpChargesString = againMoreChargesString;
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
        if ( balloon.centerInSweater() ) {
          var locationBounds = this.model.playArea.getPointBounds( balloon.getCenter() );
          var locationDescription = this.locationDescriptionMap[ locationBounds ];

          balloonLocation = StringUtils.format( draggingLocationStringPattern, locationDescription );
        }
        return StringUtils.format( locationHelpStringPattern, noChangeInChargesString, balloonLocation, moreChargesString );
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
     * Get a description that tells the user where they can find more charges.
     *
     * @return {string}
     */
    getChargePositionCue: function() {
      assert && assert( this.model.sweater.chargeProperty.get() < -MAX_BALLOON_CHARGE, 'trying to find more charges when none remain' );

      // get the closest charge that has not been picked up
      var closestCharge = this.balloon.getClosestCharge();
      var directionToCharge = this.balloon.getDirectionToCharge( closestCharge );

      var directionCueString = StringMaps.DIRECTION_MAP[ directionToCharge ];
      assert && assert( directionCueString, 'no direction found for nearest charge' );

      return StringUtils.format( morePairsOfChargesStringPattern, directionCueString );
    },

    /**
     * Return the range that contains the current charge value of the balloon.
     * @return {Range|null}
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
     * Get a description for the balloon, including charge and location.
     *
     * @param  {Balloon} balloon
     * @param {boolean} isDragged - if dragged, the navigation cue changes
     * @return {string}
     */
    getDescription: function( balloon, isDragged ) {
      var locationDescription = this.getBalloonLocationDescription( balloon, false );
      var chargeDescription = this.getBalloonChargeDescription( balloon, false );

      // if picked up for dragging, the navigation cue changes to describe the interaction
      if ( isDragged ) {
        return StringUtils.format( balloonGrabbedDescriptionPatternString, grabbedString, locationDescription, chargeDescription, dragNavigationCueString );
      }
      else {
        return StringUtils.format( balloonDescriptionPatternString, locationDescription, chargeDescription, grabButtonNavigationCueString );
      }
    },

    /**
     * Reset all key counters used for hysteresis when checking balloon
     */
    resetKeyCounts: function() {
      var self = this;
      for ( var key in self.movementCountMap ) {
        if ( self.movementCountMap.hasOwnProperty( key ) ) {
          self.movementCountMap[ key ] = 0;
        }
      }
    },

    /**
     * Reset all flags that monitor the balloon and define hysteresis for descriptions.
     * @public
     */
    reset: function() {
      this.resetKeyCounts();

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
     * @return {string}
     */
    getReleaseDescription: function() {

      var descriptionString = '';
      if ( this.balloon.chargeProperty.get() === 0 ) {

        // when the charge is zero, we want to hear the balloon Label, release position, no change in position,
        // no change in charges, button label
        descriptionString = StringUtils.format( balloonReleasedNoChangePatternString, noChangeInPositionOrChargeString );
      }
      else if ( this.balloon.touchingWall() ) {
        var touchingWallDescription = this.getTouchingWallDescription( this.balloon );
        descriptionString = StringUtils.format( balloonReleasedNoChangePatternString, touchingWallDescription );
      }
      else if ( this.balloon.centerInSweater() ) {
        var stickingString = StringUtils.format( stickingToLocationPatternString, sweaterString );
        descriptionString = StringUtils.format( balloonReleasedNoChangePatternString, stickingString );
      }
      else {

        // otherwise, we want to hear direction and speed of balloon movement.
        var velocityDescription = this.getVelocityDescription();

        var attractedObject = this.getAttractedObject();

        // put it together
        descriptionString = StringUtils.format( balloonReleasedPatternString, velocityDescription, attractedObject );
      }

      return descriptionString;
    },

    getAttractedObject: function() {

      // determine which object the balloon is moving toward
      var attractedDirection = this.balloon.getAttractedDirection();

      var attractedObject;
      if ( attractedDirection === BalloonDirectionEnum.RIGHT ) {
        attractedObject = wallString;
      }
      else {
        attractedObject = sweaterString;
      }

      return attractedObject;
    },

    /**
     * Get a description of how the balloon changes when the wall is removed.
     *
     * @return {}
     */
    getWallRemovedDescription: function( wallRemoved ) {
      var wallRemovedFromPlayAreaAlert = wallRemoved ? wallRemovedString : wallAddedString;
      var balloonLabel = this.balloonLabelMap[ this.balloon.balloonLabel ];

      var velocityString = this.getVelocityDescription();
      var attractedObject = this.getAttractedObject();
      var velocityDescription = StringUtils.format( movesToObjectPatternString, velocityString, attractedObject );

      var balloonChargeDescription = this.getBalloonChargeDescription( this.balloon );
      var sweaterChargeDescription = this.getSweaterChargeDescription( this.balloon );

      var stringPattern = '{0} {1} {2} {3} {4} {5}';
      return StringUtils.format( stringPattern, wallRemovedFromPlayAreaAlert, balloonLabel, velocityDescription, stickingToSweaterString, balloonChargeDescription, sweaterChargeDescription );
    },

    /**
     * Return true when it is time to reset the dragging descriptions.
     * @return {boolean}
     */
    keyCountsNeedToBeReset: function() {

      var countsTooHigh = false;
      var self = this;

      // key counts need to be reset if any of of the counters are greater than 5
      for ( var key in this.movementCountMap ) {
        if ( self.movementCountMap.hasOwnProperty( key ) ) {

          if ( self.movementCountMap[ key ] > 5 ) {
            countsTooHigh = true;
          }
        }
      }

      return countsTooHigh || this.transitionedToNewArea;
    },

    /**
     * Get a description of how quickly the balloon moves to another object in the play area
     * as a function of the charge.
     * @param  {number} charge
     * @return {string}
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
    },
  } );
} );