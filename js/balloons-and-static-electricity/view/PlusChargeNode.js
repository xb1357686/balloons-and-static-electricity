// Copyright 2013-2017, University of Colorado Boulder

/**
 * Scenery display object (scene graph node) for the plusCharge.
 *
 @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PointChargeModel = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/PointChargeModel' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  var RADIUS = PointChargeModel.RADIUS;

  //Scale up before rasterization so it won't be too pixellated/fuzzy
  var scale = 2;
  var plusChargeNode = new Node( {
    children: [
      new Circle( RADIUS, {
        x: 0, y: 0,
        fill: new RadialGradient( 2, -3, 2, 2, -3, 7 )
          .addColorStop( 0, '#f97d7d' )
          .addColorStop( 0.5, '#ed4545' )
          .addColorStop( 1, '#f00' )
      } ),

      new Rectangle( 0, 0, 11, 2, {
        fill: 'white',
        centerX: 0,
        centerY: 0
      } ),

      new Rectangle( 0, 0, 2, 11, {
        fill: 'white',
        centerX: 0,
        centerY: 0
      } )
    ], scale: scale
  } );

  var node = new Node();
  plusChargeNode.toImage( function( im ) {
    //Scale back down so the image will be the desired size
    node.children = [ new Image( im, { scale: 1.0 / scale } ) ];
  } );

  /**
   * @constructor
   * @param {Vector2} location
   * @pararm {Tandem} tandem
   */
  function PlusChargeNode( location, tandem ) {

    Node.call( this, { pickable: false, tandem: tandem } );

    this.translate( location.x - RADIUS, location.y - RADIUS );

    this.addChild( node );
  }

  balloonsAndStaticElectricity.register( 'PlusChargeNode', PlusChargeNode );

  return inherit( Node, PlusChargeNode );
} );
