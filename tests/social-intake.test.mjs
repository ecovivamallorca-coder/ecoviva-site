import test from 'node:test';
import assert from 'node:assert/strict';
import {handoffParameters} from '../public/assets/renovation-start/parameters.mjs';
const values={work:'Roof or waterproofing, Façade or insulation',area:'Calvià',town:'Santa Ponsa',timing:'Within 3–6 months',budget:'€75k–€150k'};
for(const [language,label] of Object.entries({en:'English',es:'Spanish',de:'German'})){
 test(`${language}: passes project context, language and campaign through the existing intake`,()=>{
  const p=handoffParameters(values,language,{utm_source:'instagram',utm_content:'renovate_de_2'});
  assert.equal(p.request_context,'social_renovation');
  assert.equal(p.contact_type_code,'I have a property or project');
  assert.equal(p.request_type_code,'Renovation project');
  assert.equal(p.language_code,label);
  assert.equal(p.locale,language);
  assert.equal(p.utm_source,'instagram');
  assert.equal(p.utm_content,'renovate_de_2');
  assert.ok(p.renovation_summary.includes(values.work));
  assert.ok(p.renovation_summary.includes(values.timing));
  assert.ok(p.renovation_summary.includes(values.budget));
  assert.ok(p.renovation_summary.includes('choose an appointment or send the request without booking.'));
  assert.ok(!p.renovation_summary.includes('No appointment booked.'));
 });
}
test('keeps contact information out of link parameters and bounds campaign text',()=>{
 const p=handoffParameters(values,'en',{utm_content:'x'.repeat(1000),email:'do-not-forward@example.com'});
 assert.equal(p.utm_content.length,100);
 assert.equal(p.email,undefined);
 assert.equal(p.phone,undefined);
 assert.equal(p.solar_summary,undefined);
});
