const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { filterCards } = require('../assets/js/catalogue.js');

function card(title, category) {
  return { dataset: { title, category }, textContent: title, hidden: false };
}

test('filters cards added asynchronously after initial page load', () => {
  const initialCard = card('Forest walk', 'nature');
  const remoteCard = card('Ocean documentary', 'ocean');
  const cards = [initialCard, remoteCard]; // query the live DOM collection on every filter run
  const visible = filterCards(cards, '', 'ocean');
  assert.equal(visible, 1);
  assert.equal(initialCard.hidden, true);
  assert.equal(remoteCard.hidden, false);
});

test('searches remote cards using rendered text when data-title is absent', () => {
  const remoteCard = { dataset: {}, textContent: 'XVIDEOS · Ocean documentary', hidden: false };
  const visible = filterCards([remoteCard], 'ocean', 'all');
  assert.equal(visible, 1);
  assert.equal(remoteCard.hidden, false);
});

test('the provider migration uses literal-dot host patterns accepted by PostgreSQL regex', () => {
  const migration = fs.readFileSync(path.join(__dirname, '../supabase/migrations/20261031160000_xcontent_add_pornhub_xvideos_embeds.sql'), 'utf8');
  for (const host of ['youtube-nocookie', 'player', 'pornhub', 'xvideos']) {
    assert.match(migration, new RegExp(host.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\[\\.\\]'));
  }
  assert.doesNotMatch(migration, /youtube-nocookie\\\\\\\\\\\\\\\\\\\\/);
});
