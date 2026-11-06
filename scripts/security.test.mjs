import test from 'node:test';
import assert from 'node:assert/strict';
import { httpsUrl, googleFormResponseUrl, googleFormUrl, googleSheetCsvUrl, localAsset, publicShareUrl } from '../src/app/security.ts';

test('external links reject scripts, credentials, cleartext and malformed URLs', () => {
  for (const value of ['javascript:alert(1)','data:text/html,test','//example.com','http://example.com','https://owner:secret@example.com',' https://example.com','https:\n//example.com','bad']) {
    assert.equal(httpsUrl(value), '', value);
  }
  assert.equal(httpsUrl('https://maps.google.com/?q=venue'), 'https://maps.google.com/?q=venue');
});
test('wishes only open Google respondent forms, never editors or spoofed hosts', () => {
  assert.equal(googleFormUrl('https://docs.google.com/forms/d/e/demo/viewform?entry.1=private#x'), 'https://docs.google.com/forms/d/e/demo/viewform');
  assert.equal(googleFormUrl('https://forms.gle/demo'), 'https://forms.gle/demo');
  for (const url of ['https://docs.google.com/forms/d/demo/edit','https://docs.google.com.evil.test/forms/d/demo/viewform','https://evil.test/?url=https://forms.gle/demo','https://docs.google.com:444/forms/d/demo/viewform','https://forms.gle/demo/edit','']) {
    assert.equal(googleFormUrl(url), '', url);
  }
});
test('direct wishes submit only to a validated full Google Form endpoint', () => {
  assert.equal(googleFormResponseUrl('https://docs.google.com/forms/d/e/demo/viewform?usp=sharing'), 'https://docs.google.com/forms/d/e/demo/formResponse');
  for (const url of ['https://forms.gle/demo','https://docs.google.com/forms/d/demo/edit','https://evil.test/formResponse','']) assert.equal(googleFormResponseUrl(url), '', url);
});
test('public wishes only read a Google Sheets CSV export with a numeric tab id', () => {
  assert.equal(
    googleSheetCsvUrl('https://docs.google.com/spreadsheets/d/demo/export?format=csv&gid=123'),
    'https://docs.google.com/spreadsheets/d/demo/export?format=csv&gid=123'
  );
  for (const url of ['https://docs.google.com/spreadsheets/d/demo/edit?gid=0','https://evil.test/spreadsheets/d/demo/export?format=csv&gid=0','https://docs.google.com/spreadsheets/d/demo/export?format=xlsx&gid=0','https://docs.google.com/spreadsheets/d/demo/export?format=csv&gid=secret','']) {
    assert.equal(googleSheetCsvUrl(url), '', url);
  }
});
test('assets reject remote URLs, traversal and active content protocols', () => {
  assert.equal(localAsset('images/wedding-1.webp'), 'images/wedding-1.webp');
  assert.equal(localAsset('music/song.mp3'), 'music/song.mp3');
  for (const value of ['https://tracker.test/a.jpg','images/../secret.png','images/%2e%2e/file.png','//tracker.test/a.png','data:image/svg+xml,test','images/a.svg?key=private']) assert.equal(localAsset(value), '');
});
test('QR does not leak URL queries or fragments and tolerates bad configured URL', () => {
  assert.equal(publicShareUrl('https://wedding.example/?guest=private#secret','http://localhost:4200'), 'https://wedding.example/');
  assert.equal(publicShareUrl('javascript:alert(1)','http://localhost:4200/?token=private#event'), 'http://localhost:4200/');
});
