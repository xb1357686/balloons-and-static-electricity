// Copyright 2016-2017, University of Colorado Boulder

/**
 * Possible locations of the balloon in Balloons and Static Electricity.  In addition, there are more values that
 * signify when the balloon is along a certain object or edge of the play area.
 *
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );

  var BalloonLocationEnum = {
    TOP_RIGHT: 'TOP_RIGHT',
    UPPER_RIGHT: 'UPPER_RIGHT',
    LOWER_RIGHT: 'LOWER_RIGHT',
    BOTTOM_RIGHT: 'BOTTOM_RIGHT',
    TOP_RIGHT_PLAY_AREA: 'TOP_RIGHT_PLAY_AREA',
    UPPER_RIGHT_PLAY_AREA: 'UPPER_RIGHT_PLAY_AREA',
    LOWER_RIGHT_PLAY_AREA: 'LOWER_RIGHT_PLAY_AREA',
    BOTTOM_RIGHT_PLAY_AREA: 'BOTTOM_RIGHT_PLAY_AREA',
    TOP_CENTER_PLAY_AREA: 'TOP_CENTER_PLAY_AREA',
    UPPER_CENTER_PLAY_AREA: 'UPPER_CENTER_PLAY_AREA',
    LOWER_CENTER_PLAY_AREA: 'LOWER_CENTER_PLAY_AREA',
    BOTTOM_CENTER_PLAY_AREA: 'BOTTOM_CENTER_PLAY_AREA',
    TOP_LEFT_PLAY_AREA: 'TOP_LEFT_PLAY_AREA',
    UPPER_LEFT_PLAY_AREA: 'UPPER_LEFT_PLAY_AREA',
    LOWER_LEFT_PLAY_AREA: 'LOWER_LEFT_PLAY_AREA',
    BOTTOM_LEFT_PLAY_AREA: 'BOTTOM_LEFT_PLAY_AREA',
    TOP_RIGHT_ARM: 'TOP_RIGHT_ARM',
    UPPER_RIGHT_ARM: 'UPPER_RIGHT_ARM',
    LOWER_RIGHT_ARM: 'LOWER_RIGHT_ARM',
    BOTTOM_RIGHT_ARM: 'BOTTOM_RIGHT_ARM',
    TOP_RIGHT_SWEATER: 'TOP_RIGHT_SWEATER',
    UPPER_RIGHT_SWEATER: 'UPPER_RIGHT_SWEATER',
    LOWER_RIGHT_SWEATER: 'LOWER_RIGHT_SWEATER',
    BOTTOM_RIGHT_SWEATER: 'BOTTOM_RIGHT_SWEATER',
    TOP_LEFT_SWEATER: 'TOP_LEFT_SWEATER',
    UPPER_LEFT_SWEATER: 'UPPER_LEFT_SWEATER',
    LOWER_LEFT_SWEATER: 'LOWER_LEFT_SWEATER',
    BOTTOM_LEFT_SWEATER: 'BOTTOM_LEFT_SWEATER',
    TOP_LEFT_ARM: 'TOP_LEFT_ARM',
    UPPER_LEFT_ARM: 'UPPER_LEFT_ARM',
    LOWER_LEFT_ARM: 'LOWER_LEFT_ARM',
    BOTTOM_LEFT_ARM: 'BOTTOM_LEFT_ARM',
    BOTTOM_LEFT: 'BOTTOM_LEFT',
    LOWER_LEFT: 'LOWER_LEFT',
    UPPER_LEFT: 'UPPER_LEFT',
    TOP_LEFT: 'TOP_LEFT',

    LEFT_EDGE: 'LEFT_EDGE',
    RIGHT_EDGE: 'RIGHT_EDGE',
    TOP_EDGE: 'TOP_EDGE',
    BOTTOM_EDGE: 'BOTTOM_EDGE',
    AT_WALL: 'AT_WALL',
    ON_SWEATER: 'ON_SWEATER',
    CENTER_PLAY_AREA: 'CENTER_PLAY_AREA'
  };

  // verify that enum is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( BalloonLocationEnum ); }

  balloonsAndStaticElectricity.register( 'BalloonLocationEnum', BalloonLocationEnum );

  return BalloonLocationEnum;
} );
