#!/usr/bin/env sh
':' //; exec "$(command -v nodejs || command -v node)" -r esm "$0" "$@";
// equivalent of: node -r esm example.js "$@"

// Importing the module
import { DeniableEmitter } from './index';

// Build a task queue upon the DeniableEmitter
const mq = DeniableEmitter(Object.create({

  // Queueing new messages
  push   : Array.prototype.push,

  // Acknowledge a message (a.k.a. delete it)
  ack    : function (msg) {
    const {splice, indexOf} = Array.prototype;
    const index            = indexOf.call(this, msg);
    if (index < 0) return this;
    splice.call(this, index, 1);
    return this;
  },

  // Trigger processing of a message
  consume: function () {

    // Fetch message
    const {shift} = Array.prototype;
    const now = new Date().getTime(),
          msg = shift.call( this );
    if (!msg) return;
    this.push(msg);

    // Handle not-before
    if ( msg.nbf ) {
      if ( now < msg.nbf ) {
        return;
      } else {
        msg.nbf = now + (2*1000);
      }
    }

    // Handle tries
    if ( 'tries' in msg ) {
      if ( msg.tries > 0 ) {
        msg.tries--;
      } else {
        this.ack(msg);
        return;
      }
    }

    // Ensure we can consume it
    if ( !this.has(msg.typ) ) {
      return;
    }

    // Emit the message
    this.emit( msg.typ, msg, err => {
      if (!err) this.ack(msg);
    });
  }
}));

// Add listeners
mq.on('resolve', function( msg, callback ) {
  console.log('Resolve:',msg);
  return 'Success';
});
mq.on('precondition', function( msg, callback ) {
  console.log('Precondition:',msg);
  if ( ~msg.reject-- ) throw "Something";
  return 'Success';
});

// Enqueue an example message
mq.push({ typ: 'resolve'     , nbf: new Date().getTime() + (5*1000)            });
mq.push({ typ: 'precondition', nbf: new Date().getTime() + (3*1000), reject: 2 });

// Start processor
setTimeout(function processQueue() {
  mq.consume();
  if(mq.length) setTimeout(processQueue,100);
},0);
