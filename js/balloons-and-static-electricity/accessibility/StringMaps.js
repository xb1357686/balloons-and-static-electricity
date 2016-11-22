// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );

  // strings
  // TODO: bring in from translatable strings file once we are happy with results

  // strings for direction map
  var upString = 'Up.';
  var downString = 'Down.';
  var rightString = 'Right.';
  var leftString = 'Left.';
  var upAndRightString = 'up and to the right';
  var upAndLeftString = 'up and to the left';
  var downAndRightString = 'down and to the right';
  var downAndLeftString = 'down and to the left';

  // towards descriptions
  var towardsTopString = 'Towards top.';
  var towardsSweaterString = 'Towards sweater.';
  var towardsBottomString = 'Towards bottom.';
  var towardsWallString = 'Towards wall.';
  var towardsRightSideOfPlayAreaString = 'Towards right side of play area';

  // closer descriptions
  var closerToTopString = 'Closer to top.';
  var closerToSweaterString = 'Closer to sweater.';
  var closerToBottomString = 'Closer to bottom.';
  var closerToWallString = 'Closer to wall.';
  var closerToRightSideOfPlayAreaString = 'Closer to right side of play area.';

  var StringMaps = {

    // map of directions
    DIRECTION_MAP: {
      UP: upString,
      DOWN: downString,
      LEFT: leftString,
      RIGHT: rightString,
      UP_RIGHT: upAndRightString,
      UP_LEFT: upAndLeftString,
      DOWN_RIGHT: downAndRightString,
      DOWN_LEFT: downAndLeftString
    },

    // map of objects the balloon is moving toward, dependent on direction and
    // whether or not the wall is visible
    TOWARDS_OBJECT_MAP: {
      UP: towardsTopString,
      DOWN: towardsBottomString,
      LEFT: towardsSweaterString,
      RIGHT_WALL: towardsWallString,
      RIGHT_SIDE: towardsRightSideOfPlayAreaString
    },

    CLOSER_OBJECT_MAP: {
      UP: closerToTopString,
      DOWN: closerToBottomString,
      LEFT: closerToSweaterString,
      RIGHT_WALL: closerToWallString,
      RIGHT_SIDE: closerToRightSideOfPlayAreaString
    }
  };

  balloonsAndStaticElectricity.register( 'StringMaps', StringMaps );

  return StringMaps;
} );