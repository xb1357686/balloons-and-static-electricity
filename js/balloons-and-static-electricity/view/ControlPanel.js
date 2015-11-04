// Copyright 2002-2013, University of Colorado Boulder

/**
 * buttons and model control elements
 * Author: Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var Panel = require( 'SUN/Panel' );
  var VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );
  var MultiLineText = require( 'SCENERY_PHET/MultiLineText' );
  var ToggleNode = require( 'SUN/ToggleNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  var AccessiblePeer = require( 'SCENERY/accessibility/AccessiblePeer' );

  // images
  var balloonGreen = require( 'image!BALLOONS_AND_STATIC_ELECTRICITY/balloon-green.png' );
  var balloonYellow = require( 'image!BALLOONS_AND_STATIC_ELECTRICITY/balloon-yellow.png' );

  // strings
  var addWallString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/addWall' );
  var removeWallString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/removeWall' );
  var showAllChargesString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/BalloonApplet.ShowAllCharges' );
  var showNoChargesString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/BalloonApplet.ShowNoCharges' );
  var showChargeDifferencesString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/BalloonApplet.ShowChargeDifferences' );
  var resetBalloonString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/resetBalloon' );
  var resetBalloonsString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/resetBalloons' );

  function ControlPanel( model, layoutBounds ) {

    // super constructor
    Node.call( this );

    // Add/Remove wall button.
    var addRemoveFont = new PhetFont( 18 );
    var addWallText = new MultiLineText( addWallString, { font: addRemoveFont } );
    var removeWallText = new MultiLineText( removeWallString, { font: addRemoveFont, center: addWallText.center } );
    var wallToggleNode = new ToggleNode( removeWallText, addWallText, model.wall.isVisibleProperty );
    var wallButton = new RectangularPushButton( {
        content: wallToggleNode,
        baseColor: 'rgb( 255, 200, 0 )',
        listener: function() { model.wall.isVisible = !model.wall.isVisible; }
      }
    );

    // Radio buttons related to charges
    var radioButtonFont = new PhetFont( 15 );
    var showChargesRadioButtonGroup = new VerticalAquaRadioButtonGroup( [
      {
        node: new Text( showAllChargesString, { font: radioButtonFont } ),
        property: model.showChargesProperty,
        value: 'all'
      },
      {
        node: new Text( showNoChargesString, { font: radioButtonFont } ),
        property: model.showChargesProperty,
        value: 'none'
      },
      {
        node: new Text( showChargeDifferencesString, { font: radioButtonFont } ),
        property: model.showChargesProperty,
        value: 'diff'
      }
    ] );

    // Radio buttons for selecting 1 vs 2 balloons
    var scale = 0.14;
    var yellowBalloonImage = new Image( balloonYellow );
    var twoBalloonIcon = new Node( {
      children: [
        new Image( balloonGreen, { x: 160 } ),
        yellowBalloonImage
      ], scale: scale
    } );

    var oneBalloonIcon = new Node( {
      children: [
        new Image( balloonYellow, { x: twoBalloonIcon.width / scale / 2 - yellowBalloonImage.width / 2 } ),
        new Rectangle( 0, 0, twoBalloonIcon.width / scale, twoBalloonIcon.height / scale, {
          fill: 'black',
          visible: false
        } )
      ], scale: scale
    } );

    var showBalloonsChoice = new RadioButtonGroup( model.balloons[ 1 ].isVisibleProperty, [
      { value: false, node: oneBalloonIcon },
      { value: true, node: twoBalloonIcon }
    ], {
      orientation: 'horizontal',
      baseColor: 'white',
      spacing: 5
    } );

    // 'Reset Balloons' button
    var resetBalloonToggleNode = new ToggleNode(
      new Text( resetBalloonsString, { font: new PhetFont( 15 ) } ),
      new Text( resetBalloonString, { font: new PhetFont( 15 ) } ),
      model.balloons[ 1 ].isVisibleProperty
    );
    var resetBalloonButton = new RectangularPushButton( {
      content: resetBalloonToggleNode,
      buttonValue: resetBalloonString,
      baseColor: 'rgb( 255, 200, 0 )',
      listener: function() {
        model.sweater.reset();
        model.balloons.forEach( function( entry ) {
          entry.reset( true );
        } );
      }
    } );

    var balloonsPanel = new VBox( { spacing: 2, children: [ showBalloonsChoice, resetBalloonButton ] } );

    //Add the controls at the right, with the reset all button and the wall button
    var resetAllButton = new ResetAllButton( { listener: model.reset.bind( model ), scale: 0.96 } );
    var controls = new HBox( {
      spacing: 16,
      align: 'bottom',
      children: [ resetAllButton, wallButton ]
    } );

    controls.right = layoutBounds.maxX - 2;
    controls.bottom = layoutBounds.maxY - 4;

    this.addChild( new HBox( {
      spacing: 35,
      children: [ new Panel( showChargesRadioButtonGroup ), balloonsPanel ],
      align: 'bottom',
      left: 70,
      bottom: layoutBounds.maxY - 4
    } ) );
    this.addChild( controls );

    // outfit elements of the control panel with accessible content

    // VerticalAquaRadioButtonGroup is unstable.  Defining accessible content here until that sun element is more
    // stable.
    showChargesRadioButtonGroup.accessibleContent = {
      createPeer: function( accessibleInstance ) {
        /*
         * The content should look like the following in the parallel DOM:
         * <div> </div> // TODO: Update once you know what this should be.
         */
        var domElement = document.createElement( 'div' );
        domElement.tabIndex = '0';
        domElement.className = 'ControlPanel';

        // TODO: Implement drag and drop behavior for balloons
        return new AccessiblePeer( accessibleInstance, domElement );
      }
    };

    // provide the restBalloonButton with the o

    showBalloonsChoice.accessibleContent = {
      createPeer: function( accessibleInstance ) {
        /*
         * The content should look like the following in the parallel DOM:
         * <div> </div> // TODO: Update once you know what this should be.
         */
        var domElement = document.createElement( 'div' );
        domElement.tabIndex = '0';
        domElement.className = 'ControlPanel';

        // TODO: Implement drag and drop behavior for balloons
        return new AccessiblePeer( accessibleInstance, domElement );

      }
    };

    // define the navigation order for accessible content in the control panel.
    this.accessibleOrder = [ showChargesRadioButtonGroup, showBalloonsChoice, resetBalloonButton, wallButton, resetAllButton ];

  }

  inherit( Node, ControlPanel );

  return ControlPanel;
} );