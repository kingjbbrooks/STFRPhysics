
let A,B,C,D,E;  // slider values
let showCoordinateGrid = false;
let drawNormalBall = false;

function QuatPathing2(q, v, c,normalVertices,normalColors) {
	const spaceScale = 5;
	const normal_del = 1;
	const o = [0,0,0];//6/spaceScale,+6/spaceScale,+6/spaceScale];

	const ax = Math.abs(A);
	const ay = 0;//Math.abs(B);
	const az = Math.abs(C);
	const angleSum = ax+ay+az;    // max x/y/z

	//const lnQ = new lnQuat( {a:2*Math.PI/3,b:2*Math.PI/3,c:2*Math.PI/3} );
	let lnQ = new lnQuat( {a:A,b:T,c:C} );
	//0.53118619792
		
//	drawBasis( lnQ, 1.0 );
	//let qBasis;
	//lnQt = new lnQuat( qBasis = lnQ.getBasis() );
	drawBasis( lnQ, 1.0, true );


	// rPime.

	const tangent = { x: Math.sin(lnQ.x/2), y: Math.sin(lnQ.y/2), z: Math.sin(lnQ.z/2) }

	const dT2 = { x: -Math.cos(lnQ.x/2), y: -Math.cos(lnQ.y/2), z: -Math.cos( lnQ.z /2) };
//	const kN = { x: -tangent.z * Math.cos(lnQ.y) - tangent.y *Math.cos(lnQ.z), y:tangent.x*Math.cos(lnQ.z)-tangent.z*Math.cos(lnQ.x), z: tangent.y*Math.cos(lnQ.x)-tangent.x*Math.cos( lnQ.y ) };
	
	const tangentLen = 1/Math.sqrt( tangent.x*tangent.x + tangent.y*tangent.y + tangent.z*tangent.z );
	const Tn = {x: tangent.x * tangentLen, y:     tangent.y * tangentLen, z:     tangent.z * tangentLen };
	
	let origin = lnQ.applyDel( {x:0,y:1,z:0}, 1.0 );

	
	 //principle unit normal = 
	//const kN = { x: Tn.z * dT2.y - Tn.y * dT2.z
	//           , y: Tn.x * dT2.z - Tn.z * dT2.x
	//           , z: Tn.y * dT2.x - Tn.x * dT2.y };

	const kN = { x: Tn.z * origin.y - Tn.y * origin.z
	           , y: Tn.x * origin.z - Tn.z * origin.x
	           , z: Tn.y * origin.x - Tn.x * origin.y };

	//const kN = { x: -Math.cos(lnQ.x), y: -Math.cos(lnQ.y), z: -Math.cos(lnQ.z) };
	//const kN = { x: Tn.z, y:-Tn.x, z: -Tn.y };
	const normalLen = Math.sqrt( kN.x*kN.x+ kN.y*kN.y +kN.z*kN.z);
	const N = { x:kN.x/normalLen,y:kN.y/normalLen,z:kN.z/normalLen };

	//const Bn = { x: dT2.x 
	 //          , y: dT2.y
	 //          , z: dT2.z };
	const Bn = { x: Tn.y * N.z - Tn.z * N.y 
	           , y: Tn.z * N.x - Tn.x * N.z 
	           , z: Tn.x * N.y - Tn.y * N.x };
	//const 
// dB/ds is parallel to N
//
				normalVertices.push( new THREE.Vector3( (o[0]+origin.x+Tn.x*3)*spaceScale         ,(o[1]+origin.y+Tn.y*3)*spaceScale  ,(o[2]+origin.z+ Tn.z*3)*spaceScale ))
				normalVertices.push( new THREE.Vector3( (o[0]+origin.x+0*2*Math.PI)*spaceScale    ,(o[1]+origin.y+0*2)*spaceScale     ,(o[2]+origin.z+0*2)*spaceScale  ))
				normalColors.push( new THREE.Color( 0,0,0,255 ))
				normalColors.push( new THREE.Color( 1,0,0,255 ))
				normalVertices.push( new THREE.Vector3( (o[0]+origin.x + N.x*3)*spaceScale           ,(o[1]+origin.y + N.y*3)*spaceScale          ,(o[2]+origin.z + N.z*3)*spaceScale ))
				normalVertices.push( new THREE.Vector3( (o[0]+origin.x + 0*2)*spaceScale             ,(o[1]+origin.y + 0*2*Math.PI)*spaceScale    ,(o[2]+origin.z + 0*2)*spaceScale  ))
				normalColors.push( new THREE.Color( 0,0,0,255 ))
				normalColors.push( new THREE.Color( 0,1,0,255 ))
				normalVertices.push( new THREE.Vector3( (o[0]+origin.x+Bn.x*3)*spaceScale           ,(o[1]+origin.y+Bn.y*3)*spaceScale    ,(o[2]+origin.z+ Bn.z*3)*spaceScale ))
				normalVertices.push( new THREE.Vector3( (o[0]+origin.x+0*2)*spaceScale              ,(o[1]+origin.y+0*2)*spaceScale       ,(o[2]+origin.z+ 0*2*Math.PI)*spaceScale  ))
				normalColors.push( new THREE.Color( 0,0,0,255 ))
				normalColors.push( new THREE.Color( 0,0,1,255 ))


        //lnQ.x /= 2;
	//lnQ.z /= 2;
	let lnQP = null;
	const n = lnQ.apply( {x:0,y:1,z:0} );
	
	if(1){ // this ends up rotated 180 degrees.
		let lnQtmp = new lnQuat( lnQ );


		lnQtmp.twist( B*Math.PI/2);


		drawBasis( lnQtmp, 1.0, false );

	}
			if(1)
	                   {
				const new_v = lnQ.applyDel( {x:0,y:1,z:0}, 0.5 );
				const twistAxis = { x:lnQ.y * new_v.z - new_v.y * lnQ.z
			                          , y:lnQ.z * new_v.x - new_v.z * lnQ.x
			                          , z:lnQ.x * new_v.y - new_v.x * lnQ.y

						};
			const lnQTwist = new lnQuat( {x:lnQ.y * new_v.z - new_v.y * lnQ.z
			                             ,y:lnQ.z * new_v.x - new_v.z * lnQ.x
			                             ,z:lnQ.x * new_v.y - new_v.x * lnQ.y

						} );
			drawBasis( lnQTwist, 1.0, false );
			}

	return;

		function drawBasis( lnQ,T, doTwist )
		{

			let new_v = lnQ.applyDel( {x:0,y:1,z:0}, 1.0 );

			// draw path leading up to 1.0....
			let prior_v = null;
			for( var t = 0; t<= 1; t+=0.05 ) {
				const new_v = lnQ.applyDel( v, t );
	                
				new_v.x += o[0];new_v.y += o[1];new_v.z += o[2];
					if( prior_v ) {
						normalVertices.push( new THREE.Vector3( prior_v.x*spaceScale,prior_v.y*spaceScale, prior_v.z*spaceScale ))
						normalVertices.push( new THREE.Vector3( new_v.x*spaceScale,new_v.y*spaceScale, new_v.z*spaceScale ))
						normalColors.push( c)
						normalColors.push( c)
					}
					prior_v = new_v;
	                
			};
			new_v.x += o[0];new_v.y += o[1];new_v.z += o[2];
			const basis = lnQ.getBasis();//{ up:lnQ.applyDel( {x:0,y:1,z:0} ),right:lnQ.applyDel( {x:1,y:0,z:0} ),forward:lnQ.applyDel( {x:0,y:0,z:1} )};
			

			normalVertices.push( new THREE.Vector3( new_v.x*spaceScale                           ,new_v.y*spaceScale                           , new_v.z*spaceScale ))
			normalVertices.push( new THREE.Vector3( new_v.x*spaceScale + basis.right.x*normal_del,new_v.y*spaceScale + basis.right.y*normal_del, new_v.z*spaceScale + basis.right.z*normal_del ))

			normalVertices.push( new THREE.Vector3( new_v.x*spaceScale                        ,new_v.y*spaceScale                        , new_v.z*spaceScale ))
			normalVertices.push( new THREE.Vector3( new_v.x*spaceScale + basis.up.x*normal_del,new_v.y*spaceScale + basis.up.y*normal_del,new_v.z*spaceScale + basis.up.z*normal_del ))

			normalVertices.push( new THREE.Vector3( new_v.x*spaceScale                             ,new_v.y*spaceScale                             , new_v.z*spaceScale ))
			normalVertices.push( new THREE.Vector3( new_v.x*spaceScale + basis.forward.x*normal_del,new_v.y*spaceScale + basis.forward.y*normal_del,new_v.z*spaceScale + basis.forward.z*normal_del ))

			normalColors.push( new THREE.Color( 255,0,0,255 ))
			normalColors.push( new THREE.Color( 255,0,0,255 ))
			normalColors.push( new THREE.Color( 0,255,0,255 ))
			normalColors.push( new THREE.Color( 0,255,0,255 ))
			normalColors.push( new THREE.Color( 0,0,255,255))
			normalColors.push( new THREE.Color( 0,0,255,255 ))
				normalVertices.push( new THREE.Vector3( (o[0]+1*2*Math.PI)*spaceScale         ,(o[1]+0*2)*spaceScale  ,(o[2]+ 0*2)*spaceScale ))
				normalVertices.push( new THREE.Vector3( (o[0]+0*2*Math.PI)*spaceScale           ,(o[1]+0*2)*spaceScale    ,(o[2]+0*2)*spaceScale  ))
				normalColors.push( new THREE.Color( 0,0,0,255 ))
				normalColors.push( new THREE.Color( 1,1,1,255 ))
				normalVertices.push( new THREE.Vector3( (o[0]+0*2)*spaceScale           ,(o[1]+1*2*Math.PI)*spaceScale  ,(o[2]+ 0*2)*spaceScale ))
				normalVertices.push( new THREE.Vector3( (o[0]+0*2)*spaceScale           ,(o[1]+0*2*Math.PI)*spaceScale    ,(o[2]+0*2)*spaceScale  ))
				normalColors.push( new THREE.Color( 0,0,0,255 ))
				normalColors.push( new THREE.Color( 1,1,1,255 ))
				normalVertices.push( new THREE.Vector3( (o[0]+0*2)*spaceScale           ,(o[1]+0*2)*spaceScale    ,(o[2]+ 1*2*Math.PI)*spaceScale ))
				normalVertices.push( new THREE.Vector3( (o[0]+0*2)*spaceScale           ,(o[1]+0*2)*spaceScale    ,(o[2]+ 0*2*Math.PI)*spaceScale  ))
				normalColors.push( new THREE.Color( 0,0,0,255 ))
				normalColors.push( new THREE.Color( 1,1,1,255 ))


			if( doTwist )
			{
				for( let zz = 0; zz < 1; zz++ ) {
				const new_v_ = lnQ.applyDel( {x:0,y:1,z:0}, 0.5 );
				let new_v = { x:lnQ.ny * new_v_.z - new_v_.y * lnQ.nz
			                    , y:lnQ.nz * new_v_.x - new_v_.z * lnQ.nx
			                    , z:lnQ.nx * new_v_.y - new_v_.x * lnQ.ny
						};
				const vRot = new_v; 
				const lnv = Math.sqrt(new_v.x*new_v.x + new_v.y*new_v.y + new_v.z*new_v.z );
				new_v.x /= lnv;
				new_v.y /= lnv;
				new_v.z /= lnv;
				const q = lnQ;
			{
				let new_v_2 = { x: new_v_.y * new_v.z - new_v_.z * new_v.y 
				              , y: new_v_.z * new_v.x - new_v_.x * new_v.z
				              , z: new_v_.x * new_v.y - new_v_.y * new_v.x 
				              };
				const lnv2 = Math.sqrt(new_v_2.x*new_v_2.x + new_v_2.y*new_v_2.y + new_v_2.z*new_v_2.z );
				new_v_2.x *= 1/lnv2;
				new_v_2.y *= 1/lnv2;
				new_v_2.z *= 1/lnv2;
				// in the coordinate system of new_v_ (forward) new_v (axis of rotation/up) new_v_2 (right)
				// angle 0 = ( 1, 0, 0 )  angle 90 = ( 0, 0, 1 )
				const lnQr = new lnQuat( { forward: new_v_, right:new_v_2, up: new_v } );
				
			        const forward = new_v_;
			        const right = new_v_2;

				
				normalVertices.push( new THREE.Vector3( (o[0]+0*new_v.x*2)*spaceScale         ,(o[1]+0*new_v.y*2)*spaceScale  ,(o[2]+ 0*new_v.z*2)*spaceScale ))
				normalVertices.push( new THREE.Vector3( (o[0]+new_v.x*2)*spaceScale           ,(o[1]+new_v.y*2)*spaceScale    ,(o[2]+new_v.z*2)*spaceScale  ))
			        
				normalColors.push( new THREE.Color( 1,0.25,0.25,255 ))
				normalColors.push( new THREE.Color( 1,0.25,0.25,255 ))
				new_v = new_v_;
				normalVertices.push( new THREE.Vector3( (o[0]+0*new_v.x*2)*spaceScale         ,(o[1]+0*new_v.y*2)*spaceScale  ,(o[2]+ 0*new_v.z*2)*spaceScale ))
				normalVertices.push( new THREE.Vector3( (o[0]+new_v.x*2)*spaceScale           ,(o[1]+new_v.y*2)*spaceScale    ,(o[2]+new_v.z*2)*spaceScale  ))
				normalColors.push( new THREE.Color( 0,1,0,255 ))
				normalColors.push( new THREE.Color( 0,1,0,255 ))
				new_v = new_v_2;
				normalVertices.push( new THREE.Vector3( (o[0]+0*new_v.x*2)*spaceScale         ,(o[1]+0*new_v.y*2)*spaceScale  ,(o[2]+ 0*new_v.z*2)*spaceScale ))
				normalVertices.push( new THREE.Vector3( (o[0]+new_v.x*2)*spaceScale           ,(o[1]+new_v.y*2)*spaceScale    ,(o[2]+new_v.z*2)*spaceScale  ))
			        
				normalColors.push( new THREE.Color( 0.75,0,0,255 ))
				normalColors.push( new THREE.Color( 0.75,0,0,255 ))
			        
				const basis = lnQ.getBasisT( 1.0 );
				new_v = basis.forward;
				normalVertices.push( new THREE.Vector3( (o[0]+0*new_v.x*2)*spaceScale         ,(o[1]+0*new_v.y*2)*spaceScale  ,(o[2]+ 0*new_v.z*2)*spaceScale ))
				normalVertices.push( new THREE.Vector3( (o[0]+new_v.x*2)*spaceScale           ,(o[1]+new_v.y*2)*spaceScale    ,(o[2]+new_v.z*2)*spaceScale  ))
				normalColors.push( new THREE.Color( 0,0,0.1,255 ))
				normalColors.push( new THREE.Color( 0,0,0.1,255 ))
				new_v = basis.right;
				normalVertices.push( new THREE.Vector3( (o[0]+0*new_v.x*2)*spaceScale         ,(o[1]+0*new_v.y*2)*spaceScale  ,(o[2]+ 0*new_v.z*2)*spaceScale ))
				normalVertices.push( new THREE.Vector3( (o[0]+new_v.x*2)*spaceScale           ,(o[1]+new_v.y*2)*spaceScale    ,(o[2]+new_v.z*2)*spaceScale  ))
				normalColors.push( new THREE.Color( 0.1,0,0,255 ))
				normalColors.push( new THREE.Color( 0.1,0,0,255 ))
				new_v = basis.up;
				normalVertices.push( new THREE.Vector3( (o[0]+0*new_v.x*2)*spaceScale         ,(o[1]+0*new_v.y*2)*spaceScale  ,(o[2]+ 0*new_v.z*2)*spaceScale ))
				normalVertices.push( new THREE.Vector3( (o[0]+new_v.x*2)*spaceScale           ,(o[1]+new_v.y*2)*spaceScale    ,(o[2]+new_v.z*2)*spaceScale  ))
				normalColors.push( new THREE.Color( 0,0.1,0,255 ))
				normalColors.push( new THREE.Color( 0,0.1,0,255 ))
				
				const inv_rot = {x:-(basis.right.x+basis.forward.x+basis.up.x)/3, y:-(basis.right.y+basis.forward.y+basis.up.y)/3,z:-(basis.right.z+basis.forward.z+basis.up.z)/3 };
				new_v = inv_rot;
				normalVertices.push( new THREE.Vector3( (o[0]+0*new_v.x*2)*spaceScale         ,(o[1]+0*new_v.y*2)*spaceScale  ,(o[2]+ 0*new_v.z*2)*spaceScale ))
				normalVertices.push( new THREE.Vector3( (o[0]+new_v.x*2)*spaceScale           ,(o[1]+new_v.y*2)*spaceScale    ,(o[2]+new_v.z*2)*spaceScale  ))
				normalColors.push( new THREE.Color( 0,0.5,0.5,255 ))
				normalColors.push( new THREE.Color( 0,0.5,0.5,255 ))



			}
			const lnQTwist = new lnQuat( Math.PI/2, {x:q.y * new_v.z - new_v.y * q.z
			                                        ,y:q.z * new_v.x - new_v.z * q.x
			                                        ,z:q.x * new_v.y - new_v.x * q.y
						} );
			let lnQ2 = new lnQuat( lnQ );
			lnQ2.octave = (E|0)||1;
			//lnQ2.twist( -Math.PI ).update();
			let minL = 10;
			let maxL = -10;
if(1)
			for( var t = -Math.PI/2; t<= Math.PI/2; t+=0.01 *(1/(E/2)) ) {
			//let lnQ2 = new lnQuat( {a:lnQ.x,b:lnQ.y,c:lnQ.z} );
				if( zz == 0 ) 
					lnQ2.twist( 0.1 ).update();
				else if( zz == 1 )
					lnQ2.roll( 0.1 ).update();
				else
					lnQ2.yaw( 0.1 ).update();
				//lnQTwist.apply( lnQ2, 0.1 ).update();
				//twist_bad2( lnQ2, 0.1 ).update();
				// this shows the normalized path - easier to isolate twist axis....
				if( lnQ2.θ < minL ) minL = lnQ2.θ;
				if( lnQ2.θ > maxL ) maxL = lnQ2.θ;


				if( 0 ) {
						// this has accelerations, not just ping-ponging limits... (but those walls may be rotation artifacts and reflections)
					normalVertices.push( new THREE.Vector3( (o[0]+lnQ2.x)*spaceScale - 0.5 * normal_del   ,(o[1]+lnQ2.y)*spaceScale                     , (o[2]+lnQ2.z)*spaceScale ))
					normalVertices.push( new THREE.Vector3( (o[0]+lnQ2.x)*spaceScale + 0.5 * normal_del   ,(o[1]+lnQ2.y)*spaceScale                     , (o[2]+lnQ2.z)*spaceScale ))
			                                                                                                                                                                  
					normalVertices.push( new THREE.Vector3( (o[0]+lnQ2.x)*spaceScale                      ,(o[1]+lnQ2.y)*spaceScale - 0.5 * normal_del  , (o[2]+lnQ2.z)*spaceScale  ))
					normalVertices.push( new THREE.Vector3( (o[0]+lnQ2.x)*spaceScale                      ,(o[1]+lnQ2.y)*spaceScale + 0.5 * normal_del  , (o[2]+lnQ2.z)*spaceScale  ))
			                                                                                                                                                                  
					normalVertices.push( new THREE.Vector3( (o[0]+lnQ2.x)*spaceScale                      ,(o[1]+lnQ2.y)*spaceScale                     , (o[2]+lnQ2.z)*spaceScale - 0.5 * normal_del  ))
					normalVertices.push( new THREE.Vector3( (o[0]+lnQ2.x)*spaceScale                      ,(o[1]+lnQ2.y)*spaceScale                     , (o[2]+lnQ2.z)*spaceScale + 0.5 * normal_del  ))
			                if( t == 0 ) {
						normalColors.push( new THREE.Color( 1.0,0.6,0.6,255 ))
						normalColors.push( new THREE.Color( 1.0,0.6,0.6,255 ))
						normalColors.push( new THREE.Color( 0.6,1.0,0.6,255 ))
						normalColors.push( new THREE.Color( 0.6,1.0,0.6,255 ))
						normalColors.push( new THREE.Color( 0.6,0.6,1.0,255))
						normalColors.push( new THREE.Color( 0.6,0.6,1.0,255 ))
					} else if( Math.abs( t-B) < 0.01 ) {
						normalColors.push( new THREE.Color( 1.0,0.3,0.3,255 ))
						normalColors.push( new THREE.Color( 1.0,0.3,0.3,255 ))
						normalColors.push( new THREE.Color( 0.3,1.0,0.3,255 ))
						normalColors.push( new THREE.Color( 0.3,1.0,0.3,255 ))
						normalColors.push( new THREE.Color( 0.3,0.3,1.0,255))
						normalColors.push( new THREE.Color( 0.3,0.3,1.0,255 ))
	                                
					} else {
					normalColors.push( new THREE.Color( 0.5,0,0,255 ))
					normalColors.push( new THREE.Color( 0.5,0,0,255 ))
					normalColors.push( new THREE.Color( 0,0.5,0,255 ))
					normalColors.push( new THREE.Color( 0,0.5,0,255 ))
					normalColors.push( new THREE.Color( 0,0,0.5,255))
					normalColors.push( new THREE.Color( 0,0,0.5,255 ))
				        
					}
				}

		        
				if(0) {
					normalVertices.push( new THREE.Vector3( (o[0]+lnQ2.nx-lnQ.nx)*spaceScale - 0.5 * normal_del   ,(o[1]+lnQ2.ny-lnQ.ny)*spaceScale  , (o[2]+lnQ2.nz-lnQ.nz)*spaceScale ))
					normalVertices.push( new THREE.Vector3( (o[0]+lnQ2.nx-lnQ.nx)*spaceScale + 0.5 * normal_del   ,(o[1]+lnQ2.ny-lnQ.ny)*spaceScale  , (o[2]+lnQ2.nz-lnQ.nz)*spaceScale ))
				        
					normalVertices.push( new THREE.Vector3( (o[0]+lnQ2.nx-lnQ.nx)*spaceScale   ,(o[1]+lnQ2.ny-lnQ.ny)*spaceScale - 0.5 * normal_del  , (o[2]+lnQ2.nz-lnQ.nz)*spaceScale  ))
					normalVertices.push( new THREE.Vector3( (o[0]+lnQ2.nx-lnQ.nx)*spaceScale   ,(o[1]+lnQ2.ny-lnQ.ny)*spaceScale + 0.5 * normal_del  , (o[2]+lnQ2.nz-lnQ.nz)*spaceScale  ))
				        
					normalVertices.push( new THREE.Vector3( (o[0]+lnQ2.nx-lnQ.nx)*spaceScale   ,(o[1]+lnQ2.ny-lnQ.ny)*spaceScale , (o[2]+lnQ2.nz-lnQ.nz)*spaceScale - 0.5 * normal_del  ))
					normalVertices.push( new THREE.Vector3( (o[0]+lnQ2.nx-lnQ.nx)*spaceScale   ,(o[1]+lnQ2.ny-lnQ.ny)*spaceScale , (o[2]+lnQ2.nz-lnQ.nz)*spaceScale + 0.5 * normal_del  ))
				        
					normalColors.push( new THREE.Color( 255,0,0,255 ))
					normalColors.push( new THREE.Color( 255,0,0,255 ))
					normalColors.push( new THREE.Color( 0,255,0,255 ))
					normalColors.push( new THREE.Color( 0,255,0,255 ))
					normalColors.push( new THREE.Color( 0,0,255,255))
					normalColors.push( new THREE.Color( 0,0,255,255 ))
				        
				        
					normalVertices.push( new THREE.Vector3( (o[0]+lnQ2.nx-lnQ.nx)*spaceScale   ,(o[1]+lnQ2.ny-lnQ.ny)*spaceScale  , (o[2]+lnQ2.nz-lnQ.nz)*spaceScale ))
					normalVertices.push( new THREE.Vector3( (o[0]+lnQ2.nx)*spaceScale          ,(o[1]+lnQ2.ny)*spaceScale                     , (o[2]+lnQ2.nz)*spaceScale ))
					normalColors.push( new THREE.Color( 0,0,0,255 ))
					normalColors.push( new THREE.Color( 1.0,1.0,1.0,255))
				}
		        
				if( 0 ) {
				normalVertices.push( new THREE.Vector3( (o[0]+lnQ2.nx)*spaceScale   ,(o[1]+lnQ2.ny)*spaceScale , (o[2]+lnQ2.nz)*spaceScale ))
				normalVertices.push( new THREE.Vector3( (o[0]+lnQ.nx)*spaceScale    ,(o[1]+lnQ.ny)*spaceScale  , (o[2]+lnQ.nz)*spaceScale ))
				normalColors.push( new THREE.Color( 0,0,0,255 ))
				normalColors.push( new THREE.Color( 0.0,1.0,0.0,255))
				}
		        
				if( 0 ) {
					normalVertices.push( new THREE.Vector3( (o[0]+lnQ2.nx)*spaceScale - 0.5 * normal_del   ,(o[1]+lnQ2.ny)*spaceScale                     , (o[2]+lnQ2.nz)*spaceScale ))
					normalVertices.push( new THREE.Vector3( (o[0]+lnQ2.nx)*spaceScale + 0.5 * normal_del   ,(o[1]+lnQ2.ny)*spaceScale                     , (o[2]+lnQ2.nz)*spaceScale ))
		                        
					normalVertices.push( new THREE.Vector3( (o[0]+lnQ2.nx)*spaceScale                      ,(o[1]+lnQ2.ny)*spaceScale - 0.5 * normal_del  , (o[2]+lnQ2.nz)*spaceScale  ))
					normalVertices.push( new THREE.Vector3( (o[0]+lnQ2.nx)*spaceScale                      ,(o[1]+lnQ2.ny)*spaceScale + 0.5 * normal_del  , (o[2]+lnQ2.nz)*spaceScale  ))
					                                                                                      
					normalVertices.push( new THREE.Vector3( (o[0]+lnQ2.nx)*spaceScale                      ,(o[1]+lnQ2.ny)*spaceScale                     , (o[2]+lnQ2.nz)*spaceScale - 0.5 * normal_del  ))
					normalVertices.push( new THREE.Vector3( (o[0]+lnQ2.nx)*spaceScale                      ,(o[1]+lnQ2.ny)*spaceScale                     , (o[2]+lnQ2.nz)*spaceScale + 0.5 * normal_del  ))
			                if( Math.abs(t) < 0.005 ) {
						normalColors.push( new THREE.Color( 1.0,0.6,0.6,255 ))
						normalColors.push( new THREE.Color( 1.0,0.6,0.6,255 ))
						normalColors.push( new THREE.Color( 0.6,1.0,0.6,255 ))
						normalColors.push( new THREE.Color( 0.6,1.0,0.6,255 ))
						normalColors.push( new THREE.Color( 0.6,0.6,1.0,255))
						normalColors.push( new THREE.Color( 0.6,0.6,1.0,255 ))
					} else if( Math.abs( t-B) < 0.01 ) {
						normalColors.push( new THREE.Color( 1.0,0.3,0.3,255 ))
						normalColors.push( new THREE.Color( 1.0,0.3,0.3,255 ))
						normalColors.push( new THREE.Color( 0.3,1.0,0.3,255 ))
						normalColors.push( new THREE.Color( 0.3,1.0,0.3,255 ))
						normalColors.push( new THREE.Color( 0.3,0.3,1.0,255))
						normalColors.push( new THREE.Color( 0.3,0.3,1.0,255 ))
	                                
					} else {
						normalColors.push( new THREE.Color( 0.5,0,0,255 ))
						normalColors.push( new THREE.Color( 0.5,0,0,255 ))
						normalColors.push( new THREE.Color( 0,0.5,0,255 ))
						normalColors.push( new THREE.Color( 0,0.5,0,255 ))
						normalColors.push( new THREE.Color( 0,0,0.5,255 ))
						normalColors.push( new THREE.Color( 0,0,0.5,255 ))
				        
					}
				}
			

		if(1) { // graph of rotations...
				normalVertices.push( new THREE.Vector3( (o[0]+(t)*Math.PI)*spaceScale - 0.5 * normal_del   ,(o[1]+(lnQ2.θ))*spaceScale                     , (o[2]+(0))*spaceScale ))
				normalVertices.push( new THREE.Vector3( (o[0]+(t)*Math.PI)*spaceScale + 0.5 * normal_del   ,(o[1]+(lnQ2.θ))*spaceScale                     , (o[2]+(0))*spaceScale ))
				                                                                                                                                             
				normalVertices.push( new THREE.Vector3( (o[0]+(t)*Math.PI)*spaceScale                      ,(o[1]+(lnQ2.θ))*spaceScale - 0.5 * normal_del  , (o[2]+(0))*spaceScale  ))
				normalVertices.push( new THREE.Vector3( (o[0]+(t)*Math.PI)*spaceScale                      ,(o[1]+(lnQ2.θ))*spaceScale + 0.5 * normal_del  , (o[2]+(0))*spaceScale  ))
				                                                                                                                                             
				normalVertices.push( new THREE.Vector3( (o[0]+(t)*Math.PI)*spaceScale                      ,(o[1]+(lnQ2.θ))*spaceScale                     , (o[2]+(0))*spaceScale - 0.5 * normal_del  ))
				normalVertices.push( new THREE.Vector3( (o[0]+(t)*Math.PI)*spaceScale                      ,(o[1]+(lnQ2.θ))*spaceScale                     , (o[2]+(0))*spaceScale + 0.5 * normal_del  ))


			        if( Math.abs(t) < 0.05 ) {
					normalColors.push( new THREE.Color( 1.0,0.6,0.6,255 ))
					normalColors.push( new THREE.Color( 1.0,0.6,0.6,255 ))
					normalColors.push( new THREE.Color( 0.6,1.0,0.6,255 ))
					normalColors.push( new THREE.Color( 0.6,1.0,0.6,255 ))
					normalColors.push( new THREE.Color( 0.6,0.6,1.0,255))
					normalColors.push( new THREE.Color( 0.6,0.6,1.0,255 ))
				} else if( Math.abs( t-B) < 0.05 ) {
					normalColors.push( new THREE.Color( 1.0,0.3,0.3,255 ))
					normalColors.push( new THREE.Color( 1.0,0.3,0.3,255 ))
					normalColors.push( new THREE.Color( 0.3,1.0,0.3,255 ))
					normalColors.push( new THREE.Color( 0.3,1.0,0.3,255 ))
					normalColors.push( new THREE.Color( 0.3,0.3,1.0,255))
					normalColors.push( new THREE.Color( 0.3,0.3,1.0,255 ))
	
				} else {
					normalColors.push( new THREE.Color( 0.5,0,0,255 ))
					normalColors.push( new THREE.Color( 0.5,0,0,255 ))
					normalColors.push( new THREE.Color( 0,0.5,0,255 ))
					normalColors.push( new THREE.Color( 0,0.5,0,255 ))
					normalColors.push( new THREE.Color( 0,0,0.5,255 ))
					normalColors.push( new THREE.Color( 0,0,0.5,255 ))
				}
		}

		if(1) { // recti-linear scaled points ... 

			const basis = lnQ2.getBasis( );
			normalVertices.push( new THREE.Vector3( ((lnQ2.nx*lnQ2.θ))*spaceScale                             ,((lnQ2.ny*lnQ2.θ))*spaceScale                             , ((lnQ2.nz*lnQ2.θ))*spaceScale ))
			normalVertices.push( new THREE.Vector3( ((lnQ2.nx*lnQ2.θ))*spaceScale + basis.right.x*normal_del  ,((lnQ2.ny*lnQ2.θ))*spaceScale + basis.right.y*normal_del  , ((lnQ2.nz*lnQ2.θ))*spaceScale + basis.right.z*normal_del ))
			                                                                                                                                                                           
			normalVertices.push( new THREE.Vector3( ((lnQ2.nx*lnQ2.θ))*spaceScale                             ,((lnQ2.ny*lnQ2.θ))*spaceScale                             , ((lnQ2.nz*lnQ2.θ))*spaceScale ))
			normalVertices.push( new THREE.Vector3( ((lnQ2.nx*lnQ2.θ))*spaceScale + basis.up.x*normal_del     ,((lnQ2.ny*lnQ2.θ))*spaceScale + basis.up.y*normal_del     , ((lnQ2.nz*lnQ2.θ))*spaceScale + basis.up.z*normal_del ))
			                                                                                                                                                                           
			normalVertices.push( new THREE.Vector3( ((lnQ2.nx*lnQ2.θ))*spaceScale                             ,((lnQ2.ny*lnQ2.θ))*spaceScale                             , ((lnQ2.nz*lnQ2.θ))*spaceScale ))
			normalVertices.push( new THREE.Vector3( ((lnQ2.nx*lnQ2.θ))*spaceScale + basis.forward.x*normal_del,((lnQ2.ny*lnQ2.θ))*spaceScale + basis.forward.y*normal_del, ((lnQ2.nz*lnQ2.θ))*spaceScale + basis.forward.z*normal_del ))


			        if( t == 0 ) {
					normalColors.push( new THREE.Color( 1.0,0.6,0.6,255 ))
					normalColors.push( new THREE.Color( 1.0,0.6,0.6,255 ))
					normalColors.push( new THREE.Color( 0.6,1.0,0.6,255 ))
					normalColors.push( new THREE.Color( 0.6,1.0,0.6,255 ))
					normalColors.push( new THREE.Color( 0.6,0.6,1.0,255))
					normalColors.push( new THREE.Color( 0.6,0.6,1.0,255 ))
				} else if( Math.abs( t-B) < 0.05 ) {
					normalColors.push( new THREE.Color( 1.0,0.3,0.3,255 ))
					normalColors.push( new THREE.Color( 1.0,0.3,0.3,255 ))
					normalColors.push( new THREE.Color( 0.3,1.0,0.3,255 ))
					normalColors.push( new THREE.Color( 0.3,1.0,0.3,255 ))
					normalColors.push( new THREE.Color( 0.3,0.3,1.0,255))
					normalColors.push( new THREE.Color( 0.3,0.3,1.0,255 ))
	
				} else {
					normalColors.push( new THREE.Color( 0.5,0,0,255 ))
					normalColors.push( new THREE.Color( 0.5,0,0,255 ))
					normalColors.push( new THREE.Color( 0,0.5,0,255 ))
					normalColors.push( new THREE.Color( 0,0.5,0,255 ))
					normalColors.push( new THREE.Color( 0,0,0.5,255 ))
					normalColors.push( new THREE.Color( 0,0,0.5,255 ))
				}
		if( E < 2 )
			drawRange( lnQ2.x,lnQ2.y,lnQ2.z, Math.PI/64, 5 );


		}
	 if(1) { // drop liens to axiess...
			if( lnQ2.nx < 0 ) {
				normalVertices.push( new THREE.Vector3( (o[0]+(lnQ2.nx*lnQ2.θ))*spaceScale - 0.5 * normal_del   ,(o[1]+(lnQ2.ny*lnQ2.θ))*spaceScale                     , (o[2]+(lnQ2.nz*lnQ2.θ))*spaceScale ))
				normalVertices.push( new THREE.Vector3( (o[0])*spaceScale    ,(o[1]+(lnQ2.ny*lnQ2.θ))*spaceScale                     , (o[2]+(lnQ2.nz*lnQ2.θ))*spaceScale ))
			}else {
				normalVertices.push( new THREE.Vector3( (o[0])*spaceScale   ,(o[1]+(lnQ2.ny*lnQ2.θ))*spaceScale                     , (o[2]+(lnQ2.nz*lnQ2.θ))*spaceScale ))
				normalVertices.push( new THREE.Vector3( (o[0]+(lnQ2.nx*lnQ2.θ))*spaceScale + 0.5 * normal_del   ,(o[1]+(lnQ2.ny*lnQ2.θ))*spaceScale                     , (o[2]+(lnQ2.nz*lnQ2.θ))*spaceScale ))
			}                                                                                                                                                                                   
			if( lnQ2.nx < 0 ) {
				normalVertices.push( new THREE.Vector3( (o[0]+(lnQ2.nx*lnQ2.θ))*spaceScale                      ,(o[1]+(lnQ2.ny*lnQ2.θ))*spaceScale - 0.5 * normal_del  , (o[2]+(lnQ2.nz*lnQ2.θ))*spaceScale  ))
				normalVertices.push( new THREE.Vector3( (o[0]+(lnQ2.nx*lnQ2.θ))*spaceScale                      ,(o[1])*spaceScale   , (o[2]+(lnQ2.nz*lnQ2.θ))*spaceScale  ))
			}else {
				normalVertices.push( new THREE.Vector3( (o[0]+(lnQ2.nx*lnQ2.θ))*spaceScale                      ,(o[1])*spaceScale  , (o[2]+(lnQ2.nz*lnQ2.θ))*spaceScale  ))
				normalVertices.push( new THREE.Vector3( (o[0]+(lnQ2.nx*lnQ2.θ))*spaceScale                      ,(o[1]+(lnQ2.ny*lnQ2.θ))*spaceScale + 0.5 * normal_del  , (o[2]+(lnQ2.nz*lnQ2.θ))*spaceScale  ))
			}
			if( lnQ2.nz < 0 ) {
				normalVertices.push( new THREE.Vector3( (o[0]+(lnQ2.nx*lnQ2.θ))*spaceScale                      ,(o[1]+(lnQ2.ny*lnQ2.θ))*spaceScale                     , (o[2]+(lnQ2.nz*lnQ2.θ))*spaceScale - 0.5 * normal_del  ))
				normalVertices.push( new THREE.Vector3( (o[0]+(lnQ2.nx*lnQ2.θ))*spaceScale                      ,(o[1]+(lnQ2.ny*lnQ2.θ))*spaceScale                     , (o[2])*spaceScale  ))
			}else {
				normalVertices.push( new THREE.Vector3( (o[0]+(lnQ2.nx*lnQ2.θ))*spaceScale                      ,(o[1]+(lnQ2.ny*lnQ2.θ))*spaceScale                     , (o[2])*spaceScale  ))
				normalVertices.push( new THREE.Vector3( (o[0]+(lnQ2.nx*lnQ2.θ))*spaceScale                      ,(o[1]+(lnQ2.ny*lnQ2.θ))*spaceScale                     , (o[2]+(lnQ2.nz*lnQ2.θ))*spaceScale + 0.5 * normal_del  ))
				
			}

			        if( t == 0 ) {
					normalColors.push( new THREE.Color( 1.0,0.6,0.6,255 ))
					normalColors.push( new THREE.Color( 1.0,0.6,0.6,255 ))
					normalColors.push( new THREE.Color( 0.6,1.0,0.6,255 ))
					normalColors.push( new THREE.Color( 0.6,1.0,0.6,255 ))
					normalColors.push( new THREE.Color( 0.6,0.6,1.0,255))
					normalColors.push( new THREE.Color( 0.6,0.6,1.0,255 ))
				} else if( Math.abs( t-B) < 0.005 ) {
					normalColors.push( new THREE.Color( 1.0,0.3,0.3,255 ))
					normalColors.push( new THREE.Color( 1.0,0.3,0.3,255 ))
					normalColors.push( new THREE.Color( 0.3,1.0,0.3,255 ))
					normalColors.push( new THREE.Color( 0.3,1.0,0.3,255 ))
					normalColors.push( new THREE.Color( 0.3,0.3,1.0,255))
					normalColors.push( new THREE.Color( 0.3,0.3,1.0,255 ))
	
				} else {
					normalColors.push( new THREE.Color( 0.5,0,0,255 ))
					normalColors.push( new THREE.Color( 0.5,0,0,255 ))
					normalColors.push( new THREE.Color( 0,0.5,0,255 ))
					normalColors.push( new THREE.Color( 0,0.5,0,255 ))
					normalColors.push( new THREE.Color( 0,0,0.5,255 ))
					normalColors.push( new THREE.Color( 0,0,0.5,255 ))
				}
		}

			        }
			        
	if( showCoordinateGrid ) {
		const range = (Math.floor(E) + 2 ) * Math.PI;
		const minRange = (Math.floor(E) +1 ) * Math.PI;
		drawRange( 0,0,0, range, 40, 2*Math.PI );
	}
	// graph of location to rotation... 
	function drawRange( cx,cy,cz,range,steps, minr ) {
		if( !minr ) minr = 0;
		const normLen = 0.25*(steps/range);
	for( let x = -range; x <= range;  x += (2*range)/steps ) {
		for( let y = -range; y <= range;  y += (2*range)/steps ) {
			for( let z = -range; z <= range; z += (2*range)/steps ) {
			if( (Math.abs(z)+Math.abs(y)+Math.abs(x)) > minr ) continue;
				const lnQ = new lnQuat( 0, cx+x, cy+y, cz+z );
			const basis = lnQ.getBasis( );

			// the original normal direction; projected offset of sphere (linear scaled)
			//normalVertices.push( new THREE.Vector3( x*spaceScale,0*spaceScale, z*spaceScale ))
			//normalVertices.push( new THREE.Vector3( x*spaceScale + 1*normal_del,0*spaceScale + 1*normal_del,z*spaceScale + 1*normal_del ))
			//normalColors.push( new THREE.Color( 255,0,255,255 ))
			//normalColors.push( new THREE.Color( 255,0,255,255 ))

			const θ = (Math.abs(lnQ.x) + Math.abs(lnQ.y) + Math.abs(lnQ.z))/2;
			//const nR = Math.sqrt( lnQ.x*lnQ.x+lnQ.y*lnQ.y+lnQ.z*lnQ.z );
			const ox = lnQ.θ*lnQ.nx;
			const oy = lnQ.θ*lnQ.ny;
			const oz = lnQ.θ*lnQ.nz;
			//const ox = n*x * (Math.sqrt(x*x+y*y+z*z)) ;
			//const oy = n*y  * (Math.sqrt(x*x+y*y+z*z)) ;
			//const oz = n*z  *(Math.sqrt(x*x+y*y+z*z)) ;
			//const ox = x /  (Math.abs(x) + Math.abs(y) + Math.abs(z) ) ;
			//const oy = y  / (Math.abs(x) + Math.abs(y) + Math.abs(z) );
			//const oz = z  / (Math.abs(x) + Math.abs(y) + Math.abs(z) );
	
			normalVertices.push( new THREE.Vector3( ox*spaceScale                             ,oy*spaceScale                             , oz*spaceScale ))
			normalVertices.push( new THREE.Vector3( ox*spaceScale + basis.right.x*normal_del/normLen  ,oy*spaceScale + basis.right.y*normal_del /normLen , oz*spaceScale + basis.right.z*normal_del/normLen ))
			                                                                                                                                
			normalVertices.push( new THREE.Vector3( ox*spaceScale                             ,oy*spaceScale                             , oz*spaceScale ))
			normalVertices.push( new THREE.Vector3( ox*spaceScale + basis.up.x*normal_del/normLen     ,oy*spaceScale + basis.up.y*normal_del/normLen     , oz*spaceScale + basis.up.z*normal_del/normLen ))
			                                                                                                                                
			normalVertices.push( new THREE.Vector3( ox*spaceScale                             ,oy*spaceScale                             , oz*spaceScale ))
			normalVertices.push( new THREE.Vector3( ox*spaceScale + basis.forward.x*normal_del/normLen,oy*spaceScale + basis.forward.y*normal_del/normLen, oz*spaceScale + basis.forward.z*normal_del/normLen ))

			normalColors.push( new THREE.Color( 255,0,0,255 ))
			normalColors.push( new THREE.Color( 255,0,0,255 ))
			normalColors.push( new THREE.Color( 0,255,0,255 ))
			normalColors.push( new THREE.Color( 0,255,0,255 ))
			normalColors.push( new THREE.Color( 0,0,255,255))
			normalColors.push( new THREE.Color( 0,0,255,255 ))
			
				
			}
			
		}
		
	}
	
	}
			 console.log( "MINMAX:", minL, maxL, minL+maxL );
			}
			}
		}
}


function QuatPathing(q_, v, c,normalVertices,normalColors) {
	const spaceScale = 5;
	const normal_del = 1;
	const q = new lnQuat( q_ );

	const o = [6/spaceScale,+6/spaceScale,+6/spaceScale];
	let prior_v = null;
	for( var x = -0.0; x < 0.25; x+= 0.02 ) {
		q.twist( x );
		prior_v = null;        	
		var t = 0;
		for( ; t <= 1; t+=0.1 ) {
			
			const new_v = q.applyDel( v, t );
			new_v.x += o[0];new_v.y += o[1];new_v.z += o[2];
				if( prior_v ) {
					normalVertices.push( new THREE.Vector3( prior_v.x*spaceScale,prior_v.y*spaceScale, prior_v.z*spaceScale ))
					normalVertices.push( new THREE.Vector3( new_v.x*spaceScale,new_v.y*spaceScale, new_v.z*spaceScale ))
					normalColors.push( c)
					normalColors.push( c)
				}
				prior_v = new_v;
			if( (t % 0.750 ) <= 0.01 || t >=0.99  ) {
				const basis = q.getBasisT( t );
	        
				normalVertices.push( new THREE.Vector3( new_v.x*spaceScale                           ,new_v.y*spaceScale                           , new_v.z*spaceScale ))
				normalVertices.push( new THREE.Vector3( new_v.x*spaceScale + basis.right.x*normal_del,new_v.y*spaceScale + basis.right.y*normal_del, new_v.z*spaceScale + basis.right.z*normal_del ))
	        
				normalVertices.push( new THREE.Vector3( new_v.x*spaceScale                        ,new_v.y*spaceScale                        , new_v.z*spaceScale ))
				normalVertices.push( new THREE.Vector3( new_v.x*spaceScale + basis.up.x*normal_del,new_v.y*spaceScale + basis.up.y*normal_del,new_v.z*spaceScale + basis.up.z*normal_del ))
	        
				normalVertices.push( new THREE.Vector3( new_v.x*spaceScale                             ,new_v.y*spaceScale                             , new_v.z*spaceScale ))
				normalVertices.push( new THREE.Vector3( new_v.x*spaceScale + basis.forward.x*normal_del,new_v.y*spaceScale + basis.forward.y*normal_del,new_v.z*spaceScale + basis.forward.z*normal_del ))
	        
				normalColors.push( new THREE.Color( 255,0,0,255 ))
				normalColors.push( new THREE.Color( 255,0,0,255 ))
				normalColors.push( new THREE.Color( 0,255,0,255 ))
				normalColors.push( new THREE.Color( 0,255,0,255 ))
				normalColors.push( new THREE.Color( 0,0,255,255))
				normalColors.push( new THREE.Color( 0,0,255,255 ))
	        
			}
		};
	}
}




function DrawQuatNormals(normalVertices,normalColors) {
	const v = { x:0,y:1,z:0};
	const spaceScale = 5;
	const normal_del = 1;
	if(0)
	for( let t = 0.1; t < 1.1*Math.PI; t+= 0.05 ){
			const x = Math.sin(t );
			const z = -Math.cos(t);
			const lnQ = new lnQuat( {x:x, y:0, z:z } );

			const new_v = lnQ.apply( v );

			const basis = lnQ.getBasis( );

			// the original normal direction; projected offset of sphere (linear scaled)
			//normalVertices.push( new THREE.Vector3( x*spaceScale,0*spaceScale, z*spaceScale ))
			//normalVertices.push( new THREE.Vector3( x*spaceScale + 1*normal_del,0*spaceScale + 1*normal_del,z*spaceScale + 1*normal_del ))
			//normalColors.push( new THREE.Color( 255,0,255,255 ))
			//normalColors.push( new THREE.Color( 255,0,255,255 ))

			normalVertices.push( new THREE.Vector3( new_v.x*spaceScale                           ,new_v.y*spaceScale                           , new_v.z*spaceScale ))
			normalVertices.push( new THREE.Vector3( new_v.x*spaceScale + basis.right.x*normal_del,new_v.y*spaceScale + basis.right.y*normal_del, new_v.z*spaceScale + basis.right.z*normal_del ))

			normalVertices.push( new THREE.Vector3( new_v.x*spaceScale                        ,new_v.y*spaceScale                        , new_v.z*spaceScale ))
			normalVertices.push( new THREE.Vector3( new_v.x*spaceScale + basis.up.x*normal_del,new_v.y*spaceScale + basis.up.y*normal_del,new_v.z*spaceScale + basis.up.z*normal_del ))

			normalVertices.push( new THREE.Vector3( new_v.x*spaceScale                             ,new_v.y*spaceScale                             , new_v.z*spaceScale ))
			normalVertices.push( new THREE.Vector3( new_v.x*spaceScale + basis.forward.x*normal_del,new_v.y*spaceScale + basis.forward.y*normal_del,new_v.z*spaceScale + basis.forward.z*normal_del ))

			normalColors.push( new THREE.Color( 255,0,0,255 ))
			normalColors.push( new THREE.Color( 255,0,0,255 ))
			normalColors.push( new THREE.Color( 0,255,0,255 ))
			normalColors.push( new THREE.Color( 0,255,0,255 ))
			normalColors.push( new THREE.Color( 0,0,255,255))
			normalColors.push( new THREE.Color( 0,0,255,255 ))
			
	
	}
	drawN( new lnQuat( {x:0,y:1,z:0 } ), {x:0,y:1,z:0} );
	drawN( new lnQuat( {x:0,y:-1,z:0 } ), {x:0,y:-1,z:0} );
if(drawNormalBall/*draw normal ball with twist*/)
	for( let h = 1*-1; h <= 1; h+= 0.1/2 ) {
		for( let t = 1*-Math.PI; t < 1*Math.PI; t+= 0.25/2 ){
			let x = Math.sin(t );
			const z = Math.cos(t);
			let norm ;
			const lnQ = new lnQuat( norm={x:x*(1-Math.abs(h)), y:h, z:z*(1-Math.abs(h)) } );
			//lnQ.twist( twistDelta );
		drawN( lnQ, norm );
	}
	}

	if(0)
	for( let h = -1; h <= 1; h+= 0.25 ) {
		if( h < 0.6 ) continue;
	for( let t = Math.PI; t < Math.PI*3/2; t+= 0.25 ){
			let x = Math.sin(t );
			const z = Math.cos(t);
			let norm ;
			const lnQ = new lnQuat( norm={x:x*(1-Math.abs(h)), y:h, z:z*(1-Math.abs(h)) } );
		drawN( lnQ, norm );
	}
	}
	function drawN( lnQ, n )
	{
			const new_v = lnQ.apply( v );

			const basis = lnQ.getBasis( );

			// the original normal direction; projected offset of sphere (linear scaled)
			//normalVertices.push( new THREE.Vector3( x*spaceScale,y*spaceScale, z*spaceScale ))
			//normalVertices.push( new THREE.Vector3( x*spaceScale + x*l*normal_del,y*spaceScale + y*l*normal_del,z*spaceScale + z*l*normal_del ))
			//normalColors.push( new THREE.Color( 255,0,255,255 ))
			//normalColors.push( new THREE.Color( 255,0,255,255 ))

			normalVertices.push( new THREE.Vector3( new_v.x*spaceScale,new_v.y*spaceScale, new_v.z*spaceScale ))
			normalVertices.push( new THREE.Vector3( new_v.x*spaceScale + basis.right.x*normal_del,new_v.y*spaceScale + basis.right.y*normal_del,new_v.z*spaceScale + basis.right.z*normal_del ))

			normalVertices.push( new THREE.Vector3( new_v.x*spaceScale                        ,new_v.y*spaceScale                        , new_v.z*spaceScale ))
			normalVertices.push( new THREE.Vector3( new_v.x*spaceScale + basis.up.x*normal_del,new_v.y*spaceScale + basis.up.y*normal_del,new_v.z*spaceScale + basis.up.z*normal_del ))

			normalVertices.push( new THREE.Vector3( new_v.x*spaceScale                             ,new_v.y*spaceScale                             , new_v.z*spaceScale ))
			normalVertices.push( new THREE.Vector3( new_v.x*spaceScale + basis.forward.x*normal_del,new_v.y*spaceScale + basis.forward.y*normal_del,new_v.z*spaceScale + basis.forward.z*normal_del ))

			normalColors.push( new THREE.Color( 255,0,0,255 ))
			normalColors.push( new THREE.Color( 255,0,0,255 ))
			normalColors.push( new THREE.Color( 0,255,0,255 ))
			normalColors.push( new THREE.Color( 0,255,0,255 ))
			normalColors.push( new THREE.Color( 0,0,255,255))
			normalColors.push( new THREE.Color( 0,0,255,255 ))
			
	
	}


}
function DrawQuatPaths(normalVertices,normalColors) {

			let lnQX = document.getElementById( "lnQX" ).value;
			let lnQY = document.getElementById( "lnQY" ).value;
			let lnQZ = document.getElementById( "lnQZ" ).value;
			let lnQT = document.getElementById( "lnQT" ).value;
			let lnQA = document.getElementById( "lnQA" ).value;

			//A = (lnQX/10-5)/10;

			//let lnQ = new lnQuat(  { a:(lnQT/100+1)*(lnQX/10-5)/20 , b:(lnQT/100+1)*(B=(lnQY/10-5)/20) , c: (lnQT/100+1)*(C=(lnQZ/10-5)/20)  } );
			T = (lnQT/500-1);
			E=lnQA/100;
			let lnQ = new lnQuat( 0, (A=lnQX/500-1) , (B=lnQY/500-1) , (C=lnQZ/500-1)   );
	A = A * Math.PI*4;
	B = B * Math.PI*2;
	C = C * Math.PI*4;
	T = T * Math.PI*4;
	E = E * 30;
	D = T ;
	twistDelta = A;


	let check = document.getElementById( "showCoordinateGrid" );
	if( check ) {
		showCoordinateGrid = check.checked;
	}
	check = document.getElementById( "drawNormalBall" );
	if( check ) {
		drawNormalBall = check.checked;
	}
	document.getElementById( "lnQXval").textContent = A;
	document.getElementById( "lnQYval").textContent = B;
	document.getElementById( "lnQZval").textContent = C;
	document.getElementById( "lnQTval").textContent = T;
	document.getElementById( "lnQAval").textContent = E;

                        DrawQuatNormals(normalVertices,normalColors);

	const xAxis = {x:1,y:0,z:0};
	const yAxis = {x:0,y:1,z:0};
	const zAxis = {x:0,y:0,z:1};
	const cx = new THREE.Color( 192,192,0,255 );
	const cy = new THREE.Color( 128,128,128,255 );
	const cz = new THREE.Color( 0,192,192,255 );
	QuatPathing2( lnQ, yAxis, cy,normalVertices,normalColors );

	//QuatPathing( lnQ, xAxis, cx,normalVertices,normalColors );
	//QuatPathing( lnQ, yAxis, cy,normalVertices,normalColors );
	//QuatPathing( lnQ, zAxis, cz,normalVertices,normalColors );
}


