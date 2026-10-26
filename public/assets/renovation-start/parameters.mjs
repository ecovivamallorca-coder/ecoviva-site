export function handoffParameters(values, language, tracking = {}) {
  const summary = ['ECOVIVA SOCIAL RENOVATION REQUEST', `Work: ${values.work}`,
    `Area: ${values.area}`, `Town: ${values.town || 'Not specified'}`,
    `Timing: ${values.timing}`, `Indicative budget: ${values.budget}`,
    'Next step: choose an appointment or send the request without booking.'].join('\n');
  const params = {
    schema_version: 'renovation-social-v1', request_context: 'social_renovation',
    contact_type_code: 'I have a property or project', request_type_code: 'Renovation project',
    renovation_summary: summary, solar_region: values.area,
    locale: language, language_code: { en: 'English', es: 'Spanish', de: 'German' }[language],
    source: 'social_renovation', form_variant: 'social-renovation',
    source_page: `/${language}/renovation-start/`,
    utm_source: tracking.utm_source || 'direct', utm_medium: tracking.utm_medium || 'social',
    utm_campaign: tracking.utm_campaign || 'renovation',
  };
  ['utm_content', 'utm_term'].forEach(key => { if (tracking[key]) params[key] = String(tracking[key]).slice(0, 100); });
  return params;
}

