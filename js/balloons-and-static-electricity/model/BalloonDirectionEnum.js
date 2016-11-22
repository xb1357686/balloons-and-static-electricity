// Copyright 2016, University of Colorado Boulder

/**
 * Possible directions for the balloon in Balloons and Static Electricity, balloon can move up, down, left, right,
 * and along the diagonals of these orientations.
 *
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );

  var BalloonDirectionEnum = {
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    RIGHT_WALL: 'RIGHT_WALL',
    RIGHT_NO_WALL: 'RIGHT_NO_WALL',
    UP: 'UP',
    DOWN: 'DOWN',
    UP_LEFT: 'UP_LEFT',
    UP_RIGHT: 'UP_RIGHT',
    DOWN_LEFT: 'DOWN_LEFT',
    DOWN_RIGHT: 'DOWN_RIGHT'
  };

  // verify that enum is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( BalloonDirectionEnum ); }

  balloonsAndStaticElectricity.register( 'BalloonDirectionEnum', BalloonDirectionEnum );

  return BalloonDirectionEnum;
} );
