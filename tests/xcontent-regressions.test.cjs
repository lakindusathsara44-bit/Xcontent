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
  const migration = fs.readFileSync(path.join(__dirname, '../supabase/migrations/20261031121904_xcontent_add_pornhub_xvideos_embeds.sql'), 'utf8');
  for (const expected of ['youtube-nocookie[.]com', 'player[.]vimeo[.]com', 'pornhub[.]com', 'xvideos[.]com']) {
    assert.ok(migration.includes(expected), 'missing literal-dot host pattern: ' + expected);
  }
  assert.ok(!migration.includes('youtube-nocookie\\\\.com'), 'double-escaped hostname pattern would reject the valid URL');
});

test('frontend reruns filters after the Supabase feed appends cards', () => {
  const app = fs.readFileSync(path.join(__dirname, '../assets/js/app.js'), 'utf8');
  const backend = fs.readFileSync(path.join(__dirname, '../assets/js/backend.js'), 'utf8');
  assert.match(app, /document\.querySelectorAll\('\.video-card'\)/);
  assert.match(app, /document\.addEventListener\('xcontent:catalogue-updated',filterVideos\)/);
  assert.match(backend, /dispatchEvent\(new Event\('xcontent:catalogue-updated'\)\)/);
});
