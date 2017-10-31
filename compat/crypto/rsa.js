/*!
 * rsa.js - RSA for bcoin
 * Copyright (c) 2016-2017, Christopher Jeffrey (MIT License).
 * https://github.com/bcoin-org/bcoin
 */

'use strict';

/**
 * @module crypto/rsa
 */

var assert = require('assert');
var crypto = require('crypto');
var PEM = require('../utils/pem');

/**
 * Verify RSA signature.
 * @param {String} alg - Hash algorithm.
 * @param {Buffer} msg - Signed message.
 * @param {Buffer} sig - Signature.
 * @param {Buffer} key - ASN1 serialized RSA key.
 * @returns {Boolean}
 */

exports.verify = function verify(alg, msg, sig, key) {
  assert(typeof alg === 'string', 'No algorithm selected.');
  assert(Buffer.isBuffer(msg));
  assert(Buffer.isBuffer(sig));
  assert(Buffer.isBuffer(key));

  var name = normalizeAlg('rsa', alg);
  var pem = PEM.encode(key, 'rsa', 'public key');
  var ctx = crypto.createVerify(name);

  try {
    ctx.update(msg);
    return ctx.verify(pem, sig);
  } catch (e) {
    return false;
  }
};

/**
 * Sign message with RSA key.
 * @param {String} alg - Hash algorithm.
 * @param {Buffer} msg - Signed message.
 * @param {Buffer} key - ASN1 serialized RSA key.
 * @returns {Buffer} Signature (DER)
 */

exports.sign = function sign(alg, msg, key) {
  assert(typeof alg === 'string', 'No algorithm selected.');
  assert(Buffer.isBuffer(msg));
  assert(Buffer.isBuffer(key));

  var name = normalizeAlg('rsa', alg);
  var pem = PEM.encode(key, 'rsa', 'private key');
  var ctx = crypto.createSign(name);

  ctx.update(msg);

  return ctx.sign(pem);
};

/*
 * Helpers
 */

function normalizeAlg(alg, hash) {
  return alg.toUpperCase() + '-' + hash.toUpperCase();
}