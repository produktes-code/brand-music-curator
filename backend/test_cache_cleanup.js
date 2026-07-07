const assert = require('assert');

// Simular el cache tal como está en server.js
const cache = {
  data: new Map(),
  set(key, value, ttlMs = 3600 * 1000) {
    this.data.set(key, { value, expiresAt: Date.now() + ttlMs });
  },
  get(key) {
    const item = this.data.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      this.data.delete(key);
      return null;
    }
    return item.value;
  },
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.data.entries()) {
      if (now > item.expiresAt) {
        this.data.delete(key);
      }
    }
  }
};

// Test 1: Valor válido se recupera correctamente
cache.set('key1', 'value1', 60000); // TTL 60s
assert.strictEqual(cache.get('key1'), 'value1', 'Test 1 FAILED: El valor debería existir');
console.log('✅ Test 1 PASSED: Valor válido se recupera correctamente');

// Test 2: Valor expirado devuelve null
cache.set('expired_key', 'old_value', 1); // TTL 1ms
// Forzar expiración esperando un poco
setTimeout(() => {
  const result = cache.get('expired_key');
  assert.strictEqual(result, null, 'Test 2 FAILED: El valor expirado debería ser null');
  console.log('✅ Test 2 PASSED: Valor expirado devuelve null');

  // Test 3: cleanup() elimina entradas expiradas del Map
  cache.set('fresh', 'still_here', 60000);
  cache.set('stale1', 'gone1', 1);
  cache.set('stale2', 'gone2', 1);
  
  setTimeout(() => {
    cache.cleanup();
    assert.strictEqual(cache.data.has('stale1'), false, 'Test 3 FAILED: stale1 debería estar eliminado');
    assert.strictEqual(cache.data.has('stale2'), false, 'Test 3 FAILED: stale2 debería estar eliminado');
    assert.strictEqual(cache.data.has('fresh'), true, 'Test 3 FAILED: fresh debería seguir');
    console.log('✅ Test 3 PASSED: cleanup() elimina solo entradas expiradas');

    // Test 4: Clave inexistente devuelve null
    assert.strictEqual(cache.get('nonexistent'), null, 'Test 4 FAILED');
    console.log('✅ Test 4 PASSED: Clave inexistente devuelve null');

    console.log('\n🎉 Todos los tests de caché pasados correctamente.');
  }, 10);
}, 10);
