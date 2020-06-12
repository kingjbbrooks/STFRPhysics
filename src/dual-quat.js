
// Object relative orientation and position is represented with a dualLnQuat with( angleUp, lookAtNormal ), (my position within parent)

/* The 'world' would be started with a dual-quat */

// control whether type and normalization (sanity) checks are done..
const ASSERT = false;
// how much of an angle is required before a thing is 'turning'
// this is like in radians per tick... 
// tick = (1000/1) ticks/second
// 1/10,000th of 1/2pi (so like * 6.2)
const NO_TURN_ANGLE = 0.000_000_01;  
const SIN_R_OVER_R_MIN = 0.00001;

const world = new dlnQuat( new lnQuat(), new dualQuat() );
// add 0, rotation 0.

const someObject = new dlnQuat( new lnQuat( 0, {x:0, y:0, z:1} ), new dualQuat(0, 0, 10) );
const Tree = new dlnQuat( new lnQuat( 0, {x:0, y:1, z:0} ), new dualQuat(5, 0, -2) );
const treeTop = new dlnQuat( new lnQuat( 0, { x:0, y:1, z:0} ), new dualQuat( 0, 0, 0 ) );
const branch1 = new dlnQuat( new lnQuat( 54/180*Math.PI, { x:0.4, y:0.3, z:0.2} ), new dualQuat( 5, 0, 0 ) );

// world is 0, 0, 0, 0, 0, 0, 0.
// first object            cT   = is ( world.addNew(someObject.lnQ), world.lnQ.applyExp( someObject.dQ ) )
// first tree              tT   = is ( world.addNew(Tree.lnQ)      , world.lnQ.applyExp( Tree.dQ ) )
// first tree's top        ttT  = is ( tT.addNew(treeTop.lnQ)      , tT.lnQ.applyExp( treeTop.dQ ) )
// first tree's top branch ttbT = is ( ttT.addNew(branch1.lnQ)     , ttT.lnQ.applyExp( branch1.dQ ) )

// ttbcT = ttbT -> cT = ( cttbT.lnQ=(ttbT.lnQ - CT.lnQ), cttbT.lnQ.applyExpInv(ttbT.dQ - cT.dq) )
// basis = { forward : ttbcT.apply( {x:0,y:0,z:1} )
//         , right : ttbcT.apply( {x:1,y:0,z:0} )
//         , up : ttbcT.apply( {x:0,y:1,z:0} )
// 

const test = true;


// 
//   x y z w -> i j k R

function Quat( theta,d, a, b ) {
	if( "undefined" !== typeof theta ) {
		if( "undefined" !== typeof a ) {
			// create with 4 raw coordinates
			this.w = theta;
			this.x = d;
			this.y = a;
			this.z = b;
			return;
		}
		const ct2 = Math.cos( theta/2 );
		const st2 = Math.sin( theta/2 );
		this.w = ct2;
		this.x = d.x * st2;
		this.y = d.y * st2;
		this.z = d.z * st2;
	} else {
		this.w = 1;
		this.x = 0;
		this.y = 0;
		this.z = 0;
	}
}

//https://blog.molecular-matters.com/2013/05/24/a-faster-quaternion-vector-multiplication/
//https://www.html5gamedevs.com/topic/32934-multiply-a-vector3-times-a-quaternion/  (code; credits above)
Quat.prototype.apply = function( v ) {
        const q = this;
	const tx = 2 * (q.y * v.z - q.z * v.y);
	const ty = 2 * (q.z * v.x - q.x * v.z);
	const tz = 2 * (q.x * v.y - q.y * v.x);

	return {  x : v.x + q.w * tx + ( q.y * tz - ty * q.z )
		, y : v.y + q.w * ty + ( q.z * tx - tz * q.x )
		, z : v.z + q.w * tz + ( q.x * ty - tx * q.y ) };
}


Quat.prototype.getBasis = function() {
	const q = this;
	const basis = { right  : this.apply( { x:1, y:0, z:0 })
	              , up     : this.apply( { x:0, y:1, z:0 }) 
	              , forward: this.apply( { x:0, y:0, z:1 }) }; // 1.0
	return basis;
}

Quat.prototype.mul = function( q ) {

      //parse(P, w, x, y, z);

      // Q1 * Q2 = [w1 * w2 - dot(v1, v2), w1 * v2 + w2 * v1 + cross(v1, v2)]
      // Not commutative because cross(v1, v2) != cross(v2, v1)!  ( but cross(v1,v2) = -cross(v2,v1) )

      const w1 = this['w'];
      const x1 = this['x'];
      const y1 = this['y'];
      const z1 = this['z'];

      const w2 = q['w'];
      const x2 = q['x'];
      const y2 = q['y'];
      const z2 = q['z'];

      return new Quat(
              w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2,
              w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2,
              w1 * y2 + y1 * w2 + z1 * x2 - x1 * z2,
              w1 * z2 + z1 * w2 + x1 * y2 - y1 * x2);
	// 16+12
}


Quat.prototype.mulLong = function( q ) {
	const lnThis = this.log();
	const lnQ = q.log();
	lnThis.add( lnQ );
	const r = lnThis.exp();
	//console.log( "?", r, lnThis, lnQ );
	return r;
}

Quat.prototype.log = function( ) {
	const x = this.x;
	const y = this.y;
	const z = this.z;
	if( ASSERT ) {
		const l = 1/Math.sqrt(x*x + y*y + z*z );
		if( Math.abs( 1.0 - l ) > 0.001 ) console.log( "Input quat was denormalized", l );
	}

	const w = this.w;

	const r  = Math.sqrt(x*x+y*y+z*z);
	const t  = r>SIN_R_OVER_R_MIN? Math.atan2(r,w)/r: 0;

	const xt = x * t;
	const yt = y * t;
	const zt = z * t;
	//console.log( "Calculate log:", 0.5* Math.log(w*w+x*x+y*y+z*z), xt, yt, zt )
	return new lnQuat( 0, xt, yt, zt )
}


function lnQuat( theta, d, a, b ){
	this.w = 0;
	if( "undefined" !== typeof theta ) {
		if( "undefined" !== typeof a ) {
			if( ASSERT ) if( theta) throw new Error( "Why? I mean theta is always on the unit circle; else not a unit projection..." );
			// create with 4 raw coordinates
			this.w = theta; // 0
			this.x = d;
			this.y = a;
			this.z = b;
			this.r = Math.sqrt( d*d + a*a + b*b );
			// initial creation will allow more 'accuracy' than application...
			if( this.r > SIN_R_OVER_R_MIN ) {
				this.s  = Math.sin(this.r)/this.r;
				this.qw = Math.cos(this.r);
			} else {
				this.s  = 0;
				this.qw = 1;
			}
		}else {
			const dl = 1/Math.sqrt( d.x*d.x + d.y*d.y + d.z*d.z );

			const t  = dl*theta/2;
			// if no rotation, then nothing.
			if( t > NO_TURN_ANGLE ) {
				// 'proper' initialization would compute the quaternion, and take the log of it.
				// computation of the quaterion is just to fill in the 'w' part; which is (properly) 0.
				//  -- So this is (make a (normalized)quaternion)
				//const ct2 = Math.cos( t );  // sqrt( 1/2(1 + cos theta))  // half angle subst
				//const st2 = Math.sin( t );  // sqrt( 1/2(1 - cos theta))  // half angle subst
				//const w = ct2;               // sqrt( 1/2(1 + cos theta))
				//const x = dl * d.x * st2;    // sqrt( 1/2(1 - cos theta))
				//const y = dl * d.y * st2;    // sqrt( 1/2(1 - cos theta))
				//const z = dl * d.z * st2;    // sqrt( 1/2(1 - cos theta))
				//const r  = w*w + x*x+y*y+z*z ;
				//console.log( "D PART:", dl*dl*d.x*d.x, dl*dl*d.y*d.y, dl*dl*d.z*d.z, dl*dl*d.x*d.x+dl*dl*d.y*d.y+dl*dl*d.z*d.z );
				//console.log( "CTST PART:", ct2*ct2 + st2*st2 );
				//  w                        * w                          +  st2*st2                                     
				//               *  ( dl*dx * dl*dx + dl*dy * dl*dy + dl*dz * dl*dz )
				// sqrt( 1/2(1 + cos theta)) * sqrt( 1/2(1 + cos theta))  + sqrt( 1/2(1 - cos theta))*sqrt( 1/2(1 - cos theta)) 
				//               * ( x*x+y*y+z*z )
				// 1/2(1 + cos theta)  + 1/2(1 - cos theta) * ( x*x+y*y+z*z )
				// 1/2(1 + cos theta)  + 1/2(1 - cos theta) * (1)
				// 1/2 ( 1 + cos theta + 1 - cos theta)
				// 1
				//console.log( "Calculate log:", theta, "R=", r, "D=",d, "DL=", (x*x+y*y+z*z), st2*st2, "W=", 0.5* Math.log(r), Math.log(dl) )

				this.w = 0; // r is always 1.  0.5* Math.log(r);    // 0.5 is sqrt() moved outside
				this.x = d.x * t;
				this.y = d.y * t;
				this.z = d.z * t;
				this.r = t/dl;
				// initial creation will allow more 'accuracy' than application...
				this.s  = Math.sin(this.r)/this.r;
				this.qw = Math.cos(this.r);
			}else {
				this.x = 0;
				this.y = 0;
				this.z = 0;
				this.r = 0;
				this.s  = 0;
				this.qw = 1;
			}
		}
	} else {
		this.x = 0;
		this.y = 0;
		this.z = 0;
		this.r = 0;
		this.s  = 0;
		this.qw = 1;
	}
}

lnQuat.prototype.update = function() {
	// sqrt, 3 mul 2 add 1 div 1 sin 1 cos
	if( (this.r  = Math.sqrt( this.x*this.x + this.y*this.y + this.z*this.z ) ) > SIN_R_OVER_R_MIN ) {
		this.s  = Math.sin(this.r)/this.r;
		this.qw = Math.cos(this.r);
	} else {
		this.s = 0;
		this.qw = 1;
	}
	return this;
}

lnQuat.prototype.exp = function() {
	const q = this;
	//const r  = this.r;//Math.sqrt( q.x*q.x + q.y*q.y + q.z*q.z) ;
	//const et = 1;//Math.exp(q.w);
	const s  = this.s;//r>=SIN_R_OVER_R_MIN? /* et* */Math.sin(r)/r: 0;
	return new Quat( this.qw, q.x * s, q.y * s, q.z * s );
}

// returns the number of complete rotations removed; updates this to principal angle values.
lnQuat.prototype.prinicpal = function() {
	const q = new lnQuat();
	const r = this.r;
	const rMod  = Math.mod( r, (2*Math.PI) );
	const rDrop = r - rMod;
	
	if( ( rDrop / (Math.PI*2) ) > 0.5 )
	{
		// has a wrap; so update to principle angle values
		const rDiv = rMod/r;
		q.x = this.x * rDiv;
		q.y = this.y * rDiv;
		q.z = this.z * rDiv;
	}
	return q; // return removed part in 'turns' units
}

lnQuat.prototype.getTurns =  function() {
	const q = new lnQuat();
	const r = this.r;
	const rMod  = Math.mod( r, (2*Math.PI) );
	const rDrop = ( r - rMod ) / (2*Math.PI);
	
	return rDrop;
}

// this applies turns passed as if turns is a fraction of the current rate.
// this scales the rate of the turn... adding 0.1 turns adds 36 degrees.
// adding 3 turns adds 1920 degrees.
// turns is 0-1 for 0 to 100% turn.
// turns is from 0 to 1 turn; most turns should be between -0.5 and 0.5.
lnQuat.prototype.turn = function( turns ) {
	const q = this;
	const r  = q.r;
	
	const rDiv = (q.r+(turns*2*Math.PI))/r;
	this.x *= rDiv;
	this.y *= rDiv;
	this.z *= rDiv;
	return this;
}


// this increases the rotation, by an amount in a certain direction
// by euler angles even!
// turns is from 0 to 1 turn; most turns should be between -0.5 and 0.5.
lnQuat.prototype.torque = function( direction, turns ) {
	const q = this;
	const r  = direction.r;

	const rDiv = (turns*2*Math.PI)/r;
	this.x += direction.x*rDiv;
	this.y += direction.y*rDiv;
	this.z += direction.z*rDiv;
	return this;
}


lnQuat.prototype.getBasis = function() {
	const q = this;

	const basis = { forward:null
	              , right:null
	              , up:null
	              , origin: { x:0, y:0, z:0 } };
	if( q.w ) console.log( "0 +/- 0 is not 0?" );

	// 6+2 +sqrt+cos+sin
	const r  = this.r;
	//const et = 1;//Math.exp(q.w);
	if( r >= SIN_R_OVER_R_MIN ) {
		const s  = q.s;
	        
		const qw = q.qw;
		const qx = q.x * s;
		const qy = q.y * s;
		const qz = q.z * s;
		
		// 24+6
		{
			const ty = 2 * (qz);
			const tz = 2 * (-qy);

		 	basis.right = { x : 1 + 0       + ( qy * tz - ty * qz )
			              , y : 0 + qw * ty + ( 0       - tz * qx )
			              , z : 0 + qw * tz + ( qx * ty - 0 ) };
		}
		{
			const tx = 2 * ( -qz );
			const tz = 2 * (qx );

		 	basis.up = { x : 0 + qw * tx + ( qy * tz - 0 )
			           , y : 1 + 0       + ( qz * tx - tz * qx )
			           , z : 0 + qw * tz + ( 0       - tx * qy ) };
		}
		{
			const tx = 2 * (qy  );
			const ty = 2 * (- qx);

		 	basis.forward = { x : 0 + qw * tx + ( 0 - ty * qz )
			                , y : 0 + qw * ty + ( qz * tx - 0 )
			                , z : 1 + 0       + ( qx * ty - tx * qy ) };
		}
	} else {
		basis.right   = { x:1, y:0, z:0 };
		basis.up      = { x:0, y:1, z:0 };
		basis.forward = { x:0, y:0, z:1 };
	}
	return basis;	
}

lnQuat.prototype.apply = function( v ) {
	const q = this;

	// 3+2 +sqrt+exp+sin
        if( !q.r ) {
		// v is unmodified.	
		return {x:v.x, y:v.y, z:v.z }; // 1.0
	}
	const s  = q.s;
	const qw = q.qw;

	const qx = q.x * s;
	const qy = q.y * s;
	const qz = q.z * s;

	//p� = (v*v.dot(p) + v.cross(p)*(w))*2 + p*(w*w � v.dot(v))
	const tx = 2 * (qy * v.z - qz * v.y);
	const ty = 2 * (qz * v.x - qx * v.z);
	const tz = 2 * (qx * v.y - qy * v.x);
	return { x : v.x + qw * tx + ( qy * tz - ty * qz )
		, y : v.y + qw * ty + ( qz * tx - tz * qx )
		, z : v.z + qw * tz + ( qx * ty - tx * qy ) };

	// total 
	// 18 mul + 9 add
}


lnQuat.prototype.applyInv = function( v ) {
	//x y z w l
	const q = this;

        if( !q.r ) {
		// v is unmodified.	
		return {x:v.x, y:v.y, z:v.z }; // 1.0
	}
	const s  = q.s;
	const qw = q.qw;

	const qx = -q.x * s;
	const qy = -q.y * s;
	const qz = -q.z * s;

	const tx = 2 * (qy * v.z - qz * v.y);
	const ty = 2 * (qz * v.x - qx * v.z);
	const tz = 2 * (qx * v.y - qy * v.x);

	return { x : v.x + qw * tx + ( qy * tz - ty * qz )
	       , y : v.y + qw * ty + ( qz * tx - tz * qx )
	       , z : v.z + qw * tz + ( qx * ty - tx * qy ) };

	// total 
	// 18 mul + 9 add
}

lnQuat.prototype.add = function( q ) {
	//this.w += q.w;
	this.x += q.x;
	this.y += q.y;
	this.z += q.z;
	// 	// sqrt, 3 mul 2 add 1 div 1 sin 1 cos
	return this;
}

// rotate the passed lnQuat by the amount specified.
lnQuat.prototype.addNew = function( q ) {
	return new lnQuat().add(this).add(q).update();
}

// rotate the passed vector 'from' this space
lnQuat.prototype.subNew = function( q ) {
	const qRes = new lnQuat().add( this ).addConj( q );
	return qRes.update();
}

lnQuat.prototype.addConj = function( q ) {
	//this.w += q.w;
	this.x -= q.x;
	this.y -= q.y;
	this.z -= q.z;
	return this.update();
}


// offset coordinate
function dualQuat( x, y, z ) {
	this.w = -1.0; // mark it's a dual.
	this.x = x;
	this.y = y;
	this.z = z;
}

dualQuat.prototype.add = function( q ) {
	this.w += q.w;
	this.x += q.x;
	this.y += q.y;
	this.z += q.z;
	return this;
}

dualQuat.prototype.addNew = function( q ) {
	return new dualQuat().add(this).add(q);
}


// dual log-quat
//   log qaut keeps the orientation of the frame
//   dual of the quat keeps the offset of the origin of that quat.
//   it forms the orgin of a set of basis vectors describing the x-y-z space.

function dlnQuat( lnQ, dQ ) {
	this.lnQ = lnQ;
	this.dQ = dQ;
}

// Apply just the rotation to a point.
dlnQuat.prototype.applyRotation = function( v ) {
	return this.lnq.apply( v );
}

// Apply just the rotation to a point.
dlnQuat.prototype.applyInvRotation = function( v ) {
	return this.lnq.apply( v );
}

// Apply just the rotation to a rotation
// returns a new vector (usually the partial is saved for further use).
dlnQuat.prototype.applyRotationQ = function( q ) {
	if( !(q instanceof lnQuat) ) throw( new Error( "invalid parameter passed to applyRotationQ" ) );
	return this.lnQ.addNew( q );
}

// Apply the rotation to a rotation
// Apply the origin offset from the dual
// returns a new vector (usually the partial is saved for further use).

dlnQuat.prototype.applyTransform = function( v ) {
	const rV = this.lnq.apply( v );
	//const rO = this.lnQ.apply( this.dQ );
	rV.x += this.dQ.x;
	rV.y += this.dQ.y;
	rV.z += this.dQ.z;
	return rv;
}

// V is in the space of the dual rotated around 0.
dlnQuat.prototype.applyArmTransform = function( v ) {
	const rV = this.lnq.apply( v );
	const rO = this.lnQ.apply( this.dQ );
	rV.x += r0.x;
	rV.y += r0.y;
	rV.z += r0.z;
	return 
}


dlnQuat.prototype.applyArmTransformQ = function( q ) {
	return new dlnQuat( this.lnQ.addNew( q.lnQ ), this.dQ.addNew( q.dQ ) );
}


dlnQuat.prototype.applyArmTransformQ = function( q ) {
	// 
	return new dlnQuat( this.lnQ.addNew( q.lnQ ), this.dQ.addNew( q.dQ ) );
}


dlnQuat.prototype.applyArmTransformQ = function( q ) {
	// 
	return new dlnQuat( this.lnQ.addNew( q.lnQ ), this.dQ.addNew( q.dQ ) );
}




if( test )       {
	test1();
	function test1() {
		const q1 = new Quat( 30/ 180 * Math.PI, {x:0.5773, y:0.57735026919, z:0.57735026919 } );
		const q2 = new Quat( 17/ 180 * Math.PI, {x:0.5773, y:0.57735026919, z:0.57735026919 } );

		//const q1 = new Quat( 0, {x:1, y:0, z:0 } );
		//const q2 = new Quat( 90/ 180 * Math.PI, {x:0, y:1, z:0 } );

		const rlnq1 = new lnQuat( 30/ 180 * Math.PI, {x:0.5773, y:0.57735026919, z:0.57735026919 } );
		const rlnq2 = new lnQuat( 17/ 180 * Math.PI, {x:0.5773, y:0.57735026919, z:0.57735026919 } );
		//const rlnq1 = new lnQuat( 0, {x:1, y:0, z:0 } );
	//	const rlnq2 = new lnQuat( 90/ 180 * Math.PI, {x:0, y:1, z:0 } );

		const lnq1 = q1.log();
		const lnq2 = q2.log();
		console.log( "q1:", JSON.stringify( q1 ), "q2:", JSON.stringify( q2  ));
		console.log( "lnq1:", JSON.stringify( lnq1 ), "lnq2:", JSON.stringify( lnq2  ));
		console.log( "rlnq1:", JSON.stringify( rlnq1 ), "rlnq2:", JSON.stringify( rlnq2  ));
		const q1q2a = q1.mul( q2 );
		const q1q2b = q1.mulLong( q2 );
		console.log( "a:", JSON.stringify( q1q2a ), "b:", JSON.stringify( q1q2b  ));

		const v = { x:2, y:5, z:-3};

		console.log( "q1 v : ", JSON.stringify( q1.apply(v) ) );	
		console.log( "q2 v : ", JSON.stringify( q2.apply(v) ) );	
		console.log( "lnq1 exp v : ", JSON.stringify( rlnq1.exp().apply(v) ) );	
		console.log( "lnq2 exp v : ", JSON.stringify( rlnq2.exp().apply(v) ) );	
		console.log( "lnq1 v : ", JSON.stringify( rlnq1.apply(v) ) );	
		console.log( "lnq2 v : ", JSON.stringify( rlnq2.apply(v) ) );	

		const lnq1q2 = rlnq1.addNew( rlnq2 ); // changes 
		console.log( "q1q2 v", JSON.stringify( q1q2a.apply( v ) ) );

		console.log( "lnq1q2 v", JSON.stringify( lnq1q2.apply( v ) ) );
		

		console.log( "  q1 basis?", q1.getBasis() );

		console.log( "  q2 basis?", q2.getBasis() );

		console.log( " lq1 basis?", lnq1.getBasis() );

		console.log( " lq2 basis?", lnq2.getBasis()  );

		console.log( "rlq1 basis?", rlnq1.getBasis() );

		console.log( "rlq2 basis?", rlnq2.getBasis() );

		console.log( "lq1q2 basis?", lnq1q2.getBasis()  );

	}
}