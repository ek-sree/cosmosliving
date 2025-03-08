export const API_ENDPOINTS = {
    LOGIN: "/api/v1/bookinguser/login",
    SIGNUP: "/api/v1/bookinguser/create",
    PROPERTY: "/api/v1/property/property?page=1&limit=5&filters[address]=&filters[city]=&filters[bedrooms]=&filters[category]=&filters[area]=",
    USERDETAILS: "/api/v1/bookinguser/get-user-details",
    EDITUSERDETAILS: "/api/v1/bookinguser/update",
    SINGLEPROPERTY: "/api/v1/property/property/special"
  } as const;
  
  export const QUERY_KEYS = {
    PROPERTIES: "properties",
    USERDETAIL: "userDetails",
    SINGLEPROPERTY: "singlepropery"
  } as const;
  