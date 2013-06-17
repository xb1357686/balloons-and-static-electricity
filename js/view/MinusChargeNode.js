// Copyright 2002-2013, University of Colorado

/**
 * Scenery display object (scene graph node) for minusCharge.
 *
 @author Vasily Shakhov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var PointChargeModel = require( 'model/PointChargeModel' );
  var Image = require( 'SCENERY/nodes/Image' );

  var radius = PointChargeModel.radius;

  var minusChargeNode = new Node( {
    children: [
      new Circle( radius, {
        x: 0, y: 0,
        fill: new RadialGradient( 2, -3, 2, 2, -3, 7 )
          .addColorStop( 0, '#fff' )
          .addColorStop( 0.5, '#6cd0f5' )
          .addColorStop( 1, '#00a9e8' )
      } ),

      new Rectangle( 0, 0, 11, 2, {
        fill: 'white',
        centerX: 0,
        centerY: 0
      } )
    ]
  } );

  var node = new Node();
  minusChargeNode.toImage( function( im ) {
    node.children = [new Image( im )];
  } );

  function MinusChargeNode( location ) {

    // super constructor
    // Use svg for the shape and text
    Node.call( this, {pickable: false} );

    this.translate( location.x - radius, location.y - radius );

    this.addChild( node );
  }

  inherit( Node, MinusChargeNode ); // prototype chaining

  return MinusChargeNode;
} );
