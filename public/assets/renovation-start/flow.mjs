import {handoffParameters} from './parameters.mjs?v=1';
const form = document.querySelector('#renovation-start');
const copy = JSON.parse(document.querySelector('#intake-copy').textContent);
const panels = [...document.querySelectorAll('[data-step]')];
const inbound = new URLSearchParams(location.search);
let step = 0;
let embedScript;
let mountedParameters = '';

function show(next) {
  step = next;
  panels.forEach((panel, index) => { panel.hidden = index !== next; });
  document.querySelector('#progress').value = next + 1;
  document.querySelector('#step-number').textContent = `${next + 1} / ${panels.length}`;
  const title = panels[next].querySelector('h1, h2');
  title.focus({ preventScroll: true });
  document.querySelector('#intake-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function validate() {
  const controls = [...panels[step].querySelectorAll('input, select')];
  if (step === 0 && !form.querySelector('input[name="work"]:checked')) {
    document.querySelector('#work-error').hidden = false;
    form.querySelector('input[name="work"]').focus();
    return false;
  }
  document.querySelector('#work-error').hidden = true;
  return controls.every(input => input.reportValidity());
}

const checked = name => [...form.querySelectorAll(`input[name="${name}"]:checked`)];
const canonical = name => checked(name).map(input => input.value).join(', ');
const label = input => input.closest('label').querySelector('.choice-text').textContent;


function prepareContact() {
  const region = form.elements.region;
  const values = { work: canonical('work'), area: region.value, town: form.elements.town.value.trim(),
    timing: canonical('timing'), budget: canonical('budget') };
  const review = document.querySelector('#answer-review');
  review.replaceChildren();
  const lines = [checked('work').map(label).join(' · '), region.selectedOptions[0].textContent + (values.town ? ` · ${values.town}` : ''),
    label(checked('timing')[0]), label(checked('budget')[0])];
  lines.forEach(line => { const item = document.createElement('li'); item.textContent = line; review.append(item); });
  const params = handoffParameters(values, copy.language, Object.fromEntries(inbound));
  const url = new URL('https://ecoviva-mallorca.fillout.com/t/59qsbh9ckrus');
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  document.querySelector('#open-intake').href = url.toString();
  const host = document.querySelector('#contact-embed');
  const fingerprint = JSON.stringify(params);
  if (mountedParameters === fingerprint && host.querySelector('iframe')) return;
  mountedParameters = fingerprint;
  host.replaceChildren();
  const mount = document.createElement('div');
  mount.setAttribute('data-fillout-id', '59qsbh9ckrus');
  mount.setAttribute('data-fillout-embed-type', 'standard');
  mount.setAttribute('data-fillout-dynamic-resize', '');
  Object.entries(params).forEach(([key, value]) => mount.setAttribute('data-' + key, value));
  mount.style.minHeight = '640px';
  host.append(mount);
  embedScript?.remove();
  embedScript = document.createElement('script');
  embedScript.src = 'https://server.fillout.com/embed/v1/';
  embedScript.async = true;
  document.body.append(embedScript);
}

form.addEventListener('submit', event => {
  event.preventDefault();
  if (!validate()) return;
  if (step === 2) prepareContact();
  if (step < panels.length - 1) show(step + 1);
});
form.querySelectorAll('[data-back]').forEach(button => button.addEventListener('click', () => show(step - 1)));
form.querySelectorAll('input[name="work"]').forEach(input => input.addEventListener('change', () => { document.querySelector('#work-error').hidden = true; }));
document.querySelectorAll('[data-language]').forEach(link => link.addEventListener('click', () => {
  const url = new URL(link.href);
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(key => {
    if (inbound.has(key)) url.searchParams.set(key, inbound.get(key).slice(0, 100));
  });
  link.href = url.toString();
}));
