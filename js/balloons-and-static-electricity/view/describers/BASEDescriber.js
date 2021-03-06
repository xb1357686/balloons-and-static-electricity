// Copyright 2017, University of Colorado Boulder

/**
 * Manages descriptions for the entire simulation Balloons and Static Electricity.  Has functions that put together
 * strings for descriptions that are used throughout several view types.
 * 
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var BASEA11yStrings = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEA11yStrings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PlayAreaMap = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/PlayAreaMap' );
  var Range = require( 'DOT/Range' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  // strings
  // play area grid strings
  var leftShoulderOfSweaterString = BASEA11yStrings.leftShoulderOfSweaterString;
  var leftArmOfSweaterString = BASEA11yStrings.leftArmOfSweaterString;
  var bottomLeftEdgeOfSweaterString = BASEA11yStrings.bottomLeftEdgeOfSweaterString;

  var upperLeftSideOfSweaterString = BASEA11yStrings.upperLeftSideOfSweaterString;
  var leftSideOfSweaterString = BASEA11yStrings.leftSideOfSweaterString;
  var lowerLeftSideOfSweaterString = BASEA11yStrings.lowerLeftSideOfSweaterString;

  var upperRightSideOfSweaterString = BASEA11yStrings.upperRightSideOfSweaterString;
  var rightSideOfSweaterString = BASEA11yStrings.rightSideOfSweaterString;
  var lowerRightSideOfSweater = BASEA11yStrings.lowerRightSideOfSweater;

  var rightShoulderOfSweaterString = BASEA11yStrings.rightShoulderOfSweaterString;
  var rightArmOfSweaterString = BASEA11yStrings.rightArmOfSweaterString;
  var lowerRightArmOfSweaterString = BASEA11yStrings.lowerRightArmOfSweaterString;

  var upperLeftSideOfPlayAreaString = BASEA11yStrings.upperLeftSideOfPlayAreaString;
  var leftSideOfPlayAreaString = BASEA11yStrings.leftSideOfPlayAreaString;
  var lowerLeftSideOfPlayAreaString = BASEA11yStrings.lowerLeftSideOfPlayAreaString;

  var upperCenterOfPlayAreaString = BASEA11yStrings.upperCenterOfPlayAreaString;
  var centerOfPlayAreaString = BASEA11yStrings.centerOfPlayAreaString;
  var lowerCenterOfPlayAreaString = BASEA11yStrings.lowerCenterOfPlayAreaString;

  var upperRightSideOfPlayAreaString = BASEA11yStrings.upperRightSideOfPlayAreaString;
  var rightSideOfPlayAreaString = BASEA11yStrings.rightSideOfPlayAreaString;
  var lowerRightSideOfPlayAreaString = BASEA11yStrings.lowerRightSideOfPlayAreaString;

  var upperWallString = BASEA11yStrings.upperWallString;
  var wallString = BASEA11yStrings.wallString;
  var lowerWallString = BASEA11yStrings.lowerWallString;

  var upperRightEdgeOfPlayAreaString = BASEA11yStrings.upperRightEdgeOfPlayAreaString;
  var rightEdgeOfPlayAreaString = BASEA11yStrings.rightEdgeOfPlayAreaString;
  var lowerRightEdgeOfPlayAreaString = BASEA11yStrings.lowerRightEdgeOfPlayAreaString;

  // charge strings
  var zeroString = BASEA11yStrings.zeroString;
  var aFewString = BASEA11yStrings.aFewString;
  var severalString = BASEA11yStrings.severalString;
  var manyString = BASEA11yStrings.manyString;
  var negativeString = BASEA11yStrings.negativeString;

  var eachBalloonString = BASEA11yStrings.eachBalloonString;
  var balloonNetChargePatternStringWithLabel = BASEA11yStrings.balloonNetChargePatternStringWithLabel;

  var landmarkNearSweaterString = BASEA11yStrings.landmarkNearSweaterString;
  var landmarkLeftEdgeString = BASEA11yStrings.landmarkLeftEdgeString;
  var landmarkNearUpperWallString = BASEA11yStrings.landmarkNearUpperWallString;
  var landmarkNearWallString = BASEA11yStrings.landmarkNearWallString;
  var landmarkNearLowerWallString = BASEA11yStrings.landmarkNearLowerWallString;
  var landmarkVeryCloseToUpperWallString = BASEA11yStrings.landmarkVeryCloseToUpperWallString;
  var landmarkVeryCloseToLowerWallString = BASEA11yStrings.landmarkVeryCloseToLowerWallString;
  var landmarkVeryCloseToWallString = BASEA11yStrings.landmarkVeryCloseToWallString;
  var landmarkVeryCloseToRightEdgeString = BASEA11yStrings.landmarkVeryCloseToRightEdgeString;
  var landmarkVeryCloseToUpperRightEdgeString = BASEA11yStrings.landmarkVeryCloseToUpperRightEdgeString;
  var landmarkVeryCloseToLowerRightEdgeString = BASEA11yStrings.landmarkVeryCloseToLowerRightEdgeString;
  var landmarkVeryCloseToSweaterString = BASEA11yStrings.landmarkVeryCloseToSweaterString;
  var landmarkNearUpperRightEdgeString = BASEA11yStrings.landmarkNearUpperRightEdgeString;
  var landmarkNearRightEdgeString = BASEA11yStrings.landmarkNearRightEdgeString;
  var landmarkNearLowerRightEdgeString = BASEA11yStrings.landmarkNearLowerRightEdgeString;
  var landmarkAtCenterPlayAreaString = BASEA11yStrings.landmarkAtCenterPlayAreaString;
  var landmarkAtUpperCenterPlayAreaString = BASEA11yStrings.landmarkAtUpperCenterPlayAreaString;
  var landmarkAtLowerCenterPlayAreaString = BASEA11yStrings.landmarkAtLowerCenterPlayAreaString;

  var upString = BASEA11yStrings.upString;
  var leftString = BASEA11yStrings.leftString;
  var downString = BASEA11yStrings.downString;
  var rightString = BASEA11yStrings.rightString;
  var upAndToTheRightString = BASEA11yStrings.upAndToTheRightString;
  var upAndToTheLeftString = BASEA11yStrings.upAndToTheLeftString;
  var downAndToTheRightString = BASEA11yStrings.downAndToTheRightString;
  var downAndToTheLeftString = BASEA11yStrings.downAndToTheLeftString;

  // charge strings
  var summaryNeutralChargesPatternString = BASEA11yStrings.summaryNeutralChargesPatternString;
  var showingNoChargesString = BASEA11yStrings.showingNoChargesString;

  // constants
  var LOCATION_DESCRIPTION_MAP = {
    AT_LEFT_EDGE: {
      UPPER_PLAY_AREA: landmarkLeftEdgeString,
      CENTER_PLAY_AREA: landmarkLeftEdgeString,
      LOWER_PLAY_AREA: landmarkLeftEdgeString
    },
    LEFT_ARM: {
      UPPER_PLAY_AREA: leftShoulderOfSweaterString,
      CENTER_PLAY_AREA: leftArmOfSweaterString,
      LOWER_PLAY_AREA: bottomLeftEdgeOfSweaterString
    },
    LEFT_SIDE_OF_SWEATER: {
      UPPER_PLAY_AREA: upperLeftSideOfSweaterString,
      CENTER_PLAY_AREA: leftSideOfSweaterString,
      LOWER_PLAY_AREA: lowerLeftSideOfSweaterString
    },
    RIGHT_SIDE_OF_SWEATER: {
      UPPER_PLAY_AREA: upperRightSideOfSweaterString,
      CENTER_PLAY_AREA: rightSideOfSweaterString,
      LOWER_PLAY_AREA: lowerRightSideOfSweater
    },
    RIGHT_ARM: {
      UPPER_PLAY_AREA: rightShoulderOfSweaterString,
      CENTER_PLAY_AREA: rightArmOfSweaterString,
      LOWER_PLAY_AREA: lowerRightArmOfSweaterString
    },
    AT_VERY_CLOSE_TO_SWEATER: {
      UPPER_PLAY_AREA: landmarkVeryCloseToSweaterString,
      CENTER_PLAY_AREA: landmarkVeryCloseToSweaterString,
      LOWER_PLAY_AREA: landmarkVeryCloseToSweaterString      
    },
    AT_NEAR_SWEATER: {
      UPPER_PLAY_AREA: landmarkNearSweaterString,
      CENTER_PLAY_AREA: landmarkNearSweaterString,
      LOWER_PLAY_AREA: landmarkNearSweaterString 
    },
    LEFT_PLAY_AREA: {
      UPPER_PLAY_AREA: upperLeftSideOfPlayAreaString,
      CENTER_PLAY_AREA: leftSideOfPlayAreaString,
      LOWER_PLAY_AREA: lowerLeftSideOfPlayAreaString
    },
    AT_CENTER_PLAY_AREA: {
      UPPER_PLAY_AREA: landmarkAtUpperCenterPlayAreaString,
      CENTER_PLAY_AREA: landmarkAtCenterPlayAreaString,
      LOWER_PLAY_AREA: landmarkAtLowerCenterPlayAreaString
    },
    CENTER_PLAY_AREA: {
      UPPER_PLAY_AREA: upperCenterOfPlayAreaString,
      CENTER_PLAY_AREA: centerOfPlayAreaString,
      LOWER_PLAY_AREA: lowerCenterOfPlayAreaString
    },
    RIGHT_PLAY_AREA: {
      UPPER_PLAY_AREA: upperRightSideOfPlayAreaString,
      CENTER_PLAY_AREA: rightSideOfPlayAreaString,
      LOWER_PLAY_AREA: lowerRightSideOfPlayAreaString
    },
    AT_NEAR_WALL: {
      UPPER_PLAY_AREA: landmarkNearUpperWallString,
      CENTER_PLAY_AREA: landmarkNearWallString,
      LOWER_PLAY_AREA: landmarkNearLowerWallString
    },
    AT_VERY_CLOSE_TO_WALL: {
      UPPER_PLAY_AREA: landmarkVeryCloseToUpperWallString,
      CENTER_PLAY_AREA: landmarkVeryCloseToWallString,
      LOWER_PLAY_AREA: landmarkVeryCloseToLowerWallString,
    },
    AT_WALL: {
      UPPER_PLAY_AREA: upperWallString,
      CENTER_PLAY_AREA: wallString,
      LOWER_PLAY_AREA: lowerWallString
    },
    WALL: {
      UPPER_PLAY_AREA: upperWallString,
      CENTER_PLAY_AREA: wallString,
      LOWER_PLAY_AREA: lowerWallString
    },
    AT_NEAR_RIGHT_EDGE: {
      UPPER_PLAY_AREA: landmarkNearUpperRightEdgeString,
      CENTER_PLAY_AREA: landmarkNearRightEdgeString,
      LOWER_PLAY_AREA: landmarkNearLowerRightEdgeString
    },
    AT_VERY_CLOSE_TO_RIGHT_EDGE: {
      UPPER_PLAY_AREA: landmarkVeryCloseToUpperRightEdgeString,
      CENTER_PLAY_AREA: landmarkVeryCloseToRightEdgeString,
      LOWER_PLAY_AREA: landmarkVeryCloseToLowerRightEdgeString
    },
    RIGHT_EDGE: {
      UPPER_PLAY_AREA: upperRightEdgeOfPlayAreaString,
      CENTER_PLAY_AREA: rightEdgeOfPlayAreaString,
      LOWER_PLAY_AREA: lowerRightEdgeOfPlayAreaString
    },
    AT_RIGHT_EDGE: {
      UPPER_PLAY_AREA: upperRightEdgeOfPlayAreaString,
      CENTER_PLAY_AREA: rightEdgeOfPlayAreaString,
      LOWER_PLAY_AREA: lowerRightEdgeOfPlayAreaString
    }
  };

  // constants - ranges to describe relative charges in various objects
  var RELATIVE_CHARGE_DESCRIPTION_MAP = {
    NO_MORE_RANGE: {
      range: new Range( 0, 0 ),
      description: zeroString
    },
    A_FEW_RANGE: {
      range: new Range( 1, 15 ),
      description: aFewString
    },
    SEVERAL_RANGE: {
      range: new Range( 15, 40 ),
      description: severalString
    },
    MANY_RANGE: {
      range: new Range( 40, 57 ),
      description: manyString
    }
  };

  // maps  direction to a description string
  var DIRECTION_MAP = {
    UP: upString,
    DOWN: downString,
    LEFT: leftString,
    RIGHT: rightString,
    UP_RIGHT: upAndToTheRightString,
    UP_LEFT: upAndToTheLeftString,
    DOWN_RIGHT: downAndToTheRightString,
    DOWN_LEFT: downAndToTheLeftString
  };

  function BASEDescriber() {
    // TODO: Does this really need a type? Or can it be a static Object?
  }

  balloonsAndStaticElectricity.register( 'BASEDescriber', BASEDescriber );

  return inherit( Object, BASEDescriber, {}, {

    /**
     * Get the location description for the balloon. This is not a full description, but a short
     * descsription. Regions are defined in PlayAreaMap.  This will get called very often and needs to be quick.
     * 
     * @param {Vector2} location - location of the balloon, relative to its center
     * @return {string}
     */
    getLocationDescription: function( location, wallVisible ) {

      var landmarks = PlayAreaMap.LANDMARK_RANGES;
      var columns = PlayAreaMap.COLUMN_RANGES;
      var locations = PlayAreaMap.X_LOCATIONS;
      var rows = PlayAreaMap.ROW_RANGES;

      // loop through keys manually to prevent a many closures from being created during object iteration in 'for in'
      // loops
      var columnsKeys = Object.keys( columns );
      var rowKeys = Object.keys( rows );
      var landmarkKeys = Object.keys( landmarks );
      var locationKeys = Object.keys( locations );

      var i;
      var currentLocation;
      var currentLandmark;
      var currentColumn;
      var currentRow;

      // critical x locations take priority, start there
      for ( i = 0; i < locationKeys.length; i++ ) {
        if ( location.x === locations[ locationKeys[ i ] ] ) {
          currentLocation = locationKeys[ i ];
        }
      }

      for ( i = 0; i < landmarkKeys.length; i++ ) {
        if ( landmarks[ landmarkKeys[ i ] ].contains( location.x ) ) {
          currentLandmark = landmarkKeys[ i ];
        }
      }

      // landmark takes priority - only find column if we couldn't find landmark
      if ( !currentLandmark ) {
        for ( i = 0; i < columnsKeys.length; i++ ) {
          if ( columns[ columnsKeys[ i ] ].contains( location.x ) ) {
            currentColumn = columnsKeys[ i ];
          }
        }
      }
      for ( i = 0; i < rowKeys.length; i++ ) {
        if ( rows[ rowKeys[ i ] ].contains( location.y ) ) {
          currentRow = rowKeys[ i ];
        }
      }

      // use location, column, or landmark, whichever was found, prioritizing location
      currentColumn = currentLocation || currentLandmark || currentColumn;
      assert && assert( currentColumn && currentRow, 'item should be in a row or column of the play area' );

      // the wall and the right edge of the play area overlap, so if the wall is visible, chose that description
      // TODO: probably a better way to do this
      if ( wallVisible && ( currentColumn === 'RIGHT_EDGE' || currentColumn === 'AT_RIGHT_EDGE' ) ) {
        currentColumn = 'WALL';
      }
      if ( !wallVisible && BASEDescriber.inWallColumn( currentColumn ) ) {
        currentColumn = 'RIGHT_PLAY_AREA';
      }

      return LOCATION_DESCRIPTION_MAP[ currentColumn ][ currentRow ];
    },

    /**
     * Returns whether or not the column is in one of the 'wall' columns, could  be at, near, or very close to wall.
     * @private
     *
     * @param {string} column - one of keys in LOCATION_DESCRIPTION_MAP
     * @return {boolean}
     */
    inWallColumn: function( column ) {
      return ( column === 'AT_WALL' || column === 'AT_NEAR_WALL' || column === 'WALL' || column === 'AT_VERY_CLOSE_TO_WALL' );
    },

    /**
     * Get a fragment that describes the relative charge for an objet, like 'a few' or 'several', to be used in 
     * string patterns
     * 
     * @param  {number} charge
     * @return {string}
     */
    getRelativeChargeDescription: function( charge ) {

      // the description is mapped to the absolute value of charge
      var absCharge = Math.abs( charge );

      var keys = Object.keys( RELATIVE_CHARGE_DESCRIPTION_MAP );

      var description;

      for ( var i = 0; i < keys.length; i++ ) {
        var value = RELATIVE_CHARGE_DESCRIPTION_MAP[ keys[ i ] ];
        if ( value.range.contains( absCharge ) ) {
          description = value.description;
          break;
        }
      }

      assert && assert( description, 'no relative description found for charge value, check value or entries in description map' );
      return description;
    },

    /**
     * For a given charge, get the described range. Useful for comparing ranges before and after
     * a charge pickup. Descriptions are generated relative to the absolute value of the charge.
     * 
     * @param  {number} charge
     * @return {Range}
     */
    getDescribedChargeRange: function( charge ) {

      var describedCharge = Math.abs( charge );
      var keys = Object.keys( RELATIVE_CHARGE_DESCRIPTION_MAP );

      var range;
      for ( var i = 0; i < keys.length; i++ ) {
        var value = RELATIVE_CHARGE_DESCRIPTION_MAP[ keys[ i ] ];
        if ( value.range.contains( describedCharge ) ) {
          range = value.range;
          break;
        }
      }

      assert && assert( range, 'no charge range found for charge ' + charge );
      return range;
    },

    /**
     * Get a direction description from one of BalloonDirectionEnum. Something like down', or 'up and to the left'.
     * @public
     *
     * @param {string} direction - one of BalloonDirectionEnum
     * @return {string}
     */
    getDirectionDescription: function( direction )  {
      return DIRECTION_MAP[ direction ];
    },

    /**
     * Get a description of the net charge for each balloon, including the label 'Each balloon'. Will return something
     * like
     * "Each balloon has negative net charge." or
     * "Each balloon has zero net charge."
     *
     * @return {string}
     */
    getNetChargeDescriptionWithLabel: function( charge ) {
      var chargeAmountString = charge < 0 ? negativeString : zeroString;
      return StringUtils.fillIn( balloonNetChargePatternStringWithLabel, {
        chargeAmount: chargeAmountString,
        balloon: eachBalloonString
      } );
    },

    /**
     * Get a description for the charges shown when the object is neutral. When neutral, the object will either be
     * showing no charges, or showing "{{many}} pairs of negative and positive charges". Will return something like
     *
     * "no charges shown" or
     * "showing many pairs of positive and negative charges"
     *
     * @param {string} chargesShown
     * @param {number} numberOfCharges
     * @return {string}
     */
    getNeutralChargesShownDescription: function( chargesShown, numberOfCharges ) {
      var description;

      var relativeCharge = BASEDescriber.getRelativeChargeDescription( numberOfCharges );
      if ( chargesShown === 'all' )  {
        description = StringUtils.fillIn( summaryNeutralChargesPatternString, {
          amount: relativeCharge
        } );
      }
      else {
        description = showingNoChargesString;
      }

      return description;
    },

    RELATIVE_CHARGE_DESCRIPTION_MAP: RELATIVE_CHARGE_DESCRIPTION_MAP
  } );
} );
