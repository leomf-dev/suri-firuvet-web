import { env } from "@config/env.config";

// ponytail: empty in dev → Vite proxy handles routing; full URL in production
const BASE_URL = env.isDev ? "" : env.soap.baseUrl;
const SOAP_ENV_NS = "http://schemas.xmlsoap.org/soap/envelope/";
const SOAP_NS = env.soap.namespace;

function buildEnvelope(operation: string, params?: Record<string, string | number>): string {
  const paramXml = params
    ? Object.entries(params)
        .map(([key, value]) => `<${key}>${value}</${key}>`)
        .join("")
    : "";

  return `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="${SOAP_ENV_NS}" xmlns:soap="${SOAP_NS}">
  <soapenv:Header/>
  <soapenv:Body>
    <soap:${operation}>${paramXml}</soap:${operation}>
  </soapenv:Body>
</soapenv:Envelope>`;
}

function parseXmlResponse(xml: string): Element[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "text/xml");

  // Check for parse error
  const parseErr = doc.querySelector("parsererror");
  if (parseErr) {
    throw new Error(`SOAP XML parse error: ${parseErr.textContent}`);
  }

  // Namespace-aware lookup — works regardless of prefix used by the server
  let body: Element | undefined = doc.getElementsByTagNameNS(SOAP_ENV_NS, "Body")[0];

  // Fallback: find any element whose local name is "Body"
  if (!body) {
    const all = doc.getElementsByTagName("*");
    for (let i = 0; i < all.length; i++) {
      if (all[i]!.localName === "Body") { body = all[i]; break; }
    }
  }

  if (!body) return [];

  const responseEl = body.firstElementChild;
  if (!responseEl) return [];

  // Direct children of the response wrapper — these are the <return> elements
  return Array.from(responseEl.children);
}

function elementToObject(el: Element): Record<string, string> {
  const obj: Record<string, string> = {};
  for (const child of Array.from(el.children)) {
    obj[child.localName] = child.textContent ?? "";
  }
  return obj;
}

async function post(endpoint: string, operation: string, params?: Record<string, string | number>): Promise<string> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
      "SOAPAction": '""', // WSDL specifies soapAction="" for all operations
    },
    body: buildEnvelope(operation, params),
  });

  if (!response.ok) {
    throw new Error(`SOAP Error ${response.status}: ${response.statusText}`);
  }

  return response.text();
}

/**
 * Cliente SOAP genérico — espejo de http.ts pero para protocolo SOAP/XML.
 * call  → retorna un objeto (primera coincidencia "return")
 * list  → retorna un array de objetos ("return" elements)
 */
export const soap = {
  call: async <T>(endpoint: string, operation: string, params?: Record<string, string | number>): Promise<T> => {
    const xml = await post(endpoint, operation, params);
    const elements = parseXmlResponse(xml);
    if (elements.length === 0) return null as T;
    const returns = elements.filter(el => el.localName === "return");
    if (returns.length === 0) return elementToObject(elements[0]!) as T;
    return elementToObject(returns[0]!) as T;
  },

  list: async <T>(endpoint: string, operation: string, params?: Record<string, string | number>): Promise<T[]> => {
    const xml = await post(endpoint, operation, params);
    const elements = parseXmlResponse(xml);
    return elements
      .filter(el => el.localName === "return")
      .map(el => elementToObject(el)) as T[];
  },
};

// ponytail: backward compat aliases
export const soapCall = soap.call;
export const soapCallList = soap.list;
