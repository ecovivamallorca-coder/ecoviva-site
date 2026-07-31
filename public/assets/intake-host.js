(() => {
  const body = document.body;
  const locale = body.dataset.locale;
  const purpose = body.dataset.purpose;
  const formId = body.dataset.formId;
  const allowed = ["source", "source_page", "source_url", "form_variant", "locale", "language_code", "request_context", "contact_type_code", "request_type_code", "schema_version", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "ref", "campaign"];
  const params = new URLSearchParams(location.search);
  const requestedType = params.get("request_type_code");
  const defaults = {
    source: "website",
    source_page: purpose === "partner" ? "partners" : "intake",
    source_url: location.origin + location.pathname,
    form_variant: purpose === "partner" ? "partner" : "project_request",
    locale,
    language_code: locale.toUpperCase(),
    request_context: purpose,
    schema_version: "1.0"
  };
  if (purpose !== "partner") defaults.contact_type_code = "CLIENT";
  if (requestedType === "PROPERTY_PARTNER") defaults.contact_type_code = "PROPERTY_PARTNER";
  if (requestedType === "CONTRACTOR" || requestedType === "SPECIALIST_CONTRACTOR") {
    defaults.contact_type_code = "CONTRACTOR";
  }
  Object.entries(defaults).forEach(([key, value]) => {
    if (!params.get(key)) params.set(key, value);
  });
  const normalized = new URL(location.href);
  normalized.search = params.toString();
  history.replaceState(null, "", normalized);

  const embed = document.querySelector("[data-fillout-id]");
  if (embed) embed.dataset.filloutId = formId;
  const direct = document.querySelector("[data-direct-form]");
  if (direct) {
    const directUrl = new URL(`https://ecoviva-mallorca.fillout.com/t/${formId}`);
    allowed.forEach((key) => { if (params.has(key)) directUrl.searchParams.set(key, params.get(key)); });
    direct.href = directUrl.toString();
  }

  document.querySelectorAll("[data-language-link]").forEach((link) => {
    const targetLocale = link.dataset.languageLink;
    const target = new URL(link.href, location.origin);
    allowed.forEach((key) => { if (params.has(key)) target.searchParams.set(key, params.get(key)); });
    target.searchParams.set("locale", targetLocale);
    target.searchParams.set("source_url", target.origin + target.pathname);
    link.href = target.pathname + "?" + target.searchParams.toString();
  });
})();
