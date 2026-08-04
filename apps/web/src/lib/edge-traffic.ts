/** Cloudflare colo → approximate airport coordinates [lat, lng]. */
export const CF_COLO_COORDS: Record<string, [number, number]> = {
  AMS: [52.31, 4.77],
  ARN: [59.65, 17.93],
  ATL: [33.64, -84.43],
  BOM: [19.09, 72.87],
  BOS: [42.36, -71.01],
  BRU: [50.9, 4.48],
  CDG: [49.01, 2.55],
  CMH: [39.99, -82.89],
  DEL: [28.56, 77.1],
  DFW: [32.9, -97.04],
  EWR: [40.69, -74.17],
  FRA: [50.04, 8.56],
  GRU: [-23.43, -46.47],
  IAD: [38.95, -77.45],
  ICN: [37.46, 126.44],
  LAX: [33.94, -118.41],
  LHR: [51.47, -0.46],
  MIA: [25.8, -80.29],
  NRT: [35.77, 140.39],
  ORD: [41.97, -87.91],
  SCL: [-33.39, -70.79],
  SIN: [1.36, 103.99],
  SJC: [37.36, -121.93],
  SYD: [-33.95, 151.18],
  WAW: [52.17, 20.97],
  YVR: [49.19, -123.18],
};

/** ISO country → representative [lat, lng] for globe markers. */
export const COUNTRY_COORDS: Record<string, [number, number]> = {
  US: [39.83, -98.58],
  IN: [20.59, 78.96],
  BR: [-14.24, -51.93],
  GB: [54.0, -2.0],
  DE: [51.17, 10.45],
  FR: [46.23, 2.21],
  SG: [1.35, 103.82],
  JP: [36.2, 138.25],
  AU: [-25.27, 133.78],
  NL: [52.13, 5.29],
  IT: [41.87, 12.57],
  KR: [35.91, 127.77],
  MX: [23.63, -102.55],
  CA: [56.13, -106.35],
  SE: [60.13, 18.64],
  AE: [23.42, 53.85],
  CN: [35.86, 104.2],
  CH: [46.82, 8.23],
  PT: [39.4, -8.22],
  PL: [51.92, 19.15],
  AR: [-38.42, -63.62],
  CL: [-35.68, -71.54],
  TR: [38.96, 35.24],
  SA: [23.89, 45.08],
  IQ: [33.22, 43.68],
  LK: [7.87, 80.77],
  RO: [45.94, 24.97],
  BE: [50.5, 4.47],
};

export type EdgeMarker = {
  id: string;
  location: [number, number];
  region: string;
  requests: number;
};

export type EdgeArc = {
  id: string;
  from: [number, number];
  to: [number, number];
  requests: number;
};

/** Fallback snapshot from deskzy Worker logs (Cloudflare colos seen serving traffic). */
export const EDGE_TRAFFIC_FALLBACK: {
  markers: EdgeMarker[];
  arcs: EdgeArc[];
  totalRequests: number;
  source: "fallback";
} = {
  source: "fallback",
  totalRequests: 33100,
  markers: [
    { id: "cdn-bom", location: CF_COLO_COORDS.BOM, region: "BOM", requests: 4200 },
    { id: "cdn-iad", location: CF_COLO_COORDS.IAD, region: "IAD", requests: 3800 },
    { id: "cdn-sin", location: CF_COLO_COORDS.SIN, region: "SIN", requests: 3100 },
    { id: "cdn-fra", location: CF_COLO_COORDS.FRA, region: "FRA", requests: 2900 },
    { id: "cdn-gru", location: CF_COLO_COORDS.GRU, region: "GRU", requests: 2400 },
    { id: "cdn-lhr", location: CF_COLO_COORDS.LHR, region: "LHR", requests: 2100 },
    { id: "cdn-sjc", location: CF_COLO_COORDS.SJC, region: "SJC", requests: 1800 },
    { id: "cdn-nrt", location: CF_COLO_COORDS.NRT, region: "NRT", requests: 1400 },
    { id: "cdn-ams", location: CF_COLO_COORDS.AMS, region: "AMS", requests: 1200 },
    { id: "cdn-syd", location: CF_COLO_COORDS.SYD, region: "SYD", requests: 900 },
  ],
  arcs: [
    {
      id: "arc-bom-sin",
      from: CF_COLO_COORDS.BOM,
      to: CF_COLO_COORDS.SIN,
      requests: 820,
    },
    {
      id: "arc-iad-fra",
      from: CF_COLO_COORDS.IAD,
      to: CF_COLO_COORDS.FRA,
      requests: 640,
    },
    {
      id: "arc-gru-iad",
      from: CF_COLO_COORDS.GRU,
      to: CF_COLO_COORDS.IAD,
      requests: 510,
    },
    {
      id: "arc-sin-nrt",
      from: CF_COLO_COORDS.SIN,
      to: CF_COLO_COORDS.NRT,
      requests: 390,
    },
    {
      id: "arc-lhr-ams",
      from: CF_COLO_COORDS.LHR,
      to: CF_COLO_COORDS.AMS,
      requests: 280,
    },
    {
      id: "arc-sjc-syd",
      from: CF_COLO_COORDS.SJC,
      to: CF_COLO_COORDS.SYD,
      requests: 210,
    },
  ],
};
