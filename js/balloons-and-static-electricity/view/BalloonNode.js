// Copyright 2013-2017, University of Colorado Boulder

/**
 * Scenery display object (scene graph node) for the Balloon of the model.
 *
 * Accessible content for BalloonNode acts as a container for the button and application div, which are provided by
 * children of this node.  Beware that changing the scene graph under this node will change the structure of the
 * accessible content.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var BalloonDescriber = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/describers/BalloonDescriber' );
  var BalloonDirectionEnum = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/BalloonDirectionEnum' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var BASEA11yStrings = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEA11yStrings' );
  var BASEConstants = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEConstants' );
  var BASEQueryParameters = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEQueryParameters' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Emitter = require( 'AXON/Emitter' );
  var FocusHighlightFromNode = require( 'SCENERY/accessibility/FocusHighlightFromNode' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var KeyboardDragListener = require( 'SCENERY_PHET/accessibility/listeners/KeyboardDragListener' );
  var KeyboardUtil = require( 'SCENERY/accessibility/KeyboardUtil' );
  var Line = require( 'SCENERY/nodes/Line' );
  var MinusChargeNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/MinusChargeNode' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PlayAreaMap = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/PlayAreaMap' );
  var PlusChargeNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/PlusChargeNode' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Timer = require( 'PHET_CORE/Timer' );
  var Utterance = require( 'SCENERY_PHET/accessibility/Utterance' );
  var utteranceQueue = require( 'SCENERY_PHET/accessibility/utteranceQueue' );
  var Vector2 = require( 'DOT/Vector2' );

  // a11y - critical x locations for the balloon
  var X_LOCATIONS = PlayAreaMap.X_LOCATIONS;

  var DESCRIPTION_REFRESH_RATE = 2000; // in ms
  var RELEASE_DESCRIPTION_REFRESH_RATE = 5000; // in ms
  var RELEASE_DESCRIPTION_TIME_DELAY = 25; // in ms
  var RELEASE_DESCRIPTION_TIME_DELAY_NO_MOVEMENT = 500;

  // strings
  var grabBalloonPatternString = BASEA11yStrings.grabBalloonPatternString;
  var grabBalloonHelpString = BASEA11yStrings.grabBalloonHelpString;

  /**
   * Constructor for the balloon
   *
   * @param  {number} x
   * @param  {number} y
   * @param  {BalloonModel} model
   * @param  {Image} imgsrc - image source from the image plugin
   * @param  {BASEModel} globalModel
   * @param  {Tandem} tandem
   * @constructor
   */
  function BalloonNode( x, y, model, imgsrc, globalModel, accessibleLabelString, tandem, options ) {
    var self = this;

    // @public (a11y) - emits an event when the balloon receives focus
    // TODO: should Accessibility.js emit events for such things?
    this.focusEmitter = new Emitter();
    this.blurEmitter = new Emitter();
    this.dragNodeFocusedEmitter = new Emitter();
    this.dragNodeBlurredEmitter = new Emitter();

    options = _.extend( {
      cursor: 'pointer',

      // a11y - this node will act as a container for more accessible content, its children will implement
      // most of the keyboard navigation
      parentContainerTagName: 'div',
      tagName: 'div',
      labelTagName: 'h3',
      accessibleLabel: accessibleLabelString,
      prependLabels: true
    }, options );

    // super constructor
    Node.call( this, options );

    this.x = x;
    this.y = y;

    // @private
    this.model = model;
    this.globalModel = globalModel;

    // @public (a11y, read-only) - increments when there is a successful drag interaction with the keyboard,
    // used by the BalloonInteractionCueNode
    this.keyboardDragCount = 0;

    var accessibleButtonLabel = StringUtils.fillIn( grabBalloonPatternString, {
      balloon: accessibleLabelString
    } );

    // a11y - a type that generates descriptions for the balloon 
    this.describer = new BalloonDescriber( globalModel, globalModel.wall, model, accessibleLabelString );

    // @private (a11y) - if this time is greater than DESCRIPTION_REFRESH_RATE and the balloon
    // is moving due to an applied force, we will alert a new description, intially the refresh rate
    // so that the first movement is described
    this.timeSincePositionAlert = DESCRIPTION_REFRESH_RATE; // in ms

    this.timeSinceReleaseAlert = 0;

    // @private (a11y) {boolean} - a flag that manages whether or not we should alert the first charge pickup of the
    // balloon, will be set to true every time the balloon enters or leaves the sweater
    this.alertFirstPickup = false;

    // @private (a11y) {boolean} - a flag that manages how often we should announce a charge
    // pickup alert, every time the balloon moves, this is reset (only want to anounce charges
    // when balloon moves)
    this.alertNextPickup = false;

    // @public (a11y) - a flag that tracks if the initial movmement of the balloon after release has
    // been described. Gets reset whenever the balloon is picked up, and when the wall is removed while
    // the balloon is sticking to the wall
    this.initialMovementDescribed = false;

    // @rivate (a11y) - whether or not we describe direction changes. Between when the balloon is
    // released and the release is first described, we do not describe changes to direction because it is built into the
    // release alert
    this.describeDirection = true;

    var originalChargesNode = new Node( {
      pickable: false,
      tandem: tandem.createTandem( 'originalChargesNode' )
    } );
    var addedChargesNode = new Node( { pickable: false, tandem: tandem.createTandem( 'addedChargesNode' ) } );

    var property = {

      //Set only to the legal positions in the frame
      set: function( location ) { model.locationProperty.set( globalModel.checkBalloonRestrictions( location, model.width, model.height ) ); },

      //Get the location of the model
      get: function() { return model.locationProperty.get(); }
    };

    // called when dragging starts
    this.chargeOnStart = model.chargeProperty.get();
    this.dragStarted = false;
    var startDragListener = function() {
      self.describeWallRub = true;
      self.chargeOnStart = model.chargeProperty.get();
      self.dragStarted = true;
    };

    var endDragListener = function() {
      model.isDraggedProperty.set( false );
      model.velocityProperty.set( new Vector2( 0, 0 ) );
      model.dragVelocityProperty.set( new Vector2( 0, 0 ) );
    };

    //When dragging, move the balloon
    var dragHandler = new MovableDragHandler( property, {

      //When dragging across it in a mobile device, pick it up
      allowTouchSnag: true,
      startDrag: function() {
        model.isDraggedProperty.set( true );
        startDragListener();
      },
      endDrag: function() {
        endDragListener();
      },
      tandem: tandem.createTandem( 'dragHandler' )
    } );

    this.addInputListener( dragHandler );

    var balloonImageNode = new Image( imgsrc, {
      tandem: tandem.createTandem( 'balloonImageNode' ),
      pickable: false, // custom touch areas applied to parent

      // a11y
      parentContainerTagName: 'div',
      tagName: 'button',
      accessibleLabel: accessibleButtonLabel,
      accessibleDescription: grabBalloonHelpString
    } );

    // now add the balloon, so that the tether is behind it in the z order
    this.addChild( balloonImageNode );

    // custom elliptical touch/mouse areas so the balloon is easier to grab when under the other balloon
    this.mouseArea = Shape.ellipse( balloonImageNode.centerX, balloonImageNode.centerY, balloonImageNode.width / 2, balloonImageNode.height / 2, 0 );
    this.touchArea = this.mouseArea;

    // static charges
    var plusChargeNodesTandemGroup = tandem.createGroupTandem( 'plusChargeNodes' );
    var minusChargeNodesTandemGroup = tandem.createGroupTandem( 'minusChargeNodes' );
    for ( var i = 0; i < model.plusCharges.length; i++ ) {
      var plusChargeNode = new PlusChargeNode(
        model.plusCharges[ i ].location,
        plusChargeNodesTandemGroup.createNextTandem()
      );
      originalChargesNode.addChild( plusChargeNode );

      var minusChargeNode = new MinusChargeNode(
        model.minusCharges[ i ].location,
        minusChargeNodesTandemGroup.createNextTandem()
      );
      originalChargesNode.addChild( minusChargeNode );
    }

    //possible charges
    var addedNodes = []; // track in a local array to update visibility with charge
    var addedChargeNodesTandemGroup = tandem.createGroupTandem( 'addedChargeNodes' );
    for ( i = model.plusCharges.length; i < model.minusCharges.length; i++ ) {
      var addedMinusChargeNode = new MinusChargeNode(
        model.minusCharges[ i ].location,
        addedChargeNodesTandemGroup.createNextTandem()
      );
      addedMinusChargeNode.visible = false;
      addedChargesNode.addChild( addedMinusChargeNode );

      addedNodes.push( addedMinusChargeNode );
    }
    this.addChild( originalChargesNode );
    this.addChild( addedChargesNode );

    //if change charge, show more minus charges
    model.chargeProperty.link( function updateCharge( chargeVal ) {
      var numVisibleMinusCharges = Math.abs( chargeVal );

      for ( var i = 0; i < addedNodes.length; i++ ) {
        addedNodes[ i ].visible = i < numVisibleMinusCharges;
      }

      // a11y
      var alert;

      // the first charge pickup and subsequent pickups (behind a refresh rate)
      // should be alerted
      if ( self.alertNextPickup || self.alertFirstPickup ) {
        alert = self.describer.getChargePickupDescription( self.alertFirstPickup );
        utteranceQueue.addToBack( alert );
      }

      // always announce pickup of the last charge
      if ( Math.abs( chargeVal ) === BASEConstants.MAX_BALLOON_CHARGE ) {
        alert = self.describer.getLastChargePickupDescription();
        utteranceQueue.addToBack( alert );
      }

      // reset flags
      self.alertFirstPickup = false;
      self.alertNextPickup = false;
    } );

    // a11y - if we enter a landmark location while we are grabbed, that should be announced immediately
    model.playAreaLandmarkProperty.lazyLink( function( landmark ) {
      if ( landmark ) {
        if ( !model.isDraggedProperty.get() ) {

          // if balloon initially moving slowly, alert landmark with info about movement direction, and reset timer
          if ( self.describeContinuedMovement ) {
            var alert = self.describer.getContinuousReleaseDescription();
            utteranceQueue.addToBack( alert );

            self.timeSinceReleaseAlert = 0;
          }
        }
      }
    } );

    // a11y - if we enter/leave the sweater announce that immediately
    model.onSweaterProperty.link( function( onSweater ) {
      if ( model.isDraggedProperty.get() ) {
        utteranceQueue.addToBack( self.describer.getOnSweaterString( onSweater ) );
      }

      // entering sweater, indicate that we need to alert the next charge pickup
      self.alertFirstPickup = true;
    } );

    // a11y - when velocity hits zero when we are on the sweater or wall, describe that we are sticking
    // or touching these objects
    model.velocityProperty.link( function( velocity ) {
      if ( velocity.equals( Vector2.ZERO ) ) {
        if ( model.isDraggedProperty.get() ) {
          if ( model.onSweater() || model.touchingWall() ) {

            // while dragging, just attractive state and location 
            utteranceQueue.addToBack( self.describer.getAttractiveStateAndLocationDescriptionWithLabel() );
          }    
        }
        else if ( model.onSweater() ) {

          // if we stop on the sweater, announce that we are sticking to it
          utteranceQueue.addToBack( self.describer.getAttractiveStateAndLocationDescriptionWithLabel() );
        }
        else {

          // if we stop along anywhere else in the play area, describe that movement has stopped
          utteranceQueue.addToBack( self.describer.getMovementStopsDescription() );
        }
      }
    } );

    model.touchingWallProperty.lazyLink( function( touchingWall ) {
      if ( touchingWall && globalModel.showChargesProperty.get() === 'all' && model.isDraggedProperty.get() ) {
        utteranceQueue.addToBack( self.describer.getWallRubbingDescriptionWithChargePairs() );
        self.describeWallRub = false;
      }      
    } );

    // a11y - when the drag velocity of the balloon becomes zero while moving along the wall, describe charges
    // TODO: Should all a11y alerts go through this?
    model.dragVelocityProperty.link( function( velocity ) {
      if ( velocity.equals( Vector2.ZERO ) && model.touchingWall() && self.describeWallRub ) {
        utteranceQueue.addToBack( self.describer.getWallRubbingDescription() );
      }
    } );

    // a11y - alerts when direction changes, only describe if the balloon hasn't recently been released
    model.directionProperty.lazyLink( function( direction ) {
      if ( self.describeDirection ) {
        var alert = self.describer.getDirectionChangedDescription();
        utteranceQueue.addToBack( new Utterance( alert, {
          typeId: 'direction' // so numerous alerts relating to direction don't get triggered at once
        } ) );  
      }
    } );

    // a11y - alert when balloon is added to play area
    model.isVisibleProperty.lazyLink( function( isVisible ) {
      utteranceQueue.addToBack( self.describer.getVisibilityChangedDescription() );

      // when the balloon visibility changes, we will start with initial movement once it becomes visible again
      self.initialMovementDescribed = false;
    } );

    // link the position of this node to the model
    model.locationProperty.link( function updateLocation( location, oldLocation ) {

      // translate the node to the new location
      self.translation = location;

      // everything else for a11y - compose the alert that needs to be sent to assistive technology
      // TODO: Can all this be moved to the view step?
      if ( oldLocation ) {
        if ( self.model.isVisibleProperty.get() ) {

          var alert;
          if ( !self.model.isDraggedProperty.get() ) {
            if ( !self.initialMovementDescribed ) {
              if ( self.model.timeSinceRelease > RELEASE_DESCRIPTION_TIME_DELAY ) {

                // get the initial description of balloon movement upon release
                self.initialMovementDescribed = true;
                if ( !location.equals( oldLocation ) ) {
                  alert = self.describer.getInitialReleaseDescription( location, oldLocation );
                  utteranceQueue.addToBack( alert );

                  // after describing initial movement, continue to describe direction changes
                  self.describeDirection = true;

                  // if initial release was slow, we will describe all continued movement through play area
                  self.describeContinuedMovement = self.describer.balloonMovingSlowly();
                }

                // reset timer for release alert
                self.timeSinceReleaseAlert = 0;
              }
            }
            else if ( self.timeSinceReleaseAlert > RELEASE_DESCRIPTION_REFRESH_RATE ) {

              // if the balloon is moving slowly, alert a continuous movement description
              if ( self.describeContinuedMovement ) {

                // get subsequent descriptions of movement
                alert = self.describer.getContinuousReleaseDescription();
                utteranceQueue.addToBack( alert );

                // reset timer
                self.timeSinceReleaseAlert = 0;
              }
            }
          }
        }
      }
    } );

    //show charges based on showCharges property
    globalModel.showChargesProperty.link( function updateChargesVisibilityOnBalloon( value ) {
      if ( value === 'diff' ) {
        originalChargesNode.visible = false;
        addedChargesNode.visible = true;
      }
      else {
        var visiblity = (value === 'all');
        originalChargesNode.visible = visiblity;
        addedChargesNode.visible = visiblity;
      }
    } );

    // when the balloon changes region in the paly area, we need to handle changes to description
    Property.multilink( [ model.playAreaRowProperty, model.playAreaColumnProperty ], function( row, column ) {
      self.regionChangeHandled = false;
    } );

    // a11y
    balloonImageNode.focusHighlight = new FocusHighlightFromNode( balloonImageNode );

    // a11y - when the balloon charge, location, or model.showChargesProperty changes, the balloon needs a new
    // description for assistive technology
    var updateAccessibleDescription = function() {
      self.accessibleDescription = self.describer.getBalloonDescription( model );
    };
    model.locationProperty.link( updateAccessibleDescription );
    model.chargeProperty.link( updateAccessibleDescription );
    model.isDraggedProperty.link( updateAccessibleDescription );
    globalModel.showChargesProperty.link( updateAccessibleDescription );

    // used to determine change in position during a single keyboard drag
    var oldPosition = new Vector2( 0, 0 );

    // @private - the drag handler needs to be updated in a step function, see KeyboardDragHandler for more
    // information
    this.keyboardDragHandler = new KeyboardDragListener( {
      dragBounds: this.getDragBounds(),
      locationProperty: model.locationProperty,
      shiftKeyMultiplier: 0.25,
      drag: function() {
        if ( self.keyboardDragCount === 0 ) {
          self.keyboardDragCount++;
        }
      },
      end: function( event ) {

        // how much balloon has moved
        var dragDelta = self.model.locationProperty.get().minus( oldPosition );

        // when we complete a keyboard drag, set timer to refresh rate so that we trigger a new
        // description next time we press a key
        self.timeSincePositionAlert = DESCRIPTION_REFRESH_RATE;

        // when keyboard drag ends, provide some extra information about the balloon's movement through the play area
        // only do this if the play area column and row hasn't changed
        var inLandmark = PlayAreaMap.inLandmarkColumn( model.getCenter() );
        var onSweater = model.onSweater();
        var touchingWall = model.touchingWall();
        if ( !inLandmark && !onSweater && !touchingWall ) {
          utteranceQueue.addToBack( self.describer.getKeyboardMovementAlert() );
        }
        else if ( inLandmark ) {

          // just announce landmark as we move through it
          var locationDescription = self.describer.getLandmarkDragDescription();
          locationDescription && utteranceQueue.addToBack( locationDescription );
        }

        // describe the induced charge if we need to, excluding purely vertical movement
        if ( self.describer.describeInducedChargeChange() ) {
          utteranceQueue.addToBack( self.describer.getInducedChargeChangeDescription( dragDelta ) );
        }

        // TODO: there should be a function for this, displacementOnEnd should be private
        self.describer.inducedChargeDisplacementOnEnd = self.model.chargeDisplacementProperty.get();
      },
      start: function( event ) {

        startDragListener();

        oldPosition = self.model.locationProperty.get().copy();

        // if already touching a boundary when dragging starts, announce an indication of this
        if ( self.attemptToMoveBeyondBoundary( event.keyCode ) ) {
          var attemptedDirection = self.getAttemptedMovementDirection( event.keyCode );
          utteranceQueue.addToBack( new Utterance( self.describer.getTouchingBoundaryDescription( attemptedDirection ), {
            typeId: 'boundaryAlert'
          } ) );
        }
      }
    } );

    // jump to the wall on 'J + W'
    this.keyboardDragHandler.addHotkeyGroups( [
      {
        keys: [ KeyboardUtil.KEY_J, KeyboardUtil.KEY_W ],
        callback: function() {
          self.jumpBalloon( new Vector2( X_LOCATIONS.AT_WALL, model.getCenterY() ) );
        }
      },
      {
        keys: [ KeyboardUtil.KEY_J, KeyboardUtil.KEY_S ],
        callback: function() {
          self.jumpBalloon( new Vector2( X_LOCATIONS.AT_NEAR_SWEATER, model.getCenterY() ) );
        }
      },
      {
        keys: [ KeyboardUtil.KEY_J, KeyboardUtil.KEY_N ],
        callback: function() {
          self.jumpBalloon( new Vector2( X_LOCATIONS.AT_NEAR_WALL, model.getCenterY() ) );
        }
      },
      {
        keys: [ KeyboardUtil.KEY_J, KeyboardUtil.KEY_C ],
        callback: function() {
          self.jumpBalloon( new Vector2( X_LOCATIONS.AT_CENTER_PLAY_AREA, model.getCenterY() ) );
        }
      }
    ] );

    var dragHighlightNode = new FocusHighlightFromNode( balloonImageNode, {
      lineDash: [ 7, 7 ]
    } );

    // A node that receives focus and handles keyboard draging
    var accessibleDragNode = new Node( {
      tagName: 'div',
      parentContainerTagName: 'div',
      focusable: true,
      accessibleVisible: false, // initially false
      pickable: false,
      parentContainerAriaRole: 'application',
      accessibleLabel: accessibleLabelString,
      focusHighlight: dragHighlightNode
    } );
    this.addChild( accessibleDragNode );

    // add the keyboard drag handler to the node that will handle this
    accessibleDragNode.addAccessibleInputListener( this.keyboardDragHandler );

    // add a listener that emits events when accessible drag node is blurred and focused
    accessibleDragNode.addAccessibleInputListener( {
      focus: function() {
        self.dragNodeFocusedEmitter.emit();
      },
      blur: function() {
        self.dragNodeBlurredEmitter.emit();
      }
    } );

    // update the drag bounds when wall visibility changes
    globalModel.wall.isVisibleProperty.link( function( isVisible ) {
      self.keyboardDragHandler._dragBounds = self.getDragBounds();

      // if the f
      if ( !isVisible ) {
        if ( self.model.getRight() === globalModel.wall.x ) {
          self.initialMovementDescribed = false;
        }
      }
    } );

    // when the "Grab Balloon" button is pressed, focus the dragable node and set to dragged state
    balloonImageNode.addAccessibleInputListener( {
      click: function( event ) {

        // if the balloon was released on enter, don't pick it up again until the next click event so we don't pick
        // it up immediately again
        if ( !releasedWithEnter ) {

          // make focusable
          accessibleDragNode.accessibleVisible = true;

          // focus, but behind a short delay so that JAWS correctly enters 'forms' mode when picking up
          // the balloon, see https://github.com/phetsims/balloons-and-static-electricity/issues/293
          Timer.setTimeout( function() {
            accessibleDragNode.focus();
          }, 100 );

          // the balloon is picked up for dragging
          model.isDraggedProperty.set( true );
        }

        // pick up the balloon on the next click event
        releasedWithEnter = false;
      },
      focus: function( event ) {
        self.focusEmitter.emit1( self.focused );
      },
      blur: function( event ) {
        self.blurEmitter.emit();
      }
    } );

    var releaseBalloon = function() {
      // release the balloon
      endDragListener();

      // focus the grab balloon button
      balloonImageNode.focus();

      // the draggable node should no longer be discoverable in the parallel DOM
      accessibleDragNode.accessibleVisible = false;

      // reset the key state of the drag handler
      self.keyboardDragHandler.reset();
    };

    // when the dragable balloon is released
    var releasedWithEnter = false;
    accessibleDragNode.addAccessibleInputListener( {
      keydown: function( event ) {
        if ( event.keyCode === KeyboardUtil.KEY_ENTER ) {
          releasedWithEnter = true;
          releaseBalloon();
        }
      },
      keyup: function( event ) {
        if ( event.keyCode === KeyboardUtil.KEY_SPACE ) {

          // release  on keyup of spacebar so that we don't pick up the balloon again when we release the spacebar
          // and trigger a click event
          releaseBalloon();
        }
      },
      focus: function() {
        self.dragNodeFocusedEmitter.emit();
      },
      blur: function( event ) {
        endDragListener();

        // the draggable node should no longer be focusable
        accessibleDragNode.accessibleVisible = false;

        self.dragNodeBlurredEmitter.emit();
      }
    } );

    // when reset, reset the interaction trackers
    model.resetEmitter.addListener( function() {
      self.keyboardDragCount = 0;

      // reset the describer
      self.describer.reset();
    } );

    // a11y - when the balloon is picked up or released, generate and announce an alert that indicates
    // the interaction and the balloons state.  Linked lazilly since we don't want these alerts on 
    // sim startup
    model.isDraggedProperty.lazyLink( function( isDragged ) {
      var alert;
      if ( isDragged ) {

        // if picked up again, start describing direction changes
        self.describeDirection = true;

        alert = self.describer.getGrabbedAlert();
      }
      else {
        alert = self.describer.getReleasedAlert();

        // dont describe direction until initial release description happens
        self.describeDirection = false;
      }
      utteranceQueue.addToBack( alert );

      // update the location of release
      self.model.locationOnRelease = model.locationProperty.get();

      // reset flags that track description content
      self.initialMovementDescribed = false;
    } );

    if ( BASEQueryParameters.showBalloonChargeCenter ) {
      var parentToLocalChargeCenter = this.parentToLocalPoint( model.getChargeCenter() );
      this.addChild( new Rectangle( 0, 0, 5, 5, { fill: 'green', center: parentToLocalChargeCenter } ) );
      this.addChild( new Line( -500, parentToLocalChargeCenter.y, 500, parentToLocalChargeCenter.y, { stroke: 'green' } ) );
    }
  }

  balloonsAndStaticElectricity.register( 'BalloonNode', BalloonNode );

  return inherit( Node, BalloonNode, {

    /**
     * Also, step the keyboard drag handler to track how long keys have been pressed down.
     *
     * @public
     * @param  {number} dt
     */
    step: function( dt ) {
      var alert;

      // increment timer tracking time since alert description
      this.timeSincePositionAlert += dt * 1000;

      // at an interval, announce pickup of negative charges
      if ( this.timeSincePositionAlert > DESCRIPTION_REFRESH_RATE ) {

        // if we are on the sweater, dragged, and the charge is the same as when we started the drag, announce that
        // there was no change in charges
        var sameCharge = this.model.chargeProperty.get() === this.chargeOnStart;
        if ( this.model.isDraggedProperty.get() && this.model.onSweater() && sameCharge && this.dragStarted ) {
          alert = this.describer.getNoChargePickupDescription();
          utteranceQueue.addToBack( alert );
        }

        this.alertNextPickup = true;
        this.timeSincePositionAlert = 0;
        this.dragStarted = false;
      }

      // when the balloon is released (either from dragging or from the wall being removed), announce an
      // alert if it doesn't move within the time delay
      if ( !this.model.isDraggedProperty.get() ) {

        // if released, increment the timer for release
        this.timeSinceReleaseAlert += dt * 1000;

        if ( !this.initialMovementDescribed && this.model.locationOnRelease ) {
          if ( this.model.timeSinceRelease > RELEASE_DESCRIPTION_TIME_DELAY_NO_MOVEMENT ) {
            var touchingReleasePoint = this.model.locationProperty.get().equals( this.model.locationOnRelease );
            if ( touchingReleasePoint ) {
              alert = this.describer.getNoChangeReleaseDescription();
              utteranceQueue.addToBack( alert );
              this.initialMovementDescribed = true;
            }
          }
        }
      }
    },

    /**
     * Jump the balloon to a new location, first muting the utteranceQueue, then updating position,
     * then clearing the queue and enabling it once more.  Finally, we will add a custom utterance
     * to the queue describing the jump interaction.
     *
     * @param  {Vector2} center - new center location for the balloon
     */
    jumpBalloon: function( center ) {

      // mute the queue so that none of the normal position updates come through while jumping
      utteranceQueue.muted = true;

      // update model position
      this.model.setCenter( center );

      // clear the queue of utterances that collected as position changed
      utteranceQueue.clear();

      // unmute and send a custom alert, depending on where the balloon was moved to
      utteranceQueue.muted = false;
      var utterance = new Utterance( this.describer.getJumpingDescription( center ), {
        typeId: 'jumpingDescription' // prevent a spam of these jumping alerts
      } );
      utteranceQueue.addToBack( utterance );
    },

    getPositionOnSweaterDescription: function() {
      return 'Please implement this function or delete.';
    },

    /**
     * Determine if the user attempted to move beyond the play area bounds with the keyboard.
     * @return {[type]} [description]
     */
    attemptToMoveBeyondBoundary: function( keyCode ) {
      return (
        ( KeyboardDragListener.isLeftMovementKey( keyCode ) && this.model.isTouchingLeftBoundary() ) ||
        ( KeyboardDragListener.isUpMovementKey( keyCode ) && this.model.isTouchingTopBoundary() ) ||
        ( KeyboardDragListener.isRightMovementKey( keyCode ) && this.model.isTouchingRightBoundary() ) ||
        ( KeyboardDragListener.isDownMovementKey( keyCode ) && this.model.isTouchingBottomBoundary() )
      );
    },

    getAttemptedMovementDirection: function( keyCode ) {
      var direction;
      if ( KeyboardDragListener.isLeftMovementKey( keyCode ) ) {
        direction = BalloonDirectionEnum.LEFT;
      }
      else if ( KeyboardDragListener.isRightMovementKey( keyCode ) ) {
        direction = BalloonDirectionEnum.RIGHT;
      }
      else if ( KeyboardDragListener.isUpMovementKey( keyCode ) ) {
        direction = BalloonDirectionEnum.UP;
      }
      else if ( KeyboardDragListener.isDownMovementKey( keyCode ) ) {
        direction = BalloonDirectionEnum.DOWN;
      }

      assert && assert( direction );
      return direction;
    },

    getDragBounds: function() {
      var modelBounds = this.globalModel.bounds;
      var balloonWidth = this.model.width;
      var balloonHeight = this.model.height;
      return new Bounds2( modelBounds.minX, modelBounds.minY, modelBounds.maxX - balloonWidth, modelBounds.maxY - balloonHeight );
    }
  } );
} );
