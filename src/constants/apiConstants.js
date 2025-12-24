export const LOGIN = {
  postLogin: "/panel-login",
};
export const PANEL_CHECK = {
  getPanelStatus: "/panel-check-status",
  getEnvStatus: "/panel-fetch-dotenv",
};
export const POPUP_API = {
  list: "/popup",
  byId: (id) => `/popup/${id}`,
};
export const BANNER_API = {
  list: "/banner",
  create: "/banner",
  byId: (id) => `/banner/${id}`,
  updateById: (id) => `/banner/${id}?_method=PUT`,
};

export const COMPANY_API = {
  list: "/company",
  create: "/company",
  byId: (id) => `/company/${id}`,
  updateById: (id) => `/company/${id}?_method=PUT`,
};
export const FAQ_API = {
  list: "/faq",
  create: "/faq",
  byId: (id) => `/faq/${id}`,
  updateById: (id) => `/faq/${id}`,
};
export const BLOG_API = {
  list: "/blog",
  create: "/blog",
  dropdown: "/blogs",
  byId: (id) => `/blog/${id}`,
  delete: (id) => `/blog/${id}`,
  deleteSub: (id) => `/blog-sub/${id}`,
  deleteRelated: (id) => `/blog-related/${id}`,
  updateById: (id) => `/blog/${id}?_method=PUT`,
};
export const PAGE_TWO_API = {
  dropdown: "/page-two",
  
};
export const CHANGE_PASSWORD_API = {
  create: "/panel-change-password",
}
export const COUNTRY_API = {
  list: "/country",
  dropdown: "/countrys",
  byId: (id) => `/country/${id}`,
};
export const LETUREYOUTUBE_API = {
  list: "/lecture-youtube",
  byId: (id) => `/lecture-youtube/${id}`,
};

export const YOUTUBEFOR_API = {
  list: "/youtubeFor",
};
export const STUDENT_API = {
  list: "/student",
  byId: (id) => `/student/${id}`,
};
